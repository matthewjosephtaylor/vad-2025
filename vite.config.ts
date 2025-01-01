import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import dts from "vite-plugin-dts"; // Generates TypeScript declaration files
console.log("Vite config is being loaded");
export default defineConfig({
  plugins: [
    react(),
    // dts()
  ], // Include TypeScript declaration plugin
  // publicDir: process.env.EXCLUDE_PUBLIC === "true" ? false : "public",
  // build: {
  //   lib: {
  //     // Entry point for the library
  //     entry: "./src/index.ts",
  //     name: "vad-2025", // The global variable name for UMD builds
  //     fileName: (format) => `index.${format}.js`, // Output filenames
  //   },
  //   rollupOptions: {
  //     // Exclude dependencies you don't want bundled into your library
  //     external: ["react", "react-dom", "@mjtdev/engine"],
  //     output: {
  //       globals: {
  //         react: "React",
  //         "react-dom": "ReactDOM",
  //       },
  //     },
  //   },
  // },
});
