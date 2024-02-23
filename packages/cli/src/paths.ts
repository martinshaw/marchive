/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2024-02-22T22:41:26.929Z
Modified: 2024-02-22T22:41:26.929Z

Description: description
*/

import path from "node:path";
import os from "node:os";

const isPackaged =
  __filename.includes("/snapshot/") || __filename.includes("\\snapshot\\");

const readOnlyCliRootPath = isPackaged
  ? process.cwd()
  : path.join(__dirname, "..", "bin");

const readOnlyCliBinaryPath = isPackaged
  ? process.execPath
  : path.join(
      readOnlyCliRootPath,
      "marchive-cli" + (os.platform().startsWith("win") ? ".exe" : ""),
    );

export { isPackaged, readOnlyCliRootPath, readOnlyCliBinaryPath };
