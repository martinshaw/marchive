/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: formatLocationUrlWithChangedSearchParams.ts
Created:  2023-09-17T20:48:56.657Z
Modified: 2023-09-17T20:48:56.657Z

Description: description
*/

import { Location } from "react-router-dom";
import parseLocationWithSearchParams, { ParseLocationWithSearchParamsReturnType } from "./parseLocationWithSearchParams";

const formatLocationUrlWithChangedSearchParams = (
  (
    changes: {[key: string]: (string | number | boolean) | (string | number | boolean)[]},
    location: Location | ParseLocationWithSearchParamsReturnType,
  ) => {
    const locationWithSearchParams: ParseLocationWithSearchParamsReturnType =
      (!('searchParams' in location)) ?
        parseLocationWithSearchParams(location) :
        location;
    return locationWithSearchParams.pathname + '?' + Object
      .entries({ ...locationWithSearchParams.searchParams, ...changes })
      .map(([key, value]) => (key + '=' + (Array.isArray(value) ? JSON.stringify(value) : value)))
      .join('&');
  }
)

export default formatLocationUrlWithChangedSearchParams;
