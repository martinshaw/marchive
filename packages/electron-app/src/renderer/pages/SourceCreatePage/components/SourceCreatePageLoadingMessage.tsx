/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePageLoadingMessage.tsx
Created:  2023-09-01T02:02:35.750Z
Modified: 2023-09-01T02:02:35.750Z

Description: description
*/

import { NonIdealState, Spinner, SpinnerSize } from "@blueprintjs/core"

export type SourceCreatePageLoadingMessagePropsType = {
  //
}

const SourceCreatePageLoadingMessage = (props: SourceCreatePageLoadingMessagePropsType) => {
  return (
    <div className="data-providers__grid__loading">
      <NonIdealState icon={<Spinner size={SpinnerSize.LARGE} />} title="Just a moment, adding your link..." />
    </div>
  )
}

export default SourceCreatePageLoadingMessage
