const express = require("express");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const app = express();
const port = 5000;

//mongoose schema
//todo schema (blueprint)>model>real data---in this flow mongoose can insert data
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
//todoModel
const Todo = mongoose.model("Todo", todoSchema);

//user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//userModel
const User = mongoose.model("User", userSchema);
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

    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const todos = await Todo.findByIdAndDelete(id);
      res.send("Deleted successfuly");
    });

    //register user
    app.post("/register", async (req, res) => {
      const userData = req.body;
      // const user = await userCollection.insertOne(userData);

      //if i don't write tihs code then i will follow code of 55 line number code.
      // const user = new User(userData);
      // user.save();
      const user = await User.create(userData);
      res.send(user);
    });
    //login user
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({
        email,
        password,
      });
      if (user) {
        const payload = {
          name: user.name,
          email: user.email,
        };
        const privateKey = "passofpobi";
        const expirationTime = "1d";
        const accessToken = jwt.sign(payload, privateKey, {
          expiresIn: expirationTime,
        });
        const userResponse = {
          message: "Logged in successfuly",
          data: {accessToken},
        };
        res.send(userResponse);
      }
      res.send("email or password incorrect!");
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
