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
import Link from 'next/link';
import LoginModal from '@/components/LoginModal';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { auth } from '../Firebase';

const db = getFirestore();

interface Book {
  id?: string;
  title: string;
  author: string;
  coverUrl?: string;
  userId?: string;
}

// ----------------------------------------------------------------------
// Logged In View: Saved Books + Add Book Form
// ----------------------------------------------------------------------
function LibraryContent({ user }: { user: User }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Book form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch saved books for current user from Firestore
  useEffect(() => {
    async function fetchSavedBooks() {
      try {
        setLoading(true);
        const q = query(collection(db, 'savedBooks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedBooks: Book[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBooks.push({ id: doc.id, ...doc.data() } as Book);
        });
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching saved books:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchSavedBooks();
    }
  }, [user]);

  // Handle adding a new book
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    try {
      setIsSubmitting(true);
      const newBookData = {
        title,
        author,
        coverUrl: coverUrl || '/assets/default-book.png',
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'savedBooks'), newBookData);
      
      // Update UI state with the new book
      setBooks((prev) => [...prev, { id: docRef.id, ...newBookData }]);
      
      // Reset form
      setTitle('');
      setAuthor('');
      setCoverUrl('');
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='library-content'>
      <h2 className='section__subtitle'>Saved Books</h2>

      {loading ? (
        <p>Loading saved books...</p>
      ) : books.length === 0 ? (
        <p>You have not saved any books yet.</p>
      ) : (
        <div className='saved-books-grid'>
          {books.map((book) => (
            <div key={book.id} className='saved-book-card'>
              {book.coverUrl && (
                <img src={book.coverUrl} alt={book.title} className='saved-book-cover' />
              )}
              <div className='saved-book-details'>
                <div className='saved-book-title'>{book.title}</div>
                <div className='saved-book-author'>{book.author}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className='add-book-form' onSubmit={handleAddBook}>
        <input
          type='text'
          placeholder='Book title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-input'
        />
        <input
          type='text'
          placeholder='Author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className='form-input'
        />
        <input
          type='text'
          placeholder='Cover image URL (optional)'
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className='form-input'
        />
        <button type='submit' className='btn' disabled={isSubmitting}>
          {isSubmitting ? 'Adding book...' : 'Save book'}
        </button>
      </form>
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
