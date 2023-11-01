/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-10T06:28:15.735Z
Modified: 2023-10-10T06:28:15.735Z

Description: description
*/

import retrieveFileAsBase64DataUrlFromAbsolutePath from "./retrieveFileAsBase64DataUrlFromAbsolutePath";
import convertCrossPlatformSlashPathToNodePath from "./convertCrossPlatformSlashPathToNodePath";
import safeSanitizeFileName from "./safeSanitizeFileName";
import userAppDataPath from "./userAppDataPath";
import userDownloadsPath from "./userDownloadsPath";
import userDownloadsCapturesPath from "./userDownloadsCapturesPath";
import userDownloadsSourceDomainFaviconsPath from "./userDownloadsSourceDomainFaviconsPath";
// TODO: For some stupid fucking reason, the dts-gen generated type declaration file for this isn't working
// @ts-ignore 
import resolveRelative from "resolve-relative-url";

export {
  retrieveFileAsBase64DataUrlFromAbsolutePath,
  convertCrossPlatformSlashPathToNodePath,
  safeSanitizeFileName,
  userAppDataPath,
  userDownloadsPath,
  userDownloadsCapturesPath,
  userDownloadsSourceDomainFaviconsPath,
  resolveRelative,
};
