import Wrapper from "../assets/wrappers/Message";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const Messages = () => {
  const socket = io("http://localhost:5100");
  const [qrCode, setQrCode] = useState("");

  const createSessionForWhatsApp = () => {
    socket.emit("createSession", {
      id: "session", //rencana id session pakai phonenumber di cookie
    });
    console.log(`Start create session with id`);
  };

  useEffect(() => {
    if (Object.keys(qrCode).length === 0) {
      console.log("Object is empty");
    }

    socket.on("connect", () => {
      console.log(socket.id);
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
  });

  return (
    <Wrapper>
      <h4>Scan this QR using your WhatsApp. </h4>
      {/* <QRCode value="2@5IEbrPMExxsl7vGyL4LQyCJIIZSpOQFhhbZFpwNdVOjSJdDPLFR091qrKUuXhydUntRvousk5OzKhQ==,iTsLTcWJiTnwsAgBw+qJfA7nu41XndMsgWX0m3h2HAg=,faBI7iVxnYlCvjADzrMxAx4XDX8d9j1+nTpWJp336yI=,MM7aQYEooUY52x0f1i6cRYk0OXKO/PVowDdKsCDYLMU=,1" /> */}
      <div>
        {qrCode === "" ? (
          <button type="button" onClick={createSessionForWhatsApp}>
            Refresh
          </button>
        ) : (
          <QRCode value={qrCode} />
        )}
      </div>
      {/* if (Object.keys(qrCode).length !== 0) ? <QRCode value={qrCode} /> :{" "}
      <button onClick={createSessionForWhatsApp}>Refresh</button> */}
    </Wrapper>
  );
};

export default Messages;
