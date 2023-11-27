import React from 'react'
import styles from './loading-auth.module.scss'
import { motion } from 'framer-motion'

export const LoadingAuth = () => {
  return (
    <motion.div 
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className={styles.background} 
      />
      <span 
        className={styles.loader}
      ></span>
    </motion.div>
  )
}
