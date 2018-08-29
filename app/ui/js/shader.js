const { ipcRenderer, remote } = require("electron");

var shaderManager = {
    shaderData: undefined,
    canvas: undefined,
    glContext: undefined,

    vao: undefined,
    vbo: undefined,
    programs: {},

    time: 0,
    delta: 1,
    last: 0,

    init: function() {
        if(!this.shaderData) {
            alert("Cannot load shader, no data exists!");
            remote.getCurrentWindow().close();
            return;
        }

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

        var passes = this.shaderData.renderpass;
        passes.forEach((pass) => {
            this.programs[pass.type] = new ShaderProgram(this.glContext, pass);
        });

        var gl = this.glContext;
        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        var vertices = [
            -1, -1,
             1, -1,
            -1,  1,

            -1,  1,
             1, -1,
             1,  1
        ];
        this.elementCount = vertices.length / 2;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        this.last = Date.now();
        this.doDrawFrame();
    },

    drawFrame: function(gl, w, h) {
        var time   = Date.now();
        this.delta = (time - this.last) / 1000;
        this.last  = time;
        this.time += this.delta;

        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindVertexArray(this.vao);
        gl.enableVertexAttribArray(0);

        this.programs["image"].bind();
        this.setUniforms(gl, this.programs["image"], w, h);
        this.drawQuad();
        this.programs["image"].unbind();
        // TODO: draw all buffers/shaders

        gl.disableVertexAttribArray(0);
        gl.bindVertexArray(null);
    },

    drawQuad: function() {
        this.glContext.drawArrays(this.glContext.TRIANGLES, 0, this.elementCount);
    },

    doDrawFrame: function() {
        var canvas    = shaderManager.canvas;
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        shaderManager.drawFrame(shaderManager.glContext, canvas.width, canvas.height);
        requestAnimationFrame(shaderManager.doDrawFrame);
    },

    destroy: function() {
        this.programs.forEach((program) => {
            program.delete();
        });
        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteBuffer(this.vbo);
    },

    // TODO: actual data and samplers
    setUniforms: function(gl, shader, w, h) {
        gl.uniform3f(shader.uniformLocation("iResolution"), w, h, 0);
        gl.uniform1f(shader.uniformLocation("iTime"), this.time);
        gl.uniform1f(shader.uniformLocation("iTimeDelta"), this.delta);
        gl.uniform1i(shader.uniformLocation("iFrame"), 0);
        for(var i = 0; i < 4; i++) {
            gl.uniform1f(shader.uniformLocation("iChannelTime[" + i + "]"), 0);
            gl.uniform3f(shader.uniformLocation("iChannelResolution[" + i + "]"), 0, 0, 0);
        }
        gl.uniform4f(shader.uniformLocation("iMouse"), 0, 0, 0, 0);
        gl.uniform4f(shader.uniformLocation("iDate"), 0, 0, 0, 0);
        gl.uniform1f(shader.uniformLocation("iSampleRate"), 44100);
    }
};

ipcRenderer.once("shader-data", (event, shader) => {
    shaderManager.shaderData = shader;

    document.title = shader.info.name + " by " + shader.info.username;
    document.querySelector(".shader-name").innerText = shader.info.name;
    document.querySelector(".author").innerText      = shader.info.username;
    document.getElementById("views").innerText       = String(shader.info.viewed);
    document.getElementById("likes").innerText       = String(shader.info.likes);

    shaderManager.init();
});

window.addEventListener("beforeunload", () => {
    shaderManager.destroy();
});