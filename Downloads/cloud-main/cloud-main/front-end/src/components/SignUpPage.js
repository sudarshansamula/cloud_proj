import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const { Backend_API } = require("../utils/Backend_API");

const SignUpPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const history = useHistory();

  const createUserAccount = async (event) => {
    event.preventDefault();
    const responseFromServer = await fetch(Backend_API + "newuser/", {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify({ userName, password, email, firstName, lastName }),
    });
    let { status } = responseFromServer;
    if (status === 200) {
      const data = await responseFromServer.json(responseFromServer);
      if (data.userExists) {
        alert("User Name already in use");
      } else {
        history.push("/login");
      }
    } else {
      alert("An Error Occured!");
    }
  };
  return (

    <div className="Login">

      <Form onSubmit={createUserAccount}>
        <div>
          <h2>Sign Up</h2>
        </div>
        <Form.Group size="lg">
          <Form.Control
            required
            autoFocus
            type="text"
            value={userName}
            placeholder="User Name"
            minLength="5"
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg">
          <Form.Control
            required
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg">
          <Form.Row>
            <Col>
              <Form.Control
                required
                value={firstName}
                placeholder="First name"
                onChange={(e) => setfirstName(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                required
                value={lastName}
                placeholder="Last name"
                onChange={(e) => setlastName(e.target.value)}
              />
            </Col>
          </Form.Row>
        </Form.Group>
        <Form.Group size="lg">
          <Form.Control
            required
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <button
          type="submit"
          id="loginBtn"
          disabled={false}
          className="btn btn-success btn-lg btn-block"
        >
          Sign Up!
        </button>
      </Form>
    </div>

  );
};

export default SignUpPage;
