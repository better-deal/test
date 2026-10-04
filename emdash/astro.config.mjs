import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import emdash from "emdash/astro";

const noOpStorage = fileURLToPath(new URL("./src/storage/noop.ts", import.meta.url));

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: {
        entrypoint: noOpStorage,
        config: {},
      },
      images: false,
      siteUrl: "https://north-emdash.komure-dad.workers.dev",
    }),
  ],
  devToolbar: { enabled: false },
});
