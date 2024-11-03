import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./routes/context/socketContext";
import { SessionContext } from "./routes/context/sessionContext";
import { StateContext } from "./routes/context/stateContext";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL;

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(undefined);
  const [state, setState] = useState(undefined);

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
        const sid = localStorage.getItem("sessionId");
        s = io(SOCKET_SERVER_URL, {
          auth: sid && {
            sessionId: sid,
          },
        });
      }
      s.on("sessionData", (data) => {
        setSession(data);
        s.auth = { ...(s.auth || {}), sessionId: data.sessionId };
        if (data.sessionId) {
          localStorage.setItem("sessionId", data.sessionId || "");
        }
      });
      s.on("state", (state) => {
        setState(state);
      });

      s.on("connect_error", (err) => console.error(err));
      s.on("connect_failed", (err) => console.error(err));
      s.on("disconnect", (err) => console.error(err));
      s.on("error", (err) => console.error(err));

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
    <StateContext.Provider value={state}>
      <SessionContext.Provider value={session}>
        <SocketContext.Provider value={socket}>
          {children}
        </SocketContext.Provider>
      </SessionContext.Provider>
    </StateContext.Provider>
  );
};
