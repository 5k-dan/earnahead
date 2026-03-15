/**
 * ZipMap.test.tsx
 *
 * Tests:
 *  1. Invalid ZIP shows a validation error without hitting the network.
 *  2. Valid ZIP → geocode + polygon fetched → map.fitBounds called with
 *     the polygon's bounding box.
 *  3. Valid ZIP → polygon response → GeoJSON source added to the map instance.
 *
 * Strategy
 * ────────
 * mapbox-gl is a large browser-only library. We replace it entirely with a
 * hand-rolled class mock that records every call so we can assert on them.
 * idb-keyval is also mocked so tests stay synchronous-ish and don't touch
 * real IndexedDB.
 */

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ─── Mock mapbox-gl ──────────────────────────────────────────────────────────
//
// Must be declared before the component is imported so Jest's module registry
// picks up the mock instead of the real library.

/** Tracks every call made on the most recently constructed Map instance. */
const mapCalls: Record<string, unknown[][]> = {
  addControl:  [],
  on:          [],
  remove:      [],
  flyTo:       [],
  fitBounds:   [],
  addSource:   [],
  addLayer:    [],
  getSource:   [],
  getLayer:    [],
  removeLayer: [],
  removeSource:[],
  isStyleLoaded:[],
};

function resetMapCalls() {
  for (const k of Object.keys(mapCalls)) mapCalls[k] = [];
}

// The mock GeoJSONSource returned by getSource() when the POI source exists.
const mockGeoJSONSource = { setData: jest.fn() };

// Controls whether isStyleLoaded() returns true or false in a given test.
let styleLoaded = true;

/** Minimal mapbox-gl.Map mock. */
class MockMap {
  static instance: MockMap;

  constructor() {
    MockMap.instance = this;
    resetMapCalls();
  }

  addControl(...args: unknown[])   { mapCalls.addControl.push(args); }
  on(event: string, cb: () => void) {
    mapCalls.on.push([event, cb]);
    // Immediately invoke "load" so the addOrUpdatePOIs init path runs
    if (event === "load") cb();
  }
  once(event: string, cb: () => void) {
    mapCalls.on.push(["once:" + event, cb]);
    if (event === "styledata") cb();
  }
  remove()                          { mapCalls.remove.push([]); }
  flyTo(...args: unknown[])         { mapCalls.flyTo.push(args); }
  fitBounds(...args: unknown[])     { mapCalls.fitBounds.push(args); }
  isStyleLoaded()                   { return styleLoaded; }

  // Source / layer management
  getSource(id: string) {
    if (!mapCalls.addSource.some(a => a[0] === id)) return undefined;
    // POI source needs the real GeoJSONSource interface (setData)
    if (id === "pois") return mockGeoJSONSource;
    // All other sources (e.g. zcta-boundary) just need a truthy value so
    // clearZcta() proceeds to call removeSource()
    return {};
  }
  getLayer(id: string) {
    // addLayer is called as map.addLayer({ id, ... }) — args[0] is the config object
    return mapCalls.addLayer.some(a => (a[0] as { id: string }).id === id) ? {} : undefined;
  }
  addSource(...args: unknown[])    { mapCalls.addSource.push(args); }
  addLayer(...args: unknown[])     { mapCalls.addLayer.push(args); }
  removeLayer(...args: unknown[])  { mapCalls.removeLayer.push(args); }
  removeSource(...args: unknown[]) { mapCalls.removeSource.push(args); }
}

// Replace mapbox-gl with our minimal mock
jest.mock("mapbox-gl", () => ({
  __esModule: true,
  default: {
    Map: MockMap,
    Marker: jest.fn().mockImplementation(() => ({
      setLngLat: jest.fn().mockReturnThis(),
      addTo: jest.fn().mockReturnThis(),
      remove: jest.fn(),
    })),
    NavigationControl: jest.fn(),
    AttributionControl: jest.fn(),
    accessToken: "",
  },
  Map: MockMap,
  Marker: jest.fn().mockImplementation(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
  NavigationControl: jest.fn(),
  AttributionControl: jest.fn(),
}));

// ─── Mock idb-keyval ─────────────────────────────────────────────────────────
//
// Always return undefined (cache miss) so fetch is always exercised in tests.
// Individual tests can override this with mockResolvedValueOnce if needed.

jest.mock("idb-keyval", () => ({
  get: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue(undefined),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** What the Mapbox Geocoding API returns for ZIP 60614. */
const GEOCODE_RESPONSE = {
  features: [
    {
      center: [-87.6442, 41.9241] as [number, number],
      bbox: [-87.6600, 41.9100, -87.6300, 41.9400] as [number, number, number, number],
      place_name: "60614, Illinois, United States",
    },
  ],
};

/** What Census TIGERweb returns for ZIP 60614 (simplified polygon). */
const TIGER_RESPONSE = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-87.660, 41.910],
            [-87.630, 41.910],
            [-87.630, 41.940],
            [-87.660, 41.940],
            [-87.660, 41.910],
          ],
        ],
      },
      properties: { ZCTA5CE10: "60614" },
    },
  ],
};

// Expected bounds derived from TIGER_RESPONSE coordinates
const EXPECTED_POLYGON_BOUNDS: [[number, number], [number, number]] = [
  [-87.66, 41.91],
  [-87.63, 41.94],
];

// ─── Import component under test ─────────────────────────────────────────────
//
// Import AFTER mocks are declared so the module system sees the mocks.

import ZipMap from "./ZipMap";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CENTER: [number, number] = [-87.6298, 41.8781];

function mockFetch(geocodeOk: boolean, tigerOk: boolean) {
  (global.fetch as jest.Mock) = jest.fn().mockImplementation((url: string) => {
    if (url.includes("mapbox.com") || url.includes("/api/geocode")) {
      if (!geocodeOk) return Promise.resolve({ ok: false, status: 500 });
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(GEOCODE_RESPONSE),
      });
    }
    if (url.includes("tigerweb") || url.includes("/api/zcta")) {
      if (!tigerOk) return Promise.resolve({ ok: false, status: 500 });
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(TIGER_RESPONSE),
      });
    }
    return Promise.resolve({ ok: false, status: 404 });
  });
}

function renderZipMap() {
  return render(<ZipMap center={CENTER} pins={[]} />);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  styleLoaded = true;
  mockFetch(true, true);
  // NEXT_PUBLIC_MAPBOX_TOKEN is set in src/__mocks__/jestSetupEnv.ts so
  // the module-level TOKEN constant is non-empty when ZipMap is first imported.
});

afterEach(() => {
  jest.clearAllMocks();
});

// ─── 1. Invalid ZIP validation ────────────────────────────────────────────────

