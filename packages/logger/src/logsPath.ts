/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: winstonPath.ts
Created:  2023-10-10T05:55:11.817Z
Modified: 2023-10-10T05:55:11.817Z

Description: description
*/

import os from "node:os";
import path from "node:path";
import { userAppDataPath } from "utilities";

// Alternative to the convenient Electron method `app.getPath('logs')` which is not available in non-Electron processes.

let logPath: string = path.join(userAppDataPath, 'Logs');

if (typeof process.platform === 'string') {
    if (process.platform === 'win32') logPath = path.join(userAppDataPath, 'Logs');
    if (process.platform === 'darwin') logPath = path.join(os.homedir(), 'Library', 'Logs', 'Marchive');

    /**
     * Because the /var/log directory may have ambiguous permissions and because log files contained within the /var/log 
     *   directory are conventionally plain text files, we write logs to a subdirectory of the user's home directory.
     */
    
    if (process.platform === 'linux') logPath = path.join(userAppDataPath, 'Logs');
    if (process.platform === 'freebsd') logPath = path.join(userAppDataPath, 'Logs');
    if (process.platform === 'sunos') logPath = path.join(userAppDataPath, 'Logs');
    if (process.platform === 'aix') logPath = path.join(userAppDataPath, 'Logs');
}

export default logPath;