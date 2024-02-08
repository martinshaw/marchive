/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { FindOptionsWhere, Source } from 'database';

const SourceListAction = async (
  where?: FindOptionsWhere<Source>,
): Promise<Source[]> => Source.find({ where, relations: { schedules: true } });

export default SourceListAction;
