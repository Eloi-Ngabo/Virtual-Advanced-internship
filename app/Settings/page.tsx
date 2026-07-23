// "use client";
// import React, { useEffect, useState } from 'react'
// import LoginModal from '@/components/LoginModal';
// import { onAuthStateChanged, signOut, User } from 'firebase/auth'
// import { auth } from '../Firebase.js'


// export default function page() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//  const [user, setUser] = useState<User | null>(null);
//  useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, setUser);
//   return unsubscribe;
// }, []);
//   return (
//     <div className='container'>
//       <div className='row'>
//         <div className='section__title page__title'>Settings</div>
//         <div className='settings__login--wrapper'>
//           <img src="/assets/login.png" alt="Login" />
//           <div className='settings__login--text'> Log in to your account to see your details.</div>
//           <button className='btn settings__login--btn' onClick={() => setShowLoginModal(true)}>Login</button>
//         </div>
//       </div>
//        {showLoginModal && (
//               <LoginModal onClose={() => setShowLoginModal(false)} />
//             )}
//     </div>
//   )
// }




// "use client";
// import React, { useEffect, useState } from 'react';
// import LoginModal from '@/components/LoginModal';
// import { onAuthStateChanged, signOut, User } from 'firebase/auth';
// import { auth } from '../Firebase';
// // import { auth } from '../Firebase.js';

// export default function SettingsPage() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="section__title page__title">Settings</div>
        
//         {user ? (
//           <LoggedInContent user={user} />
//         ) : (
//           <LoginPrompt onOpenModal={() => setShowLoginModal(true)} />
//         )}
//       </div>

//       {showLoginModal && (
//         <LoginModal onClose={() => setShowLoginModal(false)} />
//       )}
//     </div>
//   );
// }

// // Shown when the user is NOT logged in
// function LoginPrompt({ onOpenModal }: { onOpenModal: () => void }) {
//   return (
//     <div className="settings__login--wrapper">
//       <img src="/assets/login.png" alt="Login" />
//       <div className="settings__login--text">
//         Log in to your account to see your details.
//       </div>
//       <button className="btn settings__login--btn" onClick={onOpenModal}>
//         Login
//       </button>
//     </div>
//   );
// }

// // Shown when the user IS logged in
// function LoggedInContent({ user }: { user: User }) {
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//      <div className="container">
//       <div className="row">
//         <div className="section__title page__title">Settings</div>
//         <div className="setting__content">
//           <div className="settings__sub--title">Your Subscription plan</div>
//           <div className="settings__text">premium</div>
//           </div>
//           <div className="setting__content">
//             <div className="settings__sub--title">Email</div>
//             <div className="settings__text">hanna@gmail.com</div>
//             </div>
//             </div>
//             </div>

//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { User, CreditCard, LogIn, Crown, Mail, ArrowUpRight, LogOut } from "lucide-react";

import LoginModal from "@/components/LoginModal";
import { auth } from "../Firebase";

type SubscriptionStatus = "basic" | "premium" | "premium-plus";

