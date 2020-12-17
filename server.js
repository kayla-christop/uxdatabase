const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
    let url = request.url;

    if (url == "/favicon.ico") {
        response.writeHead(200, {
            "content-type": "image/x-icon"
        });
        fs.createReadStream("./favicon.ico").pipe(response);
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
}).listen(process.env.PORT);

console.log("Server Started!");