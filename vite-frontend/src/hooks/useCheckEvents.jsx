import { useContext } from "react";
import { SocketContext } from "../routes/context/socketContext";
import { SessionContext } from "../routes/context/sessionContext";
import { useNavigate } from "react-router-dom";

const useCheckEvents = () => {
  const socket = useContext(SocketContext);
  const session = useContext(SessionContext);
  const navigate = useNavigate();

  socket.on("playerKicked", async (playerName) => {
    if (playerName && playerName === session?.playerName) {
      navigate("/mobile/removed");
    }
  });
  socket.on("gameEnded", async () => {
    navigate("/mobile/finish");
  });
};

export default useCheckEvents;
