'use client'
import { FormEvent, useState } from 'react'
import styles from './auth.module.scss'
import { loginWithGoogle, signInWithEmailAndPassword, signUpWithEmail, signUpWithEmailAndPassword } from './actions'
import { createSupabaseBrowerClient } from '@/lib/supabase/client'
import { Logo } from '@/assets/icon/Logo'
import { SiGmail } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const PageAuth = () => {

  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const supabase = createSupabaseBrowerClient();
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/oauth/callback`,
			},
		});
    setLoading(false)
    
    //console.log(JSON.parse('res'))
  }

  return (
    <div className={styles.wrapper}>
      <Logo />
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.oauth}>
          <span />
          <button>Войти Через</button>
          <span />
        </div>
        <div className={styles['btn-oauth']}>
          <button>
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
          value={data.email} 
          onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} 
        />
        
        <button>Войти через почту</button>

        <hr className={styles.line} />

        <input 
          placeholder='Email'
          type='email'
          value={data.email} 
          onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} 
        />
        <input 
          placeholder='Password'
          type='password'
          value={data.password} 
          onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))} 
        />

        <button>Войти</button>
        <button className={styles.register}>Регистрация</button>
      </form>
    </div>
  )
}

export default PageAuth