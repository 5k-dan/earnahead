/**
 * Runs in the Jest worker before any test module is imported.
 * Sets env vars that module-level constants (e.g. TOKEN in ZipMap.tsx) read
 * at import time — beforeEach() is too late for those.
 */
process.env.NEXT_PUBLIC_MAPBOX_TOKEN = "pk.test_token";
process.env.NEXT_PUBLIC_USE_PROXY = "false";
