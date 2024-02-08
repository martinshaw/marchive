/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainListAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/

import { FindOptionsOrder, FindOptionsRelations, SourceDomain } from 'database';

const SourceDomainListAction = async (
  withSources: boolean,
  withSourceSchedules: boolean,
): Promise<SourceDomain[]> => {
  let relations: FindOptionsRelations<SourceDomain> = {
    ...(withSources
      ? { sources: withSourceSchedules ? { schedules: true } : true }
      : {}),
  };

  let order: FindOptionsOrder<SourceDomain> = {
    sources: {
      schedules: {
        nextRunAt: 'DESC',
      },
    },
  };

  return SourceDomain.find({ relations, order });
};

export default SourceDomainListAction;
