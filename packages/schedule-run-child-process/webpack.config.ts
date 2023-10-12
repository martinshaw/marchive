/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: webpack.config.js
Created:  2023-10-12T01:42:54.182Z
Modified: 2023-10-12T01:42:54.182Z

Description: description
*/

import path from 'node:path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const configuration: webpack.Configuration = {
  target: "node",

  mode: "production",

  entry: "./src/index.ts",

  externals: [
    nodeExternals()
  ],

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: 'commonjs',
    },
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },

  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
    ],
  },
};

module.exports = configuration;