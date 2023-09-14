/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getImageFromCaptureDirectory.ts
Created:  2023-09-12T01:24:28.658Z
Modified: 2023-09-12T01:24:28.658Z

Description: description
*/

import { CaptureAttributes } from "../../../main/database/models/Capture";
import { useAsyncMemo } from "use-async-memo";

type useGetTextFromCaptureDirectoryPropsType = {
  capture: CaptureAttributes
  path: string
}

type useGetTextFromCaptureDirectoryReturnsType = {
  text: string | null
  fullPath: string | null
  errorMessage: string | null
}

const useGetTextFromCaptureDirectory: (props: useGetTextFromCaptureDirectoryPropsType) => useGetTextFromCaptureDirectoryReturnsType = (props) => {
  const response = useAsyncMemo<useGetTextFromCaptureDirectoryReturnsType | null | undefined>(async () => {
    return (
      new Promise<useGetTextFromCaptureDirectoryReturnsType>(
        (resolve, reject) => {
          window.electron.ipcRenderer.once(
            'data-providers.get-text-from-capture-directory',
            (text, fullPath, error) => {
              if (error != null && typeof error === 'string') return reject(error);
              if (error != null && error instanceof Error) return reject(error.message);

              resolve({
                text: text as string,
                fullPath: fullPath as string,
                errorMessage: null,
              });
            }
          );

          window.electron.ipcRenderer.sendMessage(
            'data-providers.get-text-from-capture-directory',
            props.capture.id,
            props.path,
          );
        }
      )
        .catch((error) => {
          return {
            text: null,
            fullPath: null,
            errorMessage: error,
          }
        })
    );
  }, [props.capture, props.path]);

  return {
    text: response?.text == null ? null : response.text,
    fullPath: response?.fullPath == null ? null : response.fullPath,
    errorMessage: response?.errorMessage == null ? null : response.errorMessage,
  }
};

export default useGetTextFromCaptureDirectory;
