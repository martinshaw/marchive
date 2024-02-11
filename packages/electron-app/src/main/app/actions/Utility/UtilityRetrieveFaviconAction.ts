/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilityRetrieveFaviconAction.ts
Created:  2023-09-06T03:31:41.596Z
Modified: 2023-09-06T03:31:41.596Z

Description: description
*/

import { runCliCommand } from '../../cli/runCliCommand';

export type UtilityRetrieveFaviconActionResponseType = {
  url: string;
  directory: string | null;
  fileName: string | null;
  path: string | null;
};

/**
 * @throws {Error}
 */
const UtilityRetrieveFaviconAction = async (
  url: string,
  store: boolean,
): Promise<UtilityRetrieveFaviconActionResponseType> =>
  runCliCommand<UtilityRetrieveFaviconActionResponseType>(
    'utilities:retrieve-favicon',
    [url],
    { store },
  ).then((response) => response.getData()[0]);

export default UtilityRetrieveFaviconAction;