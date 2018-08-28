function createShaderNode(shaderId, shaderName, authorName) {
    var div = document.createElement("div");
    div.className = "shader";
    div.title = shaderId;
    div.setAttribute("data-shader-id", shaderId);

    var thumb = document.createElement("img");
    thumb.className = "thumb";
    thumb.src = "https://shadertoy.com/media/shaders/MlyyzW.jpg";
    div.appendChild(thumb);

    var name = document.createElement("span");
    name.className = "name";
    name.innerText = shaderName;
    div.appendChild(name);
    div.appendChild(document.createElement("br"));

    var by = document.createElement("span");
    by.innerText = "by ";
    var author = document.createElement("span");
    author.className = "author";
    author.innerText = authorName;
    by.appendChild(author);
    div.appendChild(by);

    return div;
}