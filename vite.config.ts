import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  base: "/IQ-Training-Game/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-32.png", "apple-touch-icon.png"],
      manifest: {
        id: "/IQ-Training-Game/",
        name: "COGNOSCOPE",
        short_name: "COGNOSCOPE",
        description:
          "An adaptive cognitive training instrument across fluid reasoning, working memory, spatial reasoning, processing speed, and quantitative reasoning. Runs fully offline.",
        start_url: "/IQ-Training-Game/",
        scope: "/IQ-Training-Game/",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone"],
        orientation: "portrait-primary",
        background_color: "#05080a",
        theme_color: "#05080a",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Every built asset (JS, CSS, HTML, self-hosted font woff2s, icons) is
        // precached at install time, so the very first offline load after
        // one online visit works — no runtime network fetch, no CDN fallback.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,woff2}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
