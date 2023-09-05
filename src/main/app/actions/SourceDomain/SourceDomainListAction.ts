/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDomainListAction.ts
Created:  2023-09-04T18:56:21.693Z
Modified: 2023-09-04T18:56:21.693Z

Description: description
*/
import { Includeable } from 'sequelize'
import { Schedule, Source } from '../../../database'
import SourceDomain, { SourceDomainAttributes } from '../../../database/models/SourceDomain'

const SourceDomainListAction = async (withSources: boolean): Promise<SourceDomainAttributes[]> => {
  let findAssociations: Includeable[] = []
  if (withSources) findAssociations.push({ model: Source, separate: true, order: [['nextRunAt', 'desc']] })

  return SourceDomain
    .findAll({ include: findAssociations })
    .then(sourceDomains => sourceDomains.map(sourceDomain => sourceDomain.toJSON()))
}

export default SourceDomainListAction
