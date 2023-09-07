/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import sanitize from 'sanitize-filename';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

/**
 * The `sanitize` package is awesome for removing illegal characters and bizarre quirks of Windows etc...
 * But two potential issues which are highlighted in the NPM readme are:
 * - That it can return an empty string which would break the expected heirarchy of the resulting path.
 *     This is easily missed because a string is a string and therefore TypeScript doesn't warn
 *     to check if the string is empty before using it.
 * - It doesn't determine whether the full joined path already exists, this is an issue which should
 *     be remedied by a different method in the future.
 */
export const safeSanitizeFileName = (url: string): string | false => {
  const sanitizedUrl = sanitize(url);
  return sanitizedUrl === '' ? false : sanitizedUrl;
}
