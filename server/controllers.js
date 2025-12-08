const connectDB = require("./db");
const { ObjectId } = require("mongodb");

module.exports = {

    async getTodos(req, res) {
        const db = await connectDB();
        const todos = await db.collection("todos").find().toArray();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(todos));
    },

    async addTodo(req, res) {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", async () => {
            const { text } = JSON.parse(body);
            const db = await connectDB();

            const newTodo = { text, completed: false };
            const result = await db.collection("todos").insertOne(newTodo);

            newTodo._id = result.insertedId;

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newTodo));
        });
    },

    async updateTodo(req, res, id) {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", async () => {
            const { completed } = JSON.parse(body);
            const db = await connectDB();

            const result = await db.collection("todos").findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { completed } },
                { returnDocument: "after" }
            );

            if (!result.value) {
                res.writeHead(404);
                return res.end("Todo not found");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result.value));
        });
    },

    async deleteTodo(req, res, id) {
        const db = await connectDB();

        await db.collection("todos").deleteOne({ _id: new ObjectId(id) });

        res.writeHead(200);
        res.end("Deleted");
    }
};
