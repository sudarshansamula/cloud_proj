const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { MongoDB_URI } = require("../utils/mongoConfig");

router.post("/", async (req, res) => {
  const user_creds = req.body;
  //Check for user_data in MongoDB
  const user_data = await checkInDBFor(user_creds.userName);
  //Validate user object
  if (user_data) {
    res.send(user_data);
  } else {
    res.send({});
  }
});

async function checkInDBFor(name) {
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
