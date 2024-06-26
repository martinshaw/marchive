/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: ScheduleCreateAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import fs from 'node:fs';
import path from 'node:path';
import { userDownloadsCapturesPath } from 'utilities';
import logger from 'logger';
import { safeSanitizeFileName } from 'utilities';
// import { Schedule, Source } from 'database'
// import { getDataProviderByIdentifier, type AllowedScheduleIntervalReturnType } from 'data-providers'
// import { ScheduleAttributes } from 'database/src/models/Schedule'

/**
 * @throws {Error}
 */
const ScheduleCreateAction = async (
  sourceId: number,
  intervalInSeconds: number | null,
  downloadLocation: string | null = null,
): Promise</*ScheduleAttributes | never*/ void> => {
  // let source: Source | null = null
  // try {
  //   source = await Source.findByPk(sourceId)
  // } catch (error) {
  //   logger.error(`A DB error occurred when attempting to find Source ID ${sourceId} for new Schedule`)
  //   logger.error(error)
  // }
  // if (source == null) {
  //   const errorMessage = `No source found with id: ${sourceId}`
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
  // const dataProvider = await getDataProviderByIdentifier(source.dataProviderIdentifier)
  // if (dataProvider == null) {
  //   const errorMessage = 'No installed Data Provider could be found for the Source\'s Data Provider identifier: ' + (source.dataProviderIdentifier ?? '')
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
  // const dataProviderAllowedIntervalInformation: AllowedScheduleIntervalReturnType = await dataProvider.allowedScheduleInterval()
  // const minimumNonNullIntervalInSeconds = 5 * 60 // 5 minutes
  // if (dataProviderAllowedIntervalInformation.onlyRunOnce === true || intervalInSeconds == null) {
  //   logger.info(`The Source's Data Provider '${dataProvider.getName()}' will only allow this new Schedule to be ran once by the schedule watcher...`)
  //   intervalInSeconds = null
  // } else if (intervalInSeconds < minimumNonNullIntervalInSeconds) {
  //   logger.info(`Attempting to create a new Schedule with an interval below the minimum allowed (${minimumNonNullIntervalInSeconds} seconds), using minimum allowed instead...`)
  //   intervalInSeconds = minimumNonNullIntervalInSeconds
  // }
  // const downloadDirectory = safeSanitizeFileName(source.url)
  // if (downloadDirectory === false) {
  //   const errorMessage = 'Failed to sanitize download directory name'
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
  // downloadLocation = path.join(
  //   downloadLocation == null ? userDownloadsCapturesPath : downloadLocation,
  //   downloadDirectory,
  // )
  // logger.info('Using download location: ' + downloadLocation + ' for new Schedule')
  // if (downloadLocation.endsWith('/')) downloadLocation = downloadLocation.slice(0, -1)
  // if (fs.existsSync(downloadLocation) === false) fs.mkdirSync(downloadLocation, {recursive: true})
  // if (fs.lstatSync(downloadLocation).isDirectory() === false) {
  //   const errorMessage = 'The chosen download destination must be a directory'
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
  // const nextRunAtDate = intervalInSeconds == null ? new Date() : new Date(Date.now() + (intervalInSeconds * 1000))
  // let schedule: Schedule | null = null
  // try {
  //   schedule = await Schedule.save({
  //     interval: intervalInSeconds,
  //     nextRunAt: nextRunAtDate,
  //     downloadLocation: downloadLocation,
  //     sourceId: source.id,
  //   })
  // } catch (error) {
  //   logger.error(`A DB error occurred when attempting to create a new Schedule for Source ID ${source.id}`)
  //   logger.error(error)
  // }
  // if (schedule == null) {
  //   const errorMessage = 'Failed to create new Schedule'
  //   logger.error(errorMessage)
  //   throw new Error(errorMessage)
  // }
  // logger.info(`Created new Schedule with ID ${schedule.id}`)
  // return schedule.toJSON()
};

export default ScheduleCreateAction;
