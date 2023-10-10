/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: convertCrossPlatformSlashPathToNodePath.ts
Created:  2023-09-25T02:27:03.480Z
Modified: 2023-09-25T02:27:03.480Z

Description: description
*/

const convertCrossPlatformSlashPathToNodePath = (path: string) => path.replace(/\\/g, '/');

export default convertCrossPlatformSlashPathToNodePath;
