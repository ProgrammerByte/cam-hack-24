const HealthBar = ({ health, maxHealth }) => {
  // Calculate the width percentage of the health bar
  const healthPercentage = Math.max(
    0,
    Math.min((health / maxHealth) * 100, 100)
  );

  return (
    <div className="w-full h-6 bg-gray-300 rounded-md overflow-hidden absolute top-0">
      <div
        className="h-full bg-green-500 transition-width duration-300"
        style={{ width: `${healthPercentage}%` }}
      ></div>
    </div>
  );
};

export default HealthBar;
