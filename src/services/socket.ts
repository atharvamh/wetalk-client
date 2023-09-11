import { io } from "socket.io-client";
import localStorageService from "./localStorageService";

const token = localStorageService.get("x-token") ?? "";

const socket = io(import.meta.env.VITE_SERVER_URL, {
    transports : ['websocket', 'polling'],
    reconnectionAttempts : 5,
    reconnectionDelay : 1000,
    extraHeaders: {
        Authorization: `Bearer ${token}`,
    }
});

export default socket;