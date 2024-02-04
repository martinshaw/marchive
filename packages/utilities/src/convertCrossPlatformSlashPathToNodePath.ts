/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: convertCrossPlatformSlashPathToNodePath.ts
Created:  2023-10-10T07:18:33.091Z
Modified: 2023-10-10T07:18:33.091Z

Description: description
*/

const convertCrossPlatformSlashPathToNodePath = (path: string) => path.replace(/\\/g, '/');

export default convertCrossPlatformSlashPathToNodePath;