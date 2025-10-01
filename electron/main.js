const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
function createWindow () { 
  const win = new BrowserWindow({ 
    width: 1080, 
    height: 720, 
    webPreferences: { 
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation : false
    } 
  });
  win.loadURL("http://localhost:3000")
} 

// React → Electron (수신)
ipcMain.on("convert script", (event, args) => {
  console.log("React에서 받은 데이터:", args);

  // Electron → React (응답)
  event.sender.send("convert script", "Electron에서 받은 데이터: " + args);
});

app.whenReady().then(() => { 
  createWindow();
});
app.on('window-all-closed', function () { 
  if (process.platform !== 'darwin') app.quit();
});