import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "gql-pdss-auth-web-client",
      fileName: "gql-pdss-auth-web-client",
    },
  },
  plugins: [dts()],
  test: {},
});
