






// "use client";


// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { onAuthStateChanged, User, getAuth } from "firebase/auth";
// import { doc, setDoc, arrayUnion, getDoc, getFirestore } from "firebase/firestore";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { Clock, Star, Bookmark, BookmarkCheck, BookOpen, AudioLinesIcon } from "lucide-react";
// import { BiBulb } from "react-icons/bi";


// const firebaseConfig = {
//   apiKey: "AIzaSyAFGAUQOFxygF20GokNfwP_oKc_chG5SDc",
//   authDomain: "advanced-intership.firebaseapp.com",
//   projectId: "advanced-intership",
//   storageBucket: "advanced-intership.firebasestorage.app",
//   messagingSenderId: "497136065100",
//   appId: "1:497136065100:web:cf41621bb94d7e080e72e9"
// };

// const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const db = getFirestore(firebaseApp);
// const auth = getAuth(firebaseApp);

// const useAuthModal = () => ({ openAuthModal: () => console.log("Trigger custom authentication context modal visibility.") });

// interface Book {
//   subTitle: string;
//   id: string;
//   title: string;
//   author: string;
//   imageLink: string;
//   audioLink: string;
//   audioLength: number;
//   isPremium: boolean;
//   bookDescription: string;
//   authorDescription: string;
//   keyIdeas: number;
//   tags: string[];
//   type: string;
//   averageRating?: number; 
//   totalRating?: number;
// }

// export default function BookPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { openAuthModal } = useAuthModal();

//   const [book, setBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [isSaved, setIsSaved] = useState<boolean>(false);
  
//   const [user, setUser] = useState<User | null>(null);
//   const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

//   const formatDuration = (seconds: number | undefined) => {
//     if (!seconds) return "5 mins"; 
//     const minutes = Math.floor(seconds / 60);
//     return `${minutes} mins`;
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           const userDocRef = doc(db, "users", currentUser.uid);
//           const userDocSnap = await getDoc(userDocRef);
          
//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             setIsSubscribed(!!userData.isSubscribed);
//             if (userData.savedBooks && Array.isArray(userData.savedBooks)) {
//               setIsSaved(userData.savedBooks.includes(id));
//             }
//           }
//         } catch (err) {
//           console.error("Error evaluating subscription mapping flags:", err);
//         }
//       } else {
//         setIsSubscribed(false);
//         setIsSaved(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [id]);

//   useEffect(() => {
//     if (!id) return;

//     const fetchBook = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
//         );
//         if (!response.ok) throw new Error("Could not fetch target resource payload schema.");
        
//         const data = await response.json();
//         setBook(data);
//       } catch (error) {
//         console.error("Failed book content aggregation:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBook();
//   }, [id]);

//   const handleMediaAccess = () => {
//     if (!user) {
//       openAuthModal();
//       return;
//     }

//     if (book?.isPremium && !isSubscribed) {
//       router.push("/choose-plan");
//       return;
//     }

//     router.push(`/book/${id}/player`);
//   };

//   const handleAddToLibrary = async () => {
//     if (!user) {
//       openAuthModal();
//       return;
//     }

//     try {
//       setSaving(true);
//       const userLibraryRef = doc(db, "users", user.uid);
      
//       await setDoc(
//         userLibraryRef,
//         { savedBooks: arrayUnion(id) },
//         { merge: true }
//       );
      
//       setIsSaved(true);
//     } catch (error) {
//       console.error("Database payload writing failure encountered:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="book-page__center-state">
//         <div className="skeleton-pulse skeleton-box" />
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="book-page__center-state">
//         <p className="error-message-text">Requested content profile could not be located.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="book-view-container">
//       <div className="book-layout-grid">
    
//         {/* Left Column: Artwork */}
//         <div className="artwork-panel-column">
//           <div className="sticky-artwork-wrapper">
//             <img 
//               src={book.imageLink || ""} 
//               alt={book.title} 
//               className="featured-cover-image" 
//             />
//             {book.isPremium && <span className="premium-badge-tag">Premium Edition</span>}
//           </div>
//         </div>

//         {/* Right Column: Details & Metas */}
//         <div className="details-panel-column">
//           <header className="book-header-group">
//             <h1 className="display-title">{book.title || "Untitled Book"}</h1>
//             <p className="display-author">{book.author || "Unknown Author"}</p>
//             <h2 className="display-subtitle">{book.subTitle}</h2>
//           </header>

