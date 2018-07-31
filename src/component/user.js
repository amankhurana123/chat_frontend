import React from "react";
import { capitalize } from "lodash";
import "../styles.css";

export const User = props => {
  const { user = {}, onHandleChangeState } = props;
  const { name = "", email = "", _id = "" } = user;
  return (
    <div
      className="list"
      onClick={() => {
        onHandleChangeState(name, email, _id, true);
      }}
    >
      <img
        src={require("../image/images.png")}
        width="40px"
        height="40px"
        alt="user"
      />
      <div className="titleAndSubtitle">
        <div className="title">{capitalize(name)}</div>
        <div className="subtitle">{email}</div>
      </div>
    </div>
  );
};
