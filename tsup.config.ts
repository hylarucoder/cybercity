import type { Options } from "tsup";
export const tsup: Options = {
  // splitting: true,
  sourcemap: true,
  clean: true,
  target: "node16",
  esbuildPlugins: [],
  entryPoints: ["src/index.ts"],
};
