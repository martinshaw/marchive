/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePageDataProviderOptionsNotFoundMessage.tsx
Created:  2023-09-01T02:02:35.750Z
Modified: 2023-09-01T02:02:35.750Z

Description: description
*/

import { Button, NonIdealState, Text } from "@blueprintjs/core"

export type SourceCreatePageDataProviderOptionsNotFoundMessagePropsType = {
  onResetUrlValue: () => void
}

const SourceCreatePageDataProviderOptionsNotFoundMessage = (props: SourceCreatePageDataProviderOptionsNotFoundMessagePropsType) => {
  return (
    <div className="data-providers__grid__not-found">
      <NonIdealState
        icon="search"
        title="This address cannot be archived using any of the installed data providers."
        description={
          <>
            <Text>Try using a different address, or click below to browse some popular sources.</Text>
            <br/><br/>
            <Button
              text="Browse Popular Sources"
              icon="globe"
              onClick={() => { props.onResetUrlValue() }}
            />
          </>
        }
      />
    </div>
  )
}

export default SourceCreatePageDataProviderOptionsNotFoundMessage
