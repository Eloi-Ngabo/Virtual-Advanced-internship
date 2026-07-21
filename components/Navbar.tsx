
// "use client";
// import React, { useEffect, useState } from 'react';
// import { auth, signOut } from '../Firebase';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import LoginModal from './LoginModal';
//  import Image from "next/image";
// import logo from '../public/assets/logo.png'



// export default function Navbar() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogoutClick = async () => {
//     try {
//       await signOut(auth);
//       console.log("Logged out successfully");
//     } catch (err) {
//       console.error("Error signing out:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <nav className="navbar">
//         <div className="navbar__container">
//           <div className="logo">Summarist</div>
//           <div className="nav__loading">Loading...</div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="navbar">
//       <div className="navbar__container">
//         <div className="logo">
//        <figure className="nav__img--mask">
//           <Image src={logo} alt="logo" />
//         </figure>
//         </div>

//         <div className="nav__links">
//           {user ? (
//             <>
//               <span className="user__greet">
//                 Hey, <span className="user__name">{user.isAnonymous ? "Guest" : user.email?.split('@')[0]}</span>
//               </span>
//               <button onClick={handleLogoutClick} className="logout__btn">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <button onClick={() => setShowModal(true)} className="login__btn">
//               Login
//             </button>
//           )}
//         </div>
//       </div>

//       {showModal && <LoginModal onClose={() => setShowModal(false)} />}
//     </nav>
//   );
// }









// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { auth, signOut } from '../Firebase';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import LoginModal from './LoginModal';
// import Image from "next/image";
// import logo from '../public/assets/logo.png';
// import { 
//   Home, 
//   Library, 
//   Highlighter, 
//   Search, 
//   Settings, 
//   HelpCircle, 
//   LogOut 
// } from 'lucide-react';


// export default function NavbarAndSidebar() {
//   const router = useRouter();
  
//   // Auth state management
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   // Sidebar navigation states
//   const [activeTab, setActiveTab] = useState('Home');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogoutClick = async () => {
//     try {
//       await signOut(auth);
//       console.log("Logged out successfully");
//     } catch (err) {
//       console.error("Error signing out:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="layout-loading-wrapper">
//         <nav className="navbar">
//           <div className="navbar__container">
//             <div className="logo">Summarist</div>
//             <div className="nav__loading">Loading...</div>
//           </div>
//         </nav>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-layout">
      
//       {/* ================= TOP NAVBAR COMPONENT ================= */}
//       <nav className="navbar">
//         <div className="navbar__container">
//           <div className="logo">
//             Summarist
//             <figure className="nav__img--mask">
//               <Image src={logo} alt="logo" priority />
//             </figure>
//           </div>

//           <div className="nav__links">
//             {user ? (
//               <>
//                 <span className="user__greet">
//                   Hey, <span className="user__name">{user.isAnonymous ? "Guest" : user.email?.split('@')[0]}</span>
//                 </span>
//                 <button onClick={handleLogoutClick} className="logout__btn">
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <button onClick={() => setShowModal(true)} className="login__btn">
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* ================= SIDEBAR COMPONENT ================= */}
//       <aside className="dashboard-sidebar">
//         <div className="dashboard-sidebar__header">
//           <span className="dashboard-sidebar__brand">Summarist</span>
//         </div>

//         <div className="dashboard-sidebar__search-box">
//           <div className="search-input-wrapper">
//             <Search className="search-input-wrapper__icon" size={16} />
//             <input
//               type="text"
//               placeholder="Search layout..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input-wrapper__field"
//             />
//           </div>
//         </div>

//         <nav className="dashboard-sidebar__nav">
//           {[
//             { name: 'Home', icon: Home, route: '/' },
//             { name: 'My Library', icon: Library, route: '/library' },
//             { name: 'Highlights', icon: Highlighter, route: '/highlights' },
//             { name: 'Search', icon: Search, route: '/search' },
//           ].map((item) => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.name;
//             return (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   setActiveTab(item.name);
//                   if (item.route !== '/') router.push(item.route);
//                 }}
//                 className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
//               >
//                 <Icon size={18} />
//                 <span>{item.name}</span>
//               </button>
//             );
//           })}
//         </nav>

//         <div className="dashboard-sidebar__footer">
//           {[
//             { name: 'Settings', icon: Settings, route: '/settings' },
//             { name: 'Help & Support', icon: HelpCircle, route: '/help' },
//           ].map((item) => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.name;
//             return (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   setActiveTab(item.name);
//                   router.push(item.route);
//                 }}
//                 className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
//               >
//                 <Icon size={18} />
//                 <span>{item.name}</span>
//               </button>
//             );
//           })}

//           <button onClick={handleLogoutClick} className="nav-link nav-link--logout">
//             <LogOut size={18} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Login Authentication Modal */}
//       {showModal && <LoginModal onClose={() => setShowModal(false)} />}
//     </div>
//   );
// }



// // "use client";
// // import React, { useEffect, useState } from 'react';
// // import { auth, signOut } from '../Firebase';
// // import { onAuthStateChanged, User } from 'firebase/auth';
// // import LoginModal from './LoginModal';
//  import Image from "next/image";
// import logo from '../public/assets/logo.png'




// export default function Navbar() {
//   return (
//     <>
//       {/* SIDE NAVIGATION */}
//       <aside className="sidebar">
//         <div className="logo-container">

//            <div className="sidebar__logo">
//              <Image src={logo} alt="logo" priority />
//            </div>
//           {/* <span className="logo-text">Summarist</span> */}
//         </div>

