import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

/** @type {import("socket.io-client").Socket | null} */
let socket = null;

export const initSocket = async () => {
  if (socket?.connected) return socket;

  const token = await AsyncStorage.getItem("loginToken");
  socket = io("http://192.168.1.12:3000", {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
  });

  socket.on("connect", () => console.log("Socket connected:", socket?.id));
  return socket;
};

export const getSocket = () => socket;
