/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: actions.ts
Created:  2023-09-26T18:25:17.171Z
Modified: 2023-09-26T18:25:17.171Z

Description: description
*/

import prompt from 'electron-prompt';
// import { cleanupAndQuit } from '../main';
import { shell, BrowserWindow, dialog, clipboard } from 'electron';
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from 'common-functions';
import UtilityRetrieveFaviconAction from '../app/actions/Utility/UtilityRetrieveFaviconAction';
import UtilityAddCliToPathAction from '../app/actions/Utility/UtilityAddCliToPathAction';
// import UtilityCleanAction from '../app/actions/Utility/UtilityCleanAction';
// import UtilityRetrieveFavicon from '../app/actions/Utility/UtilityRetrieveFavicon';

// export const clearDatabaseMenuAction = async (mainWindow: BrowserWindow) => {
//   dialog
//     .showMessageBox(mainWindow, {
//       type: 'warning',
//       message: 'Are you sure you want to clear the database?',
//       detail:
//         'All of your captured files will remain but information about them will be permanently lost.',
//       buttons: ['Cancel', 'Clear Database'],
//       defaultId: 0,
//       cancelId: 0,
//     })
//     .then(async (result) => {
//       if (result.response === 1) {
//         // await UtilityCleanAction(true, false);

//         dialog
//           .showMessageBox(mainWindow, {
//             type: 'info',
//             message:
//               'Your Marchive will now quit. Reopen it for a fresh start...',
//             buttons: ['Cool!'],
//             defaultId: 0,
//           })
//           .then(() => {
//             cleanupAndQuit();
//           });
//       }
//     });
// };

// export const clearDatabaseAndDeleteDownloadsMenuAction = async (
//   mainWindow: BrowserWindow,
// ) => {
//   dialog
//     .showMessageBox(mainWindow, {
//       type: 'warning',
//       message:
//         'Are you sure you want to clear the database and delete the default downloads folder?',
//       detail:
//         'All of your captured files will be deleted and information about them will be permanently lost.',
//       buttons: ['Cancel', 'Delete Everything'],
//       defaultId: 0,
//       cancelId: 0,
//     })
//     .then(async (result) => {
//       if (result.response === 1) {
//         // await UtilityCleanAction(true, true);

//         dialog
//           .showMessageBox(mainWindow, {
//             type: 'info',
//             message:
//               'Your Marchive will now quit. Reopen it for a fresh start...',
//             buttons: ['Cool!'],
//             defaultId: 0,
//           })
//           .then(() => {
//             cleanupAndQuit();
//           });
//       }
//     });
// };

export const addCliToolToShellPathAction = async (
  mainWindow: BrowserWindow,
) => {
  await UtilityAddCliToPathAction().then(() => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      message:
        'The CLI tool has been added to your shell path! Type `marchive-cli` to use Marchive from the command line.',
      buttons: ['OK'],
      defaultId: 0,
    });
  });
};

export const retrieveIconForWebsiteMenuAction = async (
  mainWindow: BrowserWindow,
) => {
  prompt(
    {
      label: 'Enter a link ...',
      inputAttrs: { type: 'text' },
      type: 'input',
      height: 170,
    },
    mainWindow,
  )
    .then(async (result: string | null) => {
      if (result)
        await UtilityRetrieveFaviconAction(result, true)
          .then((result) => {
            if (result == null || result?.path === '' || result?.path == null)
              throw new Error('No icon found for the URL you entered.');

            const pathToFile = result.path;

            dialog
              .showMessageBox(mainWindow, {
                type: 'info',
                message:
                  'The icon image file has been saved successfully! Would you like to copy the file path to your clipboard, open the file or copy a Base64-encoded data URL?',
                buttons: [
                  "I'm Done",
                  'Copy File Path',
                  'Open File',
                  'Copy Base64-encoded Data URL',
                ],
                defaultId: 0,
              })
              .then((result) => {
                if (result.response === 0) return;
                if (result.response === 1) {
                  clipboard.writeText(pathToFile);
                  return;
                }
                if (result.response === 2) {
                  shell.openPath(pathToFile);
                  return;
                }
                if (result.response === 3) {
                  try {
                    const base64Url =
                      retrieveFileAsBase64DataUrlFromAbsolutePath(pathToFile);
                    if (base64Url == null) throw new Error();
                    clipboard.writeText(base64Url);
                  } catch (error) {
                    dialog.showMessageBox(mainWindow, {
                      type: 'error',
                      message:
                        'An error occurred when attempting to copy the Base64-encoded data URL to your clipboard.',
                      buttons: ['OK'],
                      defaultId: 0,
                    });
                  }
                  return;
                }
              })
              .catch((error) => {
                throw error;
              });
          })
          .catch((error) => {
            throw error;
          });
    })
    .catch((error) => {
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        message: 'The URL you entered was invalid.',
        buttons: ['OK'],
        defaultId: 0,
      });
    });
};

export const needMoreSpaceMenuAction = async (mainWindow: BrowserWindow) => {
  const links: [string, string | null][] = [
    ['Never Mind', null],
    ['Sweden', 'https://diskprices.com/?locale=se'],
    ['India', 'https://diskprices.com/?locale=in'],
    ['Canada', 'https://diskprices.com/?locale=ca'],
    ['France', 'https://diskprices.com/?locale=fr'],
    ['Spain', 'https://diskprices.com/?locale=es'],
    ['Germany', 'https://diskprices.com/?locale=de'],
    ['UK', 'https://diskprices.com/?locale=uk'],
    ['For USA', 'https://diskprices.com/?locale=us'],
  ];

  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      message:
        'You can find the best prices for hard drive disks and other physical storage on the Disk Drives website',
      buttons: links.map((link) => link[0]),
      defaultId: 0,
    })
    .then((result) => {
      if (typeof links[result.response] == 'undefined') return;
      const link = links[result.response];
      if (link[1] == null) return;

      shell.openExternal(link[1]);
    });
};
