/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: userDownloadsCapturesPath.ts
Created:  2023-10-11T08:11:03.804Z
Modified: 2023-10-11T08:11:03.804Z

Description: description
*/

import path from 'node:path';
import userDownloadsPath from './userDownloadsPath';

const userDownloadsCapturesPath = path.join(userDownloadsPath, 'Captures');

export default userDownloadsCapturesPath;