// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // 메시지 전송
  sendConvertScript: (data) =>
    ipcRenderer.send("convert script", JSON.stringify(data)),

  // 메시지 수신 (React에서 콜백 등록)
  onConvertScript: (callback) => {
    ipcRenderer.on("convert success", (event, args) => console.log(args));
  },
});