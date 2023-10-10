/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: safeSanitizeFileName.ts
Created:  2023-09-18T19:03:12.357Z
Modified: 2023-09-18T19:03:12.357Z

Description: description
*/

import sanitize from 'sanitize-filename';

/**
 * The `sanitize` package is awesome for removing illegal characters and bizarre quirks of Windows etc...
 * But two potential issues which are highlighted in the NPM readme are:
 * - That it can return an empty string which would break the expected hierarchy of the resulting path.
 *     This is easily missed because a string is a string and therefore TypeScript doesn't warn
 *     to check if the string is empty before using it.
 * - It doesn't determine whether the full joined path already exists, this is an issue which should
 *     be remedied by a different method in the future.
 */
const safeSanitizeFileName = (url: string): string | false => {
  const sanitizedUrl = sanitize(url);
  return sanitizedUrl === '' ? false : sanitizedUrl;
}

export default safeSanitizeFileName;
