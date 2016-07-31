import { app, BrowserWindow, ipcMain as ipc } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import localShortcut from 'electron-localshortcut';

import constants from './constants.js';
import config from './config.js';

import createUrlMapper from './main/url-mapper.js';
import createProxy from './main/proxy.js';

if (squirrelStartup) {
  process.exit(0); // Don't run James if it's just being installed/updated/etc
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;
let urlMapper = null;
let proxy = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false
  });

  console.log('creating mapper');
  urlMapper = createUrlMapper({
    filename: `${constants.USER_DATA}/data.nedb`,
    autoload: true
  });

  urlMapper.on('status', ({status}) => {
    console.log('root-mapper-status', status);
  });

  console.log('creating proxy');
  proxy = createProxy(config, urlMapper.urlMapper);

  proxy.on('status', ({status}) => {
    console.log('root-proxy-status', status);
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load');
    mainWindow.show();

    proxy.on('status', ({status, reason}) => {
      mainWindow.webContents.send('proxy-status', {
        status,
        reason
      });
    });

    proxy.on('update', ({requestData}) => {
      mainWindow.webContents.send('proxy-sync', {
        requestData
      });
    });

    urlMapper.on('update', ({mappings}) => {
      mainWindow.webContents.send('mapper-sync', {
        mappings
      });
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipc.on('keyboard-listen', (event, {key}) => {
  localShortcut.register(mainWindow, key, () => event.sender.send('keyboard-press', key));
});
