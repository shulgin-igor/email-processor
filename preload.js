const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getDirectories: ids => ipcRenderer.invoke('directory:list', ids),
  openDirectory: () => ipcRenderer.invoke('directory:open'),
  getFiles: path => ipcRenderer.invoke('directory:getFiles', path),
  openFile: path => ipcRenderer.invoke('file:open', path),
  saveUser: (email, path) => ipcRenderer.invoke('user:save', email, path),
  removeFile: path => ipcRenderer.invoke('file:remove', path),
  saveContext: (userId, context) =>
    ipcRenderer.invoke('context:save', userId, context),
  toggleProcessed: (messageId, processed) =>
    ipcRenderer.invoke('email:toggleProcessed', messageId, processed),

  onImportProgress: cb => ipcRenderer.on('import:progress', cb),
});
