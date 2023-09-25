/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: compressImage.ts
Created:  2023-09-18T18:53:44.141Z
Modified: 2023-09-18T18:53:44.141Z

Description: description
*/

import compressImageUntyped from 'compress-image'
import { JSONObject } from 'types-json'

type CompressImageFunctionCallbackFunctionType = (error: string | JSONObject | null, completed: boolean, statistic: string | JSONObject) => void;

/**
 * @see https://github.com/Yuriy-Svetlov/compress-images#api for schema
 */
type CompressImageFunctionType = (
  input: string,
  output: string,
  options: {
    compress_force: boolean;
    statistic: boolean;
    autoupdate: boolean;
  },
  globoption: boolean | any,
  jpg: {jpg: {
    engine: 'jpegtran' | 'mozjpeg' | 'webp' | 'guetzli' | 'jpegRecompress' | 'jpegoptim' | 'tinify';
    command: string[]|false;
    key?: string;
  }},
  png: {png: {
    engine: 'pngquant' | 'optipng' | 'pngout' | 'webp' | 'pngcrush' | 'tinify';
    command: string[]|false;
    key?: string;
  }},
  svg: {svg: {
    engine: 'svgo';
    command: string|false;
  }},
  gif: {gif: {
    engine: 'gifsicle' | 'giflossy' | 'gif2webp';
    command: string[]|false;
  }},
  callback: CompressImageFunctionCallbackFunctionType,
) => void;

const compressImage = compressImageUntyped as unknown as CompressImageFunctionType;

export const compressImageSimple = (input: string, output: string, callback: CompressImageFunctionCallbackFunctionType) => {
  return compressImage(
    input,
    output,
    {
      compress_force: true,
      statistic: true,
      autoupdate: false,

    },
    false,
    { jpg: { engine: "webp", command: ["-quality", "60"] } },
    { png: { engine: "webp", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    callback,
  );
};

export default compressImage;
