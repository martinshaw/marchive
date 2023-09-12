/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: getImageFromCaptureDirectory.ts
Created:  2023-09-12T01:24:28.658Z
Modified: 2023-09-12T01:24:28.658Z

Description: description
*/

import { CapturePartAttributes } from "../../../main/database/models/CapturePart";
import { useAsyncMemo } from "use-async-memo";

type useGetTextFromCapturePartDirectoryPropsType = {
  capturePart: CapturePartAttributes
  path: string
}

type useGetTextFromCapturePartDirectoryReturnsType = {
  text: string | null
  fullPath: string | null
  errorMessage: string | null
}

const useGetTextFromCapturePartDirectory: (props: useGetTextFromCapturePartDirectoryPropsType) => useGetTextFromCapturePartDirectoryReturnsType = (props) => {
  const response = useAsyncMemo<useGetTextFromCapturePartDirectoryReturnsType | null | undefined>(async () => {
    return (
      new Promise<useGetTextFromCapturePartDirectoryReturnsType>(
        (resolve, reject) => {
          window.electron.ipcRenderer.once(
            'data-providers.get-text-from-capture-part-directory',
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
            'data-providers.get-text-from-capture-part-directory',
            props.capturePart.id,
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
  }, [props.capturePart, props.path]);

  return {
    text: response?.text == null ? null : response.text,
    fullPath: response?.fullPath == null ? null : response.fullPath,
    errorMessage: response?.errorMessage == null ? null : response.errorMessage,
  }
};

export default useGetTextFromCapturePartDirectory;
