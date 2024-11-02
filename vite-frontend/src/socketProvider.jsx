import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./routes/context/socketContext";
import { SessionContext } from "./routes/context/sessionContext";

const SOCKET_SERVER_URL = "http://localhost:8080"; // Change this to your server URL

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
  const [session, setSession] = useState(null);
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
      s.on("sessionData", (data) => {
        setSession(data);
        s.auth = { ...(s.auth || {}), sessionId: data.sessionId };
      });
      setSocket(s);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  if (!socket || !session) {
    return null;
  }

  return (
    <SessionContext.Provider value={session}>
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    </SessionContext.Provider>
  );
};
