/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: types.d.ts
Created:  2024-02-17T16:12:29.969Z
Modified: 2024-02-17T16:12:29.969Z

Description: description
*/

type ImmediateCliCommandNames =
  | 'stored-setting:list'
  | 'stored-setting:get'
  | 'stored-setting:set'
  | 'stored-setting:unset'
  | 'source-domain:list'
  | 'source-domain:show'
  | 'source-domain:count'
  | 'source:list'
  | 'source:show'
  | 'source:count'
  | 'source:create'
  | 'source:delete'
  | 'capture:list'
  | 'capture:show'
  | 'capture:delete'
  | 'data-provider:list'
  | 'data-provider:show'
  | 'data-provider:validate'
  | 'schedule:list'
  | 'schedule:show'
  | 'schedule:count'
  | 'schedule:create'
  | 'schedule:update'
  | 'schedule:delete'
  | 'utilities:retrieve-favicon';

type PerpetualCliCommandNames = 'watch:schedules' | 'watch:capture-parts';

type CliCommandNames = ImmediateCliCommandNames | PerpetualCliCommandNames;

export { CliCommandNames, ImmediateCliCommandNames, PerpetualCliCommandNames };
