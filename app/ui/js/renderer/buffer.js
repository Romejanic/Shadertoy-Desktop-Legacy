function Buffer(gl, shaderData) {
    this.gl = gl;
    this.type = type;
}

Buffer.prototype.init = function() {
    var gl = this.gl;

    switch(this.type) {
        case "image":
            break;
        default:
            throw "Unsupported type: " + this.type;
    }
};

Buffer.prototype.draw = function() {

};