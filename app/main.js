const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const api  = require("../api-key.json");

const windows = {
    mainWindow: undefined,
    shaderWindows: [],

    createMainWindow: function() {
        if(windows.mainWindow) {
            return;
        }
        var win = new BrowserWindow({
            title: "Shadertoy",
            minWidth: 200,
            minHeight: 200,
            width: 1024,
            height: 640,
            resizable: true,
            webPreferences: {
                experimentalFeatures: true,
                additionalArguments: [ "apiKey=" + api.apiKey ]
            }
        });
        win.on("closed", () => {
            delete windows.mainWindow;
        });
        win.loadURL("file://" + path.join(__dirname, "ui", "index.html"));
        windows.mainWindow = win;
    },

    openShaderWindow: function(shaderId) {
        var win = new BrowserWindow({
            title: "Shader",
            minWidth: 200,
            minHeight: 200,
            width: 500,
            height: 350,
            resizable: true,
            webPreferences: {
                experimentalFeatures: true,
                additionArguments: [ "shaderId=" + shaderId, "apiKey=" + api.apiKey ]
            }
        });
        win.on("closed", () => {
            windows.shaderWindows.splice(windows.shaderWindows.indexOf(win), 1);
        });
        win.loadURL("file://" + path.join(__dirname, "ui", "shader.html"));
        windows.shaderWindows.push(win);
    },

    anyWindowsOpen: function() {
        if(windows.mainWindow) {
            return true;
        }
        return windows.shaderWindows.length > 0;
    }
};

process.isMac = process.platform.indexOf("darwin") > -1;

app.on("ready", windows.createMainWindow);
app.on("activate", windows.createMainWindow);
app.on("window-all-closed", () => {
    if(!process.isMac && !windows.anyWindowsOpen()) {
        app.quit();
    }
});

ipcMain.on("open-shader", (event, shaderId) => {
    windows.openShaderWindow(shaderId);
});