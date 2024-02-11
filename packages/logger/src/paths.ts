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
import { userAppDataPath } from "common-functions";

// Alternative to the convenient Electron method `app.getPath('logs')` which is not available in non-Electron processes.

let appLogsPath: string = path.join(userAppDataPath, "Logs");

if (typeof process.platform === "string") {
  if (process.platform === "win32")
    appLogsPath = path.join(userAppDataPath, "Logs");
  if (process.platform === "darwin")
    appLogsPath = path.join(os.homedir(), "Library", "Logs", "Marchive");

  /**
   * Because the /var/log directory may have ambiguous permissions and because log files contained within the /var/log
   *   directory are conventionally plain text files, we write logs to a subdirectory of the user's home directory.
   */

  if (process.platform === "linux")
    appLogsPath = path.join(userAppDataPath, "Logs");
  if (process.platform === "freebsd")
    appLogsPath = path.join(userAppDataPath, "Logs");
  if (process.platform === "sunos")
    appLogsPath = path.join(userAppDataPath, "Logs");
  if (process.platform === "aix")
    appLogsPath = path.join(userAppDataPath, "Logs");
}

export { appLogsPath };
