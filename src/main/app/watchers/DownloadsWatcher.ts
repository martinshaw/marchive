/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: downloads.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { Capture, CapturePart, Schedule, Source } from "../../database"
import logger from "../../log"
import { getDataProviderByIdentifier } from "../repositories/DataProviderRepository"
import BaseDataProvider from "../data_providers/BaseDataProvider"
import { CapturePartStatus } from "../../database/models/CapturePart"

const DownloadsWatcher = async (): Promise<never | void> => {
  // Should wait for 6 seconds between ticks when downloading pending files
  // When there are no pending files to download, should wait for 120 seconds between ticks
  let currentDelayBetweenTicks = 6 * 1000

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // TODO: May need to remove await, then use the returned values to set the currentDelayBetweenTicks asynchronously

    try {
      // eslint-disable-next-line no-await-in-loop
      const {processedSuccessfully, hadPendingCapturePart} = await tick()

      currentDelayBetweenTicks = hadPendingCapturePart === false ? 120 * 1000 : 6 * 1000
    } catch (error) {
      //
    }

    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => {
      setTimeout(() => resolve(null), currentDelayBetweenTicks)
    })
  }
}

const tick = async (): Promise<{  processedSuccessfully: boolean, hadPendingCapturePart: boolean}> => {
  logger.info('Looking for pending Capture Parts...')

  const capturePart = await CapturePart.findOne({
    where: {
      status: 'pending',
    },
    include: [{
      model: Capture,
      include: [{
        model: Schedule,
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

  if (capturePart == null) {
    /**
     * TODO: I am purposefully misusing .log instead of .error throughout this file so that an error isn't thrown and the return
     *   object is handled regardless of whether an error or success occurred
     *
     * I need to find a way to handle errors in a way that doesn't cause the process to exit allowing the loop to continue
     * Maybe use .error, then a use try / catch block around `await this.tick()` in the `run` method
     */
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
  logger.info(`Processing Capture Part ${capturePart.id} ${capturePart.url}...`)

  await capturePart.update({status: 'processing' as CapturePartStatus})

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

    return false
  }

  logger.info(`Successfully Processed Capture Part ${capturePart.id}...`)

  await capturePart.update({
    status: 'completed' as CapturePartStatus,
    currentRetryCount: capturePart.currentRetryCount + 1,
  })

  return true
}

export default DownloadsWatcher
