/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: resolveHtmlPath.ts
Created:  2023-09-18T19:02:24.580Z
Modified: 2023-09-18T19:02:24.580Z

Description: description
*/

import { URL } from 'url';
import path from 'node:path';

const resolveHtmlPath = (htmlFileName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export default resolveHtmlPath;
