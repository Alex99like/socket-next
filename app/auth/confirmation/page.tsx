'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../use-auth'
import styles from './confirmation.module.scss'
import { motion } from 'framer-motion'

const ConfirmationPage = () => {
  const { setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <motion.div 
      id='confirmation'
      key={'confirmation'}
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Вам на почту отправлена ссылка для потверждения Аккаунта</h1>
      <h2>Вам необходимо перейти на почту и потвердить</h2>
    </motion.div>
  )
}

export default ConfirmationPage