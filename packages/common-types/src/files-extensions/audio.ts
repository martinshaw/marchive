/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: audio.ts
Created:  2024-02-29T05:31:25.899Z
Modified: 2024-02-29T05:31:25.899Z

Description: description
*/

const audioExtensions = [
  "mp3",
  "wav",
  "ogg",
  "m4a",
  "flac",
  "aiff",
  "wma",
  "aac",
  "mid",
  "midi",
  "weba",
  "amr",
  "3gp",
] as const;

type AudioExtensionType = (typeof audioExtensions)[number];

export { audioExtensions, AudioExtensionType };
