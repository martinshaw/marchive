/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: webpack.config.js
Created:  2024-01-28T13:40:42.119Z
Modified: 2024-01-28T13:40:42.119Z

Description: description
*/
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  externals: [
    // Webpack cannot determine that these are not used before runtime, so we will choose not to bundle them knowing that they will never be required at runtime
    "react-native-sqlite-storage",
    "@google-cloud/spanner",
    "mongodb",
    "@sap/hana-client",
    "@sap/hana-client/extension/Stream",
    "hdb-pool",
    "mysql",
    "mysql2",
    "oracledb",
    "pg",
    "pg-native",
    "pg-query-stream",
    "typeorm-aurora-data-api-driver",
    "redis",
    "ioredis",
    "mssql",
    "sql.js",

    // I want this but I cannot bundle its native binary into the bundle code file, keep it external and bundle the binary with bindings using pkg
    "better-sqlite3",
  ],
  ignoreWarnings: [
    // Suppresses warnings about Webpack's above mentioned inability to determine that the TypeORM adapters are not used before runtime
    {
      module: /app-root-path.*\/app-root-path.js/,
    },
    {
      module:
        /typeorm.*better-sqlite3.*\/connection\/ConnectionOptionsReader.js/,
    },
    {
      module: /typeorm.*better-sqlite3.*\/platform\/PlatformTools.js/,
    },
    {
      module:
        /typeorm.*better-sqlite3.*\/util\/DirectoryExportedClassesLoader.js/,
    },
    {
      module: /typeorm.*better-sqlite3.*\/util\/ImportUtils.js/,
    },
  ],
  externalsType: "commonjs",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: true,
          /**
           * TypeOrm needs to reflect the class names of the imported migrations, so we need to keep them intact
           * I would like to mangle all other class names, but I cannot get the regex option to work
           */
          keep_classnames: true,
        },
      }),
    ],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
  },
};
