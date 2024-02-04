/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleUpdate.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/
import fs from "node:fs";
import path from "node:path";
import {
  AllowedScheduleIntervalReturnType,
  getDataProviderByIdentifier,
} from "data-providers";
import logger from "logger";
import commander, { Command, Option } from "commander";
import { Schedule } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";
import { safeSanitizeFileName, userDownloadsCapturesPath } from "utilities";
import dayjs from "dayjs";

const ScheduleUpdate = new commander.Command("schedule:update");

ScheduleUpdate.description("Update an existing Schedule")
  .argument("<schedule-id>", "Schedule ID")
  .option(
    `--interval-in-seconds <interval-in-seconds>`,
    "Update Schedule's Interval in Seconds (e.g. one hour = 3600, one day = 86400, two days = 172800, one week = 604800, two weeks = 1209600, monthly = 2592000, two months = 5184000, yearly = 31536000, monthly = 2592000)"
  )
  .option(
    `--download-location <download-location>`,
    "Update Schedule's Download location"
  )
  .addOption(new Option(`--enable`, "Enable Schedule").conflicts("disable"))
  .addOption(new Option(`--disable`, "Disable Schedule").conflicts("enable"))
  .action(
    async (
      scheduleId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
      program: Command
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        if (isNaN(parseInt(scheduleId)))
          throw new ErrorResponse("Schedule ID must be a number");

        let schedule: Schedule | null = null;
        try {
          schedule = await Schedule.findOne({
            where: { id: parseInt(scheduleId) },
            relations: { source: true },
          });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to find Schedule ID ${scheduleId} to be updated`,
            error instanceof Error ? error : undefined
          );
        }

        if (schedule == null)
          throw new ErrorResponse(`No schedule found with ID: ${scheduleId}`);

        if (schedule?.source?.dataProviderIdentifier == null)
          throw new ErrorResponse(
            "The Source's Data Provider identifier is not set"
          );

        const dataProvider = await getDataProviderByIdentifier(
          schedule?.source?.dataProviderIdentifier
        );
        if (dataProvider == null)
          throw new ErrorResponse(
            "No installed Data  Provider could be found for the Source's Data Provider identifier"
          );

        const dataProviderAllowedIntervalInformation: AllowedScheduleIntervalReturnType =
          await dataProvider.allowedScheduleInterval();

        if (typeof optionsAndArguments["intervalInSeconds"] !== "undefined") {
          const intervalInSeconds = parseInt(
            optionsAndArguments["intervalInSeconds"] + ""
          );

          if (
            dataProviderAllowedIntervalInformation.onlyRunOnce === true &&
            intervalInSeconds === null
          ) {
            throw new ErrorResponse(
              "The Source's Data Provider does not allow the Schedule to be ran more than once"
            );
          }

          if (intervalInSeconds === null) {
            schedule.interval = null;
            schedule.nextRunAt = dayjs().toDate();
          } else {
            if (Number.isNaN(intervalInSeconds))
              throw new ErrorResponse("Scheduling interval must be a number");

            if (Number(intervalInSeconds) < 1)
              throw new ErrorResponse(
                "Scheduling interval must be greater than 0"
              );

            schedule.interval = intervalInSeconds;
            schedule.nextRunAt = dayjs()
              .add(intervalInSeconds, "second")
              .clone()
              .toDate();
          }
        }

        if (typeof optionsAndArguments["downloadLocation"] !== "undefined") {
          let downloadLocation =
            optionsAndArguments["downloadLocation"] == null
              ? null
              : optionsAndArguments["downloadLocation"].toString();
          if (downloadLocation != null) {
            if (downloadLocation.endsWith("/"))
              downloadLocation = downloadLocation.slice(0, -1);
          }

          const downloadDirectory = safeSanitizeFileName(schedule.source.url);
          if (downloadDirectory === false) {
            const errorMessage = "Failed to sanitize download directory name";
            logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          downloadLocation = path.join(
            downloadLocation == null
              ? userDownloadsCapturesPath
              : downloadLocation,
            downloadDirectory
          );

          if (downloadLocation.endsWith("/"))
            downloadLocation = downloadLocation.slice(0, -1);

          if (fs.existsSync(downloadLocation) === false) {
            logger.info(
              "The chosen download destination does not exist, creating it now"
            );
            fs.mkdirSync(downloadLocation, { recursive: true });
          }

          if (fs.lstatSync(downloadLocation).isDirectory() === false)
            throw new ErrorResponse(
              "The chosen download destination must be a directory"
            );

          schedule.downloadLocation = downloadLocation;
        }

        if (typeof optionsAndArguments["enable"] !== "undefined") {
          if (
            optionsAndArguments["enable"] === true ||
            optionsAndArguments["enable"] === "true"
          ) {
            schedule.enabled = true;
          }
        }

        if (typeof optionsAndArguments["disable"] !== "undefined") {
          if (
            optionsAndArguments["disable"] === true ||
            optionsAndArguments["disable"] === "true"
          ) {
            schedule.enabled = false;
          }
        }

        let updatedSchedule: Schedule | null = null;

        try {
          updatedSchedule = await Schedule.save(schedule);
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to update Schedule ID ${scheduleId}`,
            error instanceof Error ? error : undefined
          );
        }

        if (updatedSchedule == null)
          throw new ErrorResponse(`The Schedule could not be updated`);

        return new MessageResponse(
          `Updated existing Schedule with ID ${updatedSchedule.id}`,
          [updatedSchedule]
        ).send();
      });
    }
  );

export default ScheduleUpdate;
