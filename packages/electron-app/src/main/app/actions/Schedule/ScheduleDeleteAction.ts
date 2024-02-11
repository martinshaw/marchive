/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleDeleteAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { runCliCommand } from '../../cli/runCliCommand';

/**
 * @throws {Error}
 */
const ScheduleDeleteAction = async (scheduleId: number): Promise<void> =>
  runCliCommand<{ id: number }>('schedule:delete', [scheduleId], {}).then(
    (response) => {},
  );

export default ScheduleDeleteAction;
