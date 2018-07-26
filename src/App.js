import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connectToSocket, disconnectSocket } from "./socket";
import Login from "./container/login";
import Home from "./container/home";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {}
    };
  }
  componentWillMount() {
    connectToSocket();
  }
  componentWillUnmount() {
    disconnectSocket();
  }
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={Home} />
        {/* <Link to={{ pathname: "/home", state: { socket: "hello" } }} /> */}
      </Switch>
    );
  }
}

export default withRouter(App);
