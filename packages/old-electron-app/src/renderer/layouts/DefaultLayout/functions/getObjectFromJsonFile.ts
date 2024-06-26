/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getObjectFromJsonFile.ts
Created:  2023-09-15T20:38:58.177Z
Modified: 2023-09-15T20:38:58.177Z

Description: description
*/

// import { JSONObject } from "types-json";

// export type GetObjectFromJsonFileReturnType = JSONObject | null | undefined
export type GetObjectFromJsonFileReturnType = any | null | undefined
export type GetObjectFromJsonFilePropsType = {
  if: boolean;
  filePath: string | (() => string);
};

const getObjectFromJsonFile: (props: GetObjectFromJsonFilePropsType) => Promise<GetObjectFromJsonFileReturnType> = async (props) => {
  return props.if ?
    fetch(typeof props.filePath === 'string' ? props.filePath : props.filePath())
      .then(response => response.json())
      // .then(data => data as JSONObject)
      .then(data => data as any)
      .catch(error => null) :
    null
};

export default getObjectFromJsonFile;
