import { app, BrowserWindow, shell, Menu, dialog } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'Cloud Stacker',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.removeMenu();

  // Load the local index.html relative to project root
  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function clearLocalStorageAndReload() {
  if (!mainWindow) return;

  const { response } = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    buttons: ['Clear', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    title: 'Clear Local Storage',
    message: 'This will delete all local storage for the app.',
    detail: 'You cannot undo this action.',
  });

  if (response !== 0) return;

  try {
    await mainWindow.webContents.session.clearStorageData({ storages: ['localstorage'] });
    await dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['OK'],
      defaultId: 0,
      title: 'Local Storage Cleared',
      message: 'Local storage has been cleared.',
    });
    mainWindow.reload();
  } catch (error) {
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      buttons: ['OK'],
      defaultId: 0,
      title: 'Error Clearing Storage',
      message: 'An error occurred while clearing local storage.',
      detail: String(error),
    });
  }
}

function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              {
                label: 'Clear Local Storage',
                accelerator: 'Shift+Command+Backspace',
                click: () => clearLocalStorageAndReload(),
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    // Minimal menu for non-macOS
    {
      label: 'File',
      submenu: [
        ...(isMac ? [] : [{ role: 'quit' }]),
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.setName('Cloud Stacker');

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.setAboutPanelOptions({
      applicationName: 'Cloud Stacker',
      applicationVersion: app.getVersion(),
      iconPath: path.join(__dirname, '..', 'assets', 'images', 'logo.png'),
      credits: 'Built by Superside',
      copyright: '© ' + new Date().getFullYear() + ' LightEdge',
    });
  }
  createMainWindow();
  buildMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


