/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageListItemCardScheduleCaption.tsx
Created:  2023-09-05T13:47:27.688Z
Modified: 2023-09-05T13:47:27.688Z

Description: description
*/

import { Icon, Text } from "@blueprintjs/core";
import { ScheduleAttributes } from "main/database/models/Schedule";
import { SourceAttributes } from "main/database/models/Source";
import { ReactNode } from "react";

export type SourceIndexPageListItemCardScheduleCaptionPropsType = {
  source: SourceAttributes;
};

const SourceIndexPageListItemCardScheduleCaption = (
  props: SourceIndexPageListItemCardScheduleCaptionPropsType
) => {
  let scheduleCaption: ReactNode = null;

  if (props.source?.schedules == null) return null;

  if (props.source.schedules.length > 1) {
    scheduleCaption = (
      <>
        <Icon icon="time" />
        <Text>{props.source.schedules.length} schedules</Text>
      </>
    );
  }
  else if (props.source.schedules.length === 1) {
    if (props.source.schedules[0].status === 'pending') {
      if (props.source.schedules[0].interval == null) {
        if (props.source.schedules[0].lastRunAt == null && props.source.schedules[0].nextRunAt == null) {
          scheduleCaption = (
            <>
              <Icon icon="time" />
              <Text>Not scheduled to save</Text>
            </>
          );
        }
        else if (props.source.schedules[0].lastRunAt != null && props.source.schedules[0].nextRunAt == null) {
          scheduleCaption = (
            <>
              <Icon icon="time" />
              <Text>Saved on {props.source.schedules[0].lastRunAt.toDateString()} {props.source.schedules[0].lastRunAt.toLocaleTimeString()}</Text>
            </>
          );
        }
        else if (props.source.schedules[0].lastRunAt == null && props.source.schedules[0].nextRunAt != null) {
          scheduleCaption = (
            <>
              <Icon icon="time" />
              <Text>Will save on {props.source.schedules[0].nextRunAt.toDateString()} {props.source.schedules[0].nextRunAt.toLocaleTimeString()}</Text>
            </>
          );
        }
      }
      else {
        const nextCaption = props.source.schedules[0].nextRunAt != null ? `(next time on ${props.source.schedules[0].nextRunAt.toDateString()} ${props.source.schedules[0].nextRunAt.toLocaleTimeString()})` : '';
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Saves every {Math.ceil(props.source.schedules[0].interval / 60)} mins. {nextCaption}</Text>
          </>
        );
      }
    }
    else if (props.source.schedules[0].status === 'processing') {
      scheduleCaption = (
        <>
          <Icon icon="time" />
          <Text>Saving now...</Text>
        </>
      );
    }
  }

  return scheduleCaption;
}

export default SourceIndexPageListItemCardScheduleCaption;
