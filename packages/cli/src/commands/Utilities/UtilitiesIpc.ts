import commander from "commander";
import process from "node:process";
import ErrorResponse from "../../responses/ErrorResponse";

import SourceList from "../Source/SourceList";
import SourceShow from "../Source/SourceShow";
import SourceCount from "../Source/SourceCount";
import SourceCreate from "../Source/SourceCreate";
import SourceDelete from "../Source/SourceDelete";

import SourceDomainList from "../SourceDomain/SourceDomainList";
import SourceDomainShow from "../SourceDomain/SourceDomainShow";
import SourceDomainCount from "../SourceDomain/SourceDomainCount";

import StoredSettingList from "../StoredSetting/StoredSettingList";
import StoredSettingGet from "../StoredSetting/StoredSettingGet";
import StoredSettingSet from "../StoredSetting/StoredSettingSet";
import StoredSettingUnset from "../StoredSetting/StoredSettingUnset";

import CaptureList from "../Capture/CaptureList";
import CaptureShow from "../Capture/CaptureShow";
import CaptureDelete from "../Capture/CaptureDelete";

import DataProviderList from "../DataProvider/DataProviderList";
import DataProviderShow from "../DataProvider/DataProviderShow";
import DataProviderValidate from "../DataProvider/DataProviderValidate";

import ScheduleList from "../Schedule/ScheduleList";
import ScheduleShow from "../Schedule/ScheduleShow";
import ScheduleCount from "../Schedule/ScheduleCount";
import ScheduleCreate from "../Schedule/ScheduleCreate";
import ScheduleUpdate from "../Schedule/ScheduleUpdate";
import ScheduleDelete from "../Schedule/ScheduleDelete";

import UtilitiesRetrieveFavicon from "../Utilities/UtilitiesRetrieveFavicon";

const UtilitiesIpc = new commander.Command("utilities:ipc");

UtilitiesIpc.description(
  "Receive and send messages for command functionality using IPC communication",
).action(async (options, program) => {
  if (process.send == null) {
    throw new ErrorResponse(
      "The 'ipc' command can only be run as a child process with IPC communication enabled",
    );
  }

  const commands = {
    "capture:list": () => CaptureList,
    "capture:delete": () => CaptureDelete,
    "capture:show": () => CaptureShow,

    "schedule:count": () => ScheduleCount,
    "schedule:create": () => ScheduleCreate,
    "schedule:list": () => ScheduleList,
    "schedule:show": () => ScheduleShow,
    "schedule:update": () => ScheduleUpdate,
    "schedule:delete": () => ScheduleDelete,

    "source:list": () => SourceList,
    "source:delete": () => SourceDelete,
    "source:create": () => SourceCreate,
    "source:count": () => SourceCount,
    "source:show": () => SourceShow,

    "stored-setting:unset": () => StoredSettingUnset,
    "stored-setting:get": () => StoredSettingGet,
    "stored-setting:list": () => StoredSettingList,
    "stored-setting:set": () => StoredSettingSet,

    "data-provider:show": () => DataProviderShow,
    "data-provider:validate": () => DataProviderValidate,
    "data-provider:list": () => DataProviderList,

    "source-domain:show": () => SourceDomainShow,
    "source-domain:count": () => SourceDomainCount,
    "source-domain:list": () => SourceDomainList,

    "utilities:retrieve-favicon": () => UtilitiesRetrieveFavicon,
  } as const;

  process.on(
    "message",
    async (message: { command: keyof commands; args: any[] }) => {
      try {
        if (commands[command])
          // All went well, send the result of your function to the parent process...
          process.send({ status: MESSAGE_STATUS.OK, data: result });
      } catch (e) {
        process.send({ status: MESSAGE_STATUS.ERROR, data: serializeError(e) });
      }
    },
  );

  // Use process.send to send a message to the parent process, informing it that the child process is ready to receive messages
  process.send({ ready: true });
});

export default UtilitiesIpc;

//https://www.alexanderlolis.com/node-js-fork-is-slow-deal-with-it
