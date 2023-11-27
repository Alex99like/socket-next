import { SocketProvider } from '@/providers/socket-provider';
import { Chat } from '@/components/chat/chat';


export default function Home() {
  return (
    <main>
      <SocketProvider>
        <Chat /> 
      </SocketProvider>
    </main>
  )
}
