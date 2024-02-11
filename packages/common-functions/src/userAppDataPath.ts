/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: userAppDataPath.ts
Created:  2023-10-10T16:17:26.306Z
Modified: 2023-10-10T16:17:26.306Z

Alternative to the convenient Electron method `app.getPath('userData')` which is not available in non-Electron processes.
*/

import os from "node:os";
import path from "node:path";
import process from "node:process";

let userAppDataPath: string = path.join(os.homedir(), 'Downloads', 'Marchive', 'AppData');

if (typeof process.platform === 'string') {
    if (process.platform === 'win32') userAppDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Marchive');
    if (process.platform === 'darwin') userAppDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'Marchive');
    if (process.platform === 'linux') userAppDataPath = path.join(os.homedir(), '.config', 'Marchive', 'AppData');
    if (process.platform === 'freebsd') userAppDataPath = path.join(os.homedir(), '.config', 'Marchive', 'AppData');
    if (process.platform === 'sunos') userAppDataPath = path.join(os.homedir(), '.config', 'Marchive', 'AppData');
    if (process.platform === 'aix') userAppDataPath = path.join(os.homedir(), '.config', 'Marchive', 'AppData');
}

export default userAppDataPath;