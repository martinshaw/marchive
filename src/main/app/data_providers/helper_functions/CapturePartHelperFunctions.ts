/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartHelperFunctions.ts
Created:  2023-09-12T10:59:19.263Z
Modified: 2023-09-12T10:59:19.263Z

Description: description
*/

import { Op } from "sequelize";
import logger from "../../../app/log";
import { Capture, CapturePart, Schedule } from "../../../database";

/**
 * If we are not using 'start' or 'end' cursor to determine when to start or to stop downloading capture parts,
 *   we should check the database to see if we have already downloaded this URL
 *
 * @throws {Error}
 */
export const checkIfUseStartOrEndCursorNullScheduleHasExistingCapturePartWithUrl = async (
  schedule: Schedule,
  url: string
) => {
  let unscopedExistingCaptureParts: CapturePart[] = []
  try {
    unscopedExistingCaptureParts = await CapturePart.findAll({
      where: {
        url: url,
      },
      include: [
        {
          model: Capture,
          /**
           * TODO: I would much rather use this association's where clause to filter the CapturePart but I am not
           *   sure it works like that. So I will filter it manually later
           */
          // where: {
          //   scheduleId: {
          //     [Op.eq]: schedule.id,
          //   },
          // },
        },
      ],
    })
  } catch (error) {
    logger.error('A DB error occurred when trying to find an existing Capture Part')
    logger.error(error)
    return false;
  }

  let existingCapturePart: CapturePart | null = unscopedExistingCaptureParts.find((capturePart) => {
    return capturePart.capture?.scheduleId === schedule.id
  }) || null


  if (existingCapturePart != null) {
    logger.info(`Capture Part ${existingCapturePart.id} has been previously downloaded: ${url}`)
    return true
  }

  return false
}