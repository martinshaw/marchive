/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilitiesRetrieveFavicon.ts
Created:  2024-02-10T03:23:02.782Z
Modified: 2024-02-10T03:23:02.782Z

Description: description
*/

import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";
import { retrieveAndStoreFaviconFromUrl } from "data-providers";

let UtilitiesRetrieveFavicon = async (url: string, store?: boolean) => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    let urlDomainName: string | null = null;
    try {
      const safeUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : "https://" + url;
      urlDomainName = new URL(safeUrl).hostname;
    } catch (error) {
      throw new ErrorResponse(
        `Unable to parse URL domain name from URL: '${url}' when attempting retrieve favicon for site in utility`,
        error instanceof Error ? error : null,
      );
    }

    if (urlDomainName == null) {
      throw new ErrorResponse(
        `Empty URL domain parsed from URL: '${url}' when attempting retrieve favicon for site in utility`,
      );
    }

    let faviconPathInfo = await retrieveAndStoreFaviconFromUrl(
      url,
      store === true,
    );
    if (faviconPathInfo == null || faviconPathInfo?.path === "") {
      throw new ErrorResponse(
        `Unable to retrieve favicon from URL: '${url}' when attempting retrieve favicon for site in utility`,
      );
    }

    return new MessageResponse(
      `Found favicon for URL: '${faviconPathInfo.url}'`,
      [faviconPathInfo],
    );
  });
};

export default UtilitiesRetrieveFavicon;