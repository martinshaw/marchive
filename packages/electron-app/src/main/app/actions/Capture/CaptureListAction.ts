/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: CaptureListAction.ts
Created:  2023-08-17T09:03:35.766Z
Modified: 2023-08-17T09:03:35.767Z

Description: description
*/

import { Capture } from 'database';

const CaptureListAction = async (): Promise<Capture[]> => {
  return Capture.find({
    relations: {
      schedule: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
};

export default CaptureListAction;
