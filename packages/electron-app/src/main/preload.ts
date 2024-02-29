import { SourcesChannels } from './ipc/Sources';
import { CapturesChannels } from './ipc/Captures';
import { CapturePartsChannels } from './ipc/CaptureParts';
import { SchedulesChannels } from './ipc/Schedules';
import { WatchersChannels } from './ipc/Watchers';
import { RenderersChannels } from './ipc/Renderers';
import { UtilitiesChannels } from './ipc/Utilities';
import { DataProvidersChannels } from './ipc/DataProviders';
import { SourceDomainsChannels } from './ipc/SourceDomains';
import { StoredSettingsChannels } from './ipc/StoredSettings';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | CapturesChannels
  | CapturePartsChannels
  | DataProvidersChannels
  | SchedulesChannels
  | SourcesChannels
  | SourceDomainsChannels
  | UtilitiesChannels
  | WatchersChannels
  | RenderersChannels
  | StoredSettingsChannels;

async () => {
  (await import('events')).EventEmitter.defaultMaxListeners = 15;
};

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
  platform: process.platform,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
