'use client'

import { SocketProvider } from '@/providers/socket-provider'
import { SupabaseProvider } from '@/providers/supabase-provider'
import { AnimatePresence } from 'framer-motion'
import { PropsWithChildren } from 'react'

const TemplateChat = ({
  children
}: PropsWithChildren) => {

  return (
    <SocketProvider>
      <SupabaseProvider>
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </SupabaseProvider>
    </SocketProvider>
  )
}

export default TemplateChat