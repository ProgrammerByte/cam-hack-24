import { useContext, useEffect, useState } from "react";
import useCheckEvents from "../../hooks/useCheckEvents";
import { StateContext } from "../context/stateContext";
import { useNavigate } from "react-router-dom";
import chargingSound from "/charginghealth.mp3";
import { SessionContext } from "../context/sessionContext";

const DeathPage = () => {
  useCheckEvents();
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const session = useContext(SessionContext);
  const player = state?.players?.filter(
    (p) => p.playerName === session.playerName
  )?.[0];
  const backgroundName =
    player?.team === "Scientists" ? "scientistdeath.jpg" : "soldierdeath.png";
  const [originalHealth, setOriginalHealth] = useState(null);
  const [playingSound, setPlayingSound] = useState(false);
  const chargingAudio = new Audio(chargingSound);

  useEffect(() => {
    if (originalHealth === null && player) {
      setOriginalHealth(player?.health);
    }
  }, [player]);

  useEffect(() => {
    const player1 = state?.players?.filter(
      (p) => p.playerName === session.playerName
    )?.[0];
    if (player1) {
      if (player1?.health >= 100) {
        if (chargingSound && typeof chargingSound.pause === "function") {
          chargingSound.pause();
          chargingSound.currentTime = 0;
          chargingSound.src = "";
        }
        navigate("/mobile/active");
      }
      if (
        !playingSound &&
        originalHealth !== null &&
        player1.health > originalHealth
      ) {
        setPlayingSound(true);
        console.log("playingSound");
        chargingAudio.play();
      }
    }
  }, [state]);

  if (!player) {
    return null;
  }

  return (
    <div
      className="items-center justify-center h-screen"
      style={{
        backgroundImage: `url(/${backgroundName})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-50 shadow-lg rounded-lg p-4 absolute w-full top-0">
        <h2 className="text-3xl font-bold text-center">You died!</h2>
      </div>
      <div className="bg-white bg-opacity-50 shadow-lg rounded-lg p-4 absolute w-full bottom-0">
        <h2 className="text-3xl font-bold text-center">Go back to spawn!</h2>
      </div>
    </div>
  );
};

export default DeathPage;
