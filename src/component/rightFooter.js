import React from "react";
import DropZone from "react-dropzone";
import AttachFile from "@material-ui/icons/AttachFile";
import Send from "@material-ui/icons/Send";
import "../styles.css";

export const RightFooter = props => {
  const { onDrop, message = "", onChangeState, chatMessages } = props;
  return (
    <div className="rightFooter">
      <div className="innerRightFooter">
        <DropZone
          className="dropzone"
          onDrop={files => {
            onDrop(files);
          }}
          activeClassName="active-dropzone"
          multiple={true}
        >
          <AttachFile className="attachFile" />
        </DropZone>
        <textarea
          type="text"
          className="textarea"
          value={message}
          onChange={onChangeState}
        />
        <div className="sendButton" onClick={chatMessages}>
          <Send className="send" />
        </div>
      </div>
    </div>
  );
};
