/**
 * Single source of truth for build version. Set at build time via Vite's
 * `define` (see vite.config.ts). Falls back to "dev" in environments that
 * don't inject it.
 */
export const BUILD_VERSION: string =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (typeof __BUILD_VERSION__ !== "undefined" ? __BUILD_VERSION__ : undefined) ||
  import.meta.env.VITE_BUILD_VERSION ||
  "dev";

export const SHORT_BUILD = BUILD_VERSION.slice(0, 8);
