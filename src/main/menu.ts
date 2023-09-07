import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
  clipboard,
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
      label: 'marchive',
      submenu: [
        {
          label: 'About marchive',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        // { label: 'Services', submenu: [] },
        // { type: 'separator' },
        {
          label: 'Hide marchive',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => { cleanupAndQuit() },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
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
        }
      ],
    };
    const subMenuWindowDev: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuWindowProd: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
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

    return [subMenuAbout, subMenuEdit, subMenuMarchiveUtilities, subMenuWindow];
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
