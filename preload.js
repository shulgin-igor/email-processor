const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectory: () => ipcRenderer.invoke('directory:open'),
  getFiles: (path, offset) =>
    ipcRenderer.invoke('directory:getFiles', path, offset),
  openFile: path => ipcRenderer.invoke('file:open', path),
  saveUser: (email, path) => ipcRenderer.invoke('user:save', email, path),
  removeFile: path => ipcRenderer.invoke('file:remove', path),
  saveContext: (userId, context) =>
    ipcRenderer.invoke('context:save', userId, context),
  toggleProcessed: (messageId, processed) =>
    ipcRenderer.invoke('email:toggleProcessed', messageId, processed),
});
