/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.ts
Created:  2023-10-11T02:59:44.724Z
Modified: 2023-10-11T02:59:44.724Z

Description: description
*/

import logger from 'logger';
import 'database'
import { getStoredSettingValue } from "database"
import { getDataProviderByIdentifier } from "data-providers"
import BaseDataProvider from "data-providers/src/BaseDataProvider"
import { CapturePartStatus } from "database/src/models/CapturePart"
import { Capture, CapturePart, Schedule, Source, Op } from "database"

let lastCapturePart: CapturePart | null = null;

const CapturePartRunProcess = async (): Promise<never | void> => {

  // TODO: Keep these or remove them ???
  logger.info('CapturePartRunProcess started (using Winston)') // delete me
  console.log('CapturePartRunProcess started (using console.log)') // delete me

  // Should wait for 6 seconds between ticks when downloading pending files
  // When there are no pending files to download, should wait for 60 seconds between ticks
  let currentDelayBetweenTicks = 6 * 1000

  while (true) {
    // TODO: May need to remove await, then use the returned values to set the currentDelayBetweenTicks asynchronously

    let capturePartRunProcessIsPaused = await getStoredSettingValue('CAPTURE_PART_RUN_PROCESS_IS_PAUSED') === true

    try {
      if (capturePartRunProcessIsPaused === false) {
        const {processedSuccessfully, hadPendingCapturePart} = await tick()

        currentDelayBetweenTicks = hadPendingCapturePart === false ? 60 * 1000 : 6 * 1000
      }
    } catch (error) {
      if (lastCapturePart != null) {
        logger.error(`An error occurred when trying to process Capture Part ${lastCapturePart.id} ${lastCapturePart.url}`)
        logger.error(error)

        await lastCapturePart.update({status: 'failed' as CapturePartStatus})
      }
    }

    await new Promise(resolve => {
      setTimeout(() => resolve(null), currentDelayBetweenTicks)
    })
  }
}

const tick = async (): Promise<{processedSuccessfully: boolean, hadPendingCapturePart: boolean}> => {
  // TODO: REVERT THIS BACK TO .debug WHEN WE HAVE FINISHED TESTING MONOREPO REFACTOR
  logger.info('Looking for pending Capture Parts...')

  let capturePart: CapturePart | null = null
  try {
    capturePart = await CapturePart.findOne({
      where: {
        status: 'pending',
      },
      include: [{
        model: Capture,
        include: [{
          model: Schedule,
          where: {
            status: {
              [Op.eq]: 'pending',
            },
          },
          include: [{
            model: Source,
          }],
        }],
        // where: {
        //   allowedRetriesCount: Sequelize.col('currentRetryCount'),
        // },
        // required: true,
      }],
    })
  } catch (error) {
    logger.error('A DB error occurred when trying to find a pending Capture Part for processing')
    logger.error(error)
  }

  if (capturePart == null) {
    /**
     * TODO: I am purposefully misusing .debug instead of .error throughout this file so that an error isn't thrown and the return
     *   object is handled regardless of whether an error or success occurred
     *
     * I need to find a way to handle errors in a way that doesn't cause the process to exit allowing the loop to continue
     * Maybe use .error, then a use try / catch block around `await this.tick()` in the `run` method
     */
    // TODO: REVERT THIS BACK TO .debug WHEN WE HAVE FINISHED TESTING MONOREPO REFACTOR
    logger.info('No pending Capture Parts found')

    return {
      processedSuccessfully: false,
      hadPendingCapturePart: false,
    }
  }

  logger.info(`Found a pending Capture Part to be downloaded: ${capturePart?.id} ${capturePart?.url}`)

  if (capturePart?.capture?.schedule?.source?.dataProviderIdentifier == null) {
    logger.info('No Data Provider Identifier found for pending Capture\'s Source')

    return {
      processedSuccessfully: false,
      hadPendingCapturePart: capturePart !== null,
    }
  }

  const dataProvider = await getDataProviderByIdentifier(capturePart.capture?.schedule?.source?.dataProviderIdentifier)
  if (dataProvider == null) {
    logger.info('No Data Provider found for pending Capture\'s Source')

    return {
      processedSuccessfully: false,
      hadPendingCapturePart: capturePart !== null,
    }
  }

  const processedSuccessfully = await processPart(capturePart, dataProvider)

  return {
    processedSuccessfully,
    hadPendingCapturePart: capturePart !== null,
  }
}

const processPart = async (capturePart: CapturePart, dataProvider: BaseDataProvider): Promise<boolean> => {
  lastCapturePart = capturePart

  let schedule: Schedule | undefined = capturePart.capture?.schedule
  if (schedule != null) await schedule.update({status: 'processing'})

  await capturePart.update({status: 'processing' as CapturePartStatus})

  logger.info(`Processing Capture Part ${capturePart.id} ${capturePart.url}...`)

  let processRanSuccessfully: boolean
  try {
    processRanSuccessfully = await dataProvider.processPart(capturePart)
  } catch (error) {
    processRanSuccessfully = false
  }

  if (!processRanSuccessfully) {
    logger.info(`Failed to process Capture Part ${capturePart.id} ${capturePart.url}...`)

    await capturePart.update({
      status: 'failed' as CapturePartStatus,
      currentRetryCount: capturePart.currentRetryCount + 1,
    })

    schedule = capturePart.capture?.schedule
    if (schedule != null) await schedule.update({status: 'pending'})

    return false
  }

  logger.info(`Successfully Processed Capture Part ${capturePart.id}...`)

  await capturePart.update({
    status: 'completed' as CapturePartStatus,
    currentRetryCount: capturePart.currentRetryCount + 1,
  })

  schedule = capturePart.capture?.schedule
  if (schedule != null) await schedule.update({status: 'pending'})

  return true
}

CapturePartRunProcess()
