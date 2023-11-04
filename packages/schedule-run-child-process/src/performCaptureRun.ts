/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: performCaptureRun.ts
Created:  2023-10-11T03:58:35.385Z
Modified: 2023-10-11T03:58:35.385Z

Description: description
*/

import fs from "node:fs";
import logger from "logger";
import path from "node:path";
import { v4 as uuidV4 } from "uuid";
import {
  ScheduleAttributes,
  ScheduleStatus,
} from "database/src/models/Schedule";
import { Capture, Schedule, Source } from "database";
import { getDataProviderByIdentifier } from "data-providers";
import { safeSanitizeFileName, userDownloadsCapturesPath } from "utilities";

const performCaptureRun = async (schedule: Schedule): Promise<void> => {
  // TODO: REVERT THIS BACK TO .debug WHEN WE HAVE FINISHED TESTING MONOREPO REFACTOR
  logger.info("Found Schedule with ID: " + schedule.id);

  schedule = await schedule.update({ status: "processing" as ScheduleStatus });

  if (schedule.source == null) {
    await cleanup(schedule);
    logger.error("No Source found for Schedule");
    return;
  }

  const sourceDataProviderIdentifier = schedule?.source?.dataProviderIdentifier;
  if (sourceDataProviderIdentifier == null) {
    await cleanup(schedule);
    logger.error("No Data Provider Identifier found for Source");
    return;
  }

  const dataProvider = await getDataProviderByIdentifier(
    sourceDataProviderIdentifier
  );
  if (dataProvider == null) {
    await cleanup(schedule);
    logger.error("No Data Provider found for Source");
    return;
  }

  logger.info(
    "Found Data Provider: " +
      dataProvider.getIdentifier() +
      " - " +
      dataProvider.getName()
  );

  let logCurrentCursorUrlExplanation = " for the first time";
  if (
    schedule?.source?.useStartOrEndCursor === "start" &&
    schedule?.source?.currentStartCursorUrl != null
  )
    logCurrentCursorUrlExplanation = ` until Start Cursor URL: ${schedule.source.currentStartCursorUrl}`;
  if (
    schedule?.source?.useStartOrEndCursor === "end" &&
    schedule?.source?.currentEndCursorUrl != null
  )
    logCurrentCursorUrlExplanation = ` from End Cursor URL: ${schedule.source.currentEndCursorUrl}`;

  logger.info(
    `Attempting to capture URL: ${schedule?.source?.url} - ${logCurrentCursorUrlExplanation}`
  );

  if (ensureDownloadsDirectoryExists() === false) {
    await cleanup(schedule);
    logger.error("The downloads directory cannot be created");
    return;
  }

  if (ensureScheduleDownloadLocationExists(schedule) === false) {
    await cleanup(schedule);
    logger.error(
      "The Schedule's chosen download destination cannot be created"
    );
    return;
  }

  const captureDownloadDirectory = generateCaptureDownloadDirectory(schedule);
  if (captureDownloadDirectory === false) {
    await cleanup(schedule);
    logger.error("A download directory could not be created for the capture");
    return;
  }

  let capture: Capture | null = null;
  try {
    capture = await Capture.create({
      downloadLocation: captureDownloadDirectory,
      scheduleId: schedule.id,
    });
  } catch (error) {
    await cleanup(schedule);
    logger.error("A DB error occurred when creating a new Capture");
    logger.error(error);
    return;
  }

  if (capture == null) {
    await cleanup(schedule);
    logger.error("A new Capture could not be created");
    return;
  }

  capture = await capture.reload({
    include: [
      {
        model: Schedule,
        include: [Source],
      },
    ],
  });

  logger.info(`Created new Capture with ID ${capture.id}`);

  if (capture.schedule == null) {
    await cleanup(schedule);
    logger.error("No associated Schedule found for Capture");
    return;
  }

  if (capture.schedule.source == null) {
    await cleanup(schedule);
    logger.error("No associated Source found for Capture's Schedule");
    return;
  }

  try {
    await dataProvider.performCapture(
      capture,
      capture.schedule,
      capture.schedule.source
    );
  } catch (error) {
    await cleanup(schedule);
    logger.error("Failed to perform the latest Capture");
    logger.error(error);
    return;
  }

  await cleanup(schedule);
  logger.info("Capture ID " + capture.id + " ran successfully");
};

const ensureDownloadsDirectoryExists = (): boolean => {
  if (fs.existsSync(userDownloadsCapturesPath) === false) {
    fs.mkdirSync(userDownloadsCapturesPath, { recursive: true });
  }

  return fs.lstatSync(userDownloadsCapturesPath).isDirectory();
};

const ensureScheduleDownloadLocationExists = (schedule: Schedule): boolean => {
  if (fs.existsSync(schedule.downloadLocation) === false) {
    fs.mkdirSync(schedule.downloadLocation, { recursive: true });
  }

  return fs.lstatSync(schedule.downloadLocation).isDirectory();
};

const generateCaptureDownloadDirectory = (
  schedule: Schedule
): string | false => {
  const attemptedDirectory = path.join(
    schedule.downloadLocation,
    safeSanitizeFileName(new Date().toISOString().replace(/:/g, "-")) ||
      uuidV4()
  );

  if (fs.existsSync(attemptedDirectory) === false) {
    fs.mkdirSync(attemptedDirectory, { recursive: true });
  }

  return fs.lstatSync(attemptedDirectory).isDirectory()
    ? attemptedDirectory
    : false;
};

const cleanup = async (
  schedule: Schedule | null | undefined
): Promise<boolean> => {
  if (schedule == null) return true;

  const changes: Partial<ScheduleAttributes> = {
    status: "pending" as ScheduleStatus,
    lastRunAt: schedule.nextRunAt,
  };

  if (
    schedule.interval != null &&
    Number.isNaN(Number(schedule.interval)) === false &&
    Number(schedule.interval) > 0
  ) {
    const nextRunAt = new Date(new Date().getTime() + schedule.interval * 1000);
    changes.nextRunAt = nextRunAt;
  }

  if (schedule.interval == null) changes.nextRunAt = null;

  return (await schedule.update(changes)) != null;
};

export default performCaptureRun;
