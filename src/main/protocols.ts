/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: protocols.ts
Created:  2023-09-15T11:41:05.822Z
Modified: 2023-09-15T11:41:05.822Z

Description: description
*/

import url from 'node:url';
import path from 'node:path';
import logger from "./app/log";
import { ModelStatic } from "sequelize";
import { app, net, protocol } from "electron";
import { Capture, CapturePart } from "./database";

const marchiveRegisteredProtocolSchemes = [ 'marchive-downloads' ] as const;
export type MarchiveRegisteredProtocolSchemesType = typeof marchiveRegisteredProtocolSchemes[number]

const parseMarchiveCaptureOrCapturePartDownloadProtocolUrl: (url: string) => {
  modelClass: typeof Capture | typeof CapturePart,
  modelId: number,
  protocol: MarchiveRegisteredProtocolSchemesType,
  resourcePath: string
} | false = (url) => {
  if (url == null) return false
  if (url.trim() === '') return false

  const regex = /^(?<PROTOCOL>marchive-downloads):[\/]{2,3}(?<MODELTYPE>capture|capture-part)\/(?<MODELID>\d+)\/(?<RESOURCEPATH>.*)$/miug
  let matches;

  while ((matches = regex.exec(url)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) regex.lastIndex++

    if (matches?.length === 5) {
      let modelClass: typeof Capture | typeof CapturePart | null = null
      if (matches.groups?.MODELTYPE === 'capture') modelClass = Capture
      else if (matches.groups?.MODELTYPE === 'capture-part') modelClass = CapturePart
      else return false

      return {
        modelClass,
        modelId: parseInt(matches.groups?.MODELID as string),
        protocol: matches.groups?.PROTOCOL as MarchiveRegisteredProtocolSchemesType,
        resourcePath: matches.groups?.RESOURCEPATH as string,
      }
    }
  }

  return false
};

const joinCaptureOrCapturePartModelDownloadLocationWithRelativePath: (
  modelClass: typeof Capture | typeof CapturePart,
  modelId: number,
  protocol: MarchiveRegisteredProtocolSchemesType,
  resourcePath: string,
) => Promise<[number, string | undefined]> = async (modelClass, modelId, protocol, resourcePath) => {
  let model: Capture | CapturePart | null = null
  try {
    model = await (modelClass as ModelStatic<Capture | CapturePart>).findByPk(modelId)
  } catch (error) {
    const errorMessage = 'A DB error occurred while trying to find the ' + modelClass.name + ' during ' + protocol + ' protocol request handling';
    logger.error(errorMessage, {modelId, resourcePath})
    logger.error(error)
    return [500, undefined]
  }

  if (model == null) {
    const errorMessage = 'No ' + modelClass.name + ' found during ' + protocol + ' protocol request handling';
    logger.error(errorMessage, {modelId, resourcePath})
    return [404, undefined]
  }

  const absolutePath = path.join(model.downloadLocation, resourcePath)
  if (!absolutePath.startsWith(model.downloadLocation)) {
    const errorMessage = 'The requested resource is outside of the ' + modelClass.name + ' download location when handling ' + protocol + ' protocol request';
    logger.error(errorMessage, {modelId, resourcePath})
    return [403, undefined]
  }

  return [200, absolutePath]
};

const handleDownloadsProtocolRequest: (request: Request) => Promise<Response> = async (request) => {
  const parsedUrl = parseMarchiveCaptureOrCapturePartDownloadProtocolUrl(request.url)
  if (parsedUrl === false) return new Response(null, {status: 404})

  const [statusCode, absolutePath] = await joinCaptureOrCapturePartModelDownloadLocationWithRelativePath(
    parsedUrl.modelClass,
    parsedUrl.modelId,
    parsedUrl.protocol,
    parsedUrl.resourcePath,
  )

  return absolutePath == null ? new Response(null, {status: statusCode}) : net.fetch(url.pathToFileURL(absolutePath).toString())
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'marchive-downloads',
    privileges: {
      standard: true,
      bypassCSP: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
])

app.whenReady().then(() => {

  protocol.handle(
    'marchive-downloads',
    handleDownloadsProtocolRequest,
  )

})
