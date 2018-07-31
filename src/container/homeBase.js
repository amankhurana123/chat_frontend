import React, { Component } from "react";
import { apiInstance } from "../api";
import config from "../config";

export default class HomeBase extends Component {
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
  componentDidMount = async () => {
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
}
