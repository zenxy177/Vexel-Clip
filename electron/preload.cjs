const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('velexDesktop', Object.freeze({
  listSources: () => ipcRenderer.invoke('capture:list-sources'),
  selectSource: (sourceId) => ipcRenderer.invoke('capture:select-source', sourceId),
  setCaptureAudio: (enabled) => ipcRenderer.invoke('capture:set-audio', enabled),
  setCaptureActive: (active) => ipcRenderer.send('capture:state', active),
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
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),
}));
