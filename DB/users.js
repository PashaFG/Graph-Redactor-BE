async function getUsers(req, callback) {
  const collection = req.app.locals.users;

  try {
    const users = await collection.find({}).toArray();
    callback(200, users)
  }
  catch (err) {
    console.log(err);
    callback(500)
  }
}

async function getUserById(req, callback) {
  const collection = req.app.locals.users;
  try {
    const id = Number(req.params.id);
    const user = await collection.findOne({ _id: id });
    if (user) { callback(200, user) } else { callback(404, "Not found") }
  }
  catch (err) {
    console.log(err);
    callback(500, err)
  }
}

async function addUser(req, callback) {
  if (!req.body.name || !req.body.title || !req.body.color) return callback(400, "Parametrs not found");
  const collection = req.app.locals.users;

  const user = { _id: Date.parse(new Date()), name: req.body.name, title: req.body.title, color: req.body.color }

  try {
    await collection.insertOne(user);
    callback(200, user);
  }
  catch (err) {
    console.log(err);
    callback(500, err);
  }
}

async function editUser(req, callback) {
  const collection = req.app.locals.users;
  try {
    const id = Number(req.params.id);
    const user = await collection.findOneAndUpdate({ _id: id }, { $set: { name: req.body.name, title: req.body.title, color: req.body.color } }, { returnDocument: "after" });
    if (user) { callback(200, user) } else { callback(404, "Not found") }
  }
  catch (err) {
    console.log(err);
    callback(500, err)
  }
}

async function deleteUser(req, callback) {
  const collection = req.app.locals.users;
  try {
    const id = Number(req.params.id);
    const result = await collection.deleteOne({ _id: id });
    if (result) { callback(200, result) } else { callback(404, "Not found") }
  }
  catch (err) {
    console.log(err);
    callback(500, err)
  }
}

export default {
  getUsers,
  getUserById,
  addUser,
  editUser,
  deleteUser
}