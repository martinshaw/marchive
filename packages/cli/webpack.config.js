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
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    argv.mode === "production" ||
    argv.production === true ||
    argv.p === true ||
    argv.prod;

  return {
    entry: "./src/index.ts",
    target: "node",
    externals: [
      // Webpack cannot determine that these are not used before runtime, so we will choose not to bundle them knowing that they will never be required at runtime
      "pg",
      "redis",
      "mysql",
      "mssql",
      "mysql2",
      "sql.js",
      "mongodb",
      "ioredis",
      "hdb-pool",
      "oracledb",
      "pg-native",
      "pg-query-stream",
      "@sap/hana-client",
      "@google-cloud/spanner",
      "react-native-sqlite-storage",
      "typeorm-aurora-data-api-driver",
      "@sap/hana-client/extension/Stream",

      // I want this but I cannot bundle its native binary into the bundle code file, keep it external and bundle the binary with bindings using pkg
      "better-sqlite3",
      "canvas",
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
      // These warnings are letting me know that some CLI interactivity functionality for @puppeteer/browsers is not available once bundled. Great, I don't want it.
      {
        module: /.*yargs.*\/index.cjs/,
      },
    ],
    externalsType: "commonjs",
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "node_modules", "change-case")],
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
              plugins: ["@babel/plugin-transform-modules-commonjs"],
            },
          },
        },
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    ...(isProduction
      ? {
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
                  keep_fnames: true,
                },
              }),
            ],
          },
        }
      : {}),
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "lib"),
    },
  };
};
