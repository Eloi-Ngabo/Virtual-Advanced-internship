import React from 'react'
import Image from 'next/image'
// import login from '../public/assets/login.png'

export default function page() {
  return (
     <div className='container'>
        <div className='row'>
         <div className='settings__login--wrapper'>
         <img src="/assets/login.png" alt="Login" />
            <div className='settings__login--text'> Log in to your account to see your Library.</div>
             <button className='btn settings__login--btn'>Login</button>
         </div>
        </div>
      
    </div>
  )
}

