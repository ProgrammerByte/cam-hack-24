const RoomPage = () => {
  // Hard-coded list of connected users
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  // Hard-coded room information
  const roomInfo = {
    title: "Room A",
    description: "This is a room for collaboration and discussion.",
    createdAt: "October 31, 2023",
    createdBy: "Admin",
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4">
      {/* User List Column */}
      <div className="w-1/3 bg-white p-4 shadow-lg rounded-lg mr-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Connected Users
        </h2>
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-2 bg-gray-200 rounded-lg shadow-sm text-gray-700 font-medium"
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Room Info Column */}
      <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          {roomInfo.title}
        </h2>
        <p className="text-gray-600 mb-4">{roomInfo.description}</p>
        <div className="text-sm text-gray-500">
          <p>Created on: {roomInfo.createdAt}</p>
          <p>Created by: {roomInfo.createdBy}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
