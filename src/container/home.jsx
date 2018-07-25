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
      startChating: false,
      chatText: "",
      startChatTextField: false
    };
  }

  componentWillMount = async () => {
    const user = localStorage.getItem("user");
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
  };
  onHandleChangeState = (name, email, toUser, startChating) => {
    this.setState({ name, email, toUser, startChating });
    const options ={
      method: "get",
      url: '/chat/'
    }
    apiInstance(options)
  .then(response=>{
    console.log("responser>>>>>>>>>>>>>>>>>>>>>",response)
    this.setState({startChatTextField : false, chatText: ""})
    }).catch(error=>{
    console.log("error",error)
    })
}
  onChangeState=(event)=>{
    this.setState({chatText: event.target.value})
  }
  chatMessages=()=>{
    this.setState({startChatTextField : true})
  const {chatText, toUser, }=this.state;
  const fromUser= encodeURI(JSON.stringify(JSON.parse(localStorage("user")).data._id));
  const headers = {
    "content-type": "application/json",
    Accept: "application/json"
  };
  const options = {
    method: "post",
    url: "/chat/",
    data: { chatText ,toUser,fromUser },
    headers
  };
  apiInstance(options)
  .then(response=>{
    console.log("responser>>>>>>>>>>>>>>>>>>>>>",response)
}).catch(error=>{
  console.log("error",error)
})
}
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
                      item.toUser,
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
              <div className="rightBody">{this.state.startChatTextField && <div className="chat"><p>{this.state.chatText}</p></div>}</div>
              <div className="rightFooter">
                <div className="innerRightFooter">
                  <textarea className="textarea" value={this.state.chatText} onChange={this.onChangeState}  />
                  <div className="sendButton" onClick={this.chatMessages} >
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
