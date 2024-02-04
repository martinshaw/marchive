/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: WikipediaArticleDataProvider.ts
Created:  2023-08-02T02:30:40.877Z
Modified: 2023-08-02T02:30:40.877Z

Description: description
*/

import BlogArticleDataProvider, {
  BlogArticleDataProviderLinkType,
  CountMapOfCommonParentDirectoriesType,
} from "../BlogArticleDataProvider";
import { Page } from "puppeteer-core";
import { sentenceCase } from "change-case-commonjs";
import { parse as parseHtml } from "node-html-parser";
import { BaseDataProviderIconInformationReturnType } from "../BaseDataProvider";
import axios, { AxiosResponse } from "axios";

class WikipediaArticleDataProvider extends BlogArticleDataProvider {
  getIdentifier(): string {
    return "wikipedia-article";
  }

  getName(): string {
    return "Wikipedia Article & Related Articles";
  }

  getDescription(): string {
    return "Screenshots and snapshots this Wikipedia article and each of its related articles.";
  }

  getIconInformation(): BaseDataProviderIconInformationReturnType {
    return {
      filePath:
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgo8c3ZnCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly93ZWIucmVzb3VyY2Uub3JnL2NjLyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL2lua3NjYXBlLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB2ZXJzaW9uPSIxLjAiCiAgIHdpZHRoPSIxMjgiCiAgIGhlaWdodD0iMTI4IgogICBpZD0ic3ZnMTQ2NjIiCiAgIHNvZGlwb2RpOnZlcnNpb249IjAuMzIiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuNDMiCiAgIHNvZGlwb2RpOmRvY25hbWU9Ildpa2lwZWRpYSdzIFcuc3ZnIgogICBzb2RpcG9kaTpkb2NiYXNlPSJEOlx2YXJcbWVkaWF3aWtpXHN2Z1xJbmtzY2FwZSI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhODciPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL0dQTC8yLjAvIiAvPgogICAgICAgIDxkYzp0aXRsZT5XaWtpcGVkaWEncyBXPC9kYzp0aXRsZT4KICAgICAgICA8ZGM6Y3JlYXRvcj4KICAgICAgICAgIDxjYzpBZ2VudD4KICAgICAgICAgICAgPGRjOnRpdGxlPlNUeXg8L2RjOnRpdGxlPgogICAgICAgICAgPC9jYzpBZ2VudD4KICAgICAgICA8L2RjOmNyZWF0b3I+CiAgICAgICAgPGRjOnNvdXJjZT5ub25lPC9kYzpzb3VyY2U+CiAgICAgICAgPGRjOnN1YmplY3Q+CiAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgPHJkZjpsaT5XaWtpcGVkaWE8L3JkZjpsaT4KICAgICAgICAgICAgPHJkZjpsaT5mYXZpY29uPC9yZGY6bGk+CiAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgPC9kYzpzdWJqZWN0PgogICAgICAgIDxkYzpkYXRlPjIwMDctMDYtMjY8L2RjOmRhdGU+CiAgICAgICAgPGRjOnJpZ2h0cz4KICAgICAgICAgIDxjYzpBZ2VudD4KICAgICAgICAgICAgPGRjOnRpdGxlPkdGREw8L2RjOnRpdGxlPgogICAgICAgICAgPC9jYzpBZ2VudD4KICAgICAgICA8L2RjOnJpZ2h0cz4KICAgICAgICA8ZGM6ZGVzY3JpcHRpb24+VyBkZSBXaWtpcMOpZGlhPC9kYzpkZXNjcmlwdGlvbj4KICAgICAgICA8ZGM6cHVibGlzaGVyPgogICAgICAgICAgPGNjOkFnZW50PgogICAgICAgICAgICA8ZGM6dGl0bGU+SW5rc2NhcGU8L2RjOnRpdGxlPgogICAgICAgICAgPC9jYzpBZ2VudD4KICAgICAgICA8L2RjOnB1Ymxpc2hlcj4KICAgICAgPC9jYzpXb3JrPgogICAgICA8Y2M6TGljZW5zZQogICAgICAgICByZGY6YWJvdXQ9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL0dQTC8yLjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3dlYi5yZXNvdXJjZS5vcmcvY2MvUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vd2ViLnJlc291cmNlLm9yZy9jYy9EaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vd2ViLnJlc291cmNlLm9yZy9jYy9Ob3RpY2UiIC8+CiAgICAgICAgPGNjOnBlcm1pdHMKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly93ZWIucmVzb3VyY2Uub3JnL2NjL0Rlcml2YXRpdmVXb3JrcyIgLz4KICAgICAgICA8Y2M6cmVxdWlyZXMKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly93ZWIucmVzb3VyY2Uub3JnL2NjL1NoYXJlQWxpa2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vd2ViLnJlc291cmNlLm9yZy9jYy9Tb3VyY2VDb2RlIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iOTc4IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTA0NSIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBpZD0iYmFzZSIKICAgICBpbmtzY2FwZTp6b29tPSI3LjQ1MzEyNSIKICAgICBpbmtzY2FwZTpjeD0iNjQuNjM2OTQ4IgogICAgIGlua3NjYXBlOmN5PSI3NS42Nzc5NDIiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjU3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzE0NjYyIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxNDY2NCI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMyNjEiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eTowIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzI2MyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MCIKICAgICAgICAgb2Zmc2V0PSIwLjUiCiAgICAgICAgIGlkPSJzdG9wMzI2OSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDMyNjUiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMjE5Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzBlNzMwOTtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDMyMjEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM3MGQxM2U7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzMjIzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzIwNSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMyYzgzMDA7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzMjA3IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojM2RiODAwO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjAuMjUiCiAgICAgICAgIGlkPSJzdG9wMzIxNSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIwLjUiCiAgICAgICAgIGlkPSJzdG9wMzIxMyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzY5Y2YzNTtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDMyMDkiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMTk3Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMmYzMjtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDMxOTkiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwNDViMDQ7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzMjAxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzMzOSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNlOGU4ZTg7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzMzQxIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjAuNSIKICAgICAgICAgaWQ9InN0b3AzMzQ3IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZThlOGU4O3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzM0MyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMzMjciPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wMzMyOSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZkZDk5YTtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIwLjUiCiAgICAgICAgIGlkPSJzdG9wMzMzNSIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2MzOTUzOTtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDMzMzEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMzE5Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzdkNDkxZjtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDMzMjEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM5MjY2MDA7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgaWQ9InN0b3AzMzIzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI4MiI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjAiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AzMjg0IiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMzI4NiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDE0NzA5Ij4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDE0NzExIiAvPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNWViMmZmO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjEiCiAgICAgICAgIGlkPSJzdG9wMTQ3MTMiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQxNDY4NSI+CiAgICAgIDxzdG9wCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwOTE3YTA7c3RvcC1vcGFjaXR5OjEiCiAgICAgICAgIG9mZnNldD0iMCIKICAgICAgICAgaWQ9InN0b3AxNDY4NyIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAzNDVmNDtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDE0Njg5IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeDE9Ijk2LjEyNSIKICAgICAgIHkxPSIxMS4xODc1IgogICAgICAgeDI9Ijk2LjEyNSIKICAgICAgIHkyPSI1Mi4xMDEzMzQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQxNDY5MSIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDE0Njg1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHgxPSI5Ni4xMjUiCiAgICAgICB5MT0iMTEuMTg3NSIKICAgICAgIHgyPSI5Ni4xMjUiCiAgICAgICB5Mj0iNTIuMTAxMzM0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MTQ2OTkiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQxNDY4NSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg0NDcuNDI4NTYsNjM2LjkzMzU5KSIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgY3g9IjU0Ni4zMTE2NSIKICAgICAgIGN5PSI3MDUuNDg0ODYiCiAgICAgICByPSIyNS4yODEyNSIKICAgICAgIGZ4PSI1NDYuMzExNjUiCiAgICAgICBmeT0iNzA1LjQ4NDg2IgogICAgICAgaWQ9InJhZGlhbEdyYWRpZW50MTQ3MTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQxNDcwOSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgyLjAzMjgyMSwwLC0zLjI4OTA2MmUtOCwxLjcxNzMzOCwtNTY1LjcxODMsLTUxOC40OTkxKSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeDE9Ijk2LjEyNSIKICAgICAgIHkxPSIxMS4xODc1IgogICAgICAgeDI9Ijk2LjEyNSIKICAgICAgIHkyPSI1Mi4xMDEzMzQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQxNDcyMyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDE0Njg1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0Ny40Mjg1Niw2MzYuOTMzNTkpIiAvPgogICAgPGZpbHRlcgogICAgICAgaWQ9ImZpbHRlcjE0ODI0Ij4KICAgICAgPGZlR2F1c3NpYW5CbHVyCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjE0ODI2IgogICAgICAgICBzdGREZXZpYXRpb249IjAuMzczMzIwNDciCiAgICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDwvZmlsdGVyPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4MT0iOTYuMTI1IgogICAgICAgeTE9IjExLjE4NzUiCiAgICAgICB4Mj0iOTYuMTI1IgogICAgICAgeTI9IjUyLjEwMTMzNCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDE0ODMzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MTQ2ODUiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDU4LjE2MTk4LDY0NC42MjMyKSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeDE9Ijk2LjEyNSIKICAgICAgIHkxPSIxMS4xODc1IgogICAgICAgeDI9Ijk2LjEyNSIKICAgICAgIHkyPSI1Mi4xMDEzMzQiCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQxNDg0MiIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDE0Njg1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1OC4xNjE5OCw2NDQuNjIzMikiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGN4PSI1NDYuMzExNjUiCiAgICAgICBjeT0iNzA1LjQ4NDg2IgogICAgICAgcj0iMjUuMjgxMjUiCiAgICAgICBmeD0iNTQ2LjMxMTY1IgogICAgICAgZnk9IjcwNS40ODQ4NiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDMyODgiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMjgyIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDIuMDMyODIwNiwwLC0zLjI4OTA2MThlLTgsMS43MTczMzgxLC01NjUuNzE4MzUsLTUxOC40OTkxMSkiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHgxPSI5Ni4xMjUiCiAgICAgICB5MT0iMTEuMTg3NSIKICAgICAgIHgyPSI5Ni4xMjUiCiAgICAgICB5Mj0iNTIuMTAxMzM0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI5NiIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDE0Njg1IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0Ny40Mjg1Niw2MzYuOTMzNTkpIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4MT0iOTYuMzgxODEzIgogICAgICAgeTE9IjMwLjY2NjY5MSIKICAgICAgIHgyPSI5Ni4zODE4MTMiCiAgICAgICB5Mj0iMTMuMTg3NDk0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzMwMiIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDMyODIiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC45MzQ4NTEsMCwwLDAuOTM0ODUxLDQ1My42OTEsNjM4Ljk5MzEpIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4MT0iNDEuOTQ1NTM4IgogICAgICAgeTE9IjQ2LjY2NTEyNyIKICAgICAgIHgyPSI0MS45NDU1MzgiCiAgICAgICB5Mj0iODIuMzMzMjQ0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzMyNSIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDMzMTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgY3g9IjUzLjYwMjIzIgogICAgICAgY3k9IjU5LjcyODg4MiIKICAgICAgIHI9IjE3LjgzNDA1NyIKICAgICAgIGZ4PSI1My42MDIyMyIKICAgICAgIGZ5PSI1OS43Mjg4ODIiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQzMzMzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzMyNyIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLDEuNjU1ODQ5LC0xLjYzOTE4OCwwLDE1Mi4xNTAxLC0zMi45MjM3MykiIC8+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIHgxPSIyOC40Mjk0ODMiCiAgICAgICB5MT0iNjEuNzk4Mjk4IgogICAgICAgeDI9IjU4Ljk1OTE2IgogICAgICAgeTI9IjYxLjc5ODI5OCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMzNDUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMzM5IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8ZmlsdGVyCiAgICAgICBpZD0iZmlsdGVyMzM4NSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIzMzg3IgogICAgICAgICBzdGREZXZpYXRpb249IjAuMTQ2MDc2OTEiCiAgICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDwvZmlsdGVyPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4MT0iODMuMjgxMjUiCiAgICAgICB5MT0iMTIzLjA5Nzk1IgogICAgICAgeDI9IjgzLjI4MTI1IgogICAgICAgeTI9IjY2LjMxMDk4OSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMyMDMiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMTk3IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+CiAgICA8cmFkaWFsR3JhZGllbnQKICAgICAgIGN4PSI0OTEuNTIyMzEiCiAgICAgICBjeT0iNjcwLjkyNTIzIgogICAgICAgcj0iMzYuNDI2NjAxIgogICAgICAgZng9IjQ5MS41MjIzMSIKICAgICAgIGZ5PSI2NzAuOTI1MjMiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQzMjExIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzIwNSIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLDIuMDIzNzgzLC0xLjk1ODA1NCwwLDE4MDUuMjMsLTMxMi40OTQ4KSIgLz4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgeDE9IjUxNy4wMjE2NyIKICAgICAgIHkxPSI3MDUuNDg0MzgiCiAgICAgICB4Mj0iNTE3LjAyMTY3IgogICAgICAgeTI9Ijc0NS4zMDA4NCIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMyNDAiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMjE5IgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0xLDAsMCwxLDk4My4zMjYxLDApIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4MT0iNTE3LjAyMTY3IgogICAgICAgeTE9IjcwNS40ODQzOCIKICAgICAgIHgyPSI1MTcuMDIxNjciCiAgICAgICB5Mj0iNzQ1LjMwMDg0IgogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzI0MyIKICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDMyMTkiCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMTIwMDQ3LDApIiAvPgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBjeD0iNDc5LjY4MzExIgogICAgICAgY3k9IjcwOS42NTc5IgogICAgICAgcj0iNS4wMDU4ODUxIgogICAgICAgZng9IjQ3OS42ODMxMSIKICAgICAgIGZ5PSI3MDkuNjU3OSIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDMyNjciCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMjYxIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEuMjMzOTc2LC0wLjE1MTYwMywwLjE5MDc5NywxLjU1Mjk5MywtMjQ3LjYzNDksLTMyMC4xNTIpIiAvPgogICAgPGZpbHRlcgogICAgICAgaWQ9ImZpbHRlcjMzMzEiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyMzMzMyIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIwLjM1NSIKICAgICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIiAvPgogICAgPC9maWx0ZXI+CiAgICA8ZmlsdGVyCiAgICAgICBpZD0iZmlsdGVyMzMzNSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIzMzM3IgogICAgICAgICBzdGREZXZpYXRpb249IjAuMjY2OTQ5NzciCiAgICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlcgogICAgICAgaWQ9ImZpbHRlcjMzMzkiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyMzM0MSIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIwLjIzODcwMDM4IgogICAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIC8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPGcKICAgICBpZD0iZzIwMzYiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC45OTk5OTgsMCkiPgogICAgPHBhdGgKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NzY2NjY3NzY2Njc3NjY2NjIgogICAgICAgaWQ9IlYxIgogICAgICAgZD0iTSA5NS44Njg3MDYsMjMuOTA5MTA0IEwgOTUuODY4NzA2LDI2LjA0ODA1NiBDIDkzLjA0NzM2MSwyNi41NDkxNDcgOTAuOTExODI2LDI3LjQzNTU1OSA4OS40NjIwOTcsMjguNzA3MjkzIEMgODcuMzg1MjUxLDMwLjU5NTgwOCA4NC45MzY1MzksMzMuNDg2MjgxIDgzLjMzMDA2MiwzNy4zNzg3MTkgTCA1MC42NDQ1ODksMTA0LjA5MDg5IEwgNDguNDY5ODc0LDEwNC4wOTA4OSBMIDE1LjY1Njk0LDM2LjUxMTU3NiBDIDE0LjEyODc0MiwzMy4wNDMwNzUgMTIuMDUxMTc2LDMwLjkyMzM5NSAxMS40MjQyNDQsMzAuMTUyNTMxIEMgMTAuNDQ0NjMsMjguOTU3ODc0IDkuMjM5NzExOSwyOC4wMjMyODggNy44MDk1MDI5LDI3LjM0ODc3IEMgNi4zNzkyNjg2LDI2LjY3NDQwMSA0LjQ0OTQ0OCwyNi4yNDA4MyAyLjAyMDAzNDcsMjYuMDQ4MDU2IEwgMi4wMjAwMzQ3LDIzLjkwOTEwNCBMIDMzLjk0NzkxNiwyMy45MDkxMDQgTCAzMy45NDc5MTYsMjYuMDQ4MDU2IEMgMzAuMjY0NTYyLDI2LjM5NDk4OSAyOC41MDg1MjMsMjcuMDExNjIzIDI3LjQxMTM5OSwyNy44OTc5NiBDIDI2LjMxNDIxMiwyOC43ODQ0NDYgMjUuNzY1NjM0LDI5LjkyMTM2NSAyNS43NjU2NiwzMS4zMDg3MjEgQyAyNS43NjU2MzQsMzMuMjM1NzczIDI2LjY2Njg2OCwzNi4yNDE4NjUgMjguNDY5MzY4LDQwLjMyNzAwNCBMIDUyLjcwMTc2Miw4Ni4yODU1NTkgTCA3Ni4zOTQ0NTMsNDAuOTA1MDk5IEMgNzguMjM2MDQ1LDM2LjQzNDU2MiA3OS43NjM5MzksMzMuMzMyMTIyIDc5Ljc2NDAwMiwzMS41OTc3NjggQyA3OS43NjM5MzksMzAuNDgwMTkgNzkuMTk1NzY0LDI5LjQxMDcxNSA3OC4wNTk0OTgsMjguMzg5MzQxIEMgNzYuOTIzMDgsMjcuMzY4MTE0IDc1LjYzNzI1MSwyNi42NDU0OTYgNzIuOTMzNjA2LDI2LjIyMTQ4NCBDIDcyLjczNzYyMSwyNi4xODMwMjEgNzIuNDA0NTY4LDI2LjEyNTIxMSA3MS45MzQ0MDgsMjYuMDQ4MDU2IEwgNzEuOTM0NDA4LDIzLjkwOTEwNCBMIDk1Ljg2ODcwNiwyMy45MDkxMDQgeiAiCiAgICAgICBzdHlsZT0iZm9udC1zaXplOjE3OC4yMjQ5OTA4NHB4O2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjFweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxO2ZvbnQtZmFtaWx5OlRpbWVzIE5ldyBSb21hbiIgLz4KICAgIDxwYXRoCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2Njc2NjY2Nzc2NjY3NzY2NjYyIKICAgICAgIGlkPSJWMiIKICAgICAgIGQ9Ik0gMTIzLjk3OTk3LDIzLjkwOTEwNCBMIDEyMy45Nzk5NywyNi4wNDgwNTYgQyAxMjEuMTU4NjMsMjYuNTQ5MTQ3IDExOS4wMjMxLDI3LjQzNTU1OSAxMTcuNTczMzcsMjguNzA3MjkzIEMgMTE1LjQ5NjUyLDMwLjU5NTgwOCAxMTMuMDQ3ODEsMzMuNDg2MjgxIDExMS40NDEzMywzNy4zNzg3MTkgTCA4Mi43NTU4NTcsMTA0LjA5MDg5IEwgODAuNTgxMTQzLDEwNC4wOTA4OSBMIDUwLjI2ODIwOSwzNi41MTE1NzYgQyA0OC43NDAwMSwzMy4wNDMwNzUgNDYuNjYyNDQ1LDMwLjkyMzM5NSA0Ni4wMzU1MTMsMzAuMTUyNTMxIEMgNDUuMDU1ODk4LDI4Ljk1Nzg3NCA0My44NTA5ODEsMjguMDIzMjg4IDQyLjQyMDc3MiwyNy4zNDg3NyBDIDQwLjk5MDUzNywyNi42NzQ0MDEgMzkuNjk0OTExLDI2LjI0MDgzIDM3LjI2NTQ5NywyNi4wNDgwNTYgTCAzNy4yNjU0OTcsMjMuOTA5MTA0IEwgNjguNTU5MTg1LDIzLjkwOTEwNCBMIDY4LjU1OTE4NSwyNi4wNDgwNTYgQyA2NC44NzU4MzEsMjYuMzk0OTg5IDYzLjExOTc5MiwyNy4wMTE2MjMgNjIuMDIyNjY4LDI3Ljg5Nzk2IEMgNjAuOTI1NDgxLDI4Ljc4NDQ0NiA2MC4zNzY5MDMsMjkuOTIxMzY1IDYwLjM3NjkyOCwzMS4zMDg3MjEgQyA2MC4zNzY5MDMsMzMuMjM1NzczIDYxLjI3ODEzNywzNi4yNDE4NjUgNjMuMDgwNjM3LDQwLjMyNzAwNCBMIDg0LjgxMzAzMSw4Ni4yODU1NTkgTCAxMDQuNTA1NzIsNDAuOTA1MDk5IEMgMTA2LjM0NzMxLDM2LjQzNDU2MiAxMDcuODc1MjEsMzMuMzMyMTIyIDEwNy44NzUyNywzMS41OTc3NjggQyAxMDcuODc1MjEsMzAuNDgwMTkgMTA3LjMwNzAzLDI5LjQxMDcxNSAxMDYuMTcwNzcsMjguMzg5MzQxIEMgMTA1LjAzNDM1LDI3LjM2ODExNCAxMDMuMTE0MzMsMjYuNjQ1NDk2IDEwMC40MTA2OCwyNi4yMjE0ODQgQyAxMDAuMjE0NywyNi4xODMwMjEgOTkuODgxNjQsMjYuMTI1MjExIDk5LjQxMTQ4LDI2LjA0ODA1NiBMIDk5LjQxMTQ4LDIzLjkwOTEwNCBMIDEyMy45Nzk5NywyMy45MDkxMDQgeiAiCiAgICAgICBzdHlsZT0iZm9udC1zaXplOjE3OC4yMjQ5OTA4NHB4O2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjFweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxO2ZvbnQtZmFtaWx5OlRpbWVzIE5ldyBSb21hbiIgLz4KICA8L2c+Cjwvc3ZnPgo=",
      shouldInvertOnDarkMode: true,
    };
  }

