/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/
import { Capture, CapturePart, Schedule, Source, SourceDomain } from 'database'
import logger from 'logger';
import { Includeable } from 'sequelize'
import { CaptureAttributes } from 'database/models/Capture'

const CaptureShowAction = async (
  captureId: number | null = null,
  withSchedule: boolean = false,
  withSource: boolean = false,
  withSourceDomain: boolean = false,
  withCaptureParts: boolean = false
): Promise<CaptureAttributes> => {
  if (captureId == null) {
    logger.info('No capture ID provided')
    throw new Error('No capture ID provided')
  }

  let include: Includeable[] = []
  if (withSchedule) {
    const includeSchedule: Includeable = {
      model: Schedule,
      include: withSource ? [{
        model: Source,
        include: withSourceDomain ? [{
          model: SourceDomain
        }] : [],
      }] : [],
    }

    include.push(includeSchedule)
  }

  if (withCaptureParts) {
    const includeCaptureParts: Includeable = { model: CapturePart, separate: true, order: [['createdAt', 'ASC']] }
    include.push(includeCaptureParts)
  }

  let capture: Capture | null = null
  try {
    capture = await Capture.findByPk(captureId, { include })
  } catch (error) {
    logger.error(`A DB error occurred when attempting to retrieve a capture with ID ${captureId}`)
    logger.error(error)
    throw error
  }

  if (capture == null) {
    logger.info(`Capture with ID ${captureId} not found`)

    const friendlyInfoMessage = 'We couldn\'t find the capture you were looking for. Maybe it was deleted?'
    throw new Error(friendlyInfoMessage)
  }

  return capture.toJSON()
}

export default CaptureShowAction
