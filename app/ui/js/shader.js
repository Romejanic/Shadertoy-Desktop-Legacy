const { ipcRenderer, remote } = require("electron");

var shaderManager = {
    shaderData: undefined,
    canvas: undefined,
    glContext: undefined,

    init: function() {
        this.canvas = document.getElementById("main");
        this.glContext = this.canvas.getContext("webgl2");
        if(!this.glContext) {
            this.glContext = this.canvas.getContext("experimental-webgl2");
        }
        if(!this.glContext) {
            alert("Failed to create WebGL context!");
            remote.getCurrentWindow().close();
            return;
        }

        this.glContext.clearColor(0.4, 0.6, 0.9, 1);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    }
};

window.addEventListener("load", () => {
    shaderManager.init();
});

ipcRenderer.once("shader-data", (event, shader) => {
    shaderManager.shaderData = shader;

    document.title = shader.info.name + " by " + shader.info.username;
    document.querySelector(".shader-name").innerText = shader.info.name;
    document.querySelector(".author").innerText      = shader.info.username;
    document.getElementById("views").innerText       = String(shader.info.viewed);
    document.getElementById("likes").innerText       = String(shader.info.likes);
});