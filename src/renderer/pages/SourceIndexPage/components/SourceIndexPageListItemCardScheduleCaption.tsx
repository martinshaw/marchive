/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageListItemCardScheduleCaption.tsx
Created:  2023-09-05T13:47:27.688Z
Modified: 2023-09-05T13:47:27.688Z

Description: description
*/

import { Icon, Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import Schedule, { ScheduleAttributes } from "../../../../main/database/models/Schedule";
import Source, { SourceAttributes } from "../../../../main/database/models/Source";
import { ReactNode } from "react";

export type SourceIndexPageListItemCardScheduleCaptionPropsType = {
  schedule: Schedule | ScheduleAttributes;
};

const SourceIndexPageListItemCardScheduleCaption = (
  props: SourceIndexPageListItemCardScheduleCaptionPropsType
) => {
  let scheduleCaption: ReactNode = null;

  if (props.schedule == null) return null;

  if (props.schedule.status === 'pending') {
    if (props.schedule.interval == null) {
      if (props.schedule.lastRunAt == null && props.schedule.nextRunAt == null) {
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Not scheduled to save</Text>
          </>
        );
      }
      else if (props.schedule.lastRunAt != null && props.schedule.nextRunAt == null) {
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Saved on {props.schedule.lastRunAt.toDateString()} {props.schedule.lastRunAt.toLocaleTimeString()}</Text>
          </>
        );
      }
      else if (props.schedule.lastRunAt == null && props.schedule.nextRunAt != null) {
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Will save on {props.schedule.nextRunAt.toDateString()} {props.schedule.nextRunAt.toLocaleTimeString()}</Text>
          </>
        );
      }
    }
    else {
      let timeCaption = Math.ceil(props.schedule.interval / 60) + ' mins.'
      if ((Math.ceil(props.schedule.interval / 60)) > 120) timeCaption = Math.ceil(props.schedule.interval / 3600) + ' hrs.';
      if ((Math.ceil(props.schedule.interval / 3600)) > 48) timeCaption = Math.ceil(props.schedule.interval / 86400) + ' days.';
      if ((Math.ceil(props.schedule.interval / 86400)) > 14) timeCaption = Math.ceil(props.schedule.interval / 604800) + ' weeks.';
      if ((Math.ceil(props.schedule.interval / 604800)) > 8) timeCaption = Math.ceil(props.schedule.interval / 2419200) + ' months.';
      if ((Math.ceil(props.schedule.interval / 2419200)) > 12) timeCaption = Math.ceil(props.schedule.interval / 29030400) + ' years.';

      const nextCaption = props.schedule.nextRunAt != null ? `(next time on ${props.schedule.nextRunAt.toDateString()} ${props.schedule.nextRunAt.toLocaleTimeString()})` : '';
      scheduleCaption = (
        <>
          <Icon icon="time" />
          <Text>Saves every {timeCaption} {nextCaption}</Text>
        </>
      );
    }
  }
  else if (props.schedule.status === 'processing') {
    scheduleCaption = (
      <>
        <Spinner size={SpinnerSize.SMALL} />
        <Text>Saving now...</Text>
      </>
    );
  }

  return scheduleCaption;
}

export default SourceIndexPageListItemCardScheduleCaption;
