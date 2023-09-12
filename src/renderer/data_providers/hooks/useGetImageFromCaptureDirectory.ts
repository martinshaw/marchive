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

type UseGetImageFromCaptureDirectoryPropsType = {
  capture: CaptureAttributes
  path: string
}

type UseGetImageFromCaptureDirectoryReturnsType = {
  imageDataUrl: string | null
  fullPath: string | null
  errorMessage: string | null
}

const useGetImageFromCaptureDirectory: (props: UseGetImageFromCaptureDirectoryPropsType) => UseGetImageFromCaptureDirectoryReturnsType = (props) => {
  const response = useAsyncMemo<UseGetImageFromCaptureDirectoryReturnsType | null | undefined>(async () => {
    return (
      new Promise<UseGetImageFromCaptureDirectoryReturnsType>(
        (resolve, reject) => {
          window.electron.ipcRenderer.once(
            'data-providers.get-image-from-capture-directory',
            (imageDataUrl, fullPath, error) => {
              if (error != null && typeof error === 'string') return reject(error);
              if (error != null && error instanceof Error) return reject(error.message);

              resolve({
                imageDataUrl: imageDataUrl as string,
                fullPath: fullPath as string,
                errorMessage: null,
              });
            }
          );

          window.electron.ipcRenderer.sendMessage(
            'data-providers.get-image-from-capture-directory',
            props.capture.id,
            props.path,
          );
        }
      )
        .catch((error) => {
          return {
            imageDataUrl: null,
            fullPath: null,
            errorMessage: error,
          }
        })
    );
  }, [props.capture, props.path]);

  return {
    imageDataUrl: response?.imageDataUrl == null ? null : response.imageDataUrl,
    fullPath: response?.fullPath == null ? null : response.fullPath,
    errorMessage: response?.errorMessage == null ? null : response.errorMessage,
  }
};

export default useGetImageFromCaptureDirectory;
