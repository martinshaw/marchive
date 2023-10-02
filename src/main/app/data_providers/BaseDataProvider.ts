/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: BaseDataProvider.ts
Created:  2023-08-02T02:29:08.035Z
Modified: 2023-08-02T02:29:08.035Z

Description: description
*/
import { Capture, CapturePart, Schedule, Source } from '../../database';
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from '../repositories/LocalFileRepository';

export type DataProviderSerializedType = {
  identifier: string;
  name: string;
  description: string;
  iconInformation: BaseDataProviderIconInformationReturnType;
};

export type SourceDomainInformationReturnType = {
  siteName: string | null;
  // TODO: Add site favicon using more time-effective method in future, see commented code in SourceDomainRepository.ts
};

export type AllowedScheduleIntervalReturnType = {
  onlyRunOnce?: boolean;
};

export type BaseDataProviderIconInformationReturnType = {
  filePath: string;
  shouldInvertOnDarkMode: boolean;
};

abstract class BaseDataProvider {
  /**
   * The unique identifier for this Data Provider in kebab-case
   */
  abstract getIdentifier(): string;

  /**
   * The name of this Data Provider in human-readable sentence case
   */
  abstract getName(): string;

  /**
   * A short description of what information is archived, analysed, searchable and visualised by this Data Provider
   */
  abstract getDescription(): string;

  /**
   * Relative path to the visual icon file for this Data Provider
   */
  abstract getIconInformation(): BaseDataProviderIconInformationReturnType;

  /**
   * Determine whether this Data Provider is suitable to capture useful information from the provided URL
   *
   * This method should be an asynchronous function which returns a boolean value very quickly, this is
   *   important because many Data Provider classes's `validateUrlPrompt` methods
   *   are called in sequence.
   *
   * @param {string} url
   */
  abstract validateUrlPrompt(url: string): Promise<boolean>;

  /**
   * Determine whether this Data Provider is suitable to be captured more than once per schedule configured.
   *
   * For example, it is ideal to allow a podcast feed or news website homepage to be captured multiple times
   *   because its content changes frequently.
   *
   * However, it is not ideal to allow a podcast episode or news article to be captured multiple times
   */
  abstract allowedScheduleInterval(): Promise<AllowedScheduleIntervalReturnType>;

  /**
   * When creating a new Source with a root URL which is not in common with any previously added Sources,
   *   we need to quickly retrieve basic information about the website (like the Site Name and
   *   (in the future) the Site Favicon)
   *
   * Data Providers which accept URLs for HTML websites should retrieve the content of the HTML <title> tag,
   *   and for RSS feed should retrieve the podcast network's name from the XML, etc...
   */
  async getSourceDomainInformation(
    url: string
  ): Promise<SourceDomainInformationReturnType> {
    let rootUrl = url;

    try {
      rootUrl = (new URL(url)).hostname;
    } catch (error) {
      rootUrl = rootUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    }

    return {
      siteName: rootUrl,
    };
  }

  /**
   * This event is fired when a user has a Schedule which is due to be captured using this Data Provider.
   *
   * This method should be an asynchronous function which returns a boolean value indicating whether
   *   the capture was successful.
   *
   * Firstly download, screenshot or otherwise capture information only from the provided URL using the
   *   provided helper functions (see DownloadDataProviderHelperFunctions.ts &
   *   PuppeteerDataProviderHelperFunctions.ts files)
   *
   * Then, create new CapturePart model instances for each of the other sequential and chronological
   *   resource (for example, images in the page, or items in a podcast feed)
   *
   * Lastly, ensure that all resources are cleaned up after the capture is complete. Particularly,
   *   ensure that all headless browser instances are closed, file streams / buffers are closed
   *   and temporary files are deleted, etc...
   *
   * Return a boolean value indicating whether the capture was successful
   *
   * @param {Capture} capture
   * @param {Schedule} schedule
   * @param {Source} source
   * @throws {Error}
   */
  abstract performCapture(
    capture: Capture,
    schedule: Schedule,
    source: Source
  ): Promise<boolean | never>;

  /**
   * This event is fired when one of the CapturePart models queued for capture by the `performCapture`
   *   method is ready to be processed.
   *
   * A data provider can have many different types of Capture Part differentiated by the
   *   `dataProviderPartIdentifier` model attribute.
   *
   * We recommend that this asynchronous function consists of a switch statement which
   *   calls and returns the result of a dedicated async function
   *   for each type of Capture Part.
   *
   * Each of these async functions should return a boolean value indicating whether the
   *   Capture Part was processed successfully.
   *
   * @param {CapturePart} capturePart
   * @throws {Error}
   */
  abstract processPart(capturePart: CapturePart): Promise<boolean | never>;

  /**
   * This function should not be overridden in child classes.
   *
   * @returns {DataProviderSerializedType}
   */
  async toJSON(): Promise<DataProviderSerializedType> {
    const { filePath: iconFilePath, shouldInvertOnDarkMode } =
      this.getIconInformation();
    let iconDataUrl: string =
      (await retrieveFileAsBase64DataUrlFromAbsolutePath(iconFilePath)) ?? '';

    return {
      identifier: this.getIdentifier(),
      name: this.getName(),
      description: this.getDescription(),
      iconInformation: {
        filePath: iconDataUrl,
        shouldInvertOnDarkMode,
      },
    };
  }
}

export default BaseDataProvider;
