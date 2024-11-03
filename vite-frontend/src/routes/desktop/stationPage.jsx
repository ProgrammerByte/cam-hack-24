import { useContext, useState } from "react";
import { SocketContext } from "../context/socketContext";
import StationPlayerButton from "../../components/stationPlayerButton";

const StationPage = () => {
  const [users, setUsers] = useState([]);
  const [coolingDown, setCoolingDown] = useState(false);

  const scientists = users.filter((user) => user.team === "Scientists");
  const soldiers = users.filter((user) => user.team === "Marine Corps");

  const socket = useContext(SocketContext);

  const soldierPoint = () => {
    setCoolingDown(true);
    socket.emit("soldierPoint");
    setTimeout(() => setCoolingDown(false), 1000);
  };

  socket.on("state", (state) => {
    console.log("state", state);
    setUsers(state.players);
  });

  return (
    <div
      className="flex h-screen bg-gray-100 p-4"
      style={{
        backgroundImage: "url(/stationbackground.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-1/2 mr-4 space-y-4 z-10">
        <div className="relative bg-white bg-opacity-50 shadow-lg rounded-lg p-4 h-full">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Scientists
          </h2>
          <ul className="space-y-3">
            {scientists.map((user) => (
              <StationPlayerButton
                key={user.playerName}
                user={user}
                showHealth={user.health <= 0}
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="w-1/2 flex-1 flex flex-col justify-between">
        <div className="relative bg-white bg-opacity-50 shadow-lg rounded-lg p-4 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Marine Corps
            </h2>
            <ul className="space-y-3">
              {soldiers.map((user) => (
                <StationPlayerButton key={user.playerName} user={user} />
              ))}
            </ul>
          </div>
          {/* Button positioned at the bottom */}
          <div className="mt-4">
            {!coolingDown &&
            soldiers?.filter((user) => user.health >= 0)?.length ? (
              <button
                className="bg-blue-500 text-white rounded-lg p-2 w-full py-10 text-7xl hover:bg-blue-600 transition duration-200"
                onClick={soldierPoint}
              >
                Claim score
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationPage;