export default function SettingsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus>("basic");

  // Sync real Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getPlanDetails = (status: SubscriptionStatus) => {
    switch (status) {
      case "premium":
        return { label: "Premium", class: "badge--premium" };
      case "premium-plus":
        return { label: "Premium-Plus", class: "badge--premium-plus" };
      default:
        return { label: "Basic", class: "badge--basic" };
    }
  };

  const currentPlan = getPlanDetails(subscription);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  // --- UNAUTHENTICATED STATE ---
  if (!user) {
    return (
      <div className="container">
        <div className="row">
          <div className="section__title page__title">Settings</div>
          <div className="settings__login--wrapper">
            <Image 
              src="/assets/login.png" 
              alt="Login illustration" 
              width={200} 
              height={200} 
            />
            <div className="settings__login--text">
              Log in to your account to see your details.
            </div>
            <button 
              className="btn settings__login--btn" 
              onClick={() => setShowLoginModal(true)}
            >
              <LogIn size={18} className="margin-right-xs" />
              Login
            </button>
          </div>
        </div>

        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </div>
    );
  }

  // --- AUTHENTICATED STATE ---
  return (
    <div className="settings-page">
      {/* Dev Tools State Switcher Bar */}
      <div className="dev-tools">
        <span className="dev-tools__label">Simulate plan states:</span>
        <button 
          onClick={() => setSubscription("basic")} 
          className={`dev-tools__btn ${subscription === "basic" ? "active" : ""}`}
        >
          Basic
        </button>
        <button 
          onClick={() => setSubscription("premium")} 
          className={`dev-tools__btn ${subscription === "premium" ? "active" : ""}`}
        >
          Premium
        </button>
        <button 
          onClick={() => setSubscription("premium-plus")} 
          className={`dev-tools__btn ${subscription === "premium-plus" ? "active" : ""}`}
        >
          Premium-Plus
        </button>
        <button 
          onClick={handleLogout} 
          className="dev-tools__btn dev-tools__btn--logout"
        >
          <LogOut size={14} className="margin-right-xs" />
          Logout
        </button>
      </div>

      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* Section Block: Settings Profile Data */}
        <section className="settings-section">
          <div className="settings-section__header">
            <User className="settings-section__icon" size={20} />
            <h2 className="settings-section__title">User Profile</h2>
          </div>
          
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row__meta">
                <span className="settings-row__label">Email Address</span>
                <span className="settings-row__value flex-align-center">
                  <Mail size={14} className="margin-right-xs" />
                  {user.email || "hanna@gmail.com"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Block: Subscription Framework */}
        <section className="settings-section">
          <div className="settings-section__header">
            <CreditCard className="settings-section__icon" size={20} />
            <h2 className="settings-section__title">Subscription Status</h2>
          </div>

          <div className="settings-card">
            <div className="settings-row settings-row--split">
              <div className="settings-row__meta">
                <span className="settings-row__label">Your Active Plan</span>
                <div className="flex-align-center margin-top-xs">
                  <span className={`badge ${currentPlan.class}`}>
                    {subscription !== "basic" && <Crown size={12} className="margin-right-xs" />}
                    {currentPlan.label}
                  </span>
                </div>
              </div>

              {subscription === "basic" ? (
                <Link href="/sales" className="btn btn--upgrade btn--icon-layout">
                  Upgrade to Premium
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <button className="btn btn--secondary">
                  Manage Billing
                </button>
              )}
            </div>
            
            {subscription === "basic" && (
              <div className="settings-card__footer">
                <p className="settings-card__footer-text">
                  You are currently using the limited free tier plan. Upgrade to unlock full book summaries, audio playback elements, and offline reading utilities.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}










// import { User, CreditCard, LogIn, Crown, Mail, ArrowUpRight } from "lucide-react";


// // Types for our component state simulation
// type SubscriptionStatus = "basic" | "premium" | "premium-plus";

// export default function SettingsPage() {
//   // Mock states to help you test all the required criteria in isolation
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
//   const [subscription, setSubscription] = useState<SubscriptionStatus>("basic");
//   const [userEmail] = useState<string>("user@example.com");

//   // Helper helper to format badges cleanly
//   const getPlanDetails = (status: SubscriptionStatus) => {
//     switch (status) {
//       case "premium":
//         return { label: "Premium", class: "badge--premium" };
//       case "premium-plus":
//         return { label: "Premium-Plus", class: "badge--premium-plus" };
//       default:
//         return { label: "Basic", class: "badge--basic" };
//     }
//   };

//   const currentPlan = getPlanDetails(subscription);

//   // --- UNAUTHENTICATED STATE ---
//   if (!isLoggedIn) {
//     return (
//       <div className="settings-page">
//         <div className="auth-card">
//           <div className="auth-card__image-container">
//             {/* Login placeholder illustration */}
//             <svg className="auth-card__graphic" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
//           <h1 className="auth-card__title">Log in to view settings</h1>
//           <p className="auth-card__subtitle">
//             Manage your account preference details, subscription models, and personalized content tools.
//           </p>
//           <button 
//             onClick={() => setIsLoggedIn(true)} 
//             className="btn btn--primary btn--icon-layout"
//           >
//             <LogIn size={18} />
//             Login to Your Account
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // --- AUTHENTICATED STATE ---
//   return (
//     <div className="settings-page">
//       {/* State Switcher Tool Bar (Purely for development/demonstration testing) */}
//       <div className="dev-tools">
//         <span className="dev-tools__label">Simulate account states:</span>
//         <button onClick={() => setSubscription("basic")} className={`dev-tools__btn ${subscription === "basic" ? "active" : ""}`}>Basic</button>
//         <button onClick={() => setSubscription("premium")} className={`dev-tools__btn ${subscription === "premium" ? "active" : ""}`}>Premium</button>
//         <button onClick={() => setSubscription("premium-plus")} className={`dev-tools__btn ${subscription === "premium-plus" ? "active" : ""}`}>Premium-Plus</button>
//         <button onClick={() => setIsLoggedIn(false)} className="dev-tools__btn dev-tools__btn--logout">Logout</button>
//       </div>

//       <div className="settings-container">
//         <h1 className="settings-title">Settings</h1>

//         {/* Section Block: Settings Profile Data */}
//         <section className="settings-section">
//           <div className="settings-section__header">
//             <User className="settings-section__icon" size={20} />
//             <h2 className="settings-section__title">User Profile</h2>
//           </div>
          
//           <div className="settings-card">
//             <div className="settings-row">
//               <div className="settings-row__meta">
//                 <span className="settings-row__label">Email Address</span>
//                 <span className="settings-row__value flex-align-center">
//                   <Mail size={14} className="margin-right-xs" />
//                   {userEmail}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Section Block: Subscription Framework */}
//         <section className="settings-section">
//           <div className="settings-section__header">
//             <CreditCard className="settings-section__icon" size={20} />
//             <h2 className="settings-section__title">Subscription Status</h2>
//           </div>

//           <div className="settings-card">
//             <div className="settings-row settings-row--split">
//               <div className="settings-row__meta">
//                 <span className="settings-row__label">Your Active Plan</span>
//                 <div className="flex-align-center margin-top-xs">
//                   <span className={`badge ${currentPlan.class}`}>
//                     {subscription !== "basic" && <Crown size={12} className="margin-right-xs" />}
//                     {currentPlan.label}
//                   </span>
//                 </div>
//               </div>

//               {/* Dynamic Action Trigger conditional logic */}
//               {subscription === "basic" ? (
//                 <Link href="/choose-plan" className="btn btn--upgrade btn--icon-layout">
//                   Upgrade to Premium
//                   <ArrowUpRight size={16} />
//                 </Link>
//               ) : (
//                 <button className="btn btn--secondary">
//                   Manage Billing
//                 </button>
//               )}
//             </div>
            
//             {subscription === "basic" && (
//               <div className="settings-card__footer">
//                 <p className="settings-card__footer-text">
//                   You are currently using the limited free tier plan. Upgrade to unlock full book summaries, audio playback elements, and offline reading utilities.
//                 </p>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import LoginModal from "@/components/LoginModal";
// import { User, CreditCard, LogIn, Crown, Mail, ArrowUpRight } from "lucide-react";

// type SubscriptionStatus = "basic" | "premium" | "premium-plus";

// export default function SettingsPage() {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
//   const [subscription, setSubscription] = useState<SubscriptionStatus>("basic");
//   const [userEmail] = useState<string>("user@example.com");

//   const getPlanDetails = (status: SubscriptionStatus) => {
//     switch (status) {
//       case "premium":
//         return { label: "Premium", class: "badge--premium" };
//       case "premium-plus":
//         return { label: "Premium-Plus", class: "badge--premium-plus" };
//       default:
//         return { label: "Basic", class: "badge--basic" };
//     }
//   };

//   const currentPlan = getPlanDetails(subscription);

//   // --- UNAUTHENTICATED STATE ---
//   if (!isLoggedIn) {
//     return (
//       <div className="container">
//         <div className="row">
//           <div className="section__title page__title">Settings</div>
//           <div className="settings__login--wrapper">
//             <Image 
//               src="/assets/login.png" 
//               alt="Login illustration" 
//               width={200} 
//               height={200} 
//             />
//             <div className="settings__login--text">
//               Log in to your account to see your details.
//             </div>
//             <button 
//               className="btn settings__login--btn" 
//               onClick={() => setShowLoginModal(true)}
//             >
//               <LogIn size={18} className="margin-right-xs" />
//               Login
//             </button>
//           </div>
//         </div>

//         {/* Modal display when state is true */}
//         {showLoginModal && (
//           <LoginModal 
//             onClose={() => setShowLoginModal(false)} 
//           />
//         )}
//       </div>
//     );
//   }

//   // --- AUTHENTICATED STATE ---
//   return (
//     <div className="settings-page">
//       {/* Dev Tools State Switcher Bar */}
//       <div className="dev-tools">
//         <span className="dev-tools__label">Simulate account states:</span>
//         <button 
//           onClick={() => setSubscription("basic")} 
//           className={`dev-tools__btn ${subscription === "basic" ? "active" : ""}`}
//         >
//           Basic
//         </button>
//         <button 
//           onClick={() => setSubscription("premium")} 
//           className={`dev-tools__btn ${subscription === "premium" ? "active" : ""}`}
//         >
//           Premium
//         </button>
//         <button 
//           onClick={() => setSubscription("premium-plus")} 
//           className={`dev-tools__btn ${subscription === "premium-plus" ? "active" : ""}`}
//         >
//           Premium-Plus
//         </button>
//         <button 
//           onClick={() => setIsLoggedIn(false)} 
//           className="dev-tools__btn dev-tools__btn--logout"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="settings-container">
//         <h1 className="settings-title">Settings</h1>

//         {/* Section Block: Settings Profile Data */}
//         <section className="settings-section">
//           <div className="settings-section__header">
//             <User className="settings-section__icon" size={20} />
//             <h2 className="settings-section__title">User Profile</h2>
//           </div>
          
//           <div className="settings-card">
//             <div className="settings-row">
//               <div className="settings-row__meta">
//                 <span className="settings-row__label">Email Address</span>
//                 <span className="settings-row__value flex-align-center">
//                   <Mail size={14} className="margin-right-xs" />
//                   {userEmail}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Section Block: Subscription Framework */}
//         <section className="settings-section">
//           <div className="settings-section__header">
//             <CreditCard className="settings-section__icon" size={20} />
//             <h2 className="settings-section__title">Subscription Status</h2>
//           </div>

//           <div className="settings-card">
//             <div className="settings-row settings-row--split">
//               <div className="settings-row__meta">
//                 <span className="settings-row__label">Your Active Plan</span>
//                 <div className="flex-align-center margin-top-xs">
//                   <span className={`badge ${currentPlan.class}`}>
//                     {subscription !== "basic" && <Crown size={12} className="margin-right-xs" />}
//                     {currentPlan.label}
//                   </span>
//                 </div>
//               </div>

//               {/* Dynamic Action Trigger conditional logic */}
//               {subscription === "basic" ? (
//                 <Link href="/choose-plan" className="btn btn--upgrade btn--icon-layout">
//                   Upgrade to Premium
//                   <ArrowUpRight size={16} />
//                 </Link>
//               ) : (
//                 <button className="btn btn--secondary">
//                   Manage Billing
//                 </button>
//               )}
//             </div>
            
//             {subscription === "basic" && (
//               <div className="settings-card__footer">
//                 <p className="settings-card__footer-text">
//                   You are currently using the limited free tier plan. Upgrade to unlock full book summaries, audio playback elements, and offline reading utilities.
//                 </p>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }




