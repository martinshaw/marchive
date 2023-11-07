/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: webpack.config.js
Created:  2023-10-12T01:42:54.182Z
Modified: 2023-10-12T01:42:54.182Z

Description: description
*/

const path = require("node:path");
const process = require("node:process");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const { fileURLToPath } = require("node:url");

const configuration = {
  target: "node",

  mode: "production",

  entry: "./src/index.ts",

  node: {
    __dirname: false,
  },

  externals: {
    'umzug': 'umzug',
    'sqlite3': 'sqlite3',
    'sequelize': 'sequelize',
    'sequelize-typescript': 'sequelize-typescript',
    'puppeteer-extra': 'puppeteer-extra',
    'puppeteer-extra-plugin-stealth': 'puppeteer-extra-plugin-stealth',
    'puppeteer-extra-plugin-adblocker': 'puppeteer-extra-plugin-adblocker',
  },

  output: {
    filename: "main.cjs",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "commonjs",
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
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: "ts-loader",
      },
      {
        test: /\.node$/,
        loader: "node-loader",
      },
    ],
  },
};

module.exports = configuration;