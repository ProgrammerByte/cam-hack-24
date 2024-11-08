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
import RemovedPage from "./routes/mobile/removedPage";
import FinishedPage from "./routes/mobile/finishedPage";
import StationPage from "./routes/desktop/stationPage";
import SoldierStationPage from "./routes/desktop/soldierStationPage";

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
    path: "/desktop/station",
    element: <StationPage />,
  },
  {
    path: "/desktop/soldierstation",
    element: <SoldierStationPage />,
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
  {
    path: "/mobile/removed",
    element: <RemovedPage />,
  },
  {
    path: "/mobile/finish",
    element: <FinishedPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <RouterProvider router={router} />
  </SocketProvider>
);
