/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CapturePartRepository.ts
Created:  2024-02-25T16:07:09.018Z
Modified: 2024-02-25T16:07:09.018Z

Description: description
*/

import CapturePart from "../entities/CapturePart";

const retrieveDueCapturePart = async (): Promise<CapturePart | null> => {
  // TODO: This is the old query from Sequelize, need to remove it once I can confirm that the new code below works
  // capturePart = await CapturePart.findOne({
  //   where: {
  //     status: "pending",
  //   },
  //   include: [
  //     {
  //       model: Capture,
  //       include: [
  //         {
  //           model: Schedule,
  //           where: {
  //             status: {
  //               [Op.eq]: "pending",
  //             },
  //           },
  //           include: [
  //             {
  //               model: Source,
  //             },
  //           ],
  //         },
  //       ],
  //       // where: {
  //       //   allowedRetriesCount: Sequelize.col('currentRetryCount'),
  //       // },
  //       // required: true,
  //     },
  //   ],
  // });

  return await CapturePart.findOne({
    where: {
      status: "pending",

      /**
       * TODO: Commented this out because, if there is a pile up of pending capture parts, we want to process them all
       * I have also commented out all code in WatchCaptureParts.ts that resets the status of the schedule
       */

      //   capture: {
      //     schedule: {
      //       status: "pending",
      //     },
      //   },
    },
    relations: ["capture", "capture.schedule", "capture.schedule.source"],
  });
};

export { retrieveDueCapturePart };
