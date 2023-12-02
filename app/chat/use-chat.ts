import { MessageSocket } from '@/types/message'
import { IProfile } from '@/types/profile'
import { create } from 'zustand'

interface ChatState {
  currentUser: IProfile | null
  setProfile: (prof: IProfile) => void
  message: MessageSocket[]
  setMessage: (msg: MessageSocket) => void
}


export const useChatStore = create<ChatState>()((set) => ({
  currentUser: null,
  setProfile: (profile) => set(() => {
    return { currentUser: profile }
  }),
  message: [],
  setMessage: (msg) => set(({ message }) => {
    return { message: [...message, msg] }
  })
}))