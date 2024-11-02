import cors from "cors";
import { createServer } from "http";
import express from "express";
import { io } from "./services/io.js";
import { initSocketServer } from "./sockets/socket_server.js";

const PORT = 8080;

// Catch unhandled promise rejection errors
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Promise Rejection: ${reason}`);
});

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("API is running!");
});

async function start() {
  initSocketServer();
  io.attach(server);

  server.listen(PORT, () => [console.info(`Listening on port ${PORT}`)]);
}

start().catch((reason) => {
  console.error(`Failed to start: ${reason}`);
});
