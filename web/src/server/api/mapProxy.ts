/**
 * mapProxy.ts — standalone Express proxy for Mapbox Geocoding + Census TIGERweb.
 *
 * Keeps API tokens server-side and adds a 5-minute in-memory cache so the
 * upstream services don't get hammered during development or heavy use.
 *
 * Usage:
 *   npx ts-node src/server/api/mapProxy.ts
 *   (or compile and run: node dist/server/api/mapProxy.js)
 *
 * Environment variables (set in .env or export before running):
 *   MAPBOX_TOKEN   — server-side Mapbox secret token (sk.*)
 *   PROXY_PORT     — port to listen on (default: 3001)
 */

import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// ─── In-memory cache ──────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeocodeQuery {
  zip?: string;
}

interface ZctaQuery {
  zip?: string;
}

// ─── Validation helper ────────────────────────────────────────────────────────

const ZIP_RE = /^\d{5}$/;

function validateZip(
  req: Request<object, unknown, unknown, GeocodeQuery | ZctaQuery>,
  res: Response,
): string | null {
  const zip = req.query.zip?.trim();
  if (!zip || !ZIP_RE.test(zip)) {
    res.status(400).json({ error: "zip must be a 5-digit US ZIP code" });
    return null;
  }
  return zip;
}

// ─── App + middleware ─────────────────────────────────────────────────────────

const app = express();

// Allow JSON and URL-encoded bodies (not strictly needed for GET proxies, but
// useful if you extend this to POST endpoints later).
app.use(express.json());

// Rate limiter: 60 requests per minute per IP across all proxy endpoints.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,   // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down." },
});

app.use("/api", limiter);

// ─── GET /api/geocode?zip=XXXXX ───────────────────────────────────────────────

app.get(
  "/api/geocode",
  async (
    req: Request<object, unknown, unknown, GeocodeQuery>,
    res: Response,
  ) => {
    const zip = validateZip(req, res);
    if (!zip) return;

    const cacheKey = `geocode:${zip}`;
    const hit = getCached(cacheKey);
    if (hit) {
      res.setHeader("X-Cache", "HIT");
      res.json(hit);
      return;
    }

    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      res.status(500).json({ error: "MAPBOX_TOKEN is not configured on the server." });
      return;
    }

    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zip)}.json` +
      `?country=US&types=postcode&access_token=${token}`;

    try {
      const upstream = await fetch(url);
      if (!upstream.ok) {
        res.status(502).json({ error: `Mapbox returned ${upstream.status}` });
        return;
      }
      const data: unknown = await upstream.json();
      setCached(cacheKey, data);
      res.setHeader("X-Cache", "MISS");
      res.json(data);
    } catch (err) {
      console.error("[geocode] upstream fetch failed:", err);
      res.status(502).json({ error: "Failed to reach Mapbox Geocoding API." });
    }
  },
);

// ─── GET /api/zcta?zip=XXXXX ──────────────────────────────────────────────────

app.get(
  "/api/zcta",
  async (
    req: Request<object, unknown, unknown, ZctaQuery>,
    res: Response,
  ) => {
    const zip = validateZip(req, res);
    if (!zip) return;

    const cacheKey = `zcta:${zip}`;
    const hit = getCached(cacheKey);
    if (hit) {
      res.setHeader("X-Cache", "HIT");
      res.json(hit);
      return;
    }

    const base =
      "https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Administrative/MapServer/5/query";
    const params = new URLSearchParams({
      where: `ZCTA5CE10='${zip}'`,
      outFields: "*",
      f: "geojson",
    });

    try {
      const upstream = await fetch(`${base}?${params}`);
      if (!upstream.ok) {
        res.status(502).json({ error: `TIGERweb returned ${upstream.status}` });
        return;
      }
      const data: unknown = await upstream.json();
      setCached(cacheKey, data);
      res.setHeader("X-Cache", "MISS");
      res.json(data);
    } catch (err) {
      console.error("[zcta] upstream fetch failed:", err);
      res.status(502).json({ error: "Failed to reach Census TIGERweb." });
    }
  },
);

// ─── 404 catch-all ────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[proxy] unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env.PROXY_PORT ?? 3001);

app.listen(PORT, () => {
  console.log(`Map proxy listening on http://localhost:${PORT}`);
  console.log(`  GET /api/geocode?zip=60614`);
  console.log(`  GET /api/zcta?zip=60614`);
  if (!process.env.MAPBOX_TOKEN) {
    console.warn("  ⚠  MAPBOX_TOKEN is not set — geocode endpoint will return 500");
  }
});

export default app;
