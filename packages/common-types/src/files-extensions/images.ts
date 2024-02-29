/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: images.ts
Created:  2024-02-29T05:29:47.347Z
Modified: 2024-02-29T05:29:47.347Z

Description: description
*/

const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "tiff",
  "ico",
  "heic",
  "heif",
  "avif",
  "apng",
] as const;

type ImageExtensionType = (typeof imageExtensions)[number];

export { imageExtensions, ImageExtensionType };
