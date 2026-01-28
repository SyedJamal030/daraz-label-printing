const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  printPDF: () => ipcRenderer.send("readyToPrintPDF"),
  onPdfSaved: (callback) => (
    ipcRenderer.on("wrote-pdf", (event, path) => callback(path))
  ),
});
