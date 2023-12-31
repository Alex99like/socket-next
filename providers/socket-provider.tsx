"use client";

import { useChatStore } from "@/app/chat/use-chat";
import { HandleWriteType, MessageSocket } from "@/types/message";
import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export function socketClient() {
  const socket = io(`https://chat-test-production-eefa.up.railway.app/`)
  console.log(socket)
  socket.on("connection", () => {
    console.log("Connected")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected")
  })
  

  socket.on("msg-data", (data) => {
    console.log(data)
  })

  socket.on("connect_error", async err => {
    console.log(`connect_error due to ${err.message}`)
    await fetch("https://chat-test-production-eefa.up.railway.app")
  })
  
  return socket
}

type SocketContextType = {
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  onlineUsers: Array<any>
  actionWrite: null | HandleWriteType
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  actionWrite: null
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
  const { setMessage, currentUser, message, setAllMessages } = useChatStore()
  const [actionWrite, setActionWrite] = useState<null | HandleWriteType>(null)

  useEffect(() => {
    setSocket(socketClient())
  }, []);
 
  useEffect(() => {
    if (socket) {
      socket.on('online-user', (data) => {
        setOnlineUsers(prev => Array.from(new Set([...prev, data].flat(1))))
      })
      socket.on('msg-receive', (data) => {
        setMessage(data)
      })
      socket.on('handle-active', (data) => {
        if (data.active) setActionWrite(data)
        else setActionWrite(null)
      })
    }
  }, [socket])

  useEffect(() => {
    const msg = message[message.length - 1]
    //setAllMessages((prev: MessageSocket[]) => prev.map(ms => {
    //  if (ms.id === msg.id) return { ...ms, messageStatus: msg.to === currentUser?.id ? '' }
    //}))
    if (msg?.from !== currentUser?.id && !msg.self) {
      toast('У вас новое сообщение')
    }
  }, [message])

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, actionWrite }}>
      {children}
    </SocketContext.Provider>
  )
}
