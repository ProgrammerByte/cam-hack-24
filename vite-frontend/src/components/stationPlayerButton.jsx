import { useContext } from "react";
import { SocketContext } from "../routes/context/socketContext";

/* eslint-disable react/prop-types */
const StationPlayerButton = ({ user, showHealth }) => {
  const socket = useContext(SocketContext);

  const healPlayer = () => {
    socket.emit("healPlayer", user.playerName);
  };

  return (
    <li
      key={user.sessionId}
      className="p-2 bg-gray-200 rounded-lg shadow-sm text-gray-700 font-medium z-10 flex items-center justify-between"
    >
      <span>{user.playerName}</span>
      <div className="flex space-x-1">
        {!user.connected && <img src="/disconnected.svg" />}
        {showHealth ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded"
            onClick={healPlayer}
          >
            Heal
          </button>
        ) : null}
      </div>
    </li>
  );
};

export default StationPlayerButton;
