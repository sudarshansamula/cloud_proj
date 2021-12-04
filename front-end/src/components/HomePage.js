import Navbar from "react-bootstrap/Navbar";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import Page4 from "../components/Page4";

const HomePage = (props) => {
  const history = useHistory();
  const logOutUser = () => {
    sessionStorage.removeItem("user_auth_token");
    history.push("/login");
  };
  return (
    <Router>
      <div>
        <Navbar bg="danger" variant="dark">
          <Navbar.Brand href="#home">Hi {props.user_name}</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <a
              onClick={logOutUser}
              class="btn btn-primary btn-small navbar-btn"
            >
              Sign Out!
            </a>
          </Navbar.Collapse>
        </Navbar>
        <div id="pagesContainer" className="d-flex justify-content-center">
          <table>
            <thead>
              <tr>
                <th>Please select from the options below:</th>
              </tr>
              <tr>
                <th>
                  <a
                    className="btn btn-light btn-lg btn-block"
                    href="/home/page1"
                  >
                    Data Pulls
                  </a>
                </th>
              </tr>
              <tr>
                <th>
                  <a
                    className="btn btn-light btn-lg btn-block"
                    href="/home/page2"
                  >
                    Dashboards
                  </a>
                </th>
              </tr>
              <tr>
                <th>
                  <a
                    className="btn btn-light btn-lg btn-block"
                    href="/home/page4"
                  >
                    Upload DataSet
                  </a>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <Switch>
          <Route exact path="/home/page1">
            <Page1 userName={props.user_name} />
          </Route>
          <Route exact path="/home/page2">
            <Page2 />
          </Route>
          <Route exact path="/home/page4">
            <Page4 userName={props.user_name} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HomePage;
