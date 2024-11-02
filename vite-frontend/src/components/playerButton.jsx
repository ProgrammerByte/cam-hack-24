import { useContext } from "react";
import { SocketContext } from "../routes/context/socketContext";

/* eslint-disable react/prop-types */
const PlayerButton = ({ user }) => {
  const socket = useContext(SocketContext);

  const assignToScienceTeam = () => {
    socket.emit("assignTeam", user.playerName, "Scientists");
  };

  const assignToMarineCorps = () => {
    socket.emit("assignTeam", user.playerName, "Marine Corps");
  };

  const kickPlayer = () => {
    socket.emit("kickPlayer", user.playerName);
  };

  return (
    <li
      key={user.sessionId}
      className="p-2 bg-gray-200 rounded-lg shadow-sm text-gray-700 font-medium z-10 flex items-center justify-between"
    >
      <span>{user.playerName}</span>
      <div className="flex space-x-1">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded"
          onClick={assignToScienceTeam}
        >
          B1
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-2 rounded"
          onClick={assignToMarineCorps}
        >
          B2
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded"
          onClick={kickPlayer}
        >
          B3
        </button>
      </div>
    </li>
  );
};

export default PlayerButton;
