import commander from "commander";
import process from "node:process";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";

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
import CaptureShowFiles from "../Capture/CaptureShowFiles";
import CaptureDelete from "../Capture/CaptureDelete";

import CapturePartList from "../CapturePart/CapturePartList";
import CapturePartShow from "../CapturePart/CapturePartShow";
import CapturePartShowFiles from "../CapturePart/CapturePartShowFiles";
import CapturePartDelete from "../CapturePart/CapturePartDelete";

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
import UtilitiesAddCliToPath from "../Utilities/UtilitiesAddCliToPath";

const UtilitiesIpc = new commander.Command("utilities:ipc");

UtilitiesIpc.description(
  "Receive and send messages for command functionality using IPC communication",
).action(async (options, program) => {
  ErrorResponse.catchErrorsWithErrorResponseAllowingPerpetualCommand(() => {
    const throwSpawnedWithoutIpcError = () => {
      throw new ErrorResponse(
        "The 'ipc' command can only be run as a child process with IPC communication enabled",
      );
    };

    if (process.send == null) return throwSpawnedWithoutIpcError();

    const commands = {
      "capture:list": () => CaptureList,
      "capture:delete": () => CaptureDelete,
      "capture:show": () => CaptureShow,
      "capture:show-files": () => CaptureShowFiles,

      "capture-part:list": () => CapturePartList,
      "capture-part:delete": () => CapturePartDelete,
      "capture-part:show": () => CapturePartShow,
      "capture-part:show-files": () => CapturePartShowFiles,

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
      "utilities:add-cli-to-path": () => UtilitiesAddCliToPath,
    } as const;

    process.on(
      "message",
      async (message: { command: keyof typeof commands; args: unknown[] }) => {
        try {
          if (commands[message.command]) {
            const command = await commands[message.command]();
            // @ts-ignore
            const response = await command(...message.args);

            if (process.send == null) return throwSpawnedWithoutIpcError();
            process.send(response.toJson());

            return;
          }

          if (process.send == null) return throwSpawnedWithoutIpcError();
          process.send(
            new ErrorResponse(
              `The command "${message.command}" is not recognized as a valid command for use with the ${"`"}utilities:ipc${"`"} command.`,
            ).toJson(),
          );

          return;
        } catch (error) {
          if (process.send == null) return throwSpawnedWithoutIpcError();
          process.send(
            new ErrorResponse(
              "An error occurred while processing the command",
              error instanceof Error ? error : null,
            ).toJson(),
          );
        }
      },
    );
  });
});

export default UtilitiesIpc;

//https://www.alexanderlolis.com/node-js-fork-is-slow-deal-with-it
