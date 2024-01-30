/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2024-01-30T07:25:51.956Z
Modified: 2024-01-30T07:25:51.956Z

Description: description
*/

import { CreateStoredSettingsTable1706535952788 } from "./1706535952788-create-stored-settings-table";

/**
 * I would prefer to use [path.join(__dirname, "migrations", "**", "*{.ts,.js}")], but including a fixed import of the
 *   class massively reduces the complexity of the webpack bundle compilation and pkg packaging process, removing
 *   the need for many compiled files to be included in the package and reducing the size of the package.
 */
export default [CreateStoredSettingsTable1706535952788];
