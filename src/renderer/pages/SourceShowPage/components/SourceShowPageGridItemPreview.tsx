/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowPageGridItemPreview.tsx
Created:  2023-09-11T13:04:19.598Z
Modified: 2023-09-11T13:04:19.598Z

Description: description
*/

import { CaptureAttributes } from "main/database/models/Capture";
import { ScheduleAttributes } from "main/database/models/Schedule";

export type SourceShowPageGridItemPreviewPropsType = {
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
}

const SourceShowPageGridItemPreview = (props: SourceShowPageGridItemPreviewPropsType) => {
  return <>Hello</>
}

export default SourceShowPageGridItemPreview;