  async determineUrlIsAValidWikipediaUrl(
    url: string
  ): Promise<false | { url: string; articleName: string }> {
    // See my own highly tested regex based on the quidelines (https://en.wikipedia.org/wiki/Help:URL) in Regex101 at https://regex101.com/r/wRgj8A/1
    const regex =
      /^((http:|https:){0,1}\/\/.*\.wikipedia\.org){0,1}(\/wiki\/|\/w\/){1}(index\.php\?title=){0,1}(?!User:|Wikipedia:|WP:|Project:|File:|Image:|MediaWiki:|MW:|Template:|Help:|Category:|Portal:|Draft:|TimedText:|Module:|Gadget:|Gadget definition:|Topic:|Education Program:|Book:|WT:|Special:|Wikipedia Talk:|Talk:|H:|CAT:|User talk:|Image Talk:|MOS:|P:|T:|Main_Page)(?<ARTICLENAME>(?!index\.php\?title=)[^&|?|\n]*)[&|?]?.*$/gimu;

    if (typeof url === "undefined") return false;
    if (url.trim() === "") return false;

    let matches;
    let validUrls: { url: string; articleName: string }[] = [];

    while ((matches = regex.exec(url)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `matches`-variable.
      matches.forEach((match, groupIndex) => {
        if (groupIndex === 0)
          validUrls.push({ url: match, articleName: match });
        else if (groupIndex === 5)
          validUrls[validUrls.length - 1].articleName = sentenceCase(match);
      });
    }

    validUrls = validUrls.filter(
      (validUrl) => validUrl.url.includes("action=edit") === false
    );

    return validUrls.length > 0 ? validUrls[0] : false;
  }

  async validateUrlPrompt(url: string): Promise<boolean> {
    if ((url.startsWith("http://") || url.startsWith("https://")) === false)
      url = `https://${url}`;

    const wikipediaInfo = await this.determineUrlIsAValidWikipediaUrl(url);
    if (wikipediaInfo === false) return false;

    url = wikipediaInfo.url;

    let response: AxiosResponse | null = null;
    try {
      response = await axios.get(url, { responseType: "document" });
      if (response === null) return false;
      if (response.status !== 200) return false;
      if ((response.headers["content-type"] !== "text/html") === false)
        return false;

      const contents = await response.data;
      if (!contents) return false;

      const dom = parseHtml(contents);
      if (dom.querySelector("html") == null) return false;

      const domBody = dom.querySelector("body");
      if (domBody == null) return false;
      if (domBody.classList.contains("action-view") === false) return false;
    } catch (error) {
      return false;
    }

    return true;
  }

  async determineAllLinks(
    page: Page
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const linkHandles = await page.$$(".mw-body-content a");

    const articleLinks: BlogArticleDataProviderLinkType[] = await Promise.all(
      linkHandles
        .map(async (link) => {
          const wikipediaInfo = await this.determineUrlIsAValidWikipediaUrl(
            await (await link?.getProperty("href"))?.jsonValue()
          );

          if (wikipediaInfo === false) return null;

          return {
            url: wikipediaInfo?.url ?? "",
            text: (await (await link?.getProperty("text"))?.jsonValue()) ?? "",
            innerText:
              (await (await link?.getProperty("innerText"))?.jsonValue()) ?? "",
            alt: (await (await link?.getProperty("alt"))?.jsonValue()) ?? "",
            title: wikipediaInfo?.articleName ?? "",
          };
        })
        .filter(
          (link) => link !== null
        ) as Promise<BlogArticleDataProviderLinkType>[]
    );

    return new Promise((resolve) => {
      resolve(
        articleLinks
          .map((link) => {
            if (link == null) return null;
            if (link.url === "") return null;

            if (link.url.includes("#")) {
              const urlWithoutHash = link.url.split("#")[0];
              if (
                articleLinks.some((otherLink) => {
                  if (otherLink === null) return false;
                  if (otherLink.url === "") return false;
                  if (
                    otherLink.title === link.title &&
                    otherLink.title !== "" &&
                    otherLink.title != null
                  )
                    return false;
                  return otherLink?.url === urlWithoutHash;
                })
              )
                return null;
              return {
                ...link,
                url: urlWithoutHash,
              } as BlogArticleDataProviderLinkType;
            }

            return link as BlogArticleDataProviderLinkType;
          })
          .filter((link) => link !== null) as BlogArticleDataProviderLinkType[]
      );
    });
  }

  async determineCountMapOfCommonParentDirectories(
    articleLinks: BlogArticleDataProviderLinkType[]
  ): Promise<CountMapOfCommonParentDirectoriesType> {
    return {};
  }

  async filterLikelyArticleLinks(
    allLinks: BlogArticleDataProviderLinkType[],
    countMap: CountMapOfCommonParentDirectoriesType
  ): Promise<BlogArticleDataProviderLinkType[]> {
    const uniqueArticleLinks = allLinks.filter(
      (link, index) =>
        allLinks.findIndex((otherLink) => otherLink.url === link.url) === index
    );

    return uniqueArticleLinks;
  }
}

export default WikipediaArticleDataProvider;
