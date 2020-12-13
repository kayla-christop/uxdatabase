const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
    let url = request.url;

    if (url == "/favicon.ico") {
        return;
    }

    if (url == "/") {
        url = "/index.html";
    }

    let body;
    try {
        body = fs.readFileSync("." + url).toString();
    } catch (error) {
        body = "404 Not Found";
    }
    

    response.writeHead(200, {
        "content-type": "text/html"
    });
    response.end(body);
}).listen(env.PORT);

console.log("Server Started!");