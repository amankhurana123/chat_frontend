import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./container/login";
import Home from "./container/home";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/home" component={Home} />
      </Switch>
    );
  }
}

export default App;
