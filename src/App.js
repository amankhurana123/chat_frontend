import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import openSocket from "socket.io-client";
import config from "./config";
import Login from "./container/login";
import Home from "./container/home";

class App extends Component {
  render() {
    const socket = openSocket(config.serverUrl);

    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
      </Switch>
    );
  }
}

export default withRouter(App);