describe("ZIP validation", () => {
  it("shows an error for a non-numeric ZIP", async () => {
    renderZipMap();

    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "abcde");
    fireEvent.keyDown(input, { key: "Enter" });

    // Input strips non-digits so nothing is typed, Enter should show error
    expect(await screen.findByText(/valid 5-digit/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows an error for a 4-digit ZIP", async () => {
    renderZipMap();

    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "6061");
    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    expect(await screen.findByText(/valid 5-digit/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("clears the error when the user starts retyping", async () => {
    renderZipMap();

    const input = screen.getByPlaceholderText("ZIP code");
    // Trigger the error first
    await userEvent.type(input, "606");
    fireEvent.click(screen.getByRole("button", { name: /go/i }));
    expect(await screen.findByText(/valid 5-digit/i)).toBeInTheDocument();

    // Typing another digit should clear the error message
    await userEvent.type(input, "1");
    expect(screen.queryByText(/valid 5-digit/i)).not.toBeInTheDocument();
  });
});

// ─── 2. Valid ZIP → fitBounds called with polygon bounds ──────────────────────

describe("ZIP search — geocode + polygon", () => {
  it("calls fitBounds with the polygon's computed bounding box", async () => {
    renderZipMap();

    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "60614");
    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    await waitFor(() => {
      expect(mapCalls.fitBounds.length).toBeGreaterThan(0);
    });

    const [bounds, opts] = mapCalls.fitBounds[0] as [
      [[number, number], [number, number]],
      { padding: number },
    ];

    // Check longitude values (truncated to 2 decimals to avoid float noise)
    expect(bounds[0][0]).toBeCloseTo(EXPECTED_POLYGON_BOUNDS[0][0], 2);
    expect(bounds[0][1]).toBeCloseTo(EXPECTED_POLYGON_BOUNDS[0][1], 2);
    expect(bounds[1][0]).toBeCloseTo(EXPECTED_POLYGON_BOUNDS[1][0], 2);
    expect(bounds[1][1]).toBeCloseTo(EXPECTED_POLYGON_BOUNDS[1][1], 2);

    expect(opts.padding).toBe(40);
  });

  it("falls back to geocoding bbox when TIGERweb returns no features", async () => {
    mockFetch(true, false); // TIGERweb fails

    renderZipMap();
    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "60614");
    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    await waitFor(() => {
      expect(mapCalls.fitBounds.length).toBeGreaterThan(0);
    });

    // When polygon is missing, the geocoding bbox [W, S, E, N] is used
    const [bounds] = mapCalls.fitBounds[0] as [[[number, number], [number, number]]];
    const bbox = GEOCODE_RESPONSE.features[0].bbox;
    expect(bounds[0][0]).toBeCloseTo(bbox[0], 2); // west
    expect(bounds[0][1]).toBeCloseTo(bbox[1], 2); // south
    expect(bounds[1][0]).toBeCloseTo(bbox[2], 2); // east
    expect(bounds[1][1]).toBeCloseTo(bbox[3], 2); // north
  });

  it("shows 'ZIP code not found' when both geocode and polygon fail", async () => {
    mockFetch(false, false);

    renderZipMap();
    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "99999");
    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    // Both allSettled branches reject → geo and fc are both null →
    // component shows "ZIP code not found." (not the outer-catch message)
    expect(await screen.findByText(/zip code not found/i)).toBeInTheDocument();
    expect(mapCalls.fitBounds).toHaveLength(0);
  });
});

// ─── 3. GeoJSON source added to map when polygon is returned ─────────────────

describe("ZCTA polygon source", () => {
  it("adds a GeoJSON source and two layers for the ZCTA polygon", async () => {
    renderZipMap();

    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "60614");
    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    await waitFor(() => {
      // At least one source should have been added
      expect(mapCalls.addSource.length).toBeGreaterThan(0);
    });

    // The ZCTA source should have been registered with the polygon GeoJSON
    const zctaSourceCall = mapCalls.addSource.find(args => args[0] === "zcta-boundary");
    expect(zctaSourceCall).toBeDefined();

    const sourceConfig = zctaSourceCall![1] as { type: string; data: unknown };
    expect(sourceConfig.type).toBe("geojson");
    expect(sourceConfig.data).toMatchObject({
      type: "FeatureCollection",
      features: expect.arrayContaining([
        expect.objectContaining({ type: "Feature" }),
      ]),
    });

    // Both the fill and line layers should have been added.
    // addLayer is called as map.addLayer({ id, type, ... }) so args[0] is the full config.
    type LayerConfig = { id: string; type: string };
    const addedLayers = mapCalls.addLayer.map(args => args[0] as LayerConfig);
    const addedLayerIds = addedLayers.map(l => l.id);
    expect(addedLayerIds).toContain("zcta-fill");
    expect(addedLayerIds).toContain("zcta-line");

    // Verify layer types
    const fillLayer = addedLayers.find(l => l.id === "zcta-fill");
    const lineLayer = addedLayers.find(l => l.id === "zcta-line");
    expect(fillLayer?.type).toBe("fill");
    expect(lineLayer?.type).toBe("line");
  });

  it("removes old ZCTA layers before adding new ones on a second search", async () => {
    renderZipMap();

    // First search
    const input = screen.getByPlaceholderText("ZIP code");
    await userEvent.type(input, "60614");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /go/i }));
    });
    await waitFor(() => expect(mapCalls.addSource.some(a => a[0] === "zcta-boundary")).toBe(true));

    const firstAddCount = mapCalls.addSource.filter(a => a[0] === "zcta-boundary").length;

    // Second search with a different ZIP
    await userEvent.clear(input);
    await userEvent.type(input, "10001");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /go/i }));
    });
    await waitFor(() => {
      const addCount = mapCalls.addSource.filter(a => a[0] === "zcta-boundary").length;
      expect(addCount).toBeGreaterThan(firstAddCount);
    });

    // removeLayer should have been called before the second addSource
    expect(mapCalls.removeLayer.some(a => a[0] === "zcta-fill")).toBe(true);
    expect(mapCalls.removeLayer.some(a => a[0] === "zcta-line")).toBe(true);
    expect(mapCalls.removeSource.some(a => a[0] === "zcta-boundary")).toBe(true);
  });
});

// ─── 4. POI clusters initialised on map load ──────────────────────────────────

describe("POI cluster initialisation", () => {
  it("adds the pois GeoJSON source with cluster:true on map load", () => {
    renderZipMap();
    // The mock Map fires "load" synchronously in on(), so by the time render
    // returns the load callback has already run.
    const poisSource = mapCalls.addSource.find(a => a[0] === "pois");
    expect(poisSource).toBeDefined();
    const config = poisSource![1] as { type: string; cluster: boolean };
    expect(config.cluster).toBe(true);
  });

  it("adds cluster, count, and unclustered layers for POIs", () => {
    renderZipMap();
    const layerIds = mapCalls.addLayer.map(a => (a[0] as { id: string }).id);
    expect(layerIds).toContain("poi-clusters");
    expect(layerIds).toContain("poi-cluster-count");
    expect(layerIds).toContain("poi-unclustered");
  });
});
