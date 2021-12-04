const express = require("express");
const router = express.Router();
let { host, port, user, password, database } = require("../utils/mysqlConfig");
const defaultDB = "Kroger";

router.post("/", async (req, res) => {
  const { houseHoldNumber, selectedDataSet, userName } = req.body;
  if (selectedDataSet === defaultDB) {
    database = defaultDB;
  } else {
    database = `USER_${userName}_DATASET_${selectedDataSet}`;
  }
  let result = await fetchRecordsOfHouseHold(
    houseHoldNumber,
    selectedDataSet,
    userName
  );
  return res.send(result);
});
async function fetchRecordsOfHouseHold(houseHoldNumber) {
  const mysql = require("mysql");
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
  });
  try {
    executeQuery = (query) => {
      return new Promise((resolve, reject) => {
        pool.query(query, [houseHoldNumber], (error, results) => {
          if (error) {
            console.error(error.stack);
            // return reject(error);
          }
          return resolve(results);
        });
      });
    };
    let recordsOfHouseHold = [];
    let query =
      "SELECT h.HSHD_NUM,t.BASKET_NUM,t.PURCHASE_,t.PRODUCT_NUM,p.DEPARTMENT,p.COMMODITY,t.SPEND,t.UNITS,t.STORE_R,t.WEEK_NUM,t.YEAR,h.L,h.AGE_RANGE, h.MARITAL,h.INCOME_RANGE,h.Homeowner,h.HSHD_COMPOSITION,h.HH_SIZE,h.CHILDREN from HOUSEHOLDS h JOIN TRANSACTIONS t ON h.HSHD_NUM = t.HSHD_NUM JOIN PRODUCTS p ON p.PRODUCT_NUM = t.PRODUCT_NUM WHERE h.HSHD_NUM = ? ORDER BY 1,2,3,4,5,6;";
    recordsOfHouseHold = await executeQuery(query);
    if (!recordsOfHouseHold) {
      let backup_query =
        "SELECT * from HOUSEHOLDS h JOIN TRANSACTIONS t ON h.HSHD_NUM = t.HSHD_NUM JOIN PRODUCTS p ON p.PRODUCT_NUM = t.PRODUCT_NUM WHERE h.HSHD_NUM = ? ORDER BY 1,2,3,4,5,6;";
      recordsOfHouseHold = await executeQuery(backup_query);
    }

    return recordsOfHouseHold ? recordsOfHouseHold : [];
  } catch (err) {
    console.error(err.stack);
  }
}

module.exports = router;
