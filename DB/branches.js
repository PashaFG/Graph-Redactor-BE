async function getBranches(req, callback) {
  const collection = req.app.locals.branches;

  try {
    const branches = await collection.find({}).toArray();
    callback(200, branches)
  }
  catch (err) {
    console.log(err);
    callback(500)
  }
}

async function getBranchesById(req, callback) {
  const collection = req.app.locals.branches;
  try {
    const id = Number(req.params.id);
    const branch = await collection.findOne({ _id: id });
    if (branch) { callback(200, branch) } else { callback(404, "Not found") }
  }
  catch (err) {
    console.log(err);
    callback(500, err)
  }
}

async function addBranch(req, callback) {
  if (!req.body.name || !req.body.userLimit || !req.body.exportColor || !req.body.login) return callback(400, "Parametrs not found");
  const collection = req.app.locals.branches;

  const branch = { _id: Date.parse(new Date()), name: req.body.name, userLimit: req.body.userLimit, login: req.body.login, exportColor: req.body.exportColor }

  try {
    await collection.insertOne(branch);
    callback(200, branch);
  }
  catch (err) {
    console.log(err);
    callback(500, err);
  }
}

async function editBranch(req, callback) {
  const collection = req.app.locals.branches;
  try {
    const id = Number(req.params.id);
    const branch = await collection.findOneAndUpdate({ _id: id }, { $set: { name: req.body.name, userLimit: req.body.userLimit, exportColor: req.body.exportColor } }, { returnDocument: "after" });
    if (branch) { callback(200, branch) } else { callback(404, "Not found") }
  }
  catch (err) {
    console.log(err);
    callback(500, err)
  }
}

async function deleteBranch(req, callback) {
  const collection = req.app.locals.branches;
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
  getBranches,
  getBranchesById,
  addBranch,
  editBranch,
  deleteBranch
}