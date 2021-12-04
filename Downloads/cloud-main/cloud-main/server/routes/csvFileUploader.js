const express = require("express");
const router = express.Router();
const { host, port, user, password, query } = require("../utils/mysqlConfig");

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "server/uploads/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.originalname.split(".").slice(0, -1).join(".") +
        "_" +
        Date.now() +
        ".csv"
    );
  },
});
var upload = multer({ storage: storage }).array("csvFiles", 3);

let status;
let dataSetName;
let userName;

router.post("/:userName/:dataSetName", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      res.sendStatus(400);
    }
    dataSetName = req.params.dataSetName;
    userName = req.params.userName;
    await processFiles(req.files);
    await storeDatasetName();
    return status ? res.sendStatus(200) : res.sendStatus(500);
  });
});

async function processFiles(filesObj) {
  parseCSVFiles = async (files) => {
    const csv = require("csv-parser");
    const fs = require("fs");

    let fileNameFinder = 0;
    //If fNF === 0 : file = Transactions.csv
    //elif fNF === 1: file = Products.csv
    //else file = HouseHolds.csv
    for (let file of files) {
      const processFile = async () => {
        let csvRows = [];
        const parser = fs.createReadStream(file).pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim(),
          })
        );
        for await (const record of parser) {
          csvRows.push(record);
        }
        return csvRows;
      };
      //Set status of operation to null
      status = null;
      const records = await processFile();
      await insertIntoDB(records, fileNameFinder);
      fileNameFinder++;
      fs.unlinkSync(file);
    }
  };
  let files = [];
  for (let file of filesObj) files.push(file.path);
  //Create DB and setup tables
  await setupDB();
  await parseCSVFiles(files);
}
async function setupDB() {
  const mysql = require("mysql");
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: host,
    port: port,
    user: user,
    password: password,
  });
  executeQuery = (query) => {
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  };

  try {
    //Construct DB name
    const DB_NAME = "USER_" + userName + "_DATASET_" + dataSetName;
    //Drop DB if it exists already
    await executeQuery(`DROP DATABASE IF EXISTS ${DB_NAME};`);
    //Now create a fresh copy
    await executeQuery(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
  } catch (err) {
    status = null;
    console.error(err);
  }
}

async function insertIntoDB(csvRows, fileNameFinder) {
  let headersOfCSV = extractHeaders();
  let dataOfCSV = extractValues();
  let tableName = findTableName();

  await transmitRecords(headersOfCSV, dataOfCSV, tableName);

  function extractHeaders() {
    return Object.keys(csvRows[0]);
  }
  function extractValues() {
    let allTheData = [];
    for (let row of csvRows) {
      let data = [];

      for (let header of headersOfCSV) {
        data.push(row[header]);
      }
      allTheData.push(data);
    }

    return allTheData;
  }
  function findTableName() {
    const tableNames = ["TRANSACTIONS", "PRODUCTS", "HOUSEHOLDS"];
    return tableNames[fileNameFinder];
  }
}

async function transmitRecords(csvHeaders, csvValues, tableName) {
  const mysql = require("mysql");
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: host,
    port: port,
    user: user,
    password: password,
  });
  createTable = (query) => {
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  };
  insertData = (query, values) => {
    return new Promise((resolve, reject) => {
      pool.query(query, [values], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  };

  try {
    const DB_NAME = "USER_" + userName + "_DATASET_" + dataSetName;

    let tableCreateStatement = `CREATE TABLE ${DB_NAME}.${tableName}(`;

    for (let i = 0; i < csvHeaders.length; i++) {
      //console.log(csvHeaders[i].toUpperCase().indexOf("NUM"));
      let dataType = "varchar(200)";
      if (csvHeaders[i].toUpperCase().indexOf("NUM") > 0) dataType = "INT";
      if (i === csvHeaders.length - 1) {
        tableCreateStatement += `${csvHeaders[i]} ${dataType});`;
      } else tableCreateStatement += `${csvHeaders[i]} ${dataType},`;
    }
    await createTable(tableCreateStatement);

    let insertStatement = `INSERT INTO ${DB_NAME}.${tableName} VALUES ?`;
    await insertData(insertStatement, csvValues);

    status = "SUCCESS";
  } catch (err) {
    status = null;
    console.error(err);
  } finally {
    return status;
  }
}

async function storeDatasetName() {
  const { MongoClient } = require("mongodb");
  const { MongoDB_URI } = require("../utils/mongoConfig");
  const client = new MongoClient(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //Check the global status, if true then insert the name
  if (status) {
    const dbName = "Users_Database";
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("Users_Datasets");
      await collection.insertOne({
        userName,
        dataSetName,
        uploadDate: new Date(),
      });
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }
  }
}

module.exports = router;
