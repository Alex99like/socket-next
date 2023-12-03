"use client";

import { useChatStore } from "@/app/chat/use-chat";
import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import toast from "react-hot-toast";
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
  const { setMessage, currentUser, message } = useChatStore()

  useEffect(() => {
    setSocket(socketClient())
  }, []);
  console.log({ currentUser })
  useEffect(() => {
    if (socket) {
      socket.on('online-user', (data) => {
        setOnlineUsers(prev => Array.from(new Set([...prev, data].flat(1))))
      })
      socket.on('msg-receive', (data) => {
        setMessage(data)
      })
    }
  }, [socket])

  useEffect(() => {
    const msg = message[message.length - 1]
    if (msg?.from !== currentUser?.id && !msg.self) {
      toast('У вас новое сообщение')
    }
  }, [message])

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
