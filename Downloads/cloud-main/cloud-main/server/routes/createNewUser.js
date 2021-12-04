const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { MongoDB_URI } = require("../utils/mongoConfig");

router.post("/", async (req, res) => {
  const new_user_data = req.body;

  //Check if the user_name exists in users list already
  const userExists = await checkIfUserExistsInDB(new_user_data.userName);
  if (userExists) {
    res.send({ userExists: true });
  } else {
    const insertionStatus = insertToDB(new_user_data);
    res.send({ userCreated: insertionStatus });
  }
});

async function insertToDB(user_data) {
  const client = new MongoClient(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const dbName = "Users_Database";
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("UsersList");
    await collection.insertOne(user_data);
    return true;
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    return false;
  }
}
async function checkIfUserExistsInDB(name) {
  const client = new MongoClient(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const DB_Name = "Users_Database";
  let userObject = null;

  try {
    await client.connect();
    const db = client.db(DB_Name);
    const collection = db.collection("UsersList");
    userObject = await collection.findOne({
      userName: name,
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    return userObject;
  }
}
module.exports = router;
