/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainListAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/

import { Schedule, Source, SourceDomain } from 'database'
import { SourceDomainAttributes } from 'database/src/models/SourceDomain'

const SourceDomainListAction = async (withSources: boolean, withSourceSchedules: boolean): Promise<SourceDomainAttributes[]> => {
  /**
   * TODO: Add sorting by latest nextRunAt to sources in addition to sources' schedules
   */
  return SourceDomain
    .findAll({
      include: withSources ? [{
        model: Source,
        include: withSourceSchedules ? [
          { model: Schedule, separate: true, order: [['nextRunAt', 'desc']] }
        ] : [],
      }] : [],
      order: [['createdAt', 'desc']],
    })
    .then(sourceDomains => {
      return sourceDomains.map(sourceDomain => sourceDomain.toJSON())
    })
}

export default SourceDomainListAction
