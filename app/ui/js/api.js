const SHADERTOY_URL = "https://www.shadertoy.com/api/v1/shaders/";

const QUERIES = {
    shaderList: function(pageNo, sort) {
        var shadersPerPage = 18;
        var from           = pageNo * shadersPerPage;
        return buildApiString("", ["from=" + from, "num=" + shadersPerPage, "sort=" + sort]);
    },
    shaderData: function(shaderId) {
        return buildApiString(shaderId);
    }
};

function buildApiString(queryString, parameters) {
    if(!parameters) {
        parameters = [];
    }
    parameters.push("key=" + apiKey);
    return encodeURI(SHADERTOY_URL + queryString + "?" + parameters.join("&"));
}

function makeApiRequest(url, callback) {
    console.log("querying " + url);
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            if(http.getResponseHeader("content-type") == "application/json") {
                callback(undefined, JSON.parse(http.responseText));
            } else {
                callback(undefined, http.response);
            }
        }
    };
    http.onerror = function(e) {
        callback(e, undefined);
    };
    http.open("GET", url, true);
    http.send();
}

// get API key
for(var i = 0; i < process.argv.length; i++) {
    if(process.argv[i].indexOf("apiKey=") > -1) {
        global.apiKey = process.argv[i].substring("apiKey=".length);
        break;
    }
}