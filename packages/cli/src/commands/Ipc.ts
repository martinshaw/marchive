import commander from "commander";
import logger from "logger";
import process from "node:process";
import ErrorResponse from "../responses/ErrorResponse";

const Ipc = new commander.Command("ipc");

Ipc.description(
  "Receive and send messages for command functionality using IPC communication",
).action(async (options, program) => {
  ErrorResponse.catchErrorsWithErrorResponseAllowingPerpetualCommand(
    async () => {
      if (process.send == null) {
        throw new ErrorResponse(
          "The 'ipc' command can only be run as a child process with IPC communication enabled",
        );
      }

      // Use process.send to send a message to the parent process, informing it that the child process is ready to receive messages
      process.send({ ready: true });
    },
  );
});

export default Ipc;
