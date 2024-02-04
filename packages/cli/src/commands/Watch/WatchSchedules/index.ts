/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-11T02:59:44.724Z
Modified: 2023-10-11T02:59:44.724Z

Description: description
*/

import {
  Schedule,
  retrieveDueSchedules,
  getStoredSettingValue,
} from "database";
import logger from "logger";
import commander from "commander";
import performCaptureRun from "./performCaptureRun";

let lastSchedule: Schedule | null = null;

let WatchSchedules = new commander.Command("watch:schedules")
  .description("Watch for pending Schedules to be processed")
  .action(
    async (optionsAndArguments: {
      [key: string]: string | number | boolean;
    }) => {
      const currentDelayBetweenTicks = 13 * 1000; // 13 seconds

      // TODO: Keep these or remove them ???
      logger.info("WatchSchedules started (using Winston)"); // delete me
      console.log("WatchSchedules started (using console.log)"); // delete me

      while (true) {
        let watchSchedulesProcessIsPaused =
          (await getStoredSettingValue("WATCH_SCHEDULES_PROCESS_IS_PAUSED")) ===
          true;

        try {
          if (watchSchedulesProcessIsPaused === false) await tick();
        } catch (error) {
          if (lastSchedule != null) {
            logger.error(
              `An error occurred when trying to process Schedule ${lastSchedule.id} ${lastSchedule}`
            );
            logger.error(error);

            /**
             * Don't want to update the status of the Schedule to failed, as it may be due to a temporary
             *   issue and we don't want to stop the Schedule from running future captures
             */
            // lastSchedule.status = "failed";
            // await lastSchedule.save();
          }
        }

        await new Promise((resolve) => {
          setTimeout(() => resolve(null), currentDelayBetweenTicks);
        });
      }
    }
  );

const tick = async (): Promise<void> => {
  const dueSchedules = await retrieveDueSchedules();

  if (dueSchedules.length === 0) logger.info("No Schedules due to be run");

  dueSchedules.forEach(async (schedule) => {
    lastSchedule = schedule;

    logger.info(`Found Schedule ${schedule.id} due to be run`);

    performCaptureRun(schedule).catch((error) => {
      logger.error(
        `Error running Schedule ID ${schedule.id} in WatchSchedules tick loop`
      );
      logger.error(error);
    });
  });
};

export default WatchSchedules;
