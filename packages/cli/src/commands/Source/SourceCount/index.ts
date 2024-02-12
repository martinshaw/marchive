/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCount.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/

import { Source } from "database";
import MessageResponse from "../../../responses/MessageResponse";

const SourceCount = async () => {
  const count = await Source.count();

  return new MessageResponse(`${count} Source${count === 1 ? "" : "s"}`, [
    {
      count,
    },
  ]).send();
};

export default SourceCount;
