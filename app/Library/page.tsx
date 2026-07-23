// "use client"
// import React, { useState } from 'react'
// import Image from 'next/image'
// import LoginModal from '@/components/LoginModal';

// export default function page() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   return (
//      <div className='container'>
//         <div className='row'>
//          <div className='settings__login--wrapper'>
//          <img src="/assets/login.png" alt="Login" />
//             <div className='settings__login--text'> Log in to your account to see your Library.</div>
//              <button className='btn settings__login--btn' onClick={() => setShowLoginModal(true)}>Login</button>
//          </div>
//         </div>
//       {showLoginModal && (
//           <LoginModal onClose={() => setShowLoginModal(false)} />
//          )}
//     </div>
//   )
// }

"use client";
import React, { useEffect, useState } from 'react';
import LoginModal from '@/components/LoginModal';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { auth } from '../Firebase';

const db = getFirestore();

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  userId: string;
  finished?: boolean;
}

function LibraryContent({ user }: { user: User }) {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserBooks() {
      try {
        setLoading(true);
        const q = query(collection(db, 'savedBooks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const saved: Book[] = [];
        const finished: Book[] = [];

        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as Book;
          if (data.finished) {
            finished.push(data);
          } else {
            saved.push(data);
          }
        });

        setSavedBooks(saved);
        setFinishedBooks(finished);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  if (loading) {
    return <p>Loading your library...</p>;
  }

  return (
    <div className='library-content'>
      {/* SECTION 1: Saved Books */}
      <section className='library-section'>
        <h2 className='section__subtitle'>Saved Books ({savedBooks.length})</h2>
        {savedBooks.length === 0 ? (
          <p>No saved books yet. Add books from the main catalog!</p>
        ) : (
          <div className='saved-books-grid'>
            {savedBooks.map((book) => (
              <div key={book.id} className='saved-book-card'>
                <img src={book.coverUrl || '/assets/default-book.png'} alt={book.title} className='saved-book-cover' />
                <div className='saved-book-details'>
                  <div className='saved-book-title'>{book.title}</div>
                  <div className='saved-book-author'>{book.author}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Finished Books */}
      <section className='library-section' style={{ marginTop: '2rem' }}>
        <h2 className='section__subtitle'>Finished Books ({finishedBooks.length})</h2>
        {finishedBooks.length === 0 ? (
          <p>You haven't finished any books yet.</p>
        ) : (
          <div className='saved-books-grid'>
            {finishedBooks.map((book) => (
              <div key={book.id} className='saved-book-card finished'>
                <img src={book.coverUrl || '/assets/default-book.png'} alt={book.title} className='saved-book-cover' />
                <div className='saved-book-details'>
                  <div className='saved-book-title'>{book.title}</div>
                  <div className='saved-book-author'>{book.author}</div>
                  <span className='badge badge-success'>Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// Logged Out View: Prompt to Sign In
// ----------------------------------------------------------------------
function LoginPrompt({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <div className='settings__login--wrapper'>
      <img src="/assets/login.png" alt="Login required" />
      <div className='settings__login--text'>
        Log in to view your saved books and manage your library.
      </div>
      <button className='btn settings__login--btn' onClick={onOpenLogin}>
        Login
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------
export default function LibraryPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div className='container'>
      <div className='row'>
        <div className='section__title page__title'>My Library</div>

        {user ? (
          <LibraryContent user={user} />
        ) : (
          <LoginPrompt onOpenLogin={() => setShowLoginModal(true)} />
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
