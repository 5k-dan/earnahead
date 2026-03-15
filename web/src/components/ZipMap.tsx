"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { get as idbGet, set as idbSet } from "idb-keyval";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapPin {
  id: number | string;
  lng: number;
  lat: number;
  label: string;
  color: string;
  active?: boolean;
}

interface MapboxOptions {
  style?: string;
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

interface ZipMapProps {
  center: [number, number]; // [lng, lat]
  pins: MapPin[];
  onPinClick?: (id: number | string) => void;
  onZipChange?: (center: [number, number], zip: string) => void;
  options?: MapboxOptions;
  style?: React.CSSProperties;
}

// Mapbox Geocoding API
interface GeocodingFeature {
  center: [number, number];
  bbox?: [number, number, number, number];
  place_name: string;
}
interface GeocodingResponse {
  features: GeocodingFeature[];
}

// Census TIGERweb GeoJSON (subset)
interface TigerFeature {
  type: "Feature";
  geometry: GeoJSON.Geometry;
  properties: Record<string, unknown>;
}
interface TigerFeatureCollection {
  type: "FeatureCollection";
  features: TigerFeature[];
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const TTL_24H = 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/** Read from IndexedDB, fall back to localStorage, return null on miss/expiry. */
async function getCache<T>(key: string): Promise<T | null> {
  try {
    const entry = await idbGet<CacheEntry<T>>(key);
    if (entry && entry.expiresAt > Date.now()) return entry.value;
  } catch {
    // IDB unavailable — try localStorage
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (entry.expiresAt > Date.now()) return entry.value;
        localStorage.removeItem(key);
      }
    } catch { /* ignore */ }
  }
  return null;
}

/** Write to IndexedDB, fall back to localStorage on failure. */
async function setCache<T>(key: string, value: T, ttlMs = TTL_24H): Promise<void> {
  const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs };
  try {
    await idbSet(key, entry);
  } catch {
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch { /* quota exceeded or private browsing — skip silently */ }
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const ZIP_RE = /^\d{5}$/;
const PADDING = 40;
const POINT_DELTA = 0.05;

// Mapbox source/layer IDs for the ZCTA polygon
const ZCTA_SOURCE = "zcta-boundary";
const ZCTA_FILL = "zcta-fill";
const ZCTA_LINE = "zcta-line";

// Mapbox source/layer IDs for POI clusters
const POI_SOURCE        = "pois";
const POI_CLUSTERS      = "poi-clusters";
const POI_CLUSTER_COUNT = "poi-cluster-count";
const POI_UNCLUSTERED   = "poi-unclustered";

// ─── POI Types + Mock Data ────────────────────────────────────────────────────

export interface POIProperties {
  id: string;
  name: string;
  type: "Plasma" | "Blood" | "Research" | "Sperm" | "Egg";
  earn: string;
}

export type POIFeature = GeoJSON.Feature<GeoJSON.Point, POIProperties>;
export type POIFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, POIProperties>;

/** Drop-in mock data — replace with real API results in production. */
export const MOCK_POIS: POIFeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6842, 41.9085] }, properties: { id: "1", name: "BioLife Plasma",              type: "Plasma",   earn: "$85"    } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6397, 41.8782] }, properties: { id: "2", name: "Lifestream Blood Center",      type: "Blood",    earn: "$50"    } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6204, 41.8954] }, properties: { id: "3", name: "Northwestern Clinical Trials", type: "Research", earn: "$200"   } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6512, 41.9231] }, properties: { id: "4", name: "CSL Plasma",                   type: "Plasma",   earn: "$90"    } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6867, 41.8731] }, properties: { id: "5", name: "American Red Cross",           type: "Blood",    earn: "$45"    } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6741, 41.8820] }, properties: { id: "6", name: "Vitalant Blood Center",        type: "Blood",    earn: "$50"    } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6278, 41.8805] }, properties: { id: "7", name: "New England Cryogenic",        type: "Sperm",    earn: "$150"   } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-87.6243, 41.9001] }, properties: { id: "8", name: "Shady Grove Fertility",        type: "Egg",      earn: "$8,500" } },
  ],
};

