import React, { Component } from "react";
import "../styles.css";

export default class Home extends Component {
  componentDidMount() {
    console.log("====================================");
    console.log();
    console.log("====================================");
  }
  render() {
    return <div className="mainContainer">Hello world</div>;
  }
}
