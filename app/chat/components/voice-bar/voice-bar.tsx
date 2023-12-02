import { useEffect } from 'react';
import styles from './voice-bar.module.scss'
import { FaTrash } from "react-icons/fa6";

export const VoiceBar = () => {
  

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button>
          <FaTrash />
        </button>
      </div>
    </div>
  )
}
