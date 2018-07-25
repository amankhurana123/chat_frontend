import React, { Component } from "react";
import { capitalize } from "lodash";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Send from "@material-ui/icons/Send";
import { apiInstance } from "../api";
import "../styles.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      name: "",
      email: "",
      toUser: "",
      fromUser: "",
      startChating: false,
      message: "",
      startChatTextField: false,
      chat: []
    };
  }

  componentWillMount = async () => {
    const user = localStorage.getItem("user");
    this.setState({ fromUser: JSON.parse(user).data._id });
    if (!user) {
      this.props.history.push("/");
    } else {
      const params = encodeURI(JSON.stringify(JSON.parse(user).data._id));
      const options = {
        method: "get",
        url: "/user/getUser?params=" + params
      };
      apiInstance(options)
        .then(response => {
          this.setState({ user: response.data });
          console.log("====================================");
          console.log("response", this.state.user);

          console.log("====================================");
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };
  onHandleChangeState = (name, email, toUser, startChating) => {
    this.setState({ name, email, toUser, startChating });
    const { fromUser } = this.state;
    const params = encodeURI(JSON.stringify({ fromUser, toUser }));
    const options = {
      method: "get",
      url: "/chat/chatdata?params=" + params
    };
    apiInstance(options)
      .then(response => {
        this.setState({ chat: response.data });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  onChangeState = event => {
    this.setState({ message: event.target.value });
  };
  chatMessages = () => {
    this.setState({ startChatTextField: true });
    const { message, toUser, fromUser } = this.state;
    this.state.chat.push({ message, toUser, fromUser });
    this.setState({});
    const headers = {
      "content-type": "application/json",
      Accept: "application/json"
    };
    const options = {
      method: "post",
      url: "/chat/messages",
      data: { message, toUser, fromUser },
      headers
    };
    apiInstance(options)
      .then(response => {
        console.log("responser>>>>>>>>>>>>>>>>>>>>>", response);
        this.setState({ startChatTextField: false });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  render() {
    console.log("this.state", this.state.chat);
    return (
      <div className="mainHomeContainer">
        <div className="header" />
        <div className="body">
          <div className="leftContainer">
            {this.state.user.map((item, index) => {
              return (
                <div
                  key={index}
                  className="list"
                  onClick={() => {
                    this.onHandleChangeState(
                      item.name,
                      item.email,
                      item._id,
                      true
                    );
                  }}
                >
                  <img
                    src={require("./../image/images.png")}
                    width="40px"
                    height="40px"
                    alt="user"
                  />
                  <div className="titleAndSubtitle">
                    <div className="title">{capitalize(item.name)}</div>
                    <div className="subtitle">{item.email}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {this.state.startChating ? (
            <div className="rightContainer">
              <div className="rightHeader">
                <div className="leftRightHeaderComponent">
                  <ArrowBack
                    onClick={() => {
                      this.onHandleChangeState("", "", "", false);
                    }}
                    className="arrowName"
                  />
                  <div className="chatUsername">
                    <div>{capitalize(this.state.name)}</div>
                    <div>{this.state.email}</div>
                  </div>
                </div>
                <div />
              </div>
              <div className="rightBody">
                {this.state.chat &&
                  this.state.chat.map((item, index) => {
                    return (
                      <div
                        className="chat"
                        key={index}
                        style={
                          typeof item.fromUser._id !==
                          typeof this.state.fromUser
                            ? {
                                backgroundColor: "lightblue",
                                alignSelf: "flex-end"
                              }
                            : {}
                        }
                      >
                        <p>{item.message}</p>
                      </div>
                    );
                  })}
              </div>
              <div className="rightFooter">
                <div className="innerRightFooter">
                  <textarea
                    className="textarea"
                    value={this.state.message}
                    onChange={this.onChangeState}
                  />
                  <div className="sendButton" onClick={this.chatMessages}>
                    <Send className="send" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rightContainer">
              <div className="imageRightContainser">
                <img src={require("./../image/chat1.png")} alt="user" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
