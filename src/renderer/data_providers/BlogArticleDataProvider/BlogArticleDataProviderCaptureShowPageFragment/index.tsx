/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.tsx
Created:  2023-09-14T02:42:40.042Z
Modified: 2023-09-14T02:42:40.042Z

Description: description
*/

import { useAsyncMemo } from "use-async-memo";
import List from 'react-virtualized/dist/commonjs/List';
import AutoAnimated from '../../../components/AutoAnimated';
import { useLocation, useNavigate } from "react-router-dom";
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { DataProvidersRendererComponentCaptureShowPageFragmentPropsType } from "../..";
import { Card, H1, H2, H3, H4, Icon, Spinner, SpinnerSize, Text } from "@blueprintjs/core";
import parseRouterLocation from "../../../../renderer/layouts/DefaultLayout/functions/parseRouterLocation";
import useHumanDateCaption from "../../../../renderer/data_providers/hooks/useHumanDateCaption";
import BlogArticleDataProviderCapturePartPreviewThumbnail from "../BlogArticleDataProviderCapturePartPreviewThumbnail";
import getObjectFromJsonFile, { GetObjectFromJsonFileReturnType } from "../../../../renderer/layouts/DefaultLayout/functions/getObjectFromJsonFile";

import './index.scss'

const BlogArticleDataProviderCaptureShowPageFragment = (props: DataProvidersRendererComponentCaptureShowPageFragmentPropsType) => {
  const navigate = useNavigate();
  const location = parseRouterLocation(useLocation());

  type CaptureStateValueReturnType = {
    captureImageUrl: string | null;
    metadata: GetObjectFromJsonFileReturnType;
    titleText: string | null;
    descriptionText: string | null;
    hasFocusedMedia: boolean;
  }

  const {
    captureImageUrl,
    metadata,
    titleText,
    descriptionText,
    hasFocusedMedia,
  } = useAsyncMemo<CaptureStateValueReturnType>(
    () => {
      return new Promise(async (resolve, reject) => {
        let returnValue: CaptureStateValueReturnType = {
          captureImageUrl: null,
          metadata: null,
          titleText: null,
          descriptionText: null,
          hasFocusedMedia: false,
        };

        const afterMetadataFileLoadCallback = async (metadata: CaptureStateValueReturnType['metadata']) => {
          if (returnValue.metadata == null) {
            resolve(returnValue);
            return returnValue;
          }

          returnValue.titleText = (returnValue.metadata?.title as string | null) || null;
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

          returnValue.descriptionText = (returnValue.metadata?.description as string | null) || null;
          if (typeof returnValue.descriptionText === 'string') returnValue.descriptionText = returnValue.descriptionText.trim();

          const preloadImage = new Image();
          preloadImage.src = returnValue.captureImageUrl as string;
          preloadImage.onload = () => {
            resolve(returnValue);
          };
        }

        if (location.searchParams == null || Object.values(location?.searchParams || {}).length === 0) {
          returnValue.hasFocusedMedia = false;

          returnValue.captureImageUrl = 'marchive-downloads:///capture/' + props.capture.id + '/index.jpg';

          getObjectFromJsonFile({
            if: props.capture != null && props?.capture?.schedule?.status === 'pending',
            filePath: 'marchive-downloads:///capture/' + props.capture.id + '/metadata.json',
          })
            .then(metadata => { returnValue.metadata = metadata; return metadata })
            .then(afterMetadataFileLoadCallback)
        } else if (location.searchParams?.focused === 'capture') {
          returnValue.hasFocusedMedia = true;

          returnValue.captureImageUrl = 'marchive-downloads:///capture/' + props.capture.id + '/index.jpg';

          getObjectFromJsonFile({
            if: props.capture != null && props?.capture?.schedule?.status === 'pending',
            filePath: 'marchive-downloads:///capture/' + props.capture.id + '/metadata.json',
          })
            .then(metadata => { returnValue.metadata = metadata; return metadata })
            .then(afterMetadataFileLoadCallback)
        } else if (location.searchParams?.focused != null && Array.isArray(location.searchParams?.focused) && location.searchParams?.focused?.[0] === 'capture-part' && typeof location.searchParams?.focused?.[1] === 'number') {
          returnValue.hasFocusedMedia = true;

          if (props?.capture?.captureParts == null || (props?.capture?.captureParts || []).length < 1) return returnValue;
          const focusedIdSearchParam = location.searchParams.focused[1];

          const capturePart = props.capture.captureParts.find((capturePart) => capturePart.id === focusedIdSearchParam);
          if (capturePart == null) return returnValue;

          returnValue.captureImageUrl = 'marchive-downloads:///capture-part/' + capturePart.id + '/index.jpg';

          getObjectFromJsonFile({
            if: props.capture != null && props?.capture?.schedule?.status === 'pending',
            filePath: 'marchive-downloads:///capture-part/' + capturePart.id + '/metadata.json',
          })
            .then(metadata => { returnValue.metadata = metadata; return metadata })
            .then(afterMetadataFileLoadCallback)
        }
      })
    },
    [location.pathname, location.search, props.capture],
    {
      captureImageUrl: null,
      metadata: null,
      titleText: null,
      descriptionText: null,
      hasFocusedMedia: false,
    },
  );

  const className = 'blog-article-capture-show-fragment__container ' +
    (hasFocusedMedia ? 'blog-article-capture-show-fragment__container--has-focused-media ' : '');

  return (
    <div className={className}>

      <div
        className="blog-article-capture-show-fragment__left"
        onClick={() => {
          if (hasFocusedMedia) return navigate('/captures/' + props.capture.id)
          navigate('/captures/' + props.capture.id + '?focused=capture')
        }}
      >

        <div className="blog-article-capture-show-fragment__left__image">
          {captureImageUrl == null && <div className="blog-article-capture-show-fragment__left__image__placeholder"><Spinner size={SpinnerSize.STANDARD} /></div>}
          {(captureImageUrl != null && hasFocusedMedia === false) && <div className="blog-article-capture-show-fragment__left__image__image" style={{backgroundImage: 'url('+captureImageUrl+')'}} />}
          {(captureImageUrl != null && hasFocusedMedia) && <img className="blog-article-capture-show-fragment__left__image__image" src={captureImageUrl} />}

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
                style={{paddingBottom: '50px'}}
                width={width}
                height={height}
                rowCount={(props?.capture?.captureParts ?? []).length}
                rowHeight={200}
                rowRenderer={({key, index, style}) => {
                  const capturePart = props?.capture?.captureParts?.[index];

                  return <div key={key} style={style} className="blog-article-capture-show-fragment__right__list__item">
                    <BlogArticleDataProviderCapturePartPreviewThumbnail
                      key={key}
                      source={props.source}
                      schedule={props.schedule}
                      capture={props.capture}
                      capturePart={capturePart}
                      dataProvider={props.dataProvider}
                    />
                  </div>
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
