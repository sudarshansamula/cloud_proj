const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const { MongoDB_URI } = require("../utils/mongoConfig");

router.post("/", async (req, res) => {
  const { userName } = req.body;
  //console.log("Fetching records of", userName);
  const dataSetNames = await fetchRecords(userName);
  //console.log("Datasets are:", dataSetNames);
  res.send({ dataSetNames });
});

async function fetchRecords(userName) {
  const client = new MongoClient(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const DB_Name = "Users_Database";
  //Include the base dataSet name
  let names = ["Kroger"];

  try {
    await client.connect();
    const db = client.db(DB_Name);
    const collection = db.collection("Users_Datasets");
    await collection
      .find({
        userName,
      })
      .forEach((data_obj) => {
        names.push(data_obj.dataSetName);
      });
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    return names;
  }
}

module.exports = router;
