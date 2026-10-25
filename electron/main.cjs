const { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain, Menu, nativeImage, session, shell, Tray } = require('electron');
const path = require('node:path');

const devServerUrl = 'http://127.0.0.1:5173';
const windowIcon = nativeImage.createFromDataURL(`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#334fbd"/><path d="M8 11h3l2-3h7l2 3h3v13H8z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.5" cy="17.5" r="4" fill="none" stroke="#fff" stroke-width="2"/></svg>')}`);
let mainWindow;
let tray;
let selectedSourceId;
let captureAudio = false;
let isCapturing = false;
let isQuitting = false;
let captureHandlerInstalled = false;

function assertTrustedWindow(event) {
  if (!mainWindow || event.sender !== mainWindow.webContents) {
    throw new Error('Bu işlem yalnızca Velex Clip penceresinden kullanılabilir.');
  }
}

async function listCaptureSources() {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 480, height: 270 },
    fetchWindowIcons: true,
  });
  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL(),
    icon: source.appIcon?.toDataURL() || '',
  }));
}

function installCaptureHandler() {
  if (captureHandlerInstalled) return;
  session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {
    try {
      const senderWindow = BrowserWindow.fromWebContents(request.frame?.webContents || mainWindow?.webContents);
      if (!mainWindow || senderWindow !== mainWindow || !selectedSourceId) {
        callback({});
        return;
      }

      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
      const source = sources.find((candidate) => candidate.id === selectedSourceId);
      if (!source) {
        selectedSourceId = undefined;
        callback({});
        return;
      }

      isCapturing = true;
      refreshTrayMenu();
      const options = { video: source };
      if (captureAudio) options.audio = 'loopback';
      callback(options);
    } catch (error) {
      console.error('Ekran yakalama kaynağı açılamadı:', error);
      callback({});
    }
  }, { useSystemPicker: false });
  captureHandlerInstalled = true;
}

function registerIpcHandlers() {
  ipcMain.handle('capture:list-sources', async (event) => {
    assertTrustedWindow(event);
    return listCaptureSources();
  });

  ipcMain.handle('capture:select-source', async (event, sourceId) => {
    assertTrustedWindow(event);
    if (typeof sourceId !== 'string' || sourceId.length > 512) {
      throw new Error('Geçerli bir yakalama kaynağı seç.');
    }
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
    if (!sources.some((source) => source.id === sourceId)) {
      throw new Error('Bu ekran veya pencere artık kullanılamıyor. Kaynak listesini yenile.');
    }
    selectedSourceId = sourceId;
    return true;
  });

  ipcMain.handle('capture:set-audio', (event, enabled) => {
    assertTrustedWindow(event);
    if (typeof enabled !== 'boolean') throw new Error('Ses yakalama seçimi geçersiz.');
    captureAudio = enabled;
  });

  ipcMain.on('capture:state', (event, active) => {
    assertTrustedWindow(event);
    if (typeof active !== 'boolean') return;
    isCapturing = active;
    if (!active) selectedSourceId = undefined;
    refreshTrayMenu();
  });

  ipcMain.handle('app:get-version', (event) => {
    assertTrustedWindow(event);
    return app.getVersion();
  });

  ipcMain.handle('app:open-external', async (event, url) => {
    assertTrustedWindow(event);
    if (typeof url !== 'string' || (!url.startsWith('https://') && !url.startsWith('http://'))) {
      throw new Error('Geçersiz web adresi.');
    }
    await shell.openExternal(url);
    return true;
  });
}

function refreshTrayMenu() {
  if (!tray) return;
  const captureItem = isCapturing
    ? {
        label: 'Kaydı durdur',
        click: () => mainWindow?.webContents.send('capture:stop'),
      }
    : {
        label: 'Yakalama sayfasını aç',
        click: () => showWindow(),
      };
  const menu = Menu.buildFromTemplate([
    { label: 'Velex Clip', enabled: false },
    { type: 'separator' },
    captureItem,
    { label: 'Velex Clip’i göster', click: () => showWindow() },
    { type: 'separator' },
    {
      label: isCapturing ? 'Kaydı durdur ve çık' : 'Çıkış',
      click: () => {
        if (isCapturing) mainWindow?.webContents.send('capture:stop');
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);
  tray.setToolTip(isCapturing ? 'Velex Clip — kayıt devam ediyor' : 'Velex Clip');
}

function createTray() {
  tray = new Tray(windowIcon);
  tray.on('click', () => showWindow());
  tray.on('double-click', () => showWindow());
  refreshTrayMenu();
}

function showWindow() {
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 620,
    title: 'Velex Clip',
    icon: windowIcon,
    backgroundColor: '#f3f3ef',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isDevServer = !app.isPackaged && url.startsWith(devServerUrl);
    const isAppFile = url.startsWith('file://') && (url.includes('dist/index.html') || url.includes('dist\\index.html') || url.includes('app.asar'));
    if (!isDevServer && !isAppFile) event.preventDefault();
  });
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow.webContents.toggleDevTools();
    }
  });
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message} (${sourceId}:${line})`);
  });
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, description, validatedURL) => {
    console.error(`Velex Clip arayüzü yüklenemedi (${errorCode}): ${description} - ${validatedURL}`);
  });
  mainWindow.on('close', (event) => {
    if (isCapturing && !isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      tray?.displayBalloon({
        title: 'Kayıt devam ediyor',
        content: 'Velex Clip arka planda kayda devam ediyor. Tepsi simgesinden kaydı durdurabilirsin.',
      });
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    mainWindow.loadURL(devServerUrl);
  }
}

app.whenReady().then(() => {
  installCaptureHandler();
  registerIpcHandlers();
  createWindow();
  createTray();

  const registered = globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (isCapturing) mainWindow?.webContents.send('capture:save');
    else showWindow();
  });
  if (!registered) console.error('Global kısayol Ctrl+Shift+S kullanılamıyor; başka uygulama bu kısayolu kullanıyor olabilir.');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    showWindow();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
  tray?.destroy();
});
