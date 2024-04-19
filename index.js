const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;

//mongoose schema
// schema (blueprint)>model>real data---in this flow mongoose can insert data
const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    required: true,
  },
  isComplete: {
    type: Boolean,
    required: true,
  },
});
//model
const Todo = mongoose.model("Todo", todoSchema);
//middleware
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://todo-user:passoftodo-user@cluster0.mqqqjra.mongodb.net/todoDB?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    await mongoose.connect(uri);
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // const todoCollection = client.db("todoDB").collection("todos");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    //get all todos
    app.get("/todos", async (req, res) => {
      // const todos = await todoCollection.find({}).toArray();
      const todos = await Todo.find({});
      res.send(todos);
    });
    //get single todo
    app.get("/todo/:id", async (req, res) => {
      const id = req.params.id;
      //option 1
      const todo = await Todo.findById(id);
      //option 2
      // const todo = await Todo.findOne({
      //   _id: id,
      // });
      res.send(todo);
    });

    //post todo
    app.post("/todo", async (req, res) => {
      const todoData = req.body;
      // const todo = await todoCollection.insertOne(todoData);

      //if i don't write tihs code then i will follow code of 55 line number code.
      // const todo = new Todo(todoData);
      // todo.save();
      const todo = await Todo.create(todoData);
      res.send(todo);
    });

    app.patch("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const todo = await Todo.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      res.send(todo);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("i am pobi!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
