/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import { useMemo } from "react";
import { ReactNode } from "react";
import { JSONObject } from "types-json";
import List from 'react-virtualized/dist/commonjs/List';
import AutoAnimated from '../../../components/AutoAnimated';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Card, H1, H2, H3, H4, Icon, Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from "../..";
import useGetImageFromCaptureDirectory from "../../hooks/useGetImageFromCaptureDirectory";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";
import useGetTextFromCapturePartDirectory from "../../../../renderer/data_providers/hooks/useGetTextFromCapturePartDirectory";
import useGetTextFromCaptureDirectory from "../../../../renderer/data_providers/hooks/useGetTextFromCaptureDirectory";

import './index.scss'
import BlogArticleDataProviderCapturePartPreviewThumbnail from "../BlogArticleDataProviderCapturePartPreviewThumbnail";

const BlogArticleDataProviderCaptureShowPageFragment = (props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType) => {
  const {
    imageDataUrl: captureImageUrl,
    errorMessage: captureImageErrorMessage,
  } = useGetImageFromCaptureDirectory({
    capture: props.capture,
    path: 'index.jpg'
  });

  const {
    text: captureMetadataJson,
    errorMessage: captureMetadataErrorMessage,
  } = useGetTextFromCaptureDirectory({
    capture: props.capture,
    path: 'metadata.json'
  });

  type CaptureMetadataValueReturnType = {
    captureMetadataObject: JSONObject | null;
    titleText: string | null;
    descriptionText: string | null;
  }

  const {
    captureMetadataObject,
    titleText,
    descriptionText,
  } = useMemo<CaptureMetadataValueReturnType>(
    () => {
      let returnValue: CaptureMetadataValueReturnType = {
        captureMetadataObject: null,
        titleText: null,
        descriptionText: null,
      };

      if (captureMetadataJson == null) return returnValue;
      returnValue.captureMetadataObject = JSON.parse(captureMetadataJson) as JSONObject;

      console.log('object', returnValue.captureMetadataObject);


      returnValue.titleText = (returnValue.captureMetadataObject?.title as string | null) || null;
      if (returnValue.titleText?.includes(' - ')) {
        const titleTextParts = returnValue.titleText.split(' - ');
        titleTextParts.pop()
        returnValue.titleText = titleTextParts.join(' - ');
      }
      if (returnValue.titleText?.includes(' | ')) {
        const titleTextParts = returnValue.titleText.split(' | ');
        titleTextParts.pop()
        returnValue.titleText = titleTextParts.join(' - ');
      }
      if (typeof returnValue.titleText === 'string') returnValue.titleText = returnValue.titleText.trim();

      returnValue.descriptionText = (returnValue.captureMetadataObject?.description as string | null) || null;
      if (typeof returnValue.descriptionText === 'string') returnValue.descriptionText = returnValue.descriptionText.trim();

      return returnValue;
    },
    [captureMetadataJson],
  );

  return (
    <div className="blog-article-capture-show-fragment__container">

      <div className="blog-article-capture-show-fragment__left">

        <div className="blog-article-capture-show-fragment__left__image">
          {captureImageUrl == null && <div className="blog-article-capture-show-fragment__left__image__placeholder"><Spinner size={SpinnerSize.STANDARD} /></div>}
          {captureImageUrl != null && <div className="blog-article-capture-show-fragment__left__image__image" style={{backgroundImage: 'url('+captureImageUrl+')'}} />}

          <div className="blog-article-capture-show-fragment__left__image__overflow-gradient">&nbsp;</div>
        </div>

        <div className="blog-article-capture-show-fragment__left__details">
          {titleText != null && <H1 className="blog-article-capture-show-fragment__left__details__title font-serif">
            {titleText as string | null}
          </H1>}

          {descriptionText != null && <Text className="blog-article-capture-show-fragment__left__details__description font-serif">
            {descriptionText as string | null}
          </Text>}

          <Text className="blog-article-capture-show-fragment__left__details__link">Click here to view the page's screenshot, snapshot and metadata...</Text>
        </div>
      </div>

      <div className="blog-article-capture-show-fragment__right">
        <H4 className="blog-article-capture-show-fragment__right__related-heading">
          Related Articles and Posts...
        </H4>

        <div className="blog-article-capture-show-fragment__right__list">
          <AutoSizer>
            {({height, width}) => (
              <List
                width={width}
                height={height}
                rowCount={(props?.capture?.captureParts ?? []).length}
                rowHeight={200}
                rowRenderer={({key, index, style}) => {
                  const capturePart = props?.capture?.captureParts[index];

                  return <Card key={key} style={style} className="blog-article-capture-show-fragment__right__list__item" interactive>
                    <BlogArticleDataProviderCapturePartPreviewThumbnail
                      source={props.source}
                      schedule={props.schedule}
                      capture={props.capture}
                      capturePart={capturePart}
                      dataProvider={props.dataProvider}
                    />
                  </Card>
                }}
              />
            )}
          </AutoSizer>
        </div>
      </div>

    </div>
  )

}

export default BlogArticleDataProviderCaptureShowPageFragment;