//         <nav className="nav-menu">
//           <div className="nav-group">
//             <a href="/book" className="nav-item active">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                 <polyline points="9 22 9 12 15 12 15 22" />
//               </svg>
//               For you
//             </a>
//             <a href="/library" className="nav-item">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
//                 <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//               </svg>
//               My Library
//             </a>
//             <a href="#" className="nav-item">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M12 20h9" />
//                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//               </svg>
//               Highlights
//             </a>
//             <a href="#" className="nav-item">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//               Search
//             </a>
//           </div>

//           <div className="nav-group bottom-nav">
//             <a href="/settings" className="nav-item">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="3" />
//                 <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//               </svg>
//               Settings
//             </a>
//             <a href="#" className="nav-item">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
//                 <line x1="12" y1="17" x2="12.01" y2="17" />
//               </svg>
//               Help & Support
//             </a>
//             <a href="#" className="nav-item">
//               <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                 <polyline points="16 17 21 12 16 7" />
//                 <line x1="21" y1="12" x2="9" y2="12" />
//               </svg>
//               Logout
//             </a>
//           </div>
//         </nav>
//       </aside>

//       {/* MAIN CONTENT CONTAINER */}
//       <main className="content-wrapper">
//         {/* HEADER (SEARCH BAR) */}
//         <header className="top-header">
//           <div className="search-container">
//             <input type="text" placeholder="Search for books" />
//             <button className="search-button">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//             </button>
//           </div>
//         </header>
//       </main>
//     </>
//   );
// }

        
// import Link from 'next/link'
// import React from 'react'

// export default function Sidebar() {
//   return (
//     <div className='wrapper'>
//         <div className='search__background'>
//             <div className='search__wrapper'>
//             <figure>
//             <img src="logo" alt='' />
//             </figure>
//             <div className='search__content'>
//            <div className='search'>
//             <div className='search__input--wrapper'>
//              <input className='search__input' placeholder='search for books' type='text' value="" />
//               <div className='search__icon'>
//                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 
//                256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 
//                8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 
//                188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z">
//               </path>
//               </svg>
//              </div>
//             </div>
//             </div>
//              <div className='sidebar__toggle--btn'>
//                 <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                 <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 
//                 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 
//                 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 
//                 1 11.5Z" fill="currentColor">
//                 </path>
//                 </svg>
//              </div>
//             </div>
//          </div>
//         </div>
//          <div className='sidebar__overlay sidebar__overlay--hidden'></div>
//          <div className='sidebar sidebar--closed'>
//             <div className='sidebar__logo'>
//               <img src="/assets/logo.png" alt="Logo" />
//             </div>
//             <div className='sidebar__wrapper'>
//               <div className='sidebar__top'>
//               <a className='sidebar__link--wrapper' href='/book'>
//                  <div className='sidebar__link--line active--tab'></div>
//                  <div className='sidebar__icon--wrapper'>
//                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1
//                      0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 
//                      40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z">
//                      </path>
//                      </svg>
//                  </div>
//                  <div className='sidebar__link--text'>For you</div>
//               </a> 
//               <a className='sidebar__link--wrapper' href="/library">
//                  <div className='sidebar__link--line'></div>
//                  <div className='sidebar__icon--wrapper'>
//                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 
//                     0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z">
//                     </path>
//                     </svg>
//                  </div>
//                 <div className='sidebar__link--text'>My Library</div>
//               </a>
//               <div className="sidebar__link--wrapper sidebar__link--not-allowed">
//                 <div className="sidebar__link--line "></div>
//                 <div className="sidebar__icon--wrapper">
//                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                     <g><path fill="none" d="M0 0h24v24H0z"></path>
//                     <path d="M17.849 11.808l-.707-.707-9.9 9.9H3v-4.243L14.313 5.444l5.657 5.657a1 1 0 0 1 0 1.414l-7.07 7.071-1.415-1.414 6.364-6.364zm-2.121-2.121l-1.415-1.414L5
//                      17.586v1.415h1.414l9.314-9.314zm2.828-7.071l2.829 2.828a1 1 0 0 1 0 1.414L19.97 8.273 15.728 4.03l1.414-1.414a1 1 0 0 1 1.414 0z"></path>
//                      </g></svg></div>
//                      <div className="sidebar__link--text">Highlights</div>
//                  </div>
//                  <div className="sidebar__link--wrapper sidebar__link--not-allowed">
//                     <div className="sidebar__link--line "></div>
//                     <div className="sidebar__icon--wrapper">
//                         <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 
//                         256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 
//                         0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 
//                         23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
//                         </svg></div>
//                         <div className="sidebar__link--text">Search</div>
//                 </div>
//               </div>
//               <div className="sidebar__bottom">
//                 <a className="sidebar__link--wrapper" href="/settings">
//                 <div className="sidebar__link--line "></div>
//                 <div className="sidebar__icon--wrapper">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle>
//                         <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 
//                         0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65
//                          1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 
//                          2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 
//                          1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 
//                          1.65 0 0 0-1.51 1z">
//                         </path></svg>
//                             </div>
//                 <div className="sidebar__link--text">Settings</div>
//                 </a>
//                 <div className="sidebar__link--wrapper sidebar__link--not-allowed">
//                    <div className="sidebar__link--line "></div>
//                    <div className="sidebar__icon--wrapper">
//                     <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
//                     </svg>
//                 </div>
//                     <div className="sidebar__link--text">Help &amp; Support</div>
//                     </div><div className="sidebar__link--wrapper">
//                         <div className="sidebar__link--line "></div>
//                         <div className="sidebar__icon--wrapper">
//                             <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4">
//                             </path><polyline points="16 17 21 12 16 7"></polyline>
//                             <line x1="21" y1="12" x2="9" y2="12"></line></svg>
//                         </div>
//                        <div className="sidebar__link--text">Login</div>
//                     </div>
//                 </div>
//             </div>

//          </div>
//     </div>
//   )
// }