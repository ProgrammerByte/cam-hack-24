import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import RoomPage from "./routes/desktop/roomPage";
import ActivePage from "./routes/mobile/activePage";
import WaitingPage from "./routes/mobile/waitingPage";
import DeathPage from "./routes/mobile/deathPage";
import SetupPage from "./routes/mobile/setupPage";
import { SocketProvider } from "./socketProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/desktop/room",
    element: <RoomPage />,
  },
  {
    path: "/mobile/active",
    element: <ActivePage />,
  },
  {
    path: "/mobile/waiting",
    element: <WaitingPage />,
  },
  {
    path: "/mobile/death",
    element: <DeathPage />,
  },
  {
    path: "/mobile/setup",
    element: <SetupPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);