/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilitiesRetrieveFavicon.ts
Created:  2024-02-10T03:23:02.782Z
Modified: 2024-02-10T03:23:02.782Z

Description: description
*/

import commander from "commander";
import ErrorResponse from "../../responses/ErrorResponse";
import MessageResponse from "../../responses/MessageResponse";
import { retrieveAndStoreFaviconFromUrl } from "data-providers";

let UtilitiesRetrieveFavicon = new commander.Command(
  "utilities:retrieve-favicon",
)
  .description("Retrieve Favicon from URL")
  .argument("<url>", `URL of the site to retrieve the favicon for`)
  .option("--store", "Store the favicon in the user's downloads directory")
  .action(
    async (
      url: string,
      optionsAndArguments: {
        [key: string]: string | number | boolean;
      },
    ) => {
      ErrorResponse.catchErrorsWithErrorResponse(async () => {
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
          optionsAndArguments?.store === true,
        );
        if (faviconPathInfo == null || faviconPathInfo?.path === "") {
          throw new ErrorResponse(
            `Unable to retrieve favicon from URL: '${url}' when attempting retrieve favicon for site in utility`,
          );
        }

        return new MessageResponse(
          `Found favicon for URL: '${faviconPathInfo.url}'`,
          [faviconPathInfo],
        ).send();
      });
    },
  );

export default UtilitiesRetrieveFavicon;
