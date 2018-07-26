import React, { Component } from "react";
import { onSocketData } from "../socket";

export default function withSocket(groupId, Comp) {
  return class Socket extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    componentWillMount() {
      onSocketData(groupId, data => {
        this.setState({ socketData: data.data });
      });
    }

    render() {
      return <Comp socketData={this.state.socketData} />;
    }
  };
}
