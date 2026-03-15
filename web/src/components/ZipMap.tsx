"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapPin {
  id: number | string;
  lng: number;
  lat: number;
  label: string;   // shown on the pin bubble (e.g. "$85")
  color: string;   // hex or CSS color
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
  /** Called with [lng, lat] after a successful ZIP geocode */
  onZipChange?: (center: [number, number], zip: string) => void;
  options?: MapboxOptions;
  style?: React.CSSProperties;
}

// Mapbox Geocoding API — subset we actually use
interface GeocodingFeature {
  center: [number, number];                // [lng, lat]
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  place_name: string;
}

interface GeocodingResponse {
  features: GeocodingFeature[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const ZIP_RE = /^\d{5}$/;
const PADDING = 40;
// Default delta used to build bounds from a point when bbox is absent
const POINT_DELTA = 0.05; // ~5 km

async function geocodeZip(zip: string): Promise<GeocodingFeature | null> {
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zip)}.json` +
    `?country=US&types=postcode&access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data: GeocodingResponse = await res.json();
  return data.features[0] ?? null;
}

function featureToBounds(
  f: GeocodingFeature,
): mapboxgl.LngLatBoundsLike {
  if (f.bbox) {
    return [
      [f.bbox[0], f.bbox[1]], // SW
      [f.bbox[2], f.bbox[3]], // NE
    ];
  }
  const [lng, lat] = f.center;
  return [
    [lng - POINT_DELTA, lat - POINT_DELTA],
    [lng + POINT_DELTA, lat + POINT_DELTA],
  ];
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

    try {
      const feature = await geocodeZip(zip);

      if (!feature) {
        setZipError("ZIP code not found.");
        return;
      }

      const bounds = featureToBounds(feature);
      mapRef.current?.fitBounds(bounds, { padding: PADDING, duration: 800 });
      onZipChange?.(feature.center, zip);
    } catch {
      setZipError("Couldn't reach geocoding service. Try again.");
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
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}>
        <div style={{ display: "flex", gap: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", borderRadius: 8, overflow: "hidden" }}>
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
              width: 96,
              padding: "8px 12px",
              border: "none",
              fontSize: 14,
              fontFamily: "-apple-system, sans-serif",
              letterSpacing: "0.06em",
              color: "#0d1f3c",
              outline: "none",
              background: "white",
            }}
          />
          <button
            onClick={handleZipSearch}
            disabled={zipLoading}
            style={{
              padding: "8px 14px",
              background: zipLoading ? "#8aa8d0" : "#1e5aa8",
              color: "white",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "-apple-system, sans-serif",
              cursor: zipLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
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
            background: "white",
            color: "#c0392b",
            fontSize: 12,
            padding: "5px 10px",
            borderRadius: 6,
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
