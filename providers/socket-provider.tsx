"use client";

import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io } from "socket.io-client";

export function socketClient() {
  const socket = io(`:${3000 + 1}`, { path: "/api/socket", addTrailingSlash: false })
  console.log(socket)
  socket.on("connect", () => {
    console.log("Connected")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected")
  })

  socket.on("connect_error", async err => {
    console.log(`connect_error due to ${err.message}`)
    await fetch("/api/socket")
  })
  
  return socket
}

type SocketContextType = {
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  onlineUsers: Array<any>
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    setSocket(socketClient())
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('check-users', (data) => {
        setOnlineUsers(data)
      })
    }
  }, [socket])
  
  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
