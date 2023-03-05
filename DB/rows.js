import { ObjectId } from "mongodb"

function getRowName(tsDate) {
  let rawDate = new Date(tsDate)
  let weekday = ""
  switch (rawDate.getDay()) {
    case 1:
      weekday = "пн"
      break
    case 2:
      weekday = "вт"
      break
    case 3:
      weekday = "ср"
      break
    case 4:
      weekday = "чт"
      break
    case 5:
      weekday = "пт"
      break
    case 6:
      weekday = "сб"
      break
    default:
      weekday = "вс"
  }
  return `${rawDate.getDate()}.${rawDate.getMonth() + 1} ${weekday}`
}

async function getRows(req, callback) {
  const collection = req.app.locals.rows;
  const start = Number(req.query.start)
  const end = Number(req.query.end)
  try {
    const rows = await collection.find({ date: { $gte: start, $lte: end } }).toArray();
    // let rows = {
    //   start: start,
    //   end: end,
    // }
    callback(200, rows.sort((a, b) => {
      return a.date - b.date
    }))
  } catch (err) {
    console.log(err);
    callback(500, "Server is not working")
  }
}

async function initializationRows(req, callback) {
  const collection = req.app.locals.rows
  const start = Number(req.body.start)
  const end = Number(req.body.end)

  try {
    const rows = []
    const rawDates = []
    for (let i = start; i <= end; i += 86400000) {
      rawDates.push(i)
    }
    const branchesCollection = req.app.locals.branches
    const branches = await branchesCollection.find({}).toArray();
    const oldRows = await collection.find({ date: { $gte: start, $lte: end } }).toArray()
    oldRows.forEach(async (row) => {
      await collection.deleteOne({ _id: row._id });
    });

    rawDates.forEach((date) => {
      const row = {
        date: date,
        name: getRowName(date)
      }
      branches.forEach((branch) => {
        if (!row[branch.login]) { row[branch.login] = [] }
        while (row[branch.login].length < branch.userLimit) {
          row[branch.login].push({ userID: 0, id: row[branch.login].length + 1 })
        }
      })
      rows.push(row)
    })
    rows.forEach(async (oneRow) => {
      await collection.insertOne(oneRow);
    })

    callback(200, rows)

  } catch (err) {
    console.log(err)
    callback(500, "Server is not working")
  }
}

async function editRow(req, callback) {
  const collection = req.app.locals.rows;
  const id = new ObjectId(req.body.row._id);
  const newRow = {}
  const rowKeys = Object.keys((req.body.row))
  rowKeys.forEach((key) => {
    if (key !== "_id") {
      newRow[key] = req.body.row[key]
    }
  })

  try {
    const replase = await collection.replaceOne({ _id: id }, newRow, { returnDocument: "after" });
    if (replase) { callback(200, replase) } else { callback(404, "Not found") }
  }
  catch (err) {
    console.log(err);
    callback(500, err)
  }
}

export default {
  getRows,
  initializationRows,
  editRow
}