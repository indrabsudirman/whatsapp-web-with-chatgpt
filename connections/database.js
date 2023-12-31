import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_LOCAL);
    console.log("Success connected to database!");
  } catch (error) {
    console.log(`Failed to connect database ${error}`);
  }
};

export const getMultiDeviceCollection = (options) => {
  const collectionName = `whatsapp-${options.session}.files`;
  return mongoose.connection.db.collection(collectionName);
};

//   await mongoose.connect(process.env.MONGO_DB_LOCAL).then(
//     () => {
//       // (con) => {
//       //To log all connections
//       //   console.log(con.connections);

//     },
//     (err) => {

//     }
//   );
// };

// dotenv.config({ path: "./config.env" });

//Connect to the cloud
// const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

// mongoose.connect(DB).then(
//   (con) => {
//     console.log(con.connections);
//     console.log('Success connected!');
//   },
//   (err) => {
//     console.log(`Failed to connect database ${err}`);
//   },
// );

//Connect to the local
// mongoose.connect(process.env.DB_LOCAL).then(
//   () => {
//     // (con) => {
//     //To log all connections
//     // console.log(con.connections);
//     console.log("Success connected!");
//   },
//   (err) => {
//     console.log(`Failed to connect database ${err}`);
//   }
// );
