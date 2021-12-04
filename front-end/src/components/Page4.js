import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
const { Backend_API } = require("../utils/Backend_API");

const Page4 = (props) => {
  const [dataSetName, setDataSetName] = useState("");
  const userName = sessionStorage.getItem("user_auth_token");
  const [userDatasetList, setUserDatasetList] = useState([]);
  const history = useHistory();

  const handleFilesUpload = async (e) => {
    e.preventDefault(); //Prevents page reload

    if (userDatasetList.includes(dataSetName)) {
      alert("A data-set with that name exists!");
      return;
    }

    let transactionsFile = document.getElementById("transactionsFile").files;
    let productsFile = document.getElementById("productsFile").files;
    let householdsFile = document.getElementById("householdsFile").files;

    //Now prepare the file for transfer
    const file_data = new FormData();
    file_data.append("csvFiles", transactionsFile[0]);
    file_data.append("csvFiles", productsFile[0]);
    file_data.append("csvFiles", householdsFile[0]);

    if (userName && dataSetName) {
      const { status } = await fetch(
        Backend_API + `csvupload/${userName}/${dataSetName}`,
        {
          method: "POST",
          body: file_data,
        }
      );
      if (status === 200) {
        //console.log("Files inserted succesfully");
        history.push("/home/page1");
      }
    } else {
      //console.log("user Name invalid");
      alert("An error occured");
    }
  };
  useEffect(() => {
    async function getUserDataSetNames() {
      //console.log("Fetching records of", userName);
      const response = await fetch(Backend_API + "fetchDataSetNames", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ userName }),
      });
      let { status } = response;
      if (status === 200) {
        const { dataSetNames } = await response.json(response);
        setUserDatasetList(dataSetNames);
      }
    }
    getUserDataSetNames();
  }, []);
  return (
    <div id="mainContainer">
      <form
        onSubmit={(e) => handleFilesUpload(e)}
        encType="multipart/form-data"
      >
        <div className="mb-3">
          <div className="form-group">
            <input
              type="text"
              value={dataSetName}
              onChange={(e) => setDataSetName(e.target.value)}
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter Dataset Name"
              required
            />
          </div>
          <table style={{ width: "50%", margin: "50px auto" }}>
            <thead>
              <tr>
                <th>Transactions</th>
                <th>Products</th>
                <th>HouseHolds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="file"
                    id="transactionsFile"
                    name="csvFiles"
                    accept=".csv"
                    required
                  />
                </td>
                <td>
                  <input
                    type="file"
                    id="productsFile"
                    name="csvFiles"
                    accept=".csv"
                    required
                  />
                </td>
                <td>
                  <input
                    type="file"
                    id="householdsFile"
                    name="csvFiles"
                    accept=".csv"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page4;
