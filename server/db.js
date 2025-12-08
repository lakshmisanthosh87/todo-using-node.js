const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db;

async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db("todosDB");
    console.log("MongoDB Connected");

    return db;
}

module.exports = connectDB;
