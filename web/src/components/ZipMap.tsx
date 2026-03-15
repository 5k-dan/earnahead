"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  options?: MapboxOptions;
  style?: React.CSSProperties;
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export default function ZipMap({
  center,
  pins,
  onPinClick,
  options = {},
  style = {},
}: ZipMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map once
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

  // Fly to new center when it changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center, zoom: options.zoom ?? 13, duration: 800 });
  }, [center, options.zoom]);

  // Re-render markers when pins change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
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

  if (!TOKEN) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#dde4ec", color: "#5a6a80", fontSize: 14, fontWeight: 500, ...style }}>
        Set <code style={{ margin: "0 6px", background: "rgba(0,0,0,0.08)", padding: "1px 6px", borderRadius: 4 }}>NEXT_PUBLIC_MAPBOX_TOKEN</code> in .env.local
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}
