import {
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import buildDarwinTemplate from './darwin';
import buildDefaultTemplate from './default';

export interface WindowMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: WindowMenuItemConstructorOptions[] | Menu;
}

export default class WindowMenuBuilder {
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
        ? buildDarwinTemplate(this.mainWindow)
        : buildDefaultTemplate(this.mainWindow);

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
}
