/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceIndexPageChangeIntervalDropdownButton.tsx
Created:  2023-10-02T14:00:42.353Z
Modified: 2023-10-02T14:00:42.353Z

Description: description
*/

import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import AppToaster from '../../../toaster';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useCallback } from 'react';
import updateSchedule from '../functions/updateSchedule';
import scheduleIntervalToCaption from '../functions/scheduleIntervalToCaption';
import { ScheduleEntityType, SourceEntityType } from 'common-types';

type SourceIndexPageChangeIntervalDropdownButtonPropsType = {
  source: SourceEntityType;
  schedule: ScheduleEntityType;
};

const SourceIndexPageChangeIntervalDropdownButtonMenu = (
  props: SourceIndexPageChangeIntervalDropdownButtonPropsType & {
    updateScheduleInterval: (intervalInSeconds: number | null | false) => void;
    children: ReactNode;
  }
) => {
  return (
    <Popover
      position="bottom-right"
      interactionKind="click"
      content={
        <Menu>
          <MenuItem
            text="Every 15 minutes"
            onClick={async () => await props.updateScheduleInterval(60 * 15)}
          />
          <MenuItem
            text="Every 30 minutes"
            onClick={async () => await props.updateScheduleInterval(60 * 30)}
          />
          <MenuItem
            text="Every 1 hour"
            onClick={async () => await props.updateScheduleInterval(60 * 60)}
          />
          <MenuItem
            text="Every 2 hours"
            onClick={async () =>
              await props.updateScheduleInterval(60 * 60 * 2)
            }
          />
          <MenuItem
            text="Every 6 hours"
            onClick={async () =>
              await props.updateScheduleInterval(60 * 60 * 6)
            }
          />
          <MenuItem
            text="Every 12 hours"
            onClick={async () =>
              await props.updateScheduleInterval(60 * 60 * 12)
            }
          />
          <MenuItem
            text="Save Daily"
            onClick={async () =>
              await props.updateScheduleInterval(60 * 60 * 24)
            }
          />
          <MenuItem
            text="Save Weekly"
            onClick={async () =>
              await props.updateScheduleInterval(60 * 60 * 24 * 7)
            }
          />
          <MenuItem
            text="Save Monthly"
            onClick={async () =>
              await props.updateScheduleInterval(60 * 60 * 24 * 30)
            }
          />
          {props.schedule.interval != null && (
            <MenuItem
              text="Cancel Further Saves"
              onClick={async () => await props.updateScheduleInterval(false)}
            />
          )}
          {/* TODO: Implement this in the future */}
          {/* <MenuItem text="More Options..." /> */}
        </Menu>
      }
    >
      {props.children}
    </Popover>
  );
};

const SourceIndexPageChangeIntervalDropdownButton = (
  props: SourceIndexPageChangeIntervalDropdownButtonPropsType
) => {
  const navigate = useNavigate();

  if (props.source == null) return null;
  if (props.schedule == null) return null;

  // const disabled = props.schedule.status === 'pending';
  const disabled = false; // TODO: Decide - IDK if this should be disabled when processing initial save / future saves and capture part saves

  const updateScheduleInterval = useCallback(
    async (intervalInSeconds: number | null | false) => {
      let nextRunAt: Date | null = new Date();

      if (intervalInSeconds === false) {
        intervalInSeconds = null;
        nextRunAt = null;
      } else {
        // if (props.schedule.nextRunAt != null) nextRunAt = props.schedule.nextRunAt;
        if (intervalInSeconds != null && nextRunAt != null)
          nextRunAt.setSeconds(nextRunAt.getSeconds() + intervalInSeconds);
      }

      await updateSchedule(props.schedule, {
        interval: intervalInSeconds,
        nextRunAt,
      }).then((_updatedSchedule) => {
        const updatedSchedule: ScheduleEntityType =
          _updatedSchedule as unknown as ScheduleEntityType;

        let toasterMessage = 'This source will be saved again soon...';
        if (updatedSchedule.interval != null) {
          toasterMessage =
            'This source is now scheduled to be saved every ' +
            scheduleIntervalToCaption(updatedSchedule.interval);
        }

        if (
          updatedSchedule.nextRunAt == null &&
          updatedSchedule.interval == null
        ) {
          toasterMessage = 'This source will not be saved again';
        }

        AppToaster.clear();
        AppToaster.show({
          message: toasterMessage,
          intent: 'success',
        });

        navigate(0);
      });
    },
    [props.schedule]
  );

  if (props.schedule.interval == null) {
    return (
      <ButtonGroup>
        <Button
          disabled={disabled}
          icon="floppy-disk"
          text="Save Again"
          onClick={async () => await updateScheduleInterval(null)}
        />
        <SourceIndexPageChangeIntervalDropdownButtonMenu
          {...props}
          updateScheduleInterval={updateScheduleInterval}
        >
          <Button disabled={disabled} icon="caret-down" />
        </SourceIndexPageChangeIntervalDropdownButtonMenu>
      </ButtonGroup>
    );
  }

  return (
    <SourceIndexPageChangeIntervalDropdownButtonMenu
      {...props}
      updateScheduleInterval={updateScheduleInterval}
    >
      <Button disabled={disabled} rightIcon="caret-down" text="Change" />
    </SourceIndexPageChangeIntervalDropdownButtonMenu>
  );
};

export default SourceIndexPageChangeIntervalDropdownButton;
