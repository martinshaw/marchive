/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: rollup.config.js
Created:  2023-10-12T04:41:37.954Z
Modified: 2023-10-12T04:41:37.954Z

Description: description
*/

import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    typescript({
      sourceMap: true,
      inlineSources: true,
      declaration: true,
      declarationDir: "dist/ts/dec",
      outDir: "dist/ts",
    }),
  ],
};
