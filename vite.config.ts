import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({ root: "./" }),
    // eslintPlugin({
    //   include: ["**/*.{js,ts,tsx,jsx}"],
    // }),
  ],
  server: {
    port: 3000,
  },
});
