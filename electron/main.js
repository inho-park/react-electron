const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 절대경로 지정
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 개발용 React 서버로 연결
  win.loadURL('http://localhost:3000');

  win.webContents.openDevTools(); // 필요하면 콘솔 확인용
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});