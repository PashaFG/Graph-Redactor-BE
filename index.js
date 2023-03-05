import express, { json } from "express";
import { MongoClient } from "mongodb";

import users from "./DB/users.js";
import branches from "./DB/branches.js";
import rows from "./DB/rows.js";

import cors from 'cors'
const app = express()
const parser = express.json()
app.use(cors({
  origin: '*'
}));


const Mongo = new MongoClient("mongodb://127.0.0.1:27017");


(async () => {
  try {
    await Mongo.connect();
    let db = Mongo.db("graph_editor")
    app.locals.users = db.collection("users");
    app.locals.branches = db.collection("branches");
    app.locals.rows = db.collection("rows");
    app.listen(3000);
    console.log("Listen port: 3000");
  } catch (err) {
    return console.log(err);
  }
})();


//users collection

app.get("/v1/users", async (req, res) => {
  users.getUsers(req, (status, body) => {
    if (!body) { res.sendStatus(status) } else { res.status(status).send(body) }
  })
});

app.get("/v1/users/:id", async (req, res) => {
  users.getUserById(req, (status, body) => { res.status(status).send(body) })
});

app.post("/v1/users", parser, async (req, res) => {
  users.addUser(req, (status, body) => { res.status(status).send(body) })
});

app.put("/v1/users/:id", parser, async (req, res) => {
  users.editUser(req, (status, body) => { res.status(status).send(body) })
})

app.delete("/v1/users/:id", async (req, res) => {
  users.deleteUser(req, (status, body) => { res.status(status).send(body) })
})


//branches collection

app.get("/v1/branches", async (req, res) => {
  branches.getBranches(req, (status, body) => {
    if (!body) { res.sendStatus(status) } else { res.status(status).send(body) }
  })
})

app.get("/v1/branches/:id", async (req, res) => {
  branches.getBranchesById(req, (status, body) => { res.status(status).send(body) })
});

app.post("/v1/branches", parser, async (req, res) => {
  branches.addBranch(req, (status, body) => { res.status(status).send(body) })
});

app.put("/v1/branches/:id", parser, async (req, res) => {
  branches.editBranch(req, (status, body) => { res.status(status).send(body) })
})

app.delete("/v1/branches/:id", async (req, res) => {
  branches.deleteBranch(req, (status, body) => { res.status(status).send(body) })
})

//rows collection

app.get("/v1/rows", async (req, res) => {
  rows.getRows(req, (status, body) => { res.status(status).send(body) })
})

app.post("/v1/rows/setNew", parser, async (req, res) => {
  rows.initializationRows(req, (status, body) => { res.status(status).send(body) })
})

app.put("/v1/rows", parser, async (req, res) => {
  rows.editRow(req, (status, body) => { res.status(status).send(body) })
})