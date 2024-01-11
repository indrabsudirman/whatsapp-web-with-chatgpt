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
import { getUserData } from "./controllers/userController.js";

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
const allSessionsObject = {};

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

  //Sample Send to client using emit
  socket.emit("hello", "Hi this is from backend 1");

  //Sample Received from client using on
  socket.on("test", (arg) => {
    console.log(`Object connected from client, message is ${arg}`);
  });

  socket.on("createSession", (data) => {
    console.log(`Got message ${data.message}`);
    createWhatsAppSession(socket);
  });

  socket.on("getAllChats", async (data) => {
    const { phoneNumber } = getUserData();
    console.log(`Get All Chats ${data}`);
    const { message } = data;
    console.log(`Message from FE ${message}`);
    const client = allSessionsObject[phoneNumber];
    const chats = await client.getChats();
    console.log(chats);
    socket.emit("getChats", {
      chats,
    });
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

const createWhatsAppSession = (socket) => {
  const { phoneNumber } = getUserData();
  console.log(`phone number ${phoneNumber}`);
  console.log(`Client will start ... with id ${phoneNumber}`);
  const client = new Client({
    puppeteer: {
      headless: true,
    },
    authStrategy: new LocalAuth({
      clientId: phoneNumber,
    }),
  });

  client.on("qr", (qr) => {
    console.log(`QR Received ${qr}`);
    socket.emit("qr", {
      qr,
    });
  });

  client.on("authenticated", () => {
    console.log(`Client with id ${phoneNumber} already authenticated`);
    socket.emit("authenticated", {
      phoneNumber,
      message: `Client with ${phoneNumber} is authenticated!`,
    });
  });

  client.on("ready", () => {
    console.log(`Client with id ${phoneNumber} already ready`);
    allSessionsObject[phoneNumber] = client;
    socket.emit("ready", {
      phoneNumber,
      message: `Client with ${phoneNumber} is ready!`,
    });
  });

  client.initialize();
};

const PORT = process.env.PORT || 5100;

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
