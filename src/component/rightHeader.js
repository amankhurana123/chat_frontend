import React from "react";
import { capitalize } from "lodash";
import "../styles.css";
import ArrowBack from "@material-ui/icons/ArrowBack";

export const RightHeader = props => {
  const {
    name = "",
    email = "",
    onHandleChangeState = ("", "", "", false)
  } = props;
  return (
    <div className="rightHeader">
      <div className="leftRightHeaderComponent">
        <ArrowBack
          onClick={() => {
            onHandleChangeState("", "", "", false);
          }}
          className="arrowName"
        />
        <div className="chatUsername">
          <div>{capitalize(name)}</div>
          <div>{email}</div>
        </div>
      </div>
      <div />
    </div>
  );
};