//           <div className="attribute-strip-row">
//             <div className="metric-chip">
//               <Star className="chip-icon rating-fill" />
//               <span>{book.averageRating?.toFixed(1) || "0.0"} ({book.totalRating || "0"} ratings)</span>
//             </div>
//             <div className="metric-chip">
//               <Clock className="chip-icon" />
//               <span>{formatDuration(book.audioLength)}</span>
//             </div>
//             <div className="metric-chip">
//               <BiBulb className="chip-icon" />
//               <span>{book.keyIdeas || "0"} Key Ideas</span>
//             </div>
//             <div className="metric-chip">
//               <AudioLinesIcon className="chip-icon" />
//               <span>{book.type || "Audio"}</span>
//             </div>
//           </div>

//           <div className="action-button-matrix">
//             <button onClick={handleMediaAccess} className="cta-button primary-action-btn">
//               <BookOpen className="btn-embed-icon" />
//               Read 
//             </button>
//             <button onClick={handleMediaAccess} className="cta-button secondary-action-btn">
//               <AudioLinesIcon className="btn-embed-icon" />
//               Listen 
//             </button>
//             <button 
//               onClick={handleAddToLibrary} 
//               disabled={saving || isSaved} 
//               className={`cta-button library-action-btn ${isSaved ? 'state-active' : ''}`}
//             >
//               {isSaved ? <BookmarkCheck className="btn-embed-icon marker-active" /> : <Bookmark className="btn-embed-icon" />}
//               {saving ? "Processing..." : isSaved ? "In Your Library" : "Add to Library"}
//             </button>
//           </div>

//           <div className="tag-cloud-wrapper">
//             {book.tags && book.tags.map((tag, index) => (
//               <span key={index} className="pill-tag-node">{tag}</span>
//             ))}
//           </div>

//           <hr className="layout-divider-line" />

//           <section className="narrative-summary-block">
//             <h3 className="section-title">What's it about?</h3>
//             <p className="body-narrative-text">{book.bookDescription}</p>

//             <h3 className="section-title section-title--spacing">About the author</h3>
//             <p className="body-narrative-text">{book.authorDescription}</p>
//           </section>
//         </div>

//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { onAuthStateChanged, User, getAuth } from "firebase/auth";
// import { doc, setDoc, arrayUnion, getDoc, getFirestore } from "firebase/firestore";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import {
//   Clock,
//   Star,
//   Bookmark,
//   BookmarkCheck,
//   BookOpen,
//   AudioLinesIcon
// } from "lucide-react";
// import { BiBulb } from "react-icons/bi";


// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyAFGAUQOFxygF20GokNfwP_oKc_chG5SDc",
//   authDomain: "advanced-intership.firebaseapp.com",
//   projectId: "advanced-intership",
//   storageBucket: "advanced-intership.firebasestorage.app",
//   messagingSenderId: "497136065100",
//   appId: "1:497136065100:web:cf41621bb94d7e080e72e9"
// };

// const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const db = getFirestore(firebaseApp);
// const auth = getAuth(firebaseApp);

// // Mock Hook for Auth Modal Context
// const useAuthModal = () => ({
//   openAuthModal: () => console.log("Trigger custom authentication context modal visibility.")
// });

// interface Book {
//   id: string;
//   title: string;
//   subTitle: string;
//   author: string;
//   imageLink: string;
//   audioLink: string;
//   audioLength: number;
//   isPremium: boolean;
//   bookDescription: string;
//   authorDescription: string;
//   keyIdeas: number;
//   tags: string[];
//   type: string;
//   averageRating?: number;
//   totalRating?: number;
// }

// export default function BookPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { openAuthModal } = useAuthModal();

//   const [book, setBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [isSaved, setIsSaved] = useState<boolean>(false);

//   const [user, setUser] = useState<User | null>(null);
//   const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

//   const formatDuration = (seconds?: number) => {
//     if (!seconds) return "5 mins";
//     const minutes = Math.floor(seconds / 60);
//     return `${minutes} mins`;
//   };

//   // Auth State Listener
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);

//       if (currentUser) {
//         try {
//           const userDocRef = doc(db, "users", currentUser.uid);
//           const userDocSnap = await getDoc(userDocRef);

