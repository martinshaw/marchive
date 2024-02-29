/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: video.ts
Created:  2024-02-29T05:30:49.234Z
Modified: 2024-02-29T05:30:49.234Z

Description: description
*/

const videoExtensions = [
  "mp4",
  "webm",
  "mkv",
  "flv",
  "vob",
  "ogv",
  "ogg",
  "drc",
  "gif",
  "gifv",
  "mng",
  "avi",
  "mov",
  "qt",
  "wmv",
  "yuv",
  "rm",
  "rmvb",
  "asf",
  "amv",
  "mpg",
  "mpeg",
  "m4v",
  "3gp",
  "3g2",
  "f4v",
  "f4p",
  "f4a",
  "f4b",
] as const;

type VideoFileExtensionType = (typeof videoExtensions)[number];

export { videoExtensions, VideoFileExtensionType };
