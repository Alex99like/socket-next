'use client'

import { LoadingAuth } from '@/components/shared/loading-auth/loading-auth'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from './use-auth'

const Template = ({ 
  children 
}: { children: React.ReactNode }) => {
  const { loading } = useAuthStore()

  return (
    <AnimatePresence>
      {loading && <LoadingAuth />}
      {children}
    </AnimatePresence>
  )
}

export default Template