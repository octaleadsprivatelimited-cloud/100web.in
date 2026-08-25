import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    allowedHosts: ["100web.in", "www.100web.in", ".100web.in", "localhost", "127.0.0.1"],
  },
  plugins: [tanstackStart({ server: { entry: "server" } }), react(), tailwindcss(), tsconfigPaths()],
});
