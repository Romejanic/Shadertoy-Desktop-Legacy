function ShaderProgram(gl, pass) {
    this.gl   = gl;
    this.pass = pass.name;

    this.program    = gl.createProgram();
    this.vertShader = gl.createShader(gl.VERTEX_SHADER);
    this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(this.vertShader, ShaderProgram.genVertexSource());
    gl.shaderSource(this.fragShader, ShaderProgram.genFragmentSource(pass));
    gl.compileShader(this.vertShader);
    gl.compileShader(this.fragShader);

    var errors = "";
    if(!gl.getShaderParameter(this.vertShader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(this.vertShader);
        errors += "Failed to compile vertex shader!\n" + log;
    }
    if(!gl.getShaderParameter(this.fragShader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(this.fragShader);
        errors += "Failed to compile fragment shader!\n" + log;
    }

    gl.attachShader(this.program, this.vertShader);
    gl.attachShader(this.program, this.fragShader);
    gl.linkProgram(this.program);

    if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        var log = gl.getProgramInfoLog(this.program);
        errors += "Failed to link program!\n" + log;
    }

    if(errors.length > 0) {
        alert("One or more errors occoured loading the pass: " + pass.name + "!\n\n" + errors);
        console.error("Errors in pass: " + pass.name + "\n" + errors);
    }

    gl.detachShader(this.program, this.vertShader);
    gl.detachShader(this.program, this.fragShader);
    gl.deleteShader(this.vertShader);
    gl.deleteShader(this.fragShader);

    delete this.vertShader;
    delete this.fragShader;

    this.uniforms = {};
}

ShaderProgram.prototype.bind = function() {
    this.gl.useProgram(this.program);
};

ShaderProgram.prototype.unbind = function() {
    this.gl.useProgram(null);
};

ShaderProgram.prototype.delete = function() {
    this.gl.deleteProgram(this.program);
    delete this.program;
};

ShaderProgram.prototype.uniformLocation = function(name) {
    if(typeof this.uniforms[name] !== "undefined") {
        return this.uniforms[name];
    }
    var loc = this.gl.getUniformLocation(this.program, name);
    if(!loc) {
        console.error("Uniform variable " + name + " not found!");
    }
    this.uniforms[name] = loc;
    return loc;
};

ShaderProgram.genVertexSource = function() {
    return `#version 300 es
    precision mediump float;

    layout(location = 0) in vec2 vertex;
    out vec2 v_texCoords;

    void main() {
        gl_Position = vec4(vertex, 0., 1.);
        v_texCoords = vertex * .5 + .5;
    }
    `;
};

ShaderProgram.genFragmentSource = function(pass) {
    var samplers = ""; // TODO: add input

    return `#version 300 es
    precision mediump float;

    layout(location = 0) out vec4 out_fragColor;
    in vec2 v_texCoords;

    #define __SHADERTOY_DESKTOP__

    uniform vec3 iResolution;
    uniform float iTime;
    uniform float iTimeDelta;
    uniform int   iFrame;
    uniform float iChannelTime[4];
    uniform vec3  iChannelResolution[4];
    uniform vec4  iMouse;
    ` + samplers + `
    uniform vec4  iDate;
    uniform float iSampleRate;

    ` + pass.code + `

    void main() {
        vec2 pixelCoords = iResolution.xy * v_texCoords;
        mainImage(out_fragColor, pixelCoords);
    }
    `;
}