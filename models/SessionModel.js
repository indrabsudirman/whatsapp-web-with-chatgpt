import { Client, RemoteAuth } from "whatsapp-web.js";

import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";

// Load the session data
const Session = mongoose.connect(process.env.MONGO_DB_LOCAL).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });

  client.initialize();
});

export default Session;
