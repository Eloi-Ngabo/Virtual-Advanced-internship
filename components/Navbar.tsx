
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



// "use client";
// import React, { useEffect, useState } from 'react';
// import { auth, signOut } from '../Firebase';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import LoginModal from './LoginModal';
 import Image from "next/image";
import logo from '../public/assets/logo.png'




export default function Navbar() {
  return (
    <>
      {/* SIDE NAVIGATION */}
      <aside className="sidebar">
        <div className="logo-container">

           <div className="sidebar__logo">
             <Image src={logo} alt="logo" priority />
           </div>
          {/* <span className="logo-text">Summarist</span> */}
        </div>

        <nav className="nav-menu">
          <div className="nav-group">
            <a href="/book" className="nav-item active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              For you
            </a>
            <a href="/Library" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              My Library
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Highlights
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </a>
          </div>

          <div className="nav-group bottom-nav">
            <a href="/settings" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Help & Support
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </a>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="content-wrapper">
        {/* HEADER (SEARCH BAR) */}
        <header className="top-header">
          <div className="search-container">
            <input type="text" placeholder="Search for books" />
            <button className="search-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </header>
      </main>
    </>
  );
}

        