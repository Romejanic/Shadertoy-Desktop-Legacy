const { app, BrowserWindow } = require("electron");
const path = require("path");
const api  = require("../api-key.json");

const windows = {
    mainWindow: undefined,

    createMainWindow: function() {
        if(windows.mainWindow) {
            return;
        }
        var win = new BrowserWindow({
            title: "Shadertoy",
            minWidth: 200,
            minHeight: 200,
            resizable: true
        });
        win.on("closed", () => {
            delete windows.mainWindow;
        });
        win.loadURL("file://" + path.join(__dirname, "ui", "index.html"));
        windows.mainWindow = win;
    }
};

process.isMac = process.platform.indexOf("darwin") > -1;

app.on("ready", windows.createMainWindow);
app.on("activate", windows.createMainWindow);
app.on("window-all-closed", () => {
    if(!process.isMac) {
        app.quit();
    }
});

console.log(api.apiKey);