"use client";
import React, { useState } from 'react'
import Image from "next/image";
import landingImg from '../public/assets/landing.png'
import LoginModal from './LoginModal';


function Landing() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <section id="landing">
      <div className="container">
        <div className="row">
          <div className="landing__wrapper">
            <div className="landing__content">
              <div className="landing__content__title">
                Gain more knowledge <br className="remove--tablet" />
                in less time
              </div>
              <div className="landing__content__subtitle">
                Great summaries for busy people,
                <br className="remove--tablet" />
                individuals who barely have time to read,
                <br className="remove--tablet" />
                and even people who don’t like to read.
              </div>
              <button className="btn home__cta--btn" onClick={() => setShowLoginModal(true)}>
                Login
              </button>
            </div>
            <figure className="landing__image--mask">
              <Image src={landingImg} alt="landing" />
            </figure>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </section>
  )
}

export default Landing



// import React from 'react';
// import Image from "next/image";
// import landing from '../public/assets/landing.png';
// import { useAuth } from './authContext'; // Adjust this import path to match your file structure

// function Landing() {
//   // Pull the authentication states and functions from your context
//   const { user, loginAsGuest, logout } = useAuth();

//   // Simple handler example for the main login action
//   const handleLoginClick = () => {
//     if (user) {
//       // User is already logged in, redirect them to dashboard
//       // If using Next.js App Router: router.push('/dashboard')
//       console.log("Redirecting to dashboard...");
//     } else {
//       // Trigger your login modal display or redirect to /login route
//       console.log("Opening login form/modal...");
//     }
//   };

//   return (
//     <section id="landing">
//       <div className="container">
//         <div className="row">
//           <div className="landing__wrapper">
//             <div className="landing__content">
//               <div className="landing__content__title">
//                 Gain more knowledge <br className="remove--tablet" />
//                 in less time
//               </div>
//               <div className="landing__content__subtitle">
//                 Great summaries for busy people,
//                 <br className="remove--tablet" />
//                 individuals who barely have time to read,
//                 <br className="remove--tablet" />
//                 and even people who don’t like to read.
//               </div>
              
//               <div className="landing__cta__container" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//                 {/* Dynamically adjust the main CTA button depending on auth state */}
//                 <button className="btn home__cta--btn" onClick={handleLoginClick}>
//                   {user ? 'Go to Dashboard' : 'Login'}
//                 </button>

//                 {/* Alternating actions: Show Guest option if logged out, or Log Out button if logged in */}
//                 {!user ? (
//                   <button className="btn btn--secondary" onClick={loginAsGuest}>
//                     Try as Guest
//                   </button>
//                 ) : (
//                   <button className="btn btn--text" onClick={logout}>
//                     Log Out ({user.isGuest ? 'Guest' : user.email})
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <figure className="landing__image--mask">
//               <Image src={landing} alt="landing" priority />
//             </figure>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Landing;
