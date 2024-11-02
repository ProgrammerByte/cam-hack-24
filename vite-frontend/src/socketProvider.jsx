import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./routes/context/socketContext";

const SOCKET_SERVER_URL = "http://localhost:8080"; // Change this to your server URL

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    if (!socket) {
      let s;
      if (window.location.href.includes("/desktop")) {
        s = io(SOCKET_SERVER_URL, {
          auth: {
            token: "beans",
          },
        });
      } else {
        s = io(SOCKET_SERVER_URL);
      }
      setSocket(s);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  if (!socket) {
    return null;
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
