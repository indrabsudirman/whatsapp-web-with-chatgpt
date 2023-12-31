import "express-async-errors";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cookieParser from "cookie-parser";
//Import socket
import http from "http";
import { Server } from "socket.io";

import { initWhatsApp } from "./controllers/whatsappController.js";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

//database
import { connectToDatabase } from "./connections/database.js";

// routers
import authRouter from "./routers/authRouter.js";
import { StatusCodes } from "http-status-codes";
import userRouter from "./routers/userRouter.js";
import messageRouter from "./routers/messageRouter.js";
import whatsappRouter from "./routers/whatsappRouter.js";

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

//Connect to database
connectToDatabase();

const app = express();

//Init socket
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected here", socket?.id);

  //Send to client using emit
  socket.emit("hello", "Hi this is from backend 1");

  //Received from client using on
  socket.on("test", (arg) => {
    console.log(`Object connected from client, message is ${arg}`);
  });

  socket.on("createSession", (data) => {
    console.log(`Got message ${data.id}`);
    const { id } = data;
    createWhatsAppSession(id, socket);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected here");
  });
});

app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/v1/hello", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/message", authenticateUser, messageRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/whatsapp", authenticateUser, whatsappRouter);

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

// Init WhatsAppWeb JS
// const client = new Client({
//   authStrategy: new LocalAuth({
//     clientId: "PHONE_NUMBER_FROM_JWT",
//   }),
// });

// client.on("qr", (qr) => {
//   console.log(`Qr Code received ${qr}`);
// });

// client.on("authenticated", () => {
//   console.log(`Client with id ${client.clientId} already authenticated`);
// });

// client.on("ready", () => {
//   console.log(`Client with id ${client.clientId} already ready`);
// });

const allSessionsObject = {};

const createWhatsAppSession = (id, socket) => {
  console.log("Client will start ...");
  const client = new Client({
    puppeteer: {
      headless: true,
    },
    authStrategy: new LocalAuth({
      clientId: id,
    }),
  });

  client.on("qr", (qr) => {
    console.log(`QR Received ${qr}`);
  });

  client.on("authenticated", () => {
    console.log(`Client with id ${client.clientId} already authenticated`);
  });

  client.on("ready", () => {
    console.log(`Client with id ${client.clientId} already ready`);
  });

  client.initialize();
};

const PORT = process.env.PORT || 5100;

//Initialize the whatsapp connection
// initWhatsApp(io);

httpServer.listen(PORT, () => {
  console.log(`App running on port ${PORT} ...`);
});

// try {
//   await mongoose.connect(process.env.MONGO_DB_LOCAL).then(() => {
//     console.log("Success connected to database!");
//   });
//   app.listen(PORT, () => {
//     console.log(`server running on PORT ${PORT}...`);
//   });
// } catch (error) {
//   console.log(error);
//   process.exit(1);
// }
