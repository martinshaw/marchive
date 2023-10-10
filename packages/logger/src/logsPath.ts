/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: winstonPath.ts
Created:  2023-10-10T05:55:11.817Z
Modified: 2023-10-10T05:55:11.817Z

Description: description
*/

import path from "node:path";
import userAppDataPath from "utilities";

// Alternative to the convenient Electron method `app.getPath('logs')` which is not available in non-Electron processes.

let logPath: string = path.join(userAppDataPath, 'Logs'); 

export default logPath;