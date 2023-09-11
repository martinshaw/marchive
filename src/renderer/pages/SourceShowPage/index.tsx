/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowPage.tsx
Created:  2023-08-01T19:43:12.647Z
Modified: 2023-08-01T19:43:12.647Z

Description: description
*/
import { useMemo } from 'react';
import { Button, Card, Text } from '@blueprintjs/core';
import { LoaderFunction, NavLink, useLoaderData } from 'react-router-dom';
import { ScheduleAttributes } from 'main/database/models/Schedule';

import './index.scss';
import getSchedules from './functions/getSchedules';
import { useCallback } from 'react';
import SourceShowPageGridItemPreview from './components/SourceShowPageGridItemPreview';

type SourceShowPageLoaderReturnType = {
  capturesGroupedBySchedule: ScheduleAttributes[];
  capturesGroupedByScheduleError: Error | false;
};

export const SourceShowPageLoader: LoaderFunction = async ({params}): Promise<SourceShowPageLoaderReturnType> => {
  let capturesGroupedBySchedule: ScheduleAttributes[] = [];
  let capturesGroupedByScheduleError: Error | false = false;

  if (params.sourceId == null) {
    return {
      capturesGroupedBySchedule: [],
      capturesGroupedByScheduleError: new Error('A source was not specified.')
    }
  }

  const sourceId = parseInt(params.sourceId.toString());

  console.log('sourceId', sourceId);

  try { capturesGroupedBySchedule = await getSchedules(sourceId, true); }
  catch (error) { capturesGroupedByScheduleError = error as Error; }

  return {
    capturesGroupedBySchedule,
    capturesGroupedByScheduleError,
  }
}

const SourceShowPage = () => {
  const {
    capturesGroupedBySchedule,
    capturesGroupedByScheduleError,
  } = useLoaderData() as SourceShowPageLoaderReturnType

  const sourceCapturesCount = useMemo(
    () => capturesGroupedBySchedule == null ?
      0 :
      capturesGroupedBySchedule.reduce((c, schedule) => (c + (schedule.captures ?? []).length), 0)
    ,
    [capturesGroupedBySchedule]
  )

  const humanDateCaption = useCallback((date: Date): string => {
    const dateNow = new Date();

    const dateIsToday = dateNow.getFullYear() === date.getFullYear() && dateNow.getMonth() === date.getMonth() && dateNow.getDate() === date.getDate();
    const dateIsYesterday = dateNow.getFullYear() === date.getFullYear() && dateNow.getMonth() === date.getMonth() && dateNow.getDate() === date.getDate() - 1;

    if (dateIsToday) {
      return 'Today at ' + date.toLocaleTimeString();
    } else if (dateIsYesterday) {
      return 'Yesterday at ' + date.toLocaleTimeString();
    } else {
      return date.toLocaleDateString();
    }
  }, [])

  return (
    <>
      <div className="source-captures__buttons">
        <Text>
          {sourceCapturesCount} Source Capture{sourceCapturesCount > 1 ? 's' : ''}
          <span className="source-captures__buttons__hint">
            Right-click a source's capture to edit or delete it.
          </span>
        </Text>
        {/* <NavLink to="/sources/create">
          {() => (
            <Button intent="success" icon="add" text="Add a new Source" />
          )}
        </NavLink> */}
      </div>

      <div className="source-captures__grid">
        {(capturesGroupedBySchedule ?? []).map((schedule, scheduleIndex) => (
          (schedule.captures ?? []).map((capture, captureIndex) => (
            <Card key={capture.id} className="source-captures__grid__item">
              <div className="source-captures__grid__item__title">
                <Text ellipsize>{humanDateCaption(capture.createdAt)}</Text>
              </div>

              <SourceShowPageGridItemPreview
                schedule={schedule}
                capture={capture}
              />
            </Card>
          ))
        ))}

      </div>
    </>
  );
};

export default SourceShowPage;
