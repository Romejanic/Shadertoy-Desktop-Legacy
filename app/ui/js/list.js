const { ipcRenderer } = require("electron");

function loadAllShaders() {
    var sort = document.getElementById("sort").value;
    var page = 0;

    makeApiRequest(QUERIES.shaderList(page, sort), (err, resp) => {
        if(err || typeof resp !== "object") {
            console.error(err, resp);
            alert("An error occoured loading the shader list!\n\nError: " + err);
            return;
        }
        var shaders = resp.Results;
        var list    = document.querySelector(".shader-list");

        // clear list
        while(list.firstChild) {
            list.removeChild(list.firstChild);
        }

        shaders.forEach((shaderId) => {
            var div = document.createElement("div");
            div.className = "shader loading";
            div.title     = shaderId;
            div.setAttribute("data-shader-id", shaderId);
            list.appendChild(div);
        });

        loadShaderMetadata(list);
    });
}

function loadShaderMetadata(list) {
    var loading = document.querySelector(".shader.loading");
    if(!loading) {
        return;
    }
    var shaderId = loading.getAttribute("data-shader-id");
    makeApiRequest(QUERIES.shaderData(shaderId), (err, resp) => {
        if(err || typeof resp !== "object") {
            console.error("Error loading shader data:", err);
            list.removeChild(loading);
            loadShaderMetadata(list);
            return;
        }
        var data  = resp.Shader.info;
        var div   = createShaderNode(shaderId, data.name, data.username);
        loading.innerHTML = div.innerHTML;
        loading.onclick   = div.onclick;
        loading.classList.remove("loading");
        loadShaderMetadata(list);
    });
}

function createShaderNode(shaderId, shaderName, authorName) {
    var div = document.createElement("div");
    div.className = "shader";
    div.title = shaderId;
    div.setAttribute("data-shader-id", shaderId);

    var thumb = document.createElement("img");
    thumb.className = "thumb";
    thumb.src = "https://shadertoy.com/media/shaders/" + shaderId + ".jpg";
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

    div.onclick = function() {
        console.log("clicked on " + shaderId);
        ipcRenderer.send("open-shader", shaderId);
    };

    return div;
}

window.addEventListener("load", () => {
    loadAllShaders();
});