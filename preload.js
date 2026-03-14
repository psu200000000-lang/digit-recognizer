const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  recognize:    (data)    => ipcRenderer.invoke('recognize', data),
  getHistory:   ()        => ipcRenderer.invoke('get-history'),
  saveHistory:  (history) => ipcRenderer.invoke('save-history', history),
  clearHistory: ()        => ipcRenderer.invoke('clear-history'),
  getApiKey:    ()        => ipcRenderer.invoke('get-api-key'),
  saveApiKey:   (key)     => ipcRenderer.invoke('save-api-key', key)
});
