/**
 * Custom Webpack config for adding the scripts which are spawned as child processes using the `ts-node` runtime to the compiled ASAR archive
 *
 * This allows us to refer directly to the files by their path in the main/app/processes/index.ts file
 */

import { glob } from 'glob';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';
import { name as appName } from '../../release/app/package.json'

checkNodeEnv('production');
deleteSourceMaps();

const configuration: webpack.Configuration = {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  entry: {
    ...glob.sync(path.join(webpackPaths.srcChildProcessesPath, '**.js')).reduce((obj, el) => { obj[path.parse(el).name] = el; return obj; },{}),
    ...glob.sync(path.join(webpackPaths.srcChildProcessesPath, '**.ts')).reduce((obj, el) => { obj[path.parse(el).name] = el; return obj; },{}),
  },

  output: {
    path: webpackPaths.distChildProcessesPath,
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      APP_NAME: appName,
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.DefinePlugin({
      'process.type': '"browser"',
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, configuration);
