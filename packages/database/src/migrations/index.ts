/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2024-01-30T07:25:51.956Z
Modified: 2024-01-30T07:25:51.956Z

Description: description
*/

import { CreateStoredSettingsTable1706535952788 } from "./1706535952788-create_stored_settings_table";
import { CreateSourcesTable1706600379383 } from "./1706600379383-create_sources_table";
import { CreateSourceDomainsTable1706600471177 } from "./1706600471177-create_source_domains_table";
import { CreateSchedulesTable1706600552839 } from "./1706600552839-create_schedules_table";
import { CreateCapturesTable1706600657091 } from "./1706600657091-create_captures_table";
import { CreateCapturePartsTable1706600783575 } from "./1706600783575-create_capture_parts_table";

/**
 * I would prefer to use [path.join(__dirname, "migrations", "**", "*{.ts,.js}")], but including a fixed import of the
 *   class massively reduces the complexity of the webpack bundle compilation and pkg packaging process, removing
 *   the need for many compiled files to be included in the package and reducing the size of the package.
 */
export default [
  CreateStoredSettingsTable1706535952788,
  CreateSourcesTable1706600379383,
  CreateSourceDomainsTable1706600471177,
  CreateSchedulesTable1706600552839,
  CreateCapturesTable1706600657091,
  CreateCapturePartsTable1706600783575,
];
