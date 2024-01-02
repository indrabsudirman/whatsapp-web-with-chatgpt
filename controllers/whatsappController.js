import { StatusCodes } from "http-status-codes";
// import { Client, RemoteAuth } from "whatsapp-web.js";
// const { Client, RemoteAuth } = require("whatsapp-web.js");
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { createWhatsAppSession } from "../models/whatsappModel.js";
// import { getUserData } from "../controllers/userController.js";
import errorHandlerMiddleware from "../middleware/errorHandlerMiddleware.js";

export const getQRCode = (req, res) => {
  res.status(StatusCodes.OK).json({
    qr: "Hello World",
  });
};

export const initWhatsApp = async () => {
  const client = new Client({
    puppeteer: {
      headless: true,
    },
    authStrategy: new LocalAuth({
      clientId: "id",
    }),
  });

  // const number = getUserData;

  console.log("Phone ", number);
};

// export const initWhatsApp = (io) => {
//   // const client = new Client({
//   //   authStrategy: new LocalAuth({
//   //     store,
//   //     backupSyncIntervalMs: 300000,
//   //   }),
//   // });

//   const client = new Client({
//     authStrategy: new LocalAuth({ clientId: "clientID" }),
//   });

//   whapsappModel.initializeClient(Client, LocalAuth, "clientID");
//   whapsappModel.on("qrCodeReceived", (qr) => {});

//   io.on("connection", (socket) => {
//     console.log("a user connected", socket?.id);
//     socket.emit("hello", "world");

//     whapsappModel.initializeClient(Client, LocalAuth, "clientID");
//     whapsappModel.on("qrCodeReceived", (qr) => {
//       socket.emit("qrCodeReceived", qr);
//       console.log("QR RECEIVED Controllers", qr);
//     });

//     socket.on("connected", (msg) => {
//       console.log("accepted in server : ", msg);
//     });

//     socket.on("disconnect", () => {
//       console.log("a user disconnected");
//     });
//   });

//   // client.on("qrCodeReceived", (qr) => {
//   //   io.emit("qrCode", "qr");
//   // });
//   // const options = {
//   //   session: "some-session-id", // Replace with the actual session ID
//   // };
// };

// export const initWhatsApp = async (req, res) => {
//   try {
//     const qrCode = await new Promise((resolve) => {
//       const client = new Client({
//         authStrategy: new RemoteAuth({
//           store,
//           backupSyncIntervalMs: 300000,
//         }),
//       });
//       client.on("qrCodeReceived", (qr) => {
//         resolve(qr);
//       });

//       initializeClient(Client, RemoteAuth);
//       // client.initialize();
//     });
//     res.status(StatusCodes.OK).json({
//       qrCode,
//     });
//   } catch (error) {
//     console.log(`Error initialize whatsapp ${error}`);
//     return new InternalServerError(error);
//   }
// };
