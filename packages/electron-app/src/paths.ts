/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-08-22T20:33:52.038Z
Modified: 2023-08-22T20:33:52.039Z

Description: description
*/

import path from 'node:path';

// It is just a fucking boolean, I tried to create a .d.ts file for that, doesn't work, will not waste more time on it
// @ts-ignore
import _isPackaged from 'electron-is-packaged';
export const isPackaged = _isPackaged as unknown as { isPackaged: boolean };

/**
 * Do not use `readOnlyInternalRootPath` nor any path prefixed `readOnly` for any write operations.
 *   Use `userAppDataPath` instead.
 */

let readOnlyInternalRootPath = path.join(__dirname, '..');
let readOnlyInternalAssetsPath = path.join(readOnlyInternalRootPath, 'assets');

/**
 * Path to the `marchive-cli` binary (when packaged) and the bundled `lib/index.js` (when not packaged).
 */
const readOnlyInternalMarchiveCliPath = isPackaged.isPackaged
  ? path.join(readOnlyInternalRootPath, 'cli', 'marchive-cli')
  : path.join(readOnlyInternalRootPath, '..', 'cli', 'lib', 'index.js');

const readOnlyInternalMarchiveCliExecutable = isPackaged.isPackaged
  ? ''
  : 'node';

/**
 * Other exports
 */

export {
  readOnlyInternalRootPath,
  readOnlyInternalAssetsPath,
  readOnlyInternalMarchiveCliPath,
  readOnlyInternalMarchiveCliExecutable,
};
