"use client";

import { useChatStore } from "@/app/chat/use-chat";
import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io } from "socket.io-client";

export function socketClient() {
  const socket = io(`http://localhost:3005`)
  console.log(socket)
  socket.on("connection", () => {
    console.log("Connected")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected")
  })
  

  socket.on("connect_error", async err => {
    console.log(`connect_error due to ${err.message}`)
    await fetch("http://localhost:3005/api/socket")
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
  const { setMessage } = useChatStore()

  useEffect(() => {
    setSocket(socketClient())
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('online-user', (data) => {
        console.log('online')
        setOnlineUsers(prev => Array.from(new Set([...prev, data].flat(1))))
      })
      socket.on('msg-receive', (data) => {
        console.log(data)
        setMessage(data)
      })
    }
  }, [socket])
  console.log(onlineUsers)
  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
