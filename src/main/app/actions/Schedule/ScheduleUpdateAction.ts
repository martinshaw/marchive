/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: update.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import fs from 'node:fs'
import {Schedule, Source} from '../../../database'
import {Attributes} from 'sequelize'
import logger from '../../../log'
import { getDataProviderByIdentifier } from '../../../app/repositories/DataProviderRepository'
import { AllowedScheduleIntervalReturnType } from '../../../app/providers/BaseDataProvider'
import { ScheduleAttributes } from 'main/database/models/Schedule'

/**
 * @throws {Error}
 */
const ScheduleUpdateAction = async (
  scheduleId: number,
  requestedChanges: ScheduleAttributes
): Promise<ScheduleAttributes> => {
  const schedule = await Schedule.findByPk(scheduleId, {include: [Source]})
  if (schedule == null) {
    const errorMessage = `No schedule found with id: ${scheduleId}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (schedule?.source?.dataProviderIdentifier == null) {
    const errorMessage = 'The Source\'s Data Provider identifier is not set'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const dataProvider = await getDataProviderByIdentifier(schedule?.source?.dataProviderIdentifier)
  if (dataProvider == null) {
    const errorMessage = 'No installed Data  Provider could be found for the Source\'s Data Provider identifier'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const dataProviderAllowedIntervalInformation: AllowedScheduleIntervalReturnType = await dataProvider.allowedScheduleInterval()

  const scheduleChanges: Partial<ScheduleAttributes> = {}

  if (typeof requestedChanges.interval !== 'undefined') {
    if (dataProviderAllowedIntervalInformation.onlyRunOnce === true && requestedChanges.interval === null && typeof requestedChanges.interval !== 'undefined') {
      const errorMessage = 'The Source\'s Data Provider does not allow the Schedule to be ran more than once'
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (requestedChanges.interval === null) {
      scheduleChanges.interval = null
      scheduleChanges.nextRunAt = (new Date())
    } else {
      if (Number.isNaN(requestedChanges.interval)) {
        const errorMessage = 'Scheduling interval must be a number'
        logger.error(errorMessage)
        throw new Error(errorMessage)
      }

      if (Number(requestedChanges.interval) < 1) {
        const errorMessage = 'Scheduling interval must be greater than 0'
        logger.error(errorMessage)
        throw new Error(errorMessage)
      }

      scheduleChanges.interval = requestedChanges.interval
      scheduleChanges.nextRunAt = (new Date(Date.now() + (scheduleChanges.interval * 1000)))
    }
  }

  if (requestedChanges.downloadLocation != null) {
    let downloadLocation = requestedChanges.downloadLocation

    if (downloadLocation.endsWith('/')) downloadLocation = downloadLocation.slice(0, -1)

    if (fs.existsSync(downloadLocation) === false) {
      logger.info('The chosen download destination does not exist, creating it now')
      fs.mkdirSync(downloadLocation, {recursive: true})
    }

    if (fs.lstatSync(downloadLocation).isDirectory() === false) {
      const errorMessage = 'The chosen download destination must be a directory'
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    scheduleChanges.downloadLocation = downloadLocation
  }

  if (requestedChanges.enabled != null) {
    scheduleChanges.enabled = requestedChanges.enabled
  }

  const updatedSchedule = await schedule.update(scheduleChanges)
  if (updatedSchedule == null) {
    const errorMessage = 'The Schedule could not be updated'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  return updatedSchedule.toJSON()
}

export default ScheduleUpdateAction
