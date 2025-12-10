const fs = require("fs");
const path = require("path");
const controllers = require("./controllers");

module.exports = (req, res) => {
    const { method, url } = req;

    // ---- Serve static files ----
    if (method === "GET" && url === "/") {
        return serveFile("index.html", "text/html", res);
    }
    if (method === "GET" && url === "/todo.css") {
        return serveFile("todo.css", "text/css", res);
    }
    if (method === "GET" && url === "/script.js") {
        return serveFile("script.js", "application/javascript", res);
    }

    // ---- API Routes ----
    if (method === "GET" && url === "/api/todos") {
        return controllers.getTodos(req, res);
    }

    if (method === "POST" && url === "/api/todos") {
        return controllers.addTodo(req, res);
    }

    if (method === "PUT" && url.startsWith("/api/todos/")) {
        const id = url.split("/")[3];
        return controllers.updateTodo(req, res, id);
    }

    if (method === "DELETE" && url.startsWith("/api/todos/")) {
        const id = url.split("/")[3];
        return controllers.deleteTodo(req, res, id);
    }

    res.writeHead(404);
    res.end("Not Found");
};

// Serve static files
function serveFile(filename, type, res) {
    const filePath = path.join(__dirname, "..", "public", filename);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end("File not found");
        }
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
}
