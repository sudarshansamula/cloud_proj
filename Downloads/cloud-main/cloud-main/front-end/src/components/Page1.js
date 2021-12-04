import { useState, useEffect } from "react";
const { Backend_API } = require("../utils/Backend_API");

const Page1 = (props) => {
  const [houseHoldNumber, setHouseHoldNumber] = useState("");
  const userName = sessionStorage.getItem("user_auth_token");
  const [userDatasetList, setUserDatasetList] = useState([]);
  //console.log("Usrname:", userName);

  const fetchRecordsOfCustomer = async (event) => {
    const getDataSetName = () => {
      let name = userDatasetList[document.getElementById("dataSetName").value];
      return name;
    };
    event.preventDefault();
    if (!houseHoldNumber) {
      alert("Enter an household number");
      return;
    }
    let selectedDataSet = getDataSetName();

    const response = await fetch(Backend_API + "fetchData/", {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify({
        houseHoldNumber,
        selectedDataSet,
        userName,
      }),
    });
    let { status } = response;
    if (status === 200) {
      const data = await response.json(response);
      if (data) writeDataToTable(data);
    } else {
      alert("An Error Occured!");
    }
  };
  const writeDataToTable = (data) => {
    function createTableHeaders(packet) {
      let tableHeader = document.getElementById("tableHeader");
      let tableRow = document.createElement("tr");
      for (let heading in packet) {
        let cell = document.createElement("th");
        let textNode = document.createTextNode(heading);
        cell.appendChild(textNode);
        tableRow.appendChild(cell);
      }
      tableHeader.appendChild(tableRow);
    }
    function createTableRows(packet) {
      let tableBody = document.getElementById("tableBody");
      let tableRow = document.createElement("tr");
      for (let heading in packet) {
        let cell = document.createElement("td");
        let value = packet[heading];
        let textNode = document.createTextNode(value);
        cell.appendChild(textNode);
        tableBody.appendChild(cell);
      }
      tableBody.appendChild(tableRow);
    }
    function cleanPreviousHouseHoldRecords() {
      let tableHead = document.getElementById("tableHeader");
      let tableBody = document.getElementById("tableBody");
      tableHead.querySelectorAll("*").forEach((n) => n.remove());
      tableBody.querySelectorAll("*").forEach((n) => n.remove());
    }
    function validateDataPacket() {
      const messageBanner = document.getElementById("messageDisplayArea");
      if (data.length === 0) {
        messageBanner.style.display = "block";
        messageBanner.innerHTML = "HouseHold Number does not exist!";
      } else {
        messageBanner.style.display = "none";
      }
    }
    function handleDataInsertion() {
      //Check if there are multiple transactions
      if (data.length > 1) {
        createTableHeaders(data[0]);
      } else createTableHeaders(data);
      //Now insert the table rows
      for (let packet of data) {
        createTableRows(packet);
      }
    }
    validateDataPacket();
    cleanPreviousHouseHoldRecords();
    handleDataInsertion();
  };
  useEffect(() => {
    async function getUserDataSetNames() {
      const response = await fetch(Backend_API + "fetchDataSetNames", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ userName }),
      });
      let { status } = response;
      if (status === 200) {
        const { dataSetNames } = await response.json(response);
        setUserDatasetList(dataSetNames);
        //console.log(dataSetNames);
      }
    }
    getUserDataSetNames();
  }, []);
  return (
    <div>
      <div
        id="mainContainer"
        style={{ textAlign: "center", width: "50%", margin: "50px auto" }}
      >
        <div>
          <label htmlFor="sel1">Pick a DataSet:</label>
          <select id="dataSetName" className="form-control m-2">
            {userDatasetList.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <form
          onSubmit={fetchRecordsOfCustomer}
          style={{ border: "none", marginLeft: "10px" }}
        >
          <input
            type="search"
            placeholder="Enter HSHD_NUM here.."
            value={houseHoldNumber}
            onChange={(e) => setHouseHoldNumber(e.target.value)}
            className="form-control bg-light mb-4"
          />
          <button class="btn btn-outline-danger my-2 my-sm-0">Search</button>
        </form>

        <div id="messageDisplayArea">
          <br></br>
        </div>
      </div>
      <table
        id="houseHoldDetails"
        style={{ fontSize: "11px" }}
        className="table-primary table table-sm"
      >
        <thead id="tableHeader" className="table"></thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  );
};

export default Page1;
