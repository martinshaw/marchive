/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: commands.ts
Created:  2024-02-29T07:10:13.696Z
Modified: 2024-02-29T07:10:13.696Z

Description: description
*/

type ImmediateCliCommandNames =
  | "stored-setting:list"
  | "stored-setting:get"
  | "stored-setting:set"
  | "stored-setting:unset"
  | "source-domain:list"
  | "source-domain:show"
  | "source-domain:count"
  | "source:list"
  | "source:show"
  | "source:count"
  | "source:create"
  | "source:delete"
  | "capture:list"
  | "capture:show"
  | "capture:show-files"
  | "capture:delete"
  | "capture-part:list"
  | "capture-part:show"
  | "capture-part:show-files"
  | "capture-part:delete"
  | "data-provider:list"
  | "data-provider:show"
  | "data-provider:validate"
  | "schedule:list"
  | "schedule:show"
  | "schedule:count"
  | "schedule:create"
  | "schedule:update"
  | "schedule:delete"
  | "utilities:retrieve-favicon"
  | "utilities:add-cli-to-path";

type PerpetualCliCommandNames = "watch:schedules" | "watch:capture-parts";

type CliCommandNames = ImmediateCliCommandNames | PerpetualCliCommandNames;

export { CliCommandNames, ImmediateCliCommandNames, PerpetualCliCommandNames };
