const fs = require("fs");
const path = require("path");

const storagePath = path.join(__dirname, "storage.json");

// Read all todos
function readTodos() {
    if (!fs.existsSync(storagePath)) return [];
    return JSON.parse(fs.readFileSync(storagePath));
}

// Save todos
function saveTodos(todos) {
    fs.writeFileSync(storagePath, JSON.stringify(todos, null, 2));
}

module.exports = {

    getTodos(req, res) {
        const todos = readTodos();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(todos));
    },

    addTodo(req, res) {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            const { text } = JSON.parse(body);
            const todos = readTodos();

            const newTodo = {
                id: Date.now().toString(),
                text
            };

            todos.push(newTodo);
            saveTodos(todos);

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newTodo));
        });
    },

    deleteTodo(req, res, id) {
        let todos = readTodos();
        todos = todos.filter(t => t.id !== id);
        saveTodos(todos);

        res.writeHead(200);
        res.end("Deleted");
    }
};
