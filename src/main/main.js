const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const os = require("os");
const fs = require("fs");

require("@electron/remote/main").initialize();

let mainWindow;
let splashWindow;

const appIcon = path.join(__dirname, isDev ? '../../public/icons/icon.ico' : '../../build/icons/icon.ico');
const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../../build/index.html')}`

const WINDOW_CONFIG = {
  title: "Daraz Label Printing",
  width: 1200,
  height: 800,
  autoHideMenuBar: true,
  icon: appIcon,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, "preload.js"),
  },
};

const createWindows = () => {
  mainWindow = new BrowserWindow({ ...WINDOW_CONFIG, show: false });
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    icon: appIcon,
    transparent: true,
    alwaysOnTop: true,
  });

  const splashUrl = path.join(__dirname, "splash.html");

  splashWindow.loadFile(splashUrl);
  mainWindow.loadURL(startUrl);

  const MIN_SPLASH_TIME = 2000; // 2 seconds
  const startTime = Date.now();

  mainWindow.once("ready-to-show", () => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    const remainingTime = Math.max(0, MIN_SPLASH_TIME - timeElapsed);

    setTimeout(() => {
      if (splashWindow) splashWindow.destroy();
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);
    }, remainingTime);
  });

  if (mainWindow && process.platform === "win32") {
    mainWindow.setIcon(appIcon);
  }

  if (splashWindow && process.platform === "win32") {
    splashWindow.setIcon(appIcon);
  }
};

ipcMain.on("readyToPrintPDF", (event) => {
  const downloadPath = path.join(
    os.homedir(),
    "Downloads",
    `Daraz_${Date.now()}_Label.pdf`,
  );

  mainWindow.webContents
    .printToPDF({
      landscape: true,
      displayHeaderFooter: false,
      printBackground: false,
      margins: { marginType: "none" },
      pageSize: "A4",
    })
    .then((data) => {
      fs.writeFile(downloadPath, data, (error) => {
        if (error) {
          console.error("Failed to save PDF:", error);
          return;
        }
        shell.openPath(downloadPath);
        event.sender.send("wrote-pdf", downloadPath);
      });
    })
    .catch((err) => console.error("PDF Export Error:", err));
});

app.on("ready", createWindows);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindows();
});
