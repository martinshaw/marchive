/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: webpack.config.js
Created:  2024-01-28T13:40:42.119Z
Modified: 2024-01-28T13:40:42.119Z

Description: description
*/
const path = require('path');

console.log('compile dir', path.join(__dirname, 'lib/webpack'));

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib/webpack'),
  },
  devServer: {
    static: path.join(__dirname, "lib/webpack"),
    compress: true,
    port: 4000,
  },
};