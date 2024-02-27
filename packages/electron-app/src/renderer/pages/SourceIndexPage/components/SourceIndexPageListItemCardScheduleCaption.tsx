/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageListItemCardScheduleCaption.tsx
Created:  2023-09-05T13:47:27.688Z
Modified: 2023-09-05T13:47:27.688Z

Description: description
*/

import { ReactNode } from 'react';
import { Icon, Spinner, SpinnerSize, Text } from '@blueprintjs/core';
import scheduleIntervalToCaption from '../functions/scheduleIntervalToCaption';
import { ScheduleEntityType } from 'common-types';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export type SourceIndexPageListItemCardScheduleCaptionPropsType = {
  schedule: ScheduleEntityType;
};

const SourceIndexPageListItemCardScheduleCaption = (
  props: SourceIndexPageListItemCardScheduleCaptionPropsType,
) => {
  let scheduleCaption: ReactNode = null;

  if (props.schedule == null) return null;

  const scheduleLastRunAtDate =
    props.schedule.lastRunAt == null ? null : dayjs(props.schedule.lastRunAt);
  const scheduleNextRunAtDate =
    props.schedule.nextRunAt == null ? null : dayjs(props.schedule.nextRunAt);

  if (props.schedule.status === 'pending') {
    if (props.schedule.interval == null) {
      if (scheduleLastRunAtDate == null && scheduleNextRunAtDate == null) {
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Not scheduled to save</Text>
          </>
        );
      } else if (
        scheduleLastRunAtDate != null &&
        scheduleNextRunAtDate == null
      ) {
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Saved on {scheduleLastRunAtDate.format('lll')}</Text>
          </>
        );
      } else if (scheduleNextRunAtDate != null) {
        scheduleCaption = (
          <>
            <Icon icon="time" />
            <Text>Will save on {scheduleNextRunAtDate.format('lll')}</Text>
          </>
        );
      }
    } else {
      const timeCaption = scheduleIntervalToCaption(props.schedule.interval);
      const nextCaption =
        scheduleNextRunAtDate != null
          ? `(next time on ${scheduleNextRunAtDate.format('lll')})`
          : '';
      scheduleCaption = (
        <>
          <Icon icon="time" />
          <Text>
            Saves every {timeCaption} {nextCaption}
          </Text>
        </>
      );
    }
  } else if (props.schedule.status === 'processing') {
    scheduleCaption = (
      <>
        <Spinner size={SpinnerSize.SMALL} />
        <Text>Saving now...</Text>
      </>
    );
  }

  return scheduleCaption;
};

export default SourceIndexPageListItemCardScheduleCaption;
