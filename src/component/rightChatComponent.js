import React from "react";
import "../styles.css";

export const ChatComponent = props => {
  const { fromUser, setMessage, item = {} } = props;
  const { toUser = {}, message = "" } = item;
  return (
    <div
      className="chat"
      style={
        (toUser._id && toUser._id) === fromUser
          ? {}
          : {
              backgroundColor: "lightblue",
              alignSelf: "flex-end"
            }
      }
    >
      {setMessage(message)}
    </div>
  );
};
