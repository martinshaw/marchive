import commander from "commander";
import process from "node:process";
import ErrorResponse from "../../responses/ErrorResponse";

const UtilitiesIpc = new commander.Command("utilities:ipc");

UtilitiesIpc.description(
  "Receive and send messages for command functionality using IPC communication",
).action(async (options, program) => {
  if (process.send == null) {
    throw new ErrorResponse(
      "The 'ipc' command can only be run as a child process with IPC communication enabled",
    );
  }

  process.on("message", async (message) => {
    try {
      // Read and validate input data from `message` and do whatever you need to do...
      const { name } = message;
      const result = await petKitten(name);

      // All went well, send the result of your function to the parent process...
      process.send({ status: MESSAGE_STATUS.OK, data: result });
    } catch (e) {
      process.send({ status: MESSAGE_STATUS.ERROR, data: serializeError(e) });
    }
  });

  // Use process.send to send a message to the parent process, informing it that the child process is ready to receive messages
  process.send({ ready: true });
});

export default UtilitiesIpc;