// ─── POI Cluster Helpers ──────────────────────────────────────────────────────

/**
 * Add a clustered POI source + three layers to the map.
 * If the source already exists, updates its data in-place (no layer rebuild).
 *
 * Layers added (in order):
 *   poi-clusters       — circle for each cluster bubble
 *   poi-cluster-count  — symbol showing the count inside each bubble
 *   poi-unclustered    — circle for individual (non-clustered) points
 */
export function addOrUpdatePOIs(map: mapboxgl.Map, geojson: POIFeatureCollection): void {
  // ── Update path: source exists, just swap data ───────────────────────────
  if (map.getSource(POI_SOURCE)) {
    (map.getSource(POI_SOURCE) as mapboxgl.GeoJSONSource).setData(geojson);
    return;
  }

  // ── Init path: add source + all three layers ─────────────────────────────
  map.addSource(POI_SOURCE, {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterRadius: 50,    // px — points within 50px merge into a cluster
    clusterMaxZoom: 14,   // stop clustering above zoom 14
  });

  // 1. Cluster bubble
  map.addLayer({
    id: POI_CLUSTERS,
    type: "circle",
    source: POI_SOURCE,
    filter: ["has", "point_count"],
    paint: {
      // Graduated size: small cluster → big cluster
      "circle-radius": [
        "step", ["get", "point_count"],
        16,   // radius for count < 5
        5,  20, // radius for count 5–19
        20, 26, // radius for count ≥ 20
      ],
      // Graduated color: few → many
      "circle-color": [
        "step", ["get", "point_count"],
        "#93b8e0",  // light blue  (< 5)
        5,  "#3d7ec4",  // mid blue    (5–19)
        20, "#0d1f3c",  // navy        (≥ 20)
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": "white",
    },
  });

  // 2. Cluster count label (inside bubble)
  map.addLayer({
    id: POI_CLUSTER_COUNT,
    type: "symbol",
    source: POI_SOURCE,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "white",
    },
  });

  // 3. Unclustered single point
  map.addLayer({
    id: POI_UNCLUSTERED,
    type: "circle",
    source: POI_SOURCE,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": 7,
      "circle-color": "#1e5aa8",
      "circle-stroke-width": 2,
      "circle-stroke-color": "white",
    },
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function geocodeZip(zip: string): Promise<GeocodingFeature | null> {
  const cacheKey = `zip:geocode:${zip}`;
  const cached = await getCache<GeocodingFeature | null>(cacheKey);
  if (cached !== null) return cached;

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zip)}.json` +
    `?country=US&types=postcode&access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding ${res.status}`);
  const data: GeocodingResponse = await res.json();
  const feature = data.features[0] ?? null;
  await setCache(cacheKey, feature);
  return feature;
}

function geocodingBounds(f: GeocodingFeature): mapboxgl.LngLatBoundsLike {
  if (f.bbox) return [[f.bbox[0], f.bbox[1]], [f.bbox[2], f.bbox[3]]];
  const [lng, lat] = f.center;
  return [
    [lng - POINT_DELTA, lat - POINT_DELTA],
    [lng + POINT_DELTA, lat + POINT_DELTA],
  ];
}

/** Fetch ZCTA polygon from Census TIGERweb. Returns null on miss or error. */
async function fetchZctaPolygon(zip: string): Promise<TigerFeatureCollection | null> {
  const cacheKey = `zip:polygon:${zip}`;
  const cached = await getCache<TigerFeatureCollection | null>(cacheKey);
  if (cached !== null) return cached;

  const base = "https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/Administrative/MapServer/5/query";
  const params = new URLSearchParams({
    where: `ZCTA5CE10='${zip}'`,
    outFields: "*",
    f: "geojson",
  });
  const res = await fetch(`${base}?${params}`);
  if (!res.ok) throw new Error(`TIGERweb ${res.status}`);
  const data: TigerFeatureCollection = await res.json();
  const result = data.features?.length ? data : null;
  await setCache(cacheKey, result);
  return result;
}

/**
 * Compute LngLatBoundsLike from a GeoJSON feature collection by walking
 * all coordinate pairs in the geometry.
 */
function geoJsonBounds(fc: TigerFeatureCollection): mapboxgl.LngLatBoundsLike | null {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

  function walkCoords(coords: unknown): void {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number") {
      const [lng, lat] = coords as [number, number];
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      coords.forEach(walkCoords);
    }
  }

  fc.features.forEach((f) => walkCoords((f.geometry as { coordinates: unknown }).coordinates));

  if (!isFinite(minLng)) return null;
  return [[minLng, minLat], [maxLng, maxLat]];
}

/** Remove existing ZCTA source + layers from the map if present. */
function clearZcta(map: mapboxgl.Map) {
  if (map.getLayer(ZCTA_FILL)) map.removeLayer(ZCTA_FILL);
  if (map.getLayer(ZCTA_LINE)) map.removeLayer(ZCTA_LINE);
  if (map.getSource(ZCTA_SOURCE)) map.removeSource(ZCTA_SOURCE);
}

/** Add ZCTA source + layers to the map. */
function addZcta(map: mapboxgl.Map, fc: TigerFeatureCollection) {
  clearZcta(map);

  map.addSource(ZCTA_SOURCE, {
    type: "geojson",
    data: fc as unknown as GeoJSON.FeatureCollection,
  });

  map.addLayer({
    id: ZCTA_FILL,
    type: "fill",
    source: ZCTA_SOURCE,
    paint: {
      "fill-color": "#1e5aa8",
      "fill-opacity": 0.08,
    },
  });

  map.addLayer({
    id: ZCTA_LINE,
    type: "line",
    source: ZCTA_SOURCE,
    paint: {
      "line-color": "#1e5aa8",
      "line-width": 2,
      "line-opacity": 0.7,
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ZipMap({
  center,
  pins,
  onPinClick,
  onZipChange,
  options = {},
  style = {},
}: ZipMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [zipInput, setZipInput] = useState("");
  const [zipError, setZipError] = useState("");
  const [zipLoading, setZipLoading] = useState(false);

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!TOKEN) {
      console.warn("ZipMap: NEXT_PUBLIC_MAPBOX_TOKEN is not set.");
      return;
    }

    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: options.style ?? "mapbox://styles/mapbox/light-v11",
      center,
      zoom: options.zoom ?? 13,
      pitch: options.pitch ?? 0,
      bearing: options.bearing ?? 0,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fly to center prop when it changes externally ─────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center, zoom: options.zoom ?? 13, duration: 800 });
  }, [center, options.zoom]);

  // ── Re-render markers when pins change ────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    pins.forEach((pin) => {
      const el = document.createElement("div");
      el.style.cssText = `
        background: ${pin.active ? "#0d1f3c" : pin.color};
        color: white;
        font-size: 11px;
        font-weight: 700;
        font-family: -apple-system, sans-serif;
        padding: 4px 10px;
        border-radius: 20px;
        border: 2px solid ${pin.active ? "white" : "rgba(255,255,255,0.6)"};
        box-shadow: ${pin.active ? "0 4px 20px rgba(13,31,60,0.4)" : "0 2px 8px rgba(0,0,0,0.18)"};
        white-space: nowrap;
        cursor: pointer;
        transform: ${pin.active ? "scale(1.15)" : "scale(1)"};
        transition: all 150ms ease;
        position: relative;
      `;
      el.textContent = pin.label;

      if (onPinClick) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onPinClick(pin.id);
        });
      }

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([pin.lng, pin.lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [pins, onPinClick]);

  // ── ZIP search ────────────────────────────────────────────────────────────
  const handleZipSearch = async () => {
    const zip = zipInput.trim();
    if (!ZIP_RE.test(zip)) {
      setZipError("Enter a valid 5-digit US ZIP code.");
      return;
    }

    setZipError("");
    setZipLoading(true);

    const map = mapRef.current;

    try {
      // Run both requests in parallel
      const [geocodeFeature, tigerFc] = await Promise.allSettled([
        geocodeZip(zip),
        fetchZctaPolygon(zip),
      ]);

      const geo = geocodeFeature.status === "fulfilled" ? geocodeFeature.value : null;
      const fc  = tigerFc.status  === "fulfilled" ? tigerFc.value  : null;

      if (!geo && !fc) {
        setZipError("ZIP code not found.");
        return;
      }

      if (map) {
        // Add/replace ZCTA polygon if we got one
        const applyLayers = () => {
          if (fc) {
            addZcta(map, fc);
            const polyBounds = geoJsonBounds(fc);
            if (polyBounds) {
              map.fitBounds(polyBounds, { padding: PADDING, duration: 800 });
            }
          } else if (geo) {
            // Polygon miss — fall back to Mapbox bbox
            clearZcta(map);
            map.fitBounds(geocodingBounds(geo), { padding: PADDING, duration: 800 });
          }
        };

        // Layers can only be added once the style is loaded
        if (map.isStyleLoaded()) {
          applyLayers();
        } else {
          map.once("styledata", applyLayers);
        }
      }

      // Notify parent of new center
      const center: [number, number] = geo?.center ?? [0, 0];
      onZipChange?.(center, zip);

    } catch {
      setZipError("Couldn't complete the search. Try again.");
    } finally {
      setZipLoading(false);
    }
  };

  // ── No-token fallback ─────────────────────────────────────────────────────
  if (!TOKEN) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#dde4ec", color: "#5a6a80", fontSize: 14, fontWeight: 500,
        ...style,
      }}>
        Set{" "}
        <code style={{ margin: "0 6px", background: "rgba(0,0,0,0.08)", padding: "1px 6px", borderRadius: 4 }}>
          NEXT_PUBLIC_MAPBOX_TOKEN
        </code>{" "}
        in .env.local
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      {/* Map canvas */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* ZIP search overlay */}
      <div style={{
        position: "absolute", top: 12, left: 12, zIndex: 10,
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{
          display: "flex", gap: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          borderRadius: 8, overflow: "hidden",
        }}>
          <input
            type="text"
            value={zipInput}
            onChange={(e) => {
              setZipInput(e.target.value.replace(/\D/g, "").slice(0, 5));
              if (zipError) setZipError("");
            }}
            onKeyDown={(e) => { if (e.key === "Enter") handleZipSearch(); }}
            placeholder="ZIP code"
            maxLength={5}
            style={{
              width: 96, padding: "8px 12px", border: "none",
              fontSize: 14, fontFamily: "-apple-system, sans-serif",
              letterSpacing: "0.06em", color: "#0d1f3c",
              outline: "none", background: "white",
            }}
          />
          <button
            onClick={handleZipSearch}
            disabled={zipLoading}
            style={{
              padding: "8px 14px",
              background: zipLoading ? "#8aa8d0" : "#1e5aa8",
              color: "white", border: "none",
              fontSize: 13, fontWeight: 600,
              fontFamily: "-apple-system, sans-serif",
              cursor: zipLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            {zipLoading ? (
              <>
                <span style={{
                  width: 12, height: 12,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.6s linear infinite",
                }} />
                Searching
              </>
            ) : "Go"}
          </button>
        </div>

        {zipError && (
          <div style={{
            background: "white", color: "#c0392b", fontSize: 12,
            padding: "5px 10px", borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            fontFamily: "-apple-system, sans-serif",
          }}>
            {zipError}
          </div>
        )}
      </div>
    </div>
  );
}
