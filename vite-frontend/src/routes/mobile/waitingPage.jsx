import { useContext, useEffect } from "react";
import { SocketContext } from "../context/socketContext";
import { SessionContext } from "../context/sessionContext";

const WaitingPage = () => {
  const socket = useContext(SocketContext);
  const session = useContext(SessionContext);

  console.log("got sess", session);

  useEffect(() => {
    // console.log(socket);
  }, [socket]);
  const team = "unassigned"; // scientist / soldier / unassigned

  const teamNames = {
    scientist: "You are on team Scientist",
    soldier: "You are on team Marine Corps",
    unassigned: "You are yet to be assigned to a team",
  };

  const bgs = {
    scientist: "blue-500",
    soldier: "green-500",
    unassigned: "red-500",
  };

  return (
    <div
      className={`flex items-center justify-center h-screen bg-${bgs[team]}`}
    >
      <div className="hidden bg-blue-500 bg-green-500 bg-red-500" />
      <div className="text-center text-white font-bold">
        <div className="absolute top-0 w-full text-3xl my-4 left-0">
          <p>Your name is</p>
          <p>{session.playerName}</p>
        </div>
        <h1 className="text-5xl font-bold">Waiting</h1>
        <p className="text-xl mt-2">{teamNames[team]}</p>
      </div>
    </div>
  );
};

export default WaitingPage;
