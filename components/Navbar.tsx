



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
//         <div className="logo">Summarist

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



"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signOut } from '../Firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import LoginModal from './LoginModal';
import Image from "next/image";
import logo from '../public/assets/logo.png';
import { 
  Home, 
  Library, 
  Highlighter, 
  Search, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';


export default function NavbarAndSidebar() {
  const router = useRouter();
  
  // Auth state management
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Sidebar navigation states
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (loading) {
    return (
      <div className="layout-loading-wrapper">
        <nav className="navbar">
          <div className="navbar__container">
            <div className="logo">Summarist</div>
            <div className="nav__loading">Loading...</div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      
      {/* ================= TOP NAVBAR COMPONENT ================= */}
      <nav className="navbar">
        <div className="navbar__container">
          <div className="logo">
            Summarist
            <figure className="nav__img--mask">
              <Image src={logo} alt="logo" priority />
            </figure>
          </div>

          <div className="nav__links">
            {user ? (
              <>
                <span className="user__greet">
                  Hey, <span className="user__name">{user.isAnonymous ? "Guest" : user.email?.split('@')[0]}</span>
                </span>
                <button onClick={handleLogoutClick} className="logout__btn">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => setShowModal(true)} className="login__btn">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR COMPONENT ================= */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__header">
          <span className="dashboard-sidebar__brand">Summarist</span>
        </div>

        <div className="dashboard-sidebar__search-box">
          <div className="search-input-wrapper">
            <Search className="search-input-wrapper__icon" size={16} />
            <input
              type="text"
              placeholder="Search layout..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-wrapper__field"
            />
          </div>
        </div>

        <nav className="dashboard-sidebar__nav">
          {[
            { name: 'Home', icon: Home, route: '/' },
            { name: 'My Library', icon: Library, route: '/library' },
            { name: 'Highlights', icon: Highlighter, route: '/highlights' },
            { name: 'Search', icon: Search, route: '/search' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  if (item.route !== '/') router.push(item.route);
                }}
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="dashboard-sidebar__footer">
          {[
            { name: 'Settings', icon: Settings, route: '/settings' },
            { name: 'Help & Support', icon: HelpCircle, route: '/help' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  router.push(item.route);
                }}
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}

          <button onClick={handleLogoutClick} className="nav-link nav-link--logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Login Authentication Modal */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}