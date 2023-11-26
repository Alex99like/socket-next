'use client'

import { useSocket } from "@/providers/socket-provider"

export const Chat = () => {
  const { socket, isConnected } = useSocket()
  console.log(socket)

  return (
    <div>{isConnected ? 'True' : 'False'}</div>
  )
}
