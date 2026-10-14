import { io, type Socket } from "socket.io-client";

const LOCAL_URL = "http://localhost:3000";
const PROD_URL = "https://hungrykart-backend.onrender.com";

export const SERVER_URL: string =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? LOCAL_URL : PROD_URL);

export function connectSocket(token: string): Socket {
  return io(SERVER_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
  });
}



// import { io, type Socket } from "socket.io-client";

// export const SERVER_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// export function connectSocket(token: string): Socket {
//   return io(SERVER_URL, {
//     auth: { token },
//     transports: ["websocket", "polling"],
//     reconnection: true,
//   });
// }


