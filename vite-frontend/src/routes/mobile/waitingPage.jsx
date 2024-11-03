import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/sessionContext";
import { StateContext } from "../context/stateContext";
import { useNavigate } from "react-router-dom";

const WaitingPage = () => {
  const session = useContext(SessionContext);
  const state = useContext(StateContext);
  const [team, setTeam] = useState("unassigned");
  const navigate = useNavigate();

  useEffect(() => {
    const newTeam =
      state?.players?.filter((p) => p.playerName === session.playerName)?.[0]
        ?.team || "unassigned";
    if (state?.gameInProgress && newTeam !== "unassigned") {
      navigate("/mobile/active");
    } else {
      setTeam(newTeam);
    }
  }, [state]);

  const teamNames = {
    Scientists: "You are on team Scientist",
    "Marine Corps": "You are on team Marine Corps",
    unassigned: "You are yet to be assigned to a team",
  };

  return (
    <div
      className={
        "flex items-center justify-center h-screen " +
        (team === "Scientists"
          ? "bg-blue-500"
          : team === "Marine Corps"
          ? "bg-green-500"
          : "bg-red-500")
      }
    >
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
