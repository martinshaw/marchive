/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-09-06T22:28:00.468Z
Modified: 2023-09-06T22:28:00.468Z

Description: description
*/

import winston from "winston";
import createWinstonLogger from "./createWinstonLogger";

let logger: winston.Logger | typeof console = console;
logger = createWinstonLogger("other");

const processWithOptionalType: NodeJS.Process & { type?: string } = process;
if (typeof (processWithOptionalType).type !== "undefined") {
  if (typeof processWithOptionalType.versions["electron"] !== "undefined" && ["renderer", "browser"].includes(processWithOptionalType.type)) {
    logger = createWinstonLogger(processWithOptionalType.type === "browser" ? 
      "main" :
      processWithOptionalType.type
    );
  }
}

export default logger;
