"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import LoginModal from '@/components/LoginModal';

export default function page() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
     <div className='container'>
        <div className='row'>
         <div className='settings__login--wrapper'>
         <img src="/assets/login.png" alt="Login" />
            <div className='settings__login--text'> Log in to your account to see your Library.</div>
             <button className='btn settings__login--btn' onClick={() => setShowLoginModal(true)}>Login</button>
         </div>
        </div>
      {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
         )}
    </div>
  )
}

