/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: SourceCreatePageErrorMessage.tsx
Created:  2023-09-01T02:02:35.750Z
Modified: 2023-09-01T02:02:35.750Z

Description: description
*/

import { Button, NonIdealState, Text } from "@blueprintjs/core"

export type SourceCreatePageErrorMessagePropsType = {
  errorMessages: Error[];
  onResetUrlValue: () => void
}

const SourceCreatePageErrorMessage = (props: SourceCreatePageErrorMessagePropsType) => {
  return (
    <div className="data-providers__grid__not-found">
      <NonIdealState
        icon="warning-sign"
        title="Unfortunately, there was an error when we tried to add your link..."
        description={
          <>
            {props.errorMessages.map((errorMessage, index) => (
              <Text key={index}>{errorMessage.message}</Text>
            ))}
            <br/><br/>
            <Button
              text="Try Again"
              icon="repeat"
              onClick={() => { props.onResetUrlValue() }}
            />
          </>
        }
      />
    </div>
  )
}

export default SourceCreatePageErrorMessage
