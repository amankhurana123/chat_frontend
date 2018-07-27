import React, { Component } from "react";
import { capitalize } from "lodash";
import DropZone from "react-dropzone";
import ArrowBack from "@material-ui/icons/ArrowBack";
import AttachFile from "@material-ui/icons/AttachFile";
import Send from "@material-ui/icons/Send";
import { apiInstance } from "../api";
import "../styles.css";
import withSocket from "../component/withSocket";

class Home extends Component {
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
      chat: [],
      socket: {},
      chat1: [],
      height: 0,
      fileIsSend: []
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
        this.setState({
          height: this.state.chat.length ? this.state.chat.length : 0
        });
        this.onHandleChange(this.state.height * 74);
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
    this.setState({
      height: this.state.chat.length
    });
    this.onHandleChange(this.state.height * 74);
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
        console.log("response >>>>>>>>>>>>>>>>>>>>>", response);
        this.setState({ message: "" });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.socketData) {
      this.state.chat.push(nextProps.socketData);
      this.setState({});
      this.setState({ height: this.state.chat.length });
      this.onHandleChange(this.state.height * 74);
    }
  }
  onHandleChange = height => {
    console.log(
      height,
      document.getElementsByClassName("rightBody")[0].scrollHeight
    );

    return document.getElementsByClassName("rightBody")[0].scrollTo(0, height);
  };
  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log("accpetedFiles", acceptedFiles[0]);
    console.log("rejectedFiles", rejectedFiles);
    let fileIsSend = this.state.fileIsSend;
    fileIsSend.push(acceptedFiles);
    this.setState({ acceptedFiles });
    let data = new FormData();
    data.append("message", acceptedFiles[0]);
    data.append("fromUser", this.state.fromUser);
    data.append("toUser", this.state.toUser);
    console.log("data", data);
    const headers = {
      "content-type": "multipart/form-data",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*"
    };
    const options = {
      method: "post",
      url: "/chat/messages",
      data,
      headers
    };
    console.log("options", options);
    apiInstance(options)
      .then(response => {
        console.log("response", response);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  render() {
    console.log(this.state.chat);
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
                          item.fromUser._id === this.state.fromUser
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
                  <AttachFile className="attachFile" />
                  <DropZone
                    className="dropzone"
                    onDrop={files => {
                      this.onDrop(files);
                    }}
                  />

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
              <div className="imageRightContainer">
                <img src={require("./../image/chat1.png")} alt="user" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default class HomeWrapper extends Component {
  render() {
    const { user_id } = this.props.location.state;
    const HomeComponent = withSocket(`chat_${user_id}`, Home);
    return <HomeComponent {...this.props} />;
  }
}
