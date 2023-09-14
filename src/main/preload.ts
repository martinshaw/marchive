import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { CapturesChannels } from './ipc/Captures';
import { DataProvidersChannels } from './ipc/DataProviders';
import { SchedulesChannels } from './ipc/Schedules';
import { SourcesChannels } from './ipc/Sources';
import { SourceDomainsChannels } from './ipc/SourceDomains';
import { UtilitiesChannels } from './ipc/Utilities';
import { ProcessesChannels } from './ipc/Processes';
import { RenderersChannels } from './ipc/Renderers';

/**
 * TODO: This is a temporary fix for the following error:
 *   (node:12345) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added to [process]. Use emitter.setMaxListeners() to increase limit
 * This is not the best way to solve this problem
 */
require('events').EventEmitter.defaultMaxListeners = 20

export type Channels =
  | CapturesChannels
  | DataProvidersChannels
  | SchedulesChannels
  | SourcesChannels
  | SourceDomainsChannels
  | UtilitiesChannels
  | ProcessesChannels
  | RenderersChannels;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: Channels) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
