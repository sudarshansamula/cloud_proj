import React, { useState } from "react";
import "../styles/Login.css";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const { Backend_API } = require("../utils/Backend_API");

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const authenticateUser = async (event) => {
    event.preventDefault();
    //console.log("here");

    const responseFromServer = await fetch(Backend_API + "authenticateUser/", {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify({ userName, password }),
    });
    let { status } = responseFromServer;
    if (status === 200) {
      const userData = await responseFromServer.json(responseFromServer);
      validateUserCreds(userData);
    } else {
      alert("An Error Occured!");
    }
    function validateUserCreds(userData) {
      if (userData.password === password) {
        sessionStorage.setItem("user_auth_token", userName);
        history.push("/home");
      } else {
        alert("UserName does not exist or Password is incorrect");
      }
    }
  };
  return (
    <div className="Login">
      <h4>Team-29(Ceaseless)</h4>
      <form onSubmit={(e) => authenticateUser(e)}>
        <div class="container">
          <label>Username : </label>

          <input
            type="text"
            value={userName}
            placeholder="Enter Username"
            name="username"
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label>Password : </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            name="password"
            required
          />

          <button type="submit">Login</button>
          <br></br>
          <a href="/signup">Click here to sign up</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
