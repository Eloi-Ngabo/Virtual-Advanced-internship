import React from 'react'
import Image from 'next/image'
// import login from '../public/assets/login.png'

export default function page() {
  return (
     <div className='container'>
        <div className='row'>
         <div className='section_title page__title'>Settings</div>
         <div className='settings__login--wrapper'>
           <img src= "login" alt="logoin" />
            
            <div className='settings__login--text'> Log in to your account to see your Library.</div>
             <button className='btn settings__login--btn'>Login</button>
         </div>
        </div>
      
    </div>
  )
}

