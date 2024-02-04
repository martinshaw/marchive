/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-08-22T20:33:52.038Z
Modified: 2023-08-22T20:33:52.039Z

Description: description
*/

import path from 'node:path';

/**
 * Do not use `readOnlyInternalRootPath` nor any path prefixed `readOnly` for any write operations.
 *   Use `userAppDataPath` instead.
 */

let readOnlyInternalRootPath = path.join(__dirname, '..');
let readOnlyInternalAssetsPath = path.join(readOnlyInternalRootPath, 'assets');

/**
 * Other exports
 */

export { readOnlyInternalRootPath, readOnlyInternalAssetsPath };
