/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { FindOptionsRelations, FindOptionsWhere, Schedule } from 'database';

const ScheduleListAction = async (
  sourceId: number | null = null,
  withCaptures = false,
): Promise<Schedule[]> => {
  let where: FindOptionsWhere<Schedule> =
    sourceId != null ? { id: sourceId } : {};

  let relations: FindOptionsRelations<Schedule> = {
    captures: withCaptures,
  };

  return Schedule.find({
    where,
    relations,
  });
};

export default ScheduleListAction;
