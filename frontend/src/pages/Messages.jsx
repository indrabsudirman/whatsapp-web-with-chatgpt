import Wrapper from "../assets/wrappers/Message";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const Messages = () => {
  const [currentSocket, setCurrentSocket] = useState(null);
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5100");
    setCurrentSocket(socket);

    if (Object.keys(qrCode).length === 0) {
      console.log("Object is empty");
    }

    socket.on("connect", () => {
      console.log(`Connected with id : ${socket.id}`);
    });

    socket.on("hello", (arg) => {
      console.log(arg); // world
    });
    socket.emit("test", "Hello from client");

    socket.on("qr", (data) => {
      const { qr } = data;
      console.log(`Get QR from backend ${qr}`);
      setQrCode(qr);
    });
    socket.on("authenticated", (data) => {
      const { id, message } = data;
      console.log(
        `Client is Authenticated with id ${id} and the message ${message}`
      );
    });
    socket.on("ready", (data) => {
      const { id, message } = data;
      console.log(`Client is Ready with id ${id} and the message ${message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createSessionForWhatsApp = () => {
    currentSocket.emit("createSession", {
      message: "session starts from FE", //rencana id session pakai phonenumber di cookie
    });
    console.log(`Start create session FE ...`);
  };

  return (
    <Wrapper>
      <h4>Scan this QR using your WhatsApp. </h4>
      <div>
        {qrCode === "" ? (
          <button type="button" onClick={createSessionForWhatsApp}>
            Refresh
          </button>
        ) : (
          <QRCode value={qrCode} />
        )}
      </div>
    </Wrapper>
  );
};

export default Messages;
