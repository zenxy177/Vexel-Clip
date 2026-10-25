const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('velexDesktop', Object.freeze({
  listSources: () => ipcRenderer.invoke('capture:list-sources'),
  selectSource: (sourceId) => ipcRenderer.invoke('capture:select-source', sourceId),
  setCaptureAudio: (enabled) => ipcRenderer.invoke('capture:set-audio', enabled),
  setCaptureActive: (active) => ipcRenderer.send('capture:state', active),
  getCloudConfigs: () => ipcRenderer.invoke('cloud-config:read'),
  saveCloudConfigs: (configs) => ipcRenderer.invoke('cloud-config:write', configs),
  onSaveShortcut: (callback) => {
    if (typeof callback !== 'function') throw new TypeError('Klavye kısayolu callback gerektirir.');
    const listener = () => callback();
    ipcRenderer.on('capture:save', listener);
    return () => ipcRenderer.removeListener('capture:save', listener);
  },
  onStopCapture: (callback) => {
    if (typeof callback !== 'function') throw new TypeError('Durdurma callback gerektirir.');
    const listener = () => callback();
    ipcRenderer.on('capture:stop', listener);
    return () => ipcRenderer.removeListener('capture:stop', listener);
  },
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download'),
  quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),
  onUpdaterStatus: (callback) => {
    if (typeof callback !== 'function') throw new TypeError('Callback gerektirir.');
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('updater:status', listener);
    return () => ipcRenderer.removeListener('updater:status', listener);
  },
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),
}));
