/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: delete.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { Schedule, Source } from "../../../database"
import logger from "../../../log"

/**
 * @throws {Error}
 */
const SourceDeleteAction = async (sourceId: number): Promise<void> => {
  const originalSource = await Source.findByPk(sourceId, {include: [Schedule]})

  if (originalSource == null) {
    const errorMessage = 'No Source found with that ID'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (originalSource.schedules?.length > 0) {
    const errorMessage = 'The Source has associated Schedules and cannot be deleted'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  logger.info('Deleting Source with ID ' + originalSource.id)

  await originalSource.destroy()

  const sourceCheck = await Source.findByPk(sourceId)
  if (sourceCheck != null) {
    const errorMessage = 'The Source could not be deleted'
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export default SourceDeleteAction
