const { ipcRenderer } = require("electron");
var shaderData;

ipcRenderer.once("shader-data", (event, shader) => {
    shaderData = shader;
    document.title = shader.info.name + " by " + shader.info.username;
});