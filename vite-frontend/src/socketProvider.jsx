import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./routes/context/socketContext";

const SOCKET_SERVER_URL = "http://localhost:5173"; // Change this to your server URL

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    if (!socket) {
      setSocket(io(SOCKET_SERVER_URL));
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
