'use client'
import { FormEvent, useState } from 'react'
import styles from './auth.module.scss'
import { loginWithGoogle, signInWithEmailAndPassword, signUpWithEmail, signUpWithEmailAndPassword } from './actions'
import { createSupabaseBrowerClient } from '@/lib/supabase/client'
import { Logo } from '@/assets/icon/Logo'
import { SiGmail } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { motion } from 'framer-motion'
import { useAuthStore } from './use-auth'
import { useRouter } from 'next/navigation'

const PageAuth = () => {
  const { push } = useRouter()
  const { setLoading } = useAuthStore()

  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const [email, setEmail] = useState('')

  const googleAuth = async () => {
    const supabase = createSupabaseBrowerClient();
    await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/oauth/callback`,
			},
		});
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = await signUpWithEmail({ email })
    const { error } = JSON.parse(data) 
    console.log(error)
    if (!error) {
      push('/auth/confirmation')
    }

    
    //console.log(JSON.parse('res'))
  }

  return (
    <motion.div 
      className={styles.wrapper}
      id='form-auth'
      key={'form-auth'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Logo />
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.oauth}>
          <span />
          <button>Войти Через</button>
          <span />
        </div>
        <div className={styles['btn-oauth']}>
          <button onClick={googleAuth} type='button'>
            <SiGmail />
            <b>Gmail</b>
          </button>
          <button>
            <FaApple />
            <b>Apple ID</b>
          </button>
        </div>

        <div className={styles.email}>
          <span />
          <button>Войти по Почте @</button>
          <span />
        </div>

        <input 
          placeholder='Ваша почта'
          type='email'
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <button type='submit'>Войти через почту</button>

        {/* <hr className={styles.line} />

        <input 
          placeholder='Email'
          type='email'
          //value={data.email} 
          //onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} 
        />
        <input 
          placeholder='Password'
          type='password'
          //value={data.password} 
          //onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))} 
        />

        <button>Войти</button>
        <button className={styles.register}>Регистрация</button> */}
      </form>
    </motion.div>
  )
}

export default PageAuth