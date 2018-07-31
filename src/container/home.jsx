import React, { Component } from "react";
import { capitalize } from "lodash";
import DropZone from "react-dropzone";
import ArrowBack from "@material-ui/icons/ArrowBack";
import AttachFile from "@material-ui/icons/AttachFile";
import Send from "@material-ui/icons/Send";
import { apiInstance } from "../api";
import "../styles.css";
import withSocket from "../component/withSocket";
import config from "../config";

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
      scrollPage: false,
      chat: [],
      socket: {},
      height: 0,
      fileIsSend: null,
      option: {
        skip: 0,
        limit: 10,
        sort: {
          _id: -1
        }
      },
      isImage: true
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
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };
  onHandleChangeState = (name, email, toUser, startChating) => {
    let state = this.state;
    state.name = name;
    state.email = email;
    state.toUser = toUser;
    state.top = 0;
    state.chat = [];
    state.startChating = startChating;
    state.scrollPage = false;
    state.option.skip = 0;
    this.setState({});
    this.getChatMessages();
  };
  getChatMessages = () => {
    const { fromUser, option, toUser } = this.state;
    const params = encodeURI(JSON.stringify({ fromUser, toUser, option }));

    const options = {
      method: "get",
      url: "/chat/chatdata?params=" + params
    };
    apiInstance(options)
      .then(response => {
        if (response.data) {
          response.data.map(item => {
            return this.state.chat.unshift(item);
          });

          this.setState({
            height: this.state.chat.length ? this.state.chat.length : 0
          });
          this.onHandleChange();
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  scrollPage = () => {
    if (document.getElementsByClassName("rightBody")[0].scrollTop === 0) {
      if (
        this.state.option.skip + this.state.option.limit <=
        this.state.height
      ) {
        this.state.option.skip += this.state.option.limit;
        this.setState({ scrollPage: true });
        this.setState({
          top: document.getElementsByClassName("rightBody")[0].scrollHeight
        });
        this.getChatMessages();
      }
    }
  };
  onChangeState = event => {
    this.setState({ message: event.target.value });
  };
  chatMessages = () => {
    const { message, toUser, fromUser } = this.state;
    this.state.chat.length >= 10 && this.state.chat.shift();
    this.state.chat.push({ message, toUser, fromUser });
    this.state.scrollPage = false;
    this.setState({});
    this.onHandleChange();
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
      if (this.state.chat.length >= 10) {
        this.state.chat.shift();
      }
      this.state.chat.push(nextProps.socketData);
      this.state.scrollPage = false;
      this.setState({});
      this.onHandleChange();
    }
  }
  onHandleChange = () => {
    if (this.state.scrollPage) {
      return (document.getElementsByClassName("rightBody")[0].scrollTop =
        document.getElementsByClassName("rightBody")[0].scrollHeight -
        this.state.top);
    } else {
      return (document.getElementsByClassName(
        "rightBody"
      )[0].scrollTop = document.getElementsByClassName(
        "rightBody"
      )[0].scrollHeight);
    }
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log("accpetedFiles", acceptedFiles[0]);
    console.log("rejectedFiles", rejectedFiles);
    let fileIsSend = this.state.fileIsSend;
    fileIsSend = acceptedFiles[0];
    this.setState({ fileIsSend });
    let data = new FormData();
    data.append("message", acceptedFiles[0]);
    data.append("fromUser", this.state.fromUser);
    data.append("toUser", this.state.toUser);
    const headers = {
      "content-type": "multipart/form-data",
      Accept: "application/json"
    };
    const options = {
      method: "post",
      url: "/chat/messages",
      data,
      headers
    };
    apiInstance(options)
      .then(response => {
        console.log("response", response.data);

        this.state.chat.push(response.data);
        this.state.scrollPage = false;
        this.setState({});
        this.onHandleChange();
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  setMessage = message => {
    if (message.indexOf(".png") !== -1) {
      return (
        <img
          src={`${config.serverUrl}/${message}`}
          alt={message}
          className="image"
        />
      );
    } else if (message.indexOf(".jpg") !== -1) {
      return (
        <img
          src={`${config.serverUrl}/${message}`}
          alt={message}
          className="image"
        />
      );
    } else if (message.indexOf(".jpeg") !== -1) {
      return (
        <img
          src={`${config.serverUrl}/${message}`}
          alt={message}
          className="image"
        />
      );
    } else {
      return <p>{message}</p>;
    }
  };

  render() {
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
              <div className="rightBody" onScroll={this.scrollPage}>
                {this.state.chat &&
                  this.state.chat.map((item, index) => {
                    return (
                      <div
                        className="chat"
                        key={index}
                        style={
                          (item.toUser._id && item.toUser._id) ===
                          this.state.fromUser
                            ? {}
                            : {
                                backgroundColor: "lightblue",
                                alignSelf: "flex-end"
                              }
                        }
                      >
                        {this.setMessage(item.message)}
                      </div>
                    );
                  })}
              </div>
              <div className="rightFooter">
                <div className="innerRightFooter">
                  <DropZone
                    className="dropzone"
                    onDrop={files => {
                      this.onDrop(files);
                    }}
                    activeClassName="active-dropzone"
                    multiple={true}
                  >
                    <AttachFile className="attachFile" />
                  </DropZone>
                  <textarea
                    type="text"
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
