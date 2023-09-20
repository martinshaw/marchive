import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
  clipboard,
  ipcMain,
} from 'electron';
import UtilityCleanAction from './app/actions/Utility/UtilityCleanAction';
import UtilityRetrieveFavicon from './app/actions/Utility/UtilityRetrieveFavicon';
import prompt from 'electron-prompt';
import { retrieveFileAsBase64DataUrlFromAbsolutePath } from './app/repositories/LocalFileRepository';
import { cleanupAndQuit } from './main';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Marchive',
      submenu: [
        {
          label: 'About Marchive',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        // { label: 'Services', submenu: [] },
        // { type: 'separator' },
        {
          label: 'Hide Marchive',
          accelerator: 'CmdOrCtrl+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'CmdOrCtrl+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => { cleanupAndQuit() },
        },
      ],
    };
    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: 'File',
      submenu: [
        {
          label: 'New Source',
          accelerator: 'CmdOrCtrl+N',
          enabled: this.mainWindow !== null,
          click: () => {
            this.mainWindow.webContents.send('renderer.focused-window.navigate', '/sources/create');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Close Window',
          accelerator: 'CmdOrCtrl+W',
          enabled: this.mainWindow !== null,
          role: 'close',
        },
        {
          label: 'Quit Marchive',
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit',
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuMarchiveUtilities: MenuItemConstructorOptions = {
      label: 'Utilities',
      submenu: [
        {
          label: 'Clear Database',
          click: async () => {
            dialog.showMessageBox(this.mainWindow, {
              type: 'warning',
              message: "Are you sure you want to clear the database?",
              detail: "All of your captured files will remain but information about them will be permanently lost.",
              buttons: ['Cancel', 'Clear Database'],
              defaultId: 0,
              cancelId: 0,
            })
              .then(async (result) => {
                if (result.response === 1) {
                  await UtilityCleanAction(true, false)
                  this.mainWindow.reload()
                }
              })
          },
        },
        {
          label: 'Clear Database && Delete Downloads Folder',
          click: async () => {
            dialog.showMessageBox(this.mainWindow, {
              type: 'warning',
              message: "Are you sure you want to clear the database and delete the default downloads folder?",
              detail: "All of your captured files will be deleted and information about them will be permanently lost.",
              buttons: ['Cancel', 'Delete Everything'],
              defaultId: 0,
              cancelId: 0,
            })
              .then(async (result) => {
                if (result.response === 1) {
                  await UtilityCleanAction(true, true)
                  this.mainWindow.reload()
                }
              })
          }
        },
        {
          label: 'Retrieve Icon for Website',
          click: async () => {
            prompt({
              label: "Enter a link ...",
              inputAttrs: {type: 'text'},
              type: 'input',
              height: 170,
            }, this.mainWindow)
              .then(async (result: string | null) => {
                if (result)
                  await UtilityRetrieveFavicon(result)
                    .then((result) => {
                      if (result == null || result === '') throw new Error("No icon found for the URL you entered.")

                      const pathToFile = result

                      dialog.showMessageBox(this.mainWindow, {
                        type: 'info',
                        message: "The icon image file has been saved successfully! Would you like to copy the file path to your clipboard, open the file or copy a Base64-encoded data URL?",
                        buttons: ['I\'m Done', 'Copy File Path', 'Open File', 'Copy Base64-encoded Data URL'],
                        defaultId: 0,
                      })
                        .then((result) => {
                          if (result.response === 0) return
                          if (result.response === 1) {
                            clipboard.writeText(pathToFile);
                            return
                          }
                          if (result.response === 2) {
                            shell.openPath(pathToFile)
                            return
                          }
                          if (result.response === 3) {
                            try {
                              const base64Url = retrieveFileAsBase64DataUrlFromAbsolutePath(pathToFile)
                              if (base64Url == null) throw new Error()
                              clipboard.writeText(base64Url)
                            } catch (error) {
                              dialog.showMessageBox(this.mainWindow, {
                                type: 'error',
                                message: "An error occurred when attempting to copy the Base64-encoded data URL to your clipboard.",
                                buttons: ['OK'],
                                defaultId: 0,
                              })
                            }
                            return
                          }
                        })
                        .catch(error => { throw error })
                    })
                    .catch(error => { throw error })
              })
              .catch((error) => {
                dialog.showMessageBox(this.mainWindow, {
                  type: 'error',
                  message: "The URL you entered was invalid.",
                  buttons: ['OK'],
                  defaultId: 0,
                })
              })
          },
        },
        {
          label: 'Need more space?',
          click: async () => {
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

            dialog.showMessageBox(this.mainWindow, {
              type: 'info',
              message: "You can find the best prices for hard drive disks and other physical storage on the Disk Drives website",
              buttons: links.map(link => link[0]),
              defaultId: 0,
            })
              .then((result) => {
                if (typeof links[result.response] == 'undefined') return
                const link = links[result.response]
                if (link[1] == null) return

                shell.openExternal(link[1])
              })
          }
        }
      ],
    };
    const subMenuWindowDev: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+CmdOrCtrl+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuWindowProd: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+CmdOrCtrl+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    // const subMenuHelp: MenuItemConstructorOptions = {
    //   label: 'Help',
    //   submenu: [
    //     // {
    //     //   label: 'Learn More',
    //     //   click() {
    //     //     shell.openExternal('https://electronjs.org');
    //     //   },
    //     // },
    //     // {
    //     //   label: 'Documentation',
    //     //   click() {
    //     //     shell.openExternal(
    //     //       'https://github.com/electron/electron/tree/main/docs#readme'
    //     //     );
    //     //   },
    //     // },
    //     // {
    //     //   label: 'Community Discussions',
    //     //   click() {
    //     //     shell.openExternal('https://www.electronjs.org/community');
    //     //   },
    //     // },
    //     // {
    //     //   label: 'Search Issues',
    //     //   click() {
    //     //     shell.openExternal('https://github.com/electron/electron/issues');
    //     //   },
    //     // },
    //   ],
    // };

    const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
    const subMenuWindow = isDebug ? subMenuWindowDev : subMenuWindowProd;

    return [subMenuAbout, subMenuFile, subMenuEdit, subMenuMarchiveUtilities, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          // {
          //   label: '&Open',
          //   accelerator: 'Ctrl+O',
          // },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      // {
      //   label: 'Help',
      //   submenu: [
      //     {
      //       label: 'Learn More',
      //       click() {
      //         shell.openExternal('https://electronjs.org');
      //       },
      //     },
      //     {
      //       label: 'Documentation',
      //       click() {
      //         shell.openExternal(
      //           'https://github.com/electron/electron/tree/main/docs#readme'
      //         );
      //       },
      //     },
      //     {
      //       label: 'Community Discussions',
      //       click() {
      //         shell.openExternal('https://www.electronjs.org/community');
      //       },
      //     },
      //     {
      //       label: 'Search Issues',
      //       click() {
      //         shell.openExternal('https://github.com/electron/electron/issues');
      //       },
      //     },
      //   ],
      // },
    ];

    return templateDefault;
  }
}
