/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: command.ts
Created:  2024-02-12T08:45:12.908Z
Modified: 2024-02-12T08:45:12.908Z

Description: description
*/

import commander from "commander";
import action from '.'

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
    ) => action(
        url
        optionsAndArguments?.store as boolean | undefined
    )
  );

export default UtilitiesRetrieveFavicon;
