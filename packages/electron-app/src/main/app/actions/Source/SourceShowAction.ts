/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import logger from 'logger';
import { FindOptionsOrder, FindOptionsRelations, Source } from 'database';

const SourceShowAction = async (
  sourceId: number | null = null,
  withSourceDomain: boolean = false,
  withSchedules: boolean = false,
  withCaptures: boolean = false,
): Promise<Source> => {
  if (sourceId == null) {
    logger.info('No source ID provided');
    throw new Error('No source ID provided');
  }

  let relations: FindOptionsRelations<Source> = {
    ...(withSchedules
      ? { schedules: withCaptures ? { captures: true } : true }
      : {}),
    ...(withSourceDomain ? { sourceDomain: true } : {}),
  };

  let order: FindOptionsOrder<Source> = {
    schedules: {
      createdAt: 'DESC',
      captures: {
        createdAt: 'DESC',
      },
    },
  };

  let source: Source | null = null;
  try {
    source = await Source.findOne({
      where: { id: sourceId },
      relations,
      order,
    });
  } catch (error) {
    logger.error(
      `A DB error occurred when attempting to retrieve a source with ID ${sourceId}`,
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

  return source;
};

export default SourceShowAction;
