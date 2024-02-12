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
import { getDataProviderByIdentifier } from "data-providers";
import logger from "logger";
import { Schedule } from "database";
import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";
import {
  safeSanitizeFileName,
  userDownloadsCapturesPath,
} from "common-functions";
import dayjs from "dayjs";
import { type AllowedScheduleIntervalReturnType } from "common-types";

const ScheduleUpdate = async (
  scheduleId: string,
  intervalInSeconds?: string | number | null,
  downloadLocation?: string | null,
  enable?: boolean | string | null,
  disable?: boolean | string | null,
) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
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
        error instanceof Error ? error : undefined,
      );
    }

    if (schedule == null)
      throw new ErrorResponse(`No schedule found with ID: ${scheduleId}`);

    if (schedule?.source?.dataProviderIdentifier == null)
      throw new ErrorResponse(
        "The Source's Data Provider identifier is not set",
      );

    const dataProvider = await getDataProviderByIdentifier(
      schedule?.source?.dataProviderIdentifier,
    );
    if (dataProvider == null)
      throw new ErrorResponse(
        "No installed Data Provider could be found for the Source's Data Provider identifier",
      );

    const dataProviderAllowedIntervalInformation: AllowedScheduleIntervalReturnType =
      await dataProvider.allowedScheduleInterval();

    if (typeof intervalInSeconds !== "undefined") {
      intervalInSeconds = (
        intervalInSeconds == null ? null : parseInt(intervalInSeconds + "")
      ) as number | null;

      if (
        dataProviderAllowedIntervalInformation.onlyRunOnce === true &&
        // TODO: This was originally `intervalInSeconds === null`, but I suspect that this is a bug, if the negation change is causing issues, revert it here
        intervalInSeconds !== null
      ) {
        throw new ErrorResponse(
          "The Source's Data Provider does not allow the Schedule to be ran more than once",
        );
      }

      if (intervalInSeconds === null) {
        schedule.interval = null;
        schedule.nextRunAt = dayjs().toDate();
      } else {
        if (Number.isNaN(intervalInSeconds))
          throw new ErrorResponse("Scheduling interval must be a number");

        if (Number(intervalInSeconds) < 1)
          throw new ErrorResponse("Scheduling interval must be greater than 0");

        schedule.interval = intervalInSeconds;
        schedule.nextRunAt = dayjs()
          .add(intervalInSeconds, "second")
          .clone()
          .toDate();
      }
    }

    if (typeof downloadLocation !== "undefined") {
      downloadLocation =
        downloadLocation == null ? null : downloadLocation.toString();
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
        downloadLocation == null ? userDownloadsCapturesPath : downloadLocation,
        downloadDirectory,
      );

      if (downloadLocation.endsWith("/"))
        downloadLocation = downloadLocation.slice(0, -1);

      if (fs.existsSync(downloadLocation) === false) {
        logger.info(
          "The chosen download destination does not exist, creating it now",
        );
        fs.mkdirSync(downloadLocation, { recursive: true });
      }

      if (fs.lstatSync(downloadLocation).isDirectory() === false)
        throw new ErrorResponse(
          "The chosen download destination must be a directory",
        );

      schedule.downloadLocation = downloadLocation;
    }

    if (typeof enable !== "undefined") {
      if (enable === true || enable === "true") {
        schedule.enabled = true;
      }
    }

    if (typeof disable !== "undefined") {
      if (disable === true || disable === "true") {
        schedule.enabled = false;
      }
    }

    let updatedSchedule: Schedule | null = null;

    try {
      updatedSchedule = await Schedule.save(schedule);
    } catch (error) {
      throw new ErrorResponse(
        `A DB error occurred when attempting to update Schedule ID ${scheduleId}`,
        error instanceof Error ? error : undefined,
      );
    }

    if (updatedSchedule == null)
      throw new ErrorResponse(`The Schedule could not be updated`);

    return new MessageResponse(
      `Updated existing Schedule with ID ${updatedSchedule.id}`,
      [updatedSchedule],
    );
  });
};

export default ScheduleUpdate;
