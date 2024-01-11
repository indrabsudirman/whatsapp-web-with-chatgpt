import { MongoStore } from "wwebjs-mongo";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
//database
import { connectToDatabase } from "../connections/database.js";
import mongoose from "mongoose";
import EventEmitter from "node:events";

// Initialize and export the store
const store = new MongoStore({ mongoose });

const eventEmitter = new EventEmitter();

// const initializeClient = async (Client, LocalAuth, clientID) => {
//   try {
//     // console.log("Options:", options); // Add this line for debugging

//     await connectToDatabase();
//     // console.log(store);
//     // const multiDeviceCollection = getMultiDeviceCollection(options);

//     // const client = new Client({
//     //   authStrategy: new RemoteAuth({
//     //     store,
//     //     backupSyncIntervalMs: 300000,
//     //   }),
//     // });
//     const client = new Client({
//       authStrategy: new LocalAuth({ clientId: clientID }),
//     });

//     client.on("authenticated", (session) => {
//       console.log(`Whatsapp client authenticated successfully: ${session}`);
//     });

//     client.on("qr", (qr) => {
//       eventEmitter.emit("qrCodeReceived", qr);
//       console.log("QR RECEIVED IN MODEL", qr);
//     });

//     client.on("ready", () => {
//       console.log("Client is ready!");
//     });

//     // client.initialize();
//   } catch (error) {
//     console.log(`Error initialize whatsapp client ${error}`);
//   }
// };

// whatsappModel.js

export const createWhatsAppSession = (id, callback) => {
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
    callback({ id, event: "qr", data: qr });
  });

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
    callback({ id, event: "authenticated", data: "Client is authenticated!" });
  });

  client.on("ready", () => {
    allSessionsObject[id] = client;
    console.log(`Client is ready : ${allSessionsObject[id]}`);
    callback({ id, event: "ready", data: "Client is ready!" });
  });

  client.initialize();
};
