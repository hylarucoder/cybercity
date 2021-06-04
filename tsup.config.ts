import type { Options } from "tsup";
import { esbuildDecorators } from "@anatine/esbuild-decorators";
export const tsup: Options = {
  // splitting: true,
  sourcemap: true,
  clean: true,
  target: "node16",
  esbuildPlugins: [esbuildDecorators()],
  entryPoints: ["src/index.ts"],
};
