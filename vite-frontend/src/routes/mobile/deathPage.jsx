const DeathPage = () => {
  const team = "scientist"; // scientist / soldier / unassigned
  const backgroundName =
    team === "scientist" ? "scientistdeath.jpg" : "soldierdeath.png";

  return (
    <div
      className="items-center justify-center h-screen"
      style={{
        backgroundImage: `url(/src/assets/${backgroundName})`,
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
