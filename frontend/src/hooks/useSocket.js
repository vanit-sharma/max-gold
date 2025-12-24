// src/hooks/useSocket.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket({ marketId, mtype, type }) {
  const socketRef = useRef(null);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // build once
    if (process.env.REACT_APP_MODE === "development") {
      socketRef.current = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500, // start after 0.5 s
        reconnectionDelayMax: 5_000, // cap at 5 s
      });
      console.log("Development Mode");
    } else {
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
        path: process.env.REACT_APP_SOCKET_PATH,
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500, // start after 0.5 s
        reconnectionDelayMax: 5_000, // cap at 5 s
      });
      console.log("Production Mode");
    }

    const socket = socketRef.current;

    /** --- SOCKET EVENT HANDLERS --- */
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onTick = (payload) => setData(payload);
    const onError = (err) => {
      console.error("Socket error:", err.message);
      // manual fallback reconnect if needed
      if (!socket.connected) socket.connect();
    };

    //console.log("marketId->",marketId,"mtype->",mtype,"type->",type)

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("tick", onTick);
    socket.on("connect_error", onError);
    socket.on("error", onError);
    socket.emit("getMarketData", { marketId, mtype, type });

    /** cleanup on unmount */
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("tick", onTick);
      socket.off("connect_error", onError);
      socket.off("error", onError);
      socket.disconnect();
    };
  }, []);

  return { data, isConnected };
}
