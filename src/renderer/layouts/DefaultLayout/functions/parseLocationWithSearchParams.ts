/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: parseLocationWithSearchParams.ts
Created:  2023-09-16T09:22:05.197Z
Modified: 2023-09-16T09:22:05.197Z

Description: description
*/

import { useMemo } from "react";
import { Location } from "react-router-dom";

export type ParseLocationWithSearchParamsReturnType = Location & {
  searchParams: {[key: string]: (string | number | boolean) | (string | number | boolean)[]};
}

const parseLocationWithSearchParams = (location: Location) => {
  const newLocation = useMemo<ParseLocationWithSearchParamsReturnType>(
    () => {
      const searchParams = new URLSearchParams(location.search);
      const searchParamsObject: ParseLocationWithSearchParamsReturnType['searchParams'] = {};

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
      }
    },
    [location]
  )

  return newLocation;
}

export default parseLocationWithSearchParams;
