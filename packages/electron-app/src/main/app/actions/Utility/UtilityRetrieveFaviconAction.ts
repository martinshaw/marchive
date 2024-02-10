/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilityRetrieveFaviconAction.ts
Created:  2023-09-06T03:31:41.596Z
Modified: 2023-09-06T03:31:41.596Z

Description: description
*/

import CliJsonResponse from '../../cli/CliJsonResponse';
import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const UtilityRetrieveFaviconAction = async (
  url: string,
  store: boolean,
): Promise<CliJsonResponse<[any]>> =>
  runCliCommand('utilities:retrieve-favicon', [url], { store });

export default UtilityRetrieveFaviconAction;
