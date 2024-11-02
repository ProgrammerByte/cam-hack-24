import { useContext, useState } from "react";
import { SocketContext } from "../context/socketContext";
import PlayerButton from "../../components/playerButton";

const RoomPage = () => {
  const [users, setUsers] = useState([]);

  const scientists = users.filter((user) => user.team === "Scientists");
  const soldiers = users.filter((user) => user.team === "Marine Corps");
  const unassigned = users.filter(
    (user) => user.team !== "Scientists" && user.team !== "Marine Corps"
  );
  console.log(unassigned);
  const socket = useContext(SocketContext);

  const roomInfo = {
    title: "Demo Room",
    description: "This is the official Demo Room for HLIRL",
    createdAt: "November 3, 2024",
    createdBy: "Admin",
  };

  const startGame = () => {
    socket.emit("startGame");
  };

  socket.on("state", (state) => {
    console.log("state", state);
    setUsers(state.players);
  });

  return (
    <div
      className="flex h-screen bg-gray-100 p-4"
      style={{
        backgroundImage: "url(/src/assets/desktopbackground.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-1/3 mr-4 space-y-4 z-10">
        <div className="relative bg-white bg-opacity-50 shadow-lg rounded-lg p-4 h-[calc(50%-8px)]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Scientists - ({scientists.length} / 4)
          </h2>
          <ul className="space-y-3">
            {scientists.map((user) => (
              <PlayerButton key={user.playerName} user={user} />
            ))}
          </ul>
          <img
            src="/src/assets/scientistpose.png"
            alt="Decorative Image"
            className="absolute object-contain"
            style={{
              right: "5px",
              bottom: "0px",
              width: "300px",
              height: "300px",
              zIndex: -100,
            }}
          />
        </div>
        <div className="relative bg-white bg-opacity-50 shadow-lg rounded-lg p-4 h-[calc(50%-8px)]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Marine Corps - ({soldiers.length} / 4)
          </h2>
          <ul className="space-y-3">
            {soldiers.map((user) => (
              <PlayerButton key={user.playerName} user={user} />
            ))}
          </ul>
          <img
            src="/src/assets/soldierpose.png"
            alt="Decorative Image"
            className="absolute object-contain"
            style={{
              right: "0px",
              bottom: "-18px",
              width: "350px",
              height: "350px",
              zIndex: -100,
            }}
          />
        </div>
      </div>
      <div className="w-1/3 mr-4">
        <div className="relative bg-white bg-opacity-50 shadow-lg rounded-lg p-4 h-full">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Lobby</h2>
          <ul className="space-y-3">
            {unassigned.map((user) => (
              <PlayerButton key={user.playerName} user={user} />
            ))}
          </ul>
          <img
            src="/src/assets/scientistpose.png"
            alt="Decorative Image"
            className="absolute object-contain"
            style={{
              right: "5px",
              bottom: "0px",
              width: "300px",
              height: "300px",
              zIndex: -100,
            }}
          />
        </div>
      </div>

      <div className="flex-1 bg-white bg-opacity-70 p-6 shadow-lg rounded-lg flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            {roomInfo.title}
          </h2>
          <p className="text-gray-600 mb-4">{roomInfo.description}</p>
          <div className="text-sm text-gray-500">
            <p>Created on: {roomInfo.createdAt}</p>
            <p>Created by: {roomInfo.createdBy}</p>
          </div>
          <h2 className="text-xl font-bold my-2 text-gray-800">
            Join at: www.google.com
          </h2>
        </div>
        <div>
          <button
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-600 transition duration-200"
            onClick={startGame}
          >
            Begin Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
