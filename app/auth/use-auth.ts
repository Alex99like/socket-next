import { create } from 'zustand'

interface AuthStoreType {
  loading: boolean
  setLoading: (bool: boolean) => void
}

export const useAuthStore = create<AuthStoreType>()((set) => ({
  loading: false,
  setLoading: (bool) => set(() => {
    return { loading: bool }
  })
}))