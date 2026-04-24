import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Build version: short timestamp. Exposed as __BUILD_VERSION__ globally and
// also read by the app via import.meta.env.VITE_BUILD_VERSION.
const BUILD_VERSION =
  process.env.VITE_BUILD_VERSION ||
  new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __BUILD_VERSION__: JSON.stringify(BUILD_VERSION),
    "import.meta.env.VITE_BUILD_VERSION": JSON.stringify(BUILD_VERSION),
  },
}));
