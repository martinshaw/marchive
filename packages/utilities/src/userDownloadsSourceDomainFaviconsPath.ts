/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: userDownloadsSourceDomainFaviconsPath.ts
Created:  2023-10-11T08:27:43.485Z
Modified: 2023-10-11T08:27:43.485Z

Description: description
*/

import path from 'node:path';
import userDownloadsPath from './userDownloadsPath';

const userDownloadsSourceDomainFaviconsPath = path.join(userDownloadsPath, 'Favicons');

export default userDownloadsSourceDomainFaviconsPath;