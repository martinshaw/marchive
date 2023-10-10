/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { Capture, Schedule, Source, SourceDomain } from 'database';
import logger from 'logger';
import { Includeable } from 'database';
import { SourceAttributes } from 'database/src/models/Source';

const SourceShowAction = async (
  sourceId: number | null = null,
  withSourceDomain: boolean = false,
  withSchedules: boolean = false,
  withCaptures: boolean = false
): Promise<SourceAttributes> => {
  if (sourceId == null) {
    logger.info('No source ID provided');
    throw new Error('No source ID provided');
  }

  let include: Includeable[] = [];
  if (withSchedules) {
    const includeSchedules: Includeable = {
      model: Schedule,
      separate: true,
      order: [['createdAt', 'DESC']],
    };
    if (withCaptures)
      includeSchedules.include = [
        {
          model: Capture,
          separate: true,
          order: [['createdAt', 'DESC']],
        },
      ];

    include.push(includeSchedules);
  }

  if (withSourceDomain) {
    const includeSourceDomain: Includeable = { model: SourceDomain };
    include.push(includeSourceDomain);
  }

  let source: Source | null = null;
  try {
    source = await Source.findByPk(sourceId, { include });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to retrieve a source with ID ${sourceId}`
    );
    logger.error(error);
    throw error;
  }

  if (source == null) {
    logger.info(`Source with ID ${sourceId} not found`);

    const friendlyInfoMessage =
      "We couldn't find the source you were looking for. Maybe it was deleted?";
    throw new Error(friendlyInfoMessage);
  }

  return source.toJSON();
};

export default SourceShowAction;
