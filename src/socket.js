import io from "socket.io-client";
import config from "./config";

let socket = undefined;
export function connectToSocket() {
  return new Promise((resolve, reject) => {
    const options = { transports: ["websocket"], reconnection: true };
    socket = io.connect(
      config.socketServerUrl,
      options
    );
    socket.on("subscription_id", data => {
      resolve(data);
    });
    socket.on("connect", () => {
      console.log("yes socket is connected");
    });
    socket.on("disconnect", () => {
      console.log("yes socket is disconnected");
    });
    socket.on("error", err => {
      console.log("socket error", err);
      reject(err);
    });
  });
}
export function disconnectSocket() {
  socket.disconnect();
}
export function getSocket() {
  return socket;
}
// export function onSocketData(group, cb) {
//   socket.on("update", socketData => {
//     console.log("",socketData);
//     let { groupId } = socketData;
//     if (group == groupId) {
//       cb(socketData);
//     }
//   });
// }
export function onSocketData(group, cb) {
  socket.on(group, socketData => {
    console.log("", socketData);
    cb(socketData);
  });
}
