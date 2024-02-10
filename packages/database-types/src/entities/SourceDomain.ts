/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: Source.js
Created:  2023-06-21T16:32:11.327Z
Modified: 2023-06-21T16:32:11.327Z

Description: description
*/

import { type SourceEntityType } from "./Source";

export type SourceDomainEntityType = {
  name: string;
  url: string | null;
  faviconPath: string | null;
  sources: SourceEntityType[];
};

export default SourceDomainEntityType;
