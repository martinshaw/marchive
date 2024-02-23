/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePageDataProviderOptionsLoadingMessage.tsx
Created:  2023-09-01T02:02:35.750Z
Modified: 2023-09-01T02:02:35.750Z

Description: description
*/

import { NonIdealState, Spinner, SpinnerSize } from "@blueprintjs/core"

export type SourceCreatePageDataProviderOptionsLoadingMessagePropsType = {
  //
}

const SourceCreatePageDataProviderOptionsLoadingMessage = (props: SourceCreatePageDataProviderOptionsLoadingMessagePropsType) => {
  // TODO: For now, we have so few data providers that the loading process is almost instant. Displaying this working loading message only causes an annoying flicker. We should only display this message if the loading process takes longer than 1 second.
  return null

  return (
    <div className="data-providers__grid__loading">
      <NonIdealState icon={<Spinner size={SpinnerSize.LARGE} />} title="Loading..." />
    </div>
  )
}

export default SourceCreatePageDataProviderOptionsLoadingMessage
