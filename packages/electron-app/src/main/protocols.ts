/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: protocols.ts
Created:  2023-09-15T11:41:05.822Z
Modified: 2023-09-15T11:41:05.822Z

Description: description
*/

import fs from 'node:fs';
import url from 'node:url';
import logger from 'logger';
import path from 'node:path';
import { app, dialog, net, protocol } from 'electron';
import { CaptureEntityType, CapturePartEntityType } from 'common-types';
import CaptureShowAction from './app/actions/Capture/CaptureShowAction';
import CapturePartShowAction from './app/actions/CapturePart/CapturePartShowAction';

const marchiveRegisteredProtocolSchemes = [
  'marchive-downloads',
  'marchive',
] as const;
export type MarchiveRegisteredProtocolSchemesType =
  (typeof marchiveRegisteredProtocolSchemes)[number];

const parseMarchiveCaptureOrCapturePartDownloadProtocolUrl: (url: string) =>
  | {
      modelClass: 'capture' | 'capture-part';
      modelId: number;
      protocol: MarchiveRegisteredProtocolSchemesType;
      resourcePath: string;
    }
  | false = (url) => {
  if (url == null) return false;
  if (url.trim() === '') return false;

  const regex =
    /^(?<PROTOCOL>marchive-downloads):[\/]{2,3}(?<MODELTYPE>capture|capture-part)\/(?<MODELID>\d+)\/(?<RESOURCEPATH>.*)$/gimu;
  let matches;

  while ((matches = regex.exec(url)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) regex.lastIndex++;

    if (matches?.length === 5) {
      let modelClass: 'capture' | 'capture-part' = matches.groups?.MODELTYPE as
        | 'capture'
        | 'capture-part';

      return {
        modelClass,
        modelId: parseInt(matches.groups?.MODELID as string),
        protocol: matches.groups
          ?.PROTOCOL as MarchiveRegisteredProtocolSchemesType,
        resourcePath: matches.groups?.RESOURCEPATH as string,
      };
    }
  }

  return false;
};

const joinCaptureOrCapturePartModelDownloadLocationWithRelativePath: (
  modelClass: 'capture' | 'capture-part',
  modelId: number,
  protocol: MarchiveRegisteredProtocolSchemesType,
  resourcePath: string,
) => Promise<[number, string | undefined]> = async (
  modelClass,
  modelId,
  protocol,
  resourcePath,
) => {
  let model: CaptureEntityType | CapturePartEntityType | null = null;
  try {
    if (modelClass === 'capture') {
      model = await CaptureShowAction(modelId);
    } else if (modelClass === 'capture-part') {
      model = await CapturePartShowAction(modelId);
    }
  } catch (error) {
    const errorMessage =
      'A DB error occurred while trying to find the ' +
      modelClass +
      ' during ' +
      protocol +
      ' protocol request handling';
    logger.error(errorMessage, { modelId, resourcePath });
    logger.error(error);
    return [500, undefined];
  }

  if (model == null || model.downloadLocation == null) {
    const errorMessage =
      'No ' +
      modelClass +
      ' found during ' +
      protocol +
      ' protocol request handling';
    logger.error(errorMessage, { modelId, resourcePath });
    return [404, undefined];
  }

  const absolutePath = path.join(model.downloadLocation, resourcePath);
  if (!absolutePath.startsWith(model.downloadLocation)) {
    const errorMessage =
      'The requested resource is outside of the ' +
      modelClass +
      ' download location when handling ' +
      protocol +
      ' protocol request';
    logger.error(errorMessage, { modelId, resourcePath });
    return [403, undefined];
  }

  if (!fs.existsSync(absolutePath)) {
    const errorMessage =
      'The requested resource does not exist when handling ' +
      protocol +
      ' protocol request';
    logger.error(errorMessage, { modelId, resourcePath });
    return [404, undefined];
  }

  return [200, absolutePath];
};

const handleDownloadsProtocolRequest: (
  request: Request,
) => Promise<Response> = async (request) => {
  const parsedUrl = parseMarchiveCaptureOrCapturePartDownloadProtocolUrl(
    request.url,
  );
  if (parsedUrl === false) return new Response(null, { status: 404 });

  const [statusCode, absolutePath] =
    await joinCaptureOrCapturePartModelDownloadLocationWithRelativePath(
      parsedUrl.modelClass,
      parsedUrl.modelId,
      parsedUrl.protocol,
      parsedUrl.resourcePath,
    );

  return absolutePath == null
    ? new Response(null, { status: statusCode })
    : net.fetch(url.pathToFileURL(absolutePath).toString());
};

const handleProtocolRequest: (request: Request) => Promise<Response> = async (
  request,
) => {
  dialog.showMessageBox({
    title: 'Protocol Request',
    message: 'Protocol Request ' + request.url,
    buttons: ['OK'],
  });

  /**
   * TODO: Need to implement a handler here, which takes the URL, parses it by removing the scheme part,
   *   de-url-encoding the rest, then open a window if needed, navigate to 'Create Source' page,
   *   add the url to the input and display Data Provider options
   */

  return new Response('<h1>hello, world</h1>', {
    headers: { 'content-type': 'text/html' },
  });
};

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
  {
    scheme: 'marchive',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

app.whenReady().then(() => {
  protocol.handle('marchive-downloads', handleDownloadsProtocolRequest);

  protocol.handle('marchive', handleProtocolRequest);
});
