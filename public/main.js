const { app, BrowserWindow, ipcMain, shell } = require("electron")

const path = require('path')
const isDev = require("electron-is-dev");
const os = require("os");
const fs = require("fs");

require("@electron/remote/main").initialize();

const defaultConfig = {
    title: "Daraz Label Printing",
    icon: path.join(__dirname, '/icon.ico'),
    autoHideMenuBar: true,
    width: 1200,
    height: 800
}

const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        ...defaultConfig,
        webPreferences: {
            enableRemoteModule: true,
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    const splash = new BrowserWindow({
        ...defaultConfig,
        fullscreenable: false,
        alwaysOnTop: true,
    });

    splash.loadFile(path.join(__dirname, '/splash.html'));
    mainWindow.loadURL(startUrl)
    mainWindow.setSkipTaskbar(true);
    mainWindow.minimize();
    if (!isDev) {
        splash.removeMenu();
        mainWindow.removeMenu();
    }

    mainWindow.once('ready-to-show', () => {
        splash.destroy();
        mainWindow.setSkipTaskbar(false);
        mainWindow.show();
    });


    // when worker window is ready
    ipcMain.on("readyToPrintPDF", (event) => {
        const pdfPath = path.join(os.homedir(), `/Downloads/'Daraz_${new Date().getTime()}_Label.pdf`);
        // Use default printing options
        mainWindow.webContents.printToPDF({
            landscape: true,
            displayHeaderFooter: false,
            printBackground: true,
            color: true,
            pageSize: 'A4',
            margins: {
                marginType: "printableArea"
            }
        }).then((data) => {
            fs.writeFile(pdfPath, data, function (error) {
                if (error) {
                    throw error
                }
                shell.openPath(pdfPath)
                event.sender.send('wrote-pdf', pdfPath)
            })
        }).catch((error) => {
            throw error;
        })
    });

}

app.removeAllListeners('ready');
app.on("ready", createWindow)

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})

