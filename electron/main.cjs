const { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain, Menu, nativeImage, session, shell, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

const devServerUrl = 'http://127.0.0.1:5173';
const logoSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none"><rect x="2" y="2" width="60" height="60" rx="14" fill="#0d1424" stroke="#38bdf8" stroke-width="2.5"/><path d="M14 16 H24 L32 38 L25 48 L14 16 Z" fill="#38bdf8"/><path d="M50 16 H40 L32 38 L39 48 L50 16 Z" fill="#818cf8"/><path d="M25 48 L32 54 L39 48 L32 37 Z" fill="#2563eb"/><path d="M29 21 L39 27 L29 33 Z" fill="#ffffff"/><circle cx="32" cy="18" r="4" fill="#ff4d4d"/><circle cx="32" cy="18" r="1.8" fill="#ffffff"/></svg>';
const windowIcon = nativeImage.createFromDataURL(`data:image/svg+xml,${encodeURIComponent(logoSvg)}`);
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

autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = false;
autoUpdater.autoInstallOnAppQuit = true;

function sendToWindow(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    sendToWindow('updater:status', { status: 'checking' });
  });

  autoUpdater.on('update-available', (info) => {
    sendToWindow('updater:status', {
      status: 'available',
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    sendToWindow('updater:status', {
      status: 'not-available',
      version: info.version,
    });
  });

  autoUpdater.on('error', (err) => {
    sendToWindow('updater:status', {
      status: 'error',
      message: err == null ? 'Bilinmeyen hata' : (err.message || String(err)),
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    sendToWindow('updater:status', {
      status: 'downloading',
      percent: Math.round(progressObj.percent),
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    sendToWindow('updater:status', {
      status: 'downloaded',
      version: info.version,
    });
  });
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

  const handleCheckForUpdates = async (event) => {
    assertTrustedWindow(event);
    if (!app.isPackaged) {
      sendToWindow('updater:status', {
        status: 'dev',
        message: 'Geliştirme modunda güncelleme denetimi çalışmaz. Paketlenmiş uygulama gerekir.',
      });
      return { isDev: true, message: 'Geliştirme modunda güncelleme denetimi çalışmaz. Paketlenmiş uygulama gerekir.' };
    }
    try {
      sendToWindow('updater:status', { status: 'checking' });
      const res = await autoUpdater.checkForUpdates();
      return { success: true, updateInfo: res?.updateInfo };
    } catch (error) {
      sendToWindow('updater:status', { status: 'error', message: error.message });
      return { success: false, error: error.message };
    }
  };

  ipcMain.handle('updater:check', handleCheckForUpdates);
  ipcMain.handle('check-for-updates', handleCheckForUpdates);

  ipcMain.handle('updater:download', async (event) => {
    assertTrustedWindow(event);
    if (!app.isPackaged) throw new Error('Geliştirme modunda güncelleme indirilemez.');
    sendToWindow('updater:status', { status: 'downloading', percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 });
    try {
      await autoUpdater.downloadUpdate();
      return true;
    } catch (error) {
      sendToWindow('updater:status', { status: 'error', message: error.message || String(error) });
      throw error;
    }
  });

  ipcMain.handle('updater:quit-and-install', (event) => {
    assertTrustedWindow(event);
    isQuitting = true;
    autoUpdater.quitAndInstall(false, true);
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
  setupAutoUpdater();
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