//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             setIsSubscribed(!!userData.isSubscribed);
//             if (Array.isArray(userData.savedBooks)) {
//               setIsSaved(userData.savedBooks.includes(id));
//             }
//           }
//         } catch (err) {
//           console.error("Error evaluating subscription status:", err);
//         }
//       } else {
//         setIsSubscribed(false);
//         setIsSaved(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [id]);

//   // Fetch Book Payload
//   useEffect(() => {
//     if (!id) return;

//     const fetchBook = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
//         );
//         if (!response.ok) throw new Error("Could not fetch target resource payload schema.");

//         const data = await response.json();
//         setBook(data);
//       } catch (error) {
//         console.error("Failed book content aggregation:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBook();
//   }, [id]);

//   const handleMediaAccess = () => {
//     if (!user) {
//       openAuthModal();
//       return;
//     }

//     if (book?.isPremium && !isSubscribed) {
//       router.push("/choose-plan");
//       return;
//     }

//     router.push(`/book/${id}/player`);
//   };

//   const handleAddToLibrary = async () => {
//     if (!user) {
//       openAuthModal();
//       return;
//     }

//     try {
//       setSaving(true);
//       const userLibraryRef = doc(db, "users", user.uid);

//       await setDoc(
//         userLibraryRef,
//         { savedBooks: arrayUnion(id) },
//         { merge: true }
//       );

//       setIsSaved(true);
//     } catch (error) {
//       console.error("Database payload writing failure encountered:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="book-page__center-state">
//         <div className="skeleton-pulse skeleton-box" />
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="book-page__center-state">
//         <p className="error-message-text">Requested content profile could not be located.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="book-view-container">
//       <div className="book-layout-grid">
//         {/* Left Column: Cover & Badge */}
//         <div className="artwork-panel-column">
//           <div className="sticky-artwork-wrapper">
//             <img
//               src={book.imageLink || ""}
//               alt={book.title}
//               className="featured-cover-image"
//             />
//             {book.isPremium && (
//               <span className="premium-badge-tag">Premium Edition</span>
//             )}
//           </div>
//         </div>

//         {/* Right Column: Content & Controls */}
//         <div className="details-panel-column">
//           <header className="book-header-group">
//             <h1 className="display-title">{book.title || "Untitled Book"}</h1>
//             <p className="display-author">{book.author || "Unknown Author"}</p>
//             <h2 className="display-subtitle">{book.subTitle}</h2>
//           </header>

//           <div className="attribute-strip-row">
//             <div className="metric-chip">
//               <Star className="chip-icon rating-fill" />
//               <span>
//                 {book.averageRating?.toFixed(1) || "0.0"} ({book.totalRating || "0"}{" "}
//                 ratings)
//               </span>
//             </div>
//             <div className="metric-chip">
//               <Clock className="chip-icon" />
//               <span>{formatDuration(book.audioLength)}</span>
//             </div>
//             <div className="metric-chip">
//               <BiBulb className="chip-icon" />
//               <span>{book.keyIdeas || "0"} Key Ideas</span>
//             </div>
//             <div className="metric-chip">
//               <AudioLinesIcon className="chip-icon" />
//               <span>{book.type || "Audio"}</span>
//             </div>
//           </div>

//           <div className="action-button-matrix">
//             <button onClick={handleMediaAccess} className="cta-button primary-action-btn">
//               <BookOpen className="btn-embed-icon" />
//               Read
//             </button>
//             <button onClick={handleMediaAccess} className="cta-button secondary-action-btn">
//               <AudioLinesIcon className="btn-embed-icon" />
//               Listen
//             </button>
//             <button
//               onClick={handleAddToLibrary}
//               disabled={saving || isSaved}
//               className={`cta-button library-action-btn ${isSaved ? "state-active" : ""}`}
//             >
//               {isSaved ? (
//                 <BookmarkCheck className="btn-embed-icon marker-active" />
//               ) : (
//                 <Bookmark className="btn-embed-icon" />
//               )}
//               {saving ? "Processing..." : isSaved ? "In Your Library" : "Add to Library"}
//             </button>
//           </div>

//           {book.tags && book.tags.length > 0 && (
//             <div className="tag-cloud-wrapper">
//               {book.tags.map((tag, index) => (
//                 <span key={index} className="pill-tag-node">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           <hr className="layout-divider-line" />

//           <section className="narrative-summary-block">
//             <h3 className="section-title">What's it about?</h3>
//             <p className="body-narrative-text">{book.bookDescription}</p>

