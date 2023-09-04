/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: create.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import fs from 'node:fs'
import path from 'node:path'
import {Schedule, Source} from '../../../database'
import slugify from 'slugify'
import {downloadCapturesPath as defaultDownloadCapturesPath} from '../../../../paths'
import {getDataProviderByIdentifier} from '../../repositories/DataProviderRepository'
import {AllowedScheduleIntervalReturnType} from '../../providers/BaseDataProvider'
import logger from '../../../log'
import { ScheduleAttributes } from 'main/database/models/Schedule'

/**
 * @throws {Error}
 */
const ScheduleCreateAction = async (
  sourceId: number,
  intervalInSeconds: number | null,
  downloadLocation: string | null = null,
): Promise<ScheduleAttributes | never> => {
  const source = await Source.findByPk(sourceId)
  if (source == null) {
    const errorMessage = `No source found with id: ${sourceId}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const dataProvider = await getDataProviderByIdentifier(source.dataProviderIdentifier)
  if (dataProvider == null) {
    const errorMessage = 'No installed Data Provider could be found for the Source\'s Data Provider identifier: ' + (source.dataProviderIdentifier ?? '')
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const dataProviderAllowedIntervalInformation: AllowedScheduleIntervalReturnType = await dataProvider.allowedScheduleInterval()
  const minimumNonNullIntervalInSeconds = 5 * 60 // 5 minutes

  if (dataProviderAllowedIntervalInformation.onlyRunOnce === true || intervalInSeconds == null) {
    logger.info(`The Source's Data Provider '${dataProvider.getName()}' will only allow this new Schedule to be ran once by the schedule watcher...`)
    intervalInSeconds = null
  } else if (intervalInSeconds < minimumNonNullIntervalInSeconds) {
    logger.info(`Attempting to create a new Schedule with an interval below the minimum allowed (${minimumNonNullIntervalInSeconds} seconds), using minimum allowed instead...`)
    intervalInSeconds = minimumNonNullIntervalInSeconds
  }

  downloadLocation = path.join(
    downloadLocation == null ? defaultDownloadCapturesPath : downloadLocation,
    slugify(source.url.toString(), {
      replacement: '_',
      lower: true,
      trim: true,
      strict: true,
    }),
  )

  logger.info('Using download location: ' + downloadLocation + ' for new Schedule')

  if (downloadLocation.endsWith('/')) downloadLocation = downloadLocation.slice(0, -1)
  if (fs.existsSync(downloadLocation) === false) fs.mkdirSync(downloadLocation, {recursive: true})

  if (fs.lstatSync(downloadLocation).isDirectory() === false) {
    const errorMessage = 'The chosen download destination must be a directory'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const nextRunAtDate = intervalInSeconds == null ? new Date() : new Date(Date.now() + (intervalInSeconds * 1000))

  const schedule = await Schedule.create(
    {
      interval: intervalInSeconds,
      nextRunAt: nextRunAtDate,
      downloadLocation: downloadLocation,
      sourceId: source.id,
    },
  )

  if (schedule == null) {
    const errorMessage = 'Failed to create new Schedule'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  logger.info(`Created new Schedule with ID ${schedule.id}`)

  return schedule.toJSON()
}

export default ScheduleCreateAction
