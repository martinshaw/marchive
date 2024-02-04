/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useGetObjectFromJsonFile.ts
Created:  2023-09-15T20:38:58.177Z
Modified: 2023-09-15T20:38:58.177Z

Description: description
*/

// import { JSONObject } from "types-json";
import { useAsyncMemo } from "use-async-memo";

// export type UseGetObjectFromJsonFileReturnType = JSONObject | null | undefined
export type UseGetObjectFromJsonFileReturnType = any | null | undefined
export type UseGetObjectFromJsonFilePropsType = {
  if: boolean;
  filePath: string;
};

const useGetObjectFromJsonFile: (props: UseGetObjectFromJsonFilePropsType) => UseGetObjectFromJsonFileReturnType = (props) => {
  // const jsonObject = useAsyncMemo<JSONObject | null | undefined>(
  const jsonObject = useAsyncMemo<any | null | undefined>(
    async () =>
      props.if ?
        fetch(props.filePath)
          .then(response => response.json())
          // .then(data => data as JSONObject)
          .then(data => data as any)
          .catch(error => {
            console.log(error)
            return null
          }) :
        null
    ,
    [props.if, props.filePath],
    null,
  )

  return jsonObject
};

export default useGetObjectFromJsonFile;
