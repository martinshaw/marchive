/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: parseRouterLocation.ts
Created:  2023-09-16T09:22:05.197Z
Modified: 2023-09-16T09:22:05.197Z

Description: description
*/

import { Location } from "react-router-dom";

export type ParseRouterLocationReturnType = Location & {
  searchParams: {[key: string]: (string | number | boolean) | (string | number | boolean)[]};
}

const parseRouterLocation = (location: Location) => {
  const searchParams = new URLSearchParams(location.search);
  const searchParamsObject: ParseRouterLocationReturnType['searchParams'] = {};

  for (const [key, value] of searchParams.entries()) {
    const colonSplitParts = value
      .split(':')
      .map(part => {
        if (part === 'true') return true;
        if (part === 'false') return false;
        if (!isNaN(Number(part))) return Number(part);
        return part;
      });
    searchParamsObject[key] = colonSplitParts.length > 1 ? colonSplitParts : value;
  }

  return {
    ...location,
    searchParams: searchParamsObject,
  } as ParseRouterLocationReturnType;
}

export default parseRouterLocation;
