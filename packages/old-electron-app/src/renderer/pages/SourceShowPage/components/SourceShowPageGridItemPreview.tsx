/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceShowPageGridItemPreview.tsx
Created:  2023-09-11T13:04:19.598Z
Modified: 2023-09-11T13:04:19.598Z

Description: description
*/

import AppToaster from '../../../toaster';
import { useMemo, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SourceAttributes } from 'database/src/models/Source';
import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core';
import { CaptureAttributes } from 'database/src/models/Capture';
import { ScheduleAttributes } from 'database/src/models/Schedule';
import dataProvidersRendererDetailsList from '../../../data_providers';
import { DataProviderSerializedType } from "data-providers/src/BaseDataProvider";
import promptForCaptureDeletion from '../../../layouts/DefaultLayout/functions/promptForCaptureDeletion';

export type SourceShowPageGridItemPreviewPropsType = {
  source: SourceAttributes;
  schedule: ScheduleAttributes;
  capture: CaptureAttributes;
  dataProvider: DataProviderSerializedType;
};

const SourceShowPageGridItemPreview = (
  props: SourceShowPageGridItemPreviewPropsType
) => {
  const navigate = useNavigate();

  const capturePreviewThumbnailComponent = useMemo<ReactNode | null>(() => {
    if (!props.source.dataProviderIdentifier) return null;
    if (
      typeof dataProvidersRendererDetailsList[
        props.source.dataProviderIdentifier
      ] === 'undefined'
    )
      return null;

    const dataProviderRendererDetails =
      dataProvidersRendererDetailsList[props.source.dataProviderIdentifier];
    if (
      dataProviderRendererDetails?.components?.capturePreviewThumbnail == null
    )
      return null;

    return dataProviderRendererDetails.components.capturePreviewThumbnail({
      source: props.source,
      schedule: props.schedule,
      capture: props.capture,
      dataProvider: props.dataProvider,
    });
  }, [props.source, props.schedule, props.capture]);

  return (
    <ContextMenu
      key={props.capture.id}
      style={{ width: '100%' }}
      content={
        <Menu>
          <MenuItem
            icon="trash"
            text="Delete Capture"
            disabled={props.schedule.status === 'processing'}
            onClick={() => {
              promptForCaptureDeletion(props.capture)
                .then(() => {
                  navigate(0);
                })
                .catch(() => {
                  AppToaster.show({
                    message: 'An error occurred while deleting the capture.',
                    intent: 'danger',
                  });
                });
            }}
          />
        </Menu>
      }
    >
      <NavLink
        to={`/captures/${props.capture.id}`}
        className="source-captures__grid__item__link"
      >
        <div className="source-captures__grid__item">
          {capturePreviewThumbnailComponent}
        </div>
      </NavLink>
    </ContextMenu>
  );
};

export default SourceShowPageGridItemPreview;
