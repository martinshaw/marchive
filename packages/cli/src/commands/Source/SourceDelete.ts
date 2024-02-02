/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceDelete.ts
Created:  2024-02-01T05:03:25.700Z
Modified: 2024-02-01T05:03:25.700Z

Description: description
*/
import fs from "node:fs";
import logger from "logger";
import commander, { Command } from "commander";
import { Capture, CapturePart, Source } from "database";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";

const SourceDelete = new commander.Command("source:delete");

SourceDelete.description("Delete a Source")
  .argument("<source-id>", "Source ID")
  .option(`--also-delete-files`, "Also delete files associated with Source")
  .action(
    async (
      sourceId: string,
      optionsAndArguments: { [key: string]: string | number | boolean },
      program: Command
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
        if (isNaN(parseInt(sourceId)))
          throw new ErrorResponse("Source ID must be a number");

        let originalSource: Source | null = null;
        try {
          originalSource = await Source.findOne({
            where: { id: parseInt(sourceId) },
            relations: {
              schedules: true,
            },
          });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to find Source ID ${sourceId} for deletion`,
            error instanceof Error ? error : null
          );
        }

        if (originalSource == null)
          throw new ErrorResponse(`No Source found with that ID`);

        if (originalSource.schedules?.length > 0) {
          originalSource.schedules.forEach(async (schedule) => {
            logger.info("Deleting Schedule with ID " + schedule.id);

            const captures = await Capture.find({
              where: { scheduleId: schedule.id },
            });

            captures.forEach(async (capture) => {
              logger.info("Deleting Capture with ID " + capture.id);

              const captureParts = await CapturePart.find({
                where: { captureId: capture.id },
              });

              captureParts.forEach(async (capturePart) => {
                logger.info("Deleting Capture Part with ID " + capturePart.id);

                await capturePart.softRemove();
              });

              await capture.softRemove();
            });

            if (optionsAndArguments?.alsoDeleteFiles != null) {
              if (
                optionsAndArguments.alsoDeleteFiles === true &&
                schedule.downloadLocation != null &&
                fs.existsSync(schedule.downloadLocation)
              ) {
                fs.rmSync(schedule.downloadLocation, { recursive: true });
              }
            }

            await schedule.softRemove();
          });
        }

        logger.info("Deleting Source with ID " + originalSource.id);

        await originalSource.softRemove();

        let sourceCheck: Source | null = null;
        try {
          sourceCheck = await Source.findOne({
            where: { id: parseInt(sourceId) },
          });
        } catch (error) {
          throw new ErrorResponse(
            `A DB error occurred when attempting to find Source ID ${sourceId} for check successful deletion`,
            error instanceof Error ? error : null
          );
        }

        if (sourceCheck != null)
          throw new ErrorResponse(`The Source could not be deleted`);

        return new MessageResponse(
          `Successfully deleted Source with ID ${sourceId}`,
          [
            {
              id: sourceId,
            },
          ]
        ).send();
      });
    }
  );

export default SourceDelete;
