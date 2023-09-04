/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureRunRepository.ts
Created:  2023-08-26T08:58:39.281Z
Modified: 2023-08-26T08:58:39.281Z

Description: description
*/

import path from 'node:path'
import fs from 'node:fs'
import {Capture, Schedule, Source} from '../../database'
import {ScheduleAttributes, ScheduleStatus} from '../../database/models/Schedule'
import {getDataProviderByIdentifier} from './DataProviderRepository'
import {downloadCapturesPath} from '../../../paths'
import logger from '../../log'

const performCaptureRun = async (schedule: Schedule): Promise<void> => {
  logger.info('Found Schedule with ID: ' + schedule.id)

  schedule = await schedule.update({status: 'processing' as ScheduleStatus})

  if (schedule.source == null) {
    await cleanup(schedule)
    logger.error('No Source found for Schedule')
    return
  }

  const sourceDataProviderIdentifier = schedule?.source?.dataProviderIdentifier
  if (sourceDataProviderIdentifier == null) {
    await cleanup(schedule)
    logger.error('No Data Provider Identifier found for Source')
    return
  }

  const dataProvider = await getDataProviderByIdentifier(sourceDataProviderIdentifier)
  if (dataProvider == null) {
    await cleanup(schedule)
    logger.error('No Data Provider found for Source')
    return
  }

  logger.info('Found Data Provider: ' + dataProvider.getIdentifier() + ' - ' + dataProvider.getName())

  let logCurrentCursorUrlExplanation = ' for the first time'
  if (schedule?.source?.useStartOrEndCursor === 'start' && schedule?.source?.currentStartCursorUrl != null) logCurrentCursorUrlExplanation = ` until Start Cursor URL: ${schedule.source.currentStartCursorUrl}`
  if (schedule?.source?.useStartOrEndCursor === 'end' && schedule?.source?.currentEndCursorUrl != null) logCurrentCursorUrlExplanation = ` from End Cursor URL: ${schedule.source.currentEndCursorUrl}`

  logger.info(`Attempting to capture URL: ${schedule?.source?.url} - ${logCurrentCursorUrlExplanation}`)

  if (ensureDownloadsDirectoryExists() === false) {
    await cleanup(schedule)
    logger.error('The downloads directory cannot be created')
    return
  }

  if (ensureScheduleDownloadLocationExists(schedule) === false) {
    await cleanup(schedule)
    logger.error('The Schedule\'s chosen download destination cannot be created')
    return
  }

  const captureDownloadDirectory = generateCaptureDownloadDirectory(schedule)
  if (captureDownloadDirectory === false) {
    await cleanup(schedule)
    logger.error('A download directory could not be created for the capture')
    return
  }

  let capture = await Capture.create(
    {
      downloadLocation: captureDownloadDirectory,
      scheduleId: schedule.id,
    },
  )

  if (capture == null) {
    await cleanup(schedule)
    logger.error('A new Capture could not be created')
    return
  }

  capture = await capture.reload({include: [{
    model: Schedule,
    include: [
      Source,
    ],
  }]})

  logger.info(`Created new Capture with ID ${capture.id}`)

  if (capture.schedule == null) {
    await cleanup(schedule)
    logger.error('No associated Schedule found for Capture')
    return
  }

  if (capture.schedule.source == null) {
    await cleanup(schedule)
    logger.error('No associated Source found for Capture\'s Schedule')
    return
  }

  try {
    await dataProvider.performCapture(
      capture,
      capture.schedule,
      capture.schedule.source,
    )
  } catch (error) {
    await cleanup(schedule)
    logger.error('Failed to perform the latest Capture: ' + (error as Error).message, error)
    return
  }

  await cleanup(schedule)
  logger.info('Capture ID ' + capture.id + ' ran successfully')
}

const ensureDownloadsDirectoryExists = (): boolean => {
  if (fs.existsSync(downloadCapturesPath) === false) {
    fs.mkdirSync(downloadCapturesPath, {recursive: true})
  }

  return fs.lstatSync(downloadCapturesPath).isDirectory()
}

const ensureScheduleDownloadLocationExists = (schedule: Schedule): boolean => {
  if (fs.existsSync(schedule.downloadLocation) === false) {
    fs.mkdirSync(schedule.downloadLocation, {recursive: true})
  }

  return fs.lstatSync(schedule.downloadLocation).isDirectory()
}

const generateCaptureDownloadDirectory = (schedule: Schedule): string | false => {
  const attemptedDirectory = path.join(schedule.downloadLocation, (new Date()).toISOString().replace(/:/g, '-'))

  if (fs.existsSync(attemptedDirectory) === false) {
    fs.mkdirSync(attemptedDirectory, {recursive: true})
  }

  return fs.lstatSync(attemptedDirectory).isDirectory() ? attemptedDirectory : false
}

const cleanup = async (schedule: Schedule | null | undefined): Promise<boolean> => {
  if (schedule == null) return true

  const changes: Partial<ScheduleAttributes> = {
    status: 'pending' as ScheduleStatus,
    lastRunAt: schedule.nextRunAt,
  }

  if (schedule.interval != null && Number.isNaN(Number(schedule.interval)) === false && Number(schedule.interval) > 0) {
    const nextRunAt = new Date((new Date()).getTime() + (schedule.interval * 1000))
    changes.nextRunAt = nextRunAt
  }

  if (schedule.interval == null) changes.nextRunAt = null

  return (await schedule.update(changes) != null)
}

export default performCaptureRun
