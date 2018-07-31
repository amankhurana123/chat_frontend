import React, { Component } from "react";
import HomeBase from "./homeBase";
import "../styles.css";
import withSocket from "../component/withSocket";

import { User } from "../component/user";
import { RightHeader } from "../component/rightHeader";
import { RightFooter } from "../component/rightFooter";
import { ChatComponent } from "../component/rightChatComponent";

class Home extends HomeBase {
  render() {
    return (
      <div className="mainHomeContainer">
        <div className="header" />
        <div className="body">
          <div className="leftContainer">
            {this.state.user.map((item, index) => {
              return (
                // <div

                //   onClick={() => {
                //     this.onHandleChangeState(
                //       item.name,
                //       item.email,
                //       item._id,
                //       true
                //     );
                //   }}
                // >
                <User
                  key={index}
                  user={item}
                  onHandleChangeState={this.onHandleChangeState}
                />
                // </div>
              );
            })}
          </div>
          {this.state.startChating ? (
            <div className="rightContainer">
              <RightHeader
                name={this.state.name}
                email={this.state.email}
                onHandleChangeState={this.onHandleChangeState}
              />
              <div className="rightBody" onScroll={this.scrollPage}>
                {this.state.chat &&
                  this.state.chat.map((item, index) => {
                    return (
                      <ChatComponent
                        key={index}
                        item={item}
                        setMessage={this.setMessage}
                        fromUser={this.state.fromUser}
                      />
                    );
                  })}
              </div>
              <RightFooter
                onDrop={this.onDrop}
                message={this.state.message}
                onChangeState={this.onChangeState}
                chatMessages={this.chatMessages}
              />
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