//             <h3 className="section-title section-title--spacing">About the author</h3>
//             <p className="body-narrative-text">{book.authorDescription}</p>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }









"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getFirestore
} from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  AudioLinesIcon,
  CheckCircle2
} from "lucide-react";
import { BiBulb } from "react-icons/bi";


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAFGAUQOFxygF20GokNfwP_oKc_chG5SDc",
  authDomain: "advanced-intership.firebaseapp.com",
  projectId: "advanced-intership",
  storageBucket: "advanced-intership.firebasestorage.app",
  messagingSenderId: "497136065100",
  appId: "1:497136065100:web:cf41621bb94d7e080e72e9"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const useAuthModal = () => ({
  openAuthModal: () => console.log("Trigger custom authentication context modal visibility.")
});

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  audioLink: string;
  audioLength: number;
  isPremium: boolean;
  bookDescription: string;
  authorDescription: string;
  keyIdeas: number;
  tags: string[];
  type: string;
  averageRating?: number;
  totalRating?: number;
}

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "5 mins";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} mins`;
  };

  // Auth & Firestore State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && id) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsSubscribed(!!userData.isSubscribed);

            // Check if book is saved in user library
            if (Array.isArray(userData.savedBooks)) {
              setIsSaved(userData.savedBooks.includes(id as string));
            }

            // Check if book is marked finished
            if (Array.isArray(userData.finishedBooks)) {
              setIsFinished(userData.finishedBooks.includes(id as string));
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setIsSubscribed(false);
        setIsSaved(false);
        setIsFinished(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  // Fetch Book Payload
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!response.ok) throw new Error("Could not fetch target resource payload schema.");

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Failed book content aggregation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleMediaAccess = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (book?.isPremium && !isSubscribed) {
      router.push("/s");
      return;
    }

    router.push(`/book/${id}/player`);
  };

  // Toggle Add / Remove from My Library
  const handleToggleLibrary = async () => {
    if (!user || !id) {
      openAuthModal();
      return;
    }

    try {
      setSaving(true);
      const userLibraryRef = doc(db, "users", user.uid);

      if (isSaved) {
        await setDoc(
          userLibraryRef,
          { savedBooks: arrayRemove(id) },
          { merge: true }
        );
        setIsSaved(false);
      } else {
        await setDoc(
          userLibraryRef,
          { savedBooks: arrayUnion(id) },
          { merge: true }
        );
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Database library payload update failure:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="book-page__center-state">
        <div className="skeleton-pulse skeleton-box" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-page__center-state">
        <p className="error-message-text">Requested content profile could not be located.</p>
      </div>
    );
  }

  return (
    <div className="book-view-container">
      <div className="book-layout-grid">
        {/* Left Column: Cover & Badge */}
        <div className="artwork-panel-column">
          <div className="sticky-artwork-wrapper">
            <img
              src={book.imageLink || ""}
              alt={book.title}
              className="featured-cover-image"
            />
            {book.isPremium && (
              <span className="premium-badge-tag">Premium Edition</span>
            )}
          </div>
        </div>

        {/* Right Column: Content & Controls */}
        <div className="details-panel-column">
          <header className="book-header-group">
            <div className="title-row">
              <h1 className="display-title">{book.title || "Untitled Book"}</h1>
              {isFinished && (
                <span className="finished-pill" title="You have finished this book">
                  <CheckCircle2 className="finished-icon" /> Finished
                </span>
              )}
            </div>
            <p className="display-author">{book.author || "Unknown Author"}</p>
            <h2 className="display-subtitle">{book.subTitle}</h2>
          </header>

          <div className="attribute-strip-row">
            <div className="metric-chip">
              <Star className="chip-icon rating-fill" />
              <span>
                {book.averageRating?.toFixed(1) || "0.0"} ({book.totalRating || "0"}{" "}
                ratings)
              </span>
            </div>
            <div className="metric-chip">
              <Clock className="chip-icon" />
              <span>{formatDuration(book.audioLength)}</span>
            </div>
            <div className="metric-chip">
              <BiBulb className="chip-icon" />
              <span>{book.keyIdeas || "0"} Key Ideas</span>
            </div>
            <div className="metric-chip">
              <AudioLinesIcon className="chip-icon" />
              <span>{book.type || "Audio"}</span>
            </div>
          </div>

          <div className="action-button-matrix">
            <button onClick={handleMediaAccess} className="cta-button primary-action-btn">
              <BookOpen className="btn-embed-icon" />
              Read
            </button>
            <button onClick={handleMediaAccess} className="cta-button secondary-action-btn">
              <AudioLinesIcon className="btn-embed-icon" />
              Listen
            </button>
            <button
              onClick={handleToggleLibrary}
              disabled={saving}
              className={`cta-button library-action-btn ${isSaved ? "state-active" : ""}`}
            >
              {isSaved ? (
                <BookmarkCheck className="btn-embed-icon marker-active" />
              ) : (
                <Bookmark className="btn-embed-icon" />
              )}
              {saving ? "Processing..." : isSaved ? "Saved to Library" : "Add title to My Library"}
            </button>
          </div>

          {book.tags && book.tags.length > 0 && (
            <div className="tag-cloud-wrapper">
              {book.tags.map((tag, index) => (
                <span key={index} className="pill-tag-node">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <hr className="layout-divider-line" />

          <section className="narrative-summary-block">
            <h3 className="section-title">What's it about?</h3>
            <p className="body-narrative-text">{book.bookDescription}</p>

            <h3 className="section-title section-title--spacing">About the author</h3>
            <p className="body-narrative-text">{book.authorDescription}</p>
          </section>
        </div>
      </div>
    </div>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { onAuthStateChanged, User, getAuth } from "firebase/auth";
// import {
//   doc,
//   setDoc,
//   arrayUnion,
//   arrayRemove,
//   getDoc,
//   getFirestore
// } from "firebase/firestore";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import {
//   Clock,
//   Star,
//   Bookmark,
//   BookmarkCheck,
//   BookOpen,
//   AudioLinesIcon,
//   CheckCircle2
// } from "lucide-react";
// import { BiBulb } from "react-icons/bi";


// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyAFGAUQOFxygF20GokNfwP_oKc_chG5SDc",
//   authDomain: "advanced-intership.firebaseapp.com",
//   projectId: "advanced-intership",
//   storageBucket: "advanced-intership.firebasestorage.app",
//   messagingSenderId: "497136065100",
//   appId: "1:497136065100:web:cf41621bb94d7e080e72e9"
// };

// const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const db = getFirestore(firebaseApp);
// const auth = getAuth(firebaseApp);

// const useAuthModal = () => ({
//   openAuthModal: () => console.log("Trigger custom authentication context modal visibility.")
// });

// interface Book {
//   id: string;
//   title: string;
//   subTitle: string;
//   author: string;
//   imageLink: string;
//   audioLink: string;
//   audioLength: number;
//   isPremium: boolean;
//   bookDescription: string;
//   authorDescription: string;
//   keyIdeas: number;
//   tags: string[];
//   type: string;
//   averageRating?: number;
//   totalRating?: number;
// }

// export default function BookPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { openAuthModal } = useAuthModal();

//   const [book, setBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [isSaved, setIsSaved] = useState<boolean>(false);
//   const [isFinished, setIsFinished] = useState<boolean>(false);

//   const [user, setUser] = useState<User | null>(null);
//   const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

//   const formatDuration = (seconds?: number) => {
//     if (!seconds) return "5 mins";
//     const minutes = Math.floor(seconds / 60);
//     return `${minutes} mins`;
//   };

//   // Auth & Firestore State Listener
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);

//       if (currentUser && id) {
//         try {
//           const userDocRef = doc(db, "users", currentUser.uid);
//           const userDocSnap = await getDoc(userDocRef);

//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             setIsSubscribed(!!userData.isSubscribed);

//             // Check if book is saved in user library
//             if (Array.isArray(userData.savedBooks)) {
//               setIsSaved(userData.savedBooks.includes(id as string));
//             }

//             // Check if book is marked finished
//             if (Array.isArray(userData.finishedBooks)) {
//               setIsFinished(userData.finishedBooks.includes(id as string));
//             }
//           }
//         } catch (err) {
//           console.error("Error fetching user data:", err);
//         }
//       } else {
//         setIsSubscribed(false);
//         setIsSaved(false);
//         setIsFinished(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [id]);

//   // Fetch Book Payload
//   useEffect(() => {
//     if (!id) return;

//     const fetchBook = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
//         );
//         if (!response.ok) throw new Error("Could not fetch target resource payload schema.");

//         const data = await response.json();
//         setBook(data);
//       } catch (error) {
//         console.error("Failed book content aggregation:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBook();
//   }, [id]);

//   const handleMediaAccess = () => {
//     if (!user) {
//       openAuthModal();
//       return;
//     }

//     if (book?.isPremium && !isSubscribed) {
//       router.push("/choose-plan");
//       return;
//     }

//     router.push(`/book/${id}/player`);
//   };

//   // Toggle Add / Remove from My Library
//   const handleToggleLibrary = async () => {
//     if (!user || !id) {
//       openAuthModal();
//       return;
//     }

//     try {
//       setSaving(true);
//       const userLibraryRef = doc(db, "users", user.uid);

//       if (isSaved) {
//         await setDoc(
//           userLibraryRef,
//           { savedBooks: arrayRemove(id) },
//           { merge: true }
//         );
//         setIsSaved(false);
//       } else {
//         await setDoc(
//           userLibraryRef,
//           { savedBooks: arrayUnion(id) },
//           { merge: true }
//         );
//         setIsSaved(true);
//       }
//     } catch (error) {
//       console.error("Database library payload update failure:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="book-page__center-state">
//         <div className="skeleton-pulse skeleton-box" />
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="book-page__center-state">
//         <p className="error-message-text">Requested content profile could not be located.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="book-view-container">
//       <div className="book-layout-grid">
//         {/* Left Column: Cover & Badge */}
//         <div className="artwork-panel-column">
//           <div className="sticky-artwork-wrapper">
//             <img
//               src={book.imageLink || ""}
//               alt={book.title}
//               className="featured-cover-image"
//             />
//             {book.isPremium && (
//               <span className="premium-badge-tag">Premium Edition</span>
//             )}
//           </div>
//         </div>

//         {/* Right Column: Content & Controls */}
//         <div className="details-panel-column">
//           <header className="book-header-group">
//             <div className="title-row">
//               <h1 className="display-title">{book.title || "Untitled Book"}</h1>
//               {isFinished && (
//                 <span className="finished-pill" title="You have finished this book">
//                   <CheckCircle2 className="finished-icon" /> Finished
//                 </span>
//               )}
//             </div>
//             <p className="display-author">{book.author || "Unknown Author"}</p>
//             <h2 className="display-subtitle">{book.subTitle}</h2>
//           </header>

//           <div className="attribute-strip-row">
//             <div className="metric-chip">
//               <Star className="chip-icon rating-fill" />
//               <span>
//                 {book.averageRating?.toFixed(1) || "0.0"} ({book.totalRating || "0"}{" "}
//                 ratings)
//               </span>
//             </div>
//             <div className="metric-chip">
//               <Clock className="chip-icon" />
//               <span>{formatDuration(book.audioLength)}</span>
//             </div>
//             <div className="metric-chip">
//               <BiBulb className="chip-icon" />
//               <span>{book.keyIdeas || "0"} Key Ideas</span>
//             </div>
//             <div className="metric-chip">
//               <AudioLinesIcon className="chip-icon" />
//               <span>{book.type || "Audio"}</span>
//             </div>
//           </div>

//           <div className="action-button-matrix">
//             <button onClick={handleMediaAccess} className="cta-button primary-action-btn">
//               <BookOpen className="btn-embed-icon" />
//               Read
//             </button>
//             <button onClick={handleMediaAccess} className="cta-button secondary-action-btn">
//               <AudioLinesIcon className="btn-embed-icon" />
//               Listen
//             </button>
//             <button
//               onClick={handleToggleLibrary}
//               disabled={saving}
//               className={`cta-button library-action-btn ${isSaved ? "state-active" : ""}`}
//             >
//               {isSaved ? (
//                 <BookmarkCheck className="btn-embed-icon marker-active" />
//               ) : (
//                 <Bookmark className="btn-embed-icon" />
//               )}
//               {saving ? "Processing..." : isSaved ? "Saved to Library" : "Add title to My Library"}
//             </button>
//           </div>

//           {book.tags && book.tags.length > 0 && (
//             <div className="tag-cloud-wrapper">
//               {book.tags.map((tag, index) => (
//                 <span key={index} className="pill-tag-node">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           <hr className="layout-divider-line" />

//           <section className="narrative-summary-block">
//             <h3 className="section-title">What's it about?</h3>
//             <p className="body-narrative-text">{book.bookDescription}</p>

//             <h3 className="section-title section-title--spacing">About the author</h3>
//             <p className="body-narrative-text">{book.authorDescription}</p>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }