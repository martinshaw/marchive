/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: userDownloadsPath.ts
Created:  2023-10-11T08:21:07.505Z
Modified: 2023-10-11T08:21:07.505Z

Alternative to the convenient Electron method `app.getPath('downloads')` which is not available in non-Electron processes.
*/

import os from "node:os";
import path from "node:path";

const userDownloadsPath: string = path.join(os.homedir(), 'Downloads', 'Marchive');

export default userDownloadsPath;