/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: paths.ts
Created:  2023-10-11T22:14:15.995Z
Modified: 2023-10-11T22:14:15.995Z

Description: description
*/

import path from 'node:path';

const readOnlyBrowserExtensionsPath = path.join(__dirname, 'browser_extensions');

export { readOnlyBrowserExtensionsPath };