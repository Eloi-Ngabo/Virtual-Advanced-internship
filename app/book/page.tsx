







//   "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from "next/image";


// import { 
//   Clock,
//   Star
// } from 'lucide-react';

// type Book = {
//   id: string;
//   author: string;
//   title: string;
//   subTitle: string;
//   imageLink: string;
//   audioLink: string;
//   totalRating: number;
//   averageRating: number;
//   keyIdeas: number | string;
//   type: 'audio' | 'text' | 'audio & text';
//   status: 'selected' | 'recommended' | 'suggested';
//   subscriptionRequired: boolean;
//   summary: string;
//   tags: string[];
//   bookDescription: string;
//   authorDescription: string;
// };

// export default function BookDashboard() {
//   const router = useRouter();
  
//   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
//   const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
//   const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const getBookMetadata = (book: Book) => {
//     const numericalIdeas = parseInt(book.keyIdeas as string) || 6;
//     const computedDuration = (book.title.length % 5) + (numericalIdeas * 3) + 8;
//     const displayRating = book.averageRating || (4 + (book.title.length % 10) / 10);
    
//     return {
//       duration: `${computedDuration} mins`,
//       rating: displayRating.toFixed(1)
//     };
//   };

//   useEffect(() => {
//     async function fetchAllBooks() {
//       try {
//         setLoading(true);
//         setError(null);

//         const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
//           fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
//           fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
//           fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested')
//         ]);

//         if (!selectedRes.ok || !recommendedRes.ok || !suggestedRes.ok) {
//           throw new Error('Could not retrieve database information layout safely.');
//         }
       
//         const selectedData = await selectedRes.json();
//         const recommendedData = await recommendedRes.json();
//         const suggestedData = await suggestedRes.json();

//         setSelectedBook(Array.isArray(selectedData) ? selectedData[0] : selectedData);
//         setRecommendedBooks(Array.isArray(recommendedData) ? recommendedData : [recommendedData]);
//         setSuggestedBooks(Array.isArray(suggestedData) ? suggestedData : [suggestedData]);
           
//       } catch (err: any) {
//         setError(err.message || 'An error occurred while loading content.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAllBooks();
//   }, []);

//   const handleBookClick = (bookId: string) => {
//     router.push(`/book/${bookId}`);
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-status-container">
//         <div className="dashboard__loading">Loading bookshelf...</div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="dashboard-status-container">
//         <div className="dashboard__error">Error: {error}</div>
//       </div>
//     );
//   }
       
//   return (
    
//     <div className="dashboard-layout">
//       <main className="dashboard-content">
       
//         {/* ================= SELECTED BOOK SECTION ================= */}
//         {selectedBook && (() => {
//           const meta = getBookMetadata(selectedBook);
//           return (
//             <section className="dashboard-section">
//               <h2 className="dashboard-section__title">Selected just for you</h2>
//               <div 
//                 className="hero-book-card" 
//                 onClick={() => handleBookClick(selectedBook.id)}
//               >
//                 <div className="hero-book-card__cover">
//                   <img 
//                     src={selectedBook.imageLink} 
//                     alt={selectedBook.title} 
//                     className="hero-book-card__img" 
//                   />
//                   {selectedBook.subscriptionRequired && (
//                     <span className="premium-badge">Premium</span>
//                   )}
//                 </div>
//                 <div className="hero-book-card__info">
//                   <h3 className="hero-book-card__title">{selectedBook.title}</h3>
//                   {selectedBook.subTitle && (
//                     <h4 className="hero-book-card__subtitle">{selectedBook.subTitle}</h4>
//                   )}
//                   <p className="hero-book-card__author">{selectedBook.author}</p>
                  
//                   <div className="hero-book-card__meta">
//                     <div className="meta-item">
//                       <Clock size={16} />
//                       <span>{meta.duration}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           );
//         })()}

//      {/* ================= RECOMMENDED BOOKS SECTION ================= */}
//         <section className="dashboard-section">
//           <h2 className="dashboard-section__title">Recommended Books</h2>
//           <div className="for-you__sub--title">We think you'll like thses</div>
//           <div className="books-grid">
//             {recommendedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="grid-book-card" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="grid-book-card__cover">
//                     <img 
//                       src={book.imageLink} 
//                       alt={book.title} 
//                       className="grid-book-card__img" 
//                     />
//                     {book.subscriptionRequired && (
//                       <span className="premium-badge">Premium</span>
//                     )}
//                   </div>
//                   <div className="grid-book-card__body">
//                     <h3 className="grid-book-card__title">{book.title}</h3>
//                     <p className="grid-book-card__author">{book.author}</p>
//                     <h5 className="grid-book-card__subtitle">{book.subTitle}</h5>
                    
//                     <div className="grid-book-card__meta">
//                       <div className="meta-item">
//                         <Clock size={14} />
//                         <span>{meta.duration}</span>
//                       </div>
//                       <div className="meta-item meta-item--rating">
//                         <Star size={14} />
//                         <span>{meta.rating}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ================= SUGGESTED BOOKS SECTION ================= */}
//         <section className="dashboard-section">
//           <h2 className="dashboard-section__title">Suggested Books</h2>
//            <div className="for-you__sub--title">Browse those books</div>
//           <div className="books-grid">
//            {suggestedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="grid-book-card" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="grid-book-card__cover">
//                     <img 
//                       src={book.imageLink} 
//                       alt={book.title} 
//                       className="grid-book-card__img" 
//                     />
//                     {book.subscriptionRequired && (
//                       <span className="premium-badge">Premium</span>
//                     )}
//                   </div>
//                    <div className="grid-book-card__body">
//                     <h3 className="grid-book-card__title">{book.title}</h3>
//                     <p className="grid-book-card__author">{book.author}</p>
//                      <h5 className="grid-book-card__subtitle">{book.subTitle}</h5>
                    
//                  <div className="grid-book-card__meta">
//                        <div className="meta-item">
//                         <Clock size={14} />
//                         <span>{meta.duration}</span>
//                       </div>
//                        <div className="meta-item meta-item--rating">
//                         <Star size={14} />
//                         <span>{meta.rating}</span>
//                        </div>
//                      </div>
//                   </div>
//                </div>
//               );
//             })}
//           </div>
//         </section>

//       </main>
//      </div>
//   );
//  }
// ;





"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

import { 
  Clock,
  Star
} from 'lucide-react';

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number | string;
  type: 'audio' | 'text' | 'audio & text';
  status: 'selected' | 'recommended' | 'suggested';
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
};

// ================= SKELETON COMPONENT =================
function SkeletonLoader() {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        
        {/* Selected Book Skeleton */}
        <section className="dashboard-section">
          <div className="skeleton skeleton-title" />
          <div className="hero-book-card skeleton-hero">
            <div className="hero-book-card__cover skeleton skeleton-img" />
            <div className="hero-book-card__info">
              <div className="skeleton skeleton-text skeleton-text--lg" />
              <div className="skeleton skeleton-text skeleton-text--md" />
              <div className="skeleton skeleton-text skeleton-text--sm" />
            </div>
          </div>
        </section>

        {/* Recommended Books Skeleton */}
        <section className="dashboard-section">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="books-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid-book-card skeleton-card">
                <div className="grid-book-card__cover skeleton skeleton-img" />
                <div className="grid-book-card__body">
                  <div className="skeleton skeleton-text skeleton-text--lg" />
                  <div className="skeleton skeleton-text skeleton-text--sm" />
                  <div className="skeleton skeleton-text skeleton-text--md" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Books Skeleton */}
        <section className="dashboard-section">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="books-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid-book-card skeleton-card">
                <div className="grid-book-card__cover skeleton skeleton-img" />
                <div className="grid-book-card__body">
                  <div className="skeleton skeleton-text skeleton-text--lg" />
                  <div className="skeleton skeleton-text skeleton-text--sm" />
                  <div className="skeleton skeleton-text skeleton-text--md" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default function BookDashboard() {
  const router = useRouter();
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBookMetadata = (book: Book) => {
    const numericalIdeas = parseInt(book.keyIdeas as string) || 6;
    const computedDuration = (book.title.length % 5) + (numericalIdeas * 3) + 8;
    const displayRating = book.averageRating || (4 + (book.title.length % 10) / 10);
    
    return {
      duration: `${computedDuration} mins`,
      rating: displayRating.toFixed(1)
    };
  };

  useEffect(() => {
    async function fetchAllBooks() {
      try {
        setLoading(true);
        setError(null);

        // Enforce a minimum 3-second delay timer alongside the fetch requests
        const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1000));

        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
          minLoadTime // Wait until 3 seconds pass even if fetch finishes earlier
        ]);

        if (!selectedRes.ok || !recommendedRes.ok || !suggestedRes.ok) {
          throw new Error('Could not retrieve database information layout safely.');
        }
       
        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        setSelectedBook(Array.isArray(selectedData) ? selectedData[0] : selectedData);
        setRecommendedBooks(Array.isArray(recommendedData) ? recommendedData : [recommendedData]);
        setSuggestedBooks(Array.isArray(suggestedData) ? suggestedData : [suggestedData]);
           
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading content.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllBooks();
  }, []);

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  if (loading) {
    return <SkeletonLoader />;
  }
  
  if (error) {
    return (
      <div className="dashboard-status-container">
        <div className="dashboard__error">Error: {error}</div>
      </div>
    );
  }
       
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
       
        {/* ================= SELECTED BOOK SECTION ================= */}
        {selectedBook && (() => {
          const meta = getBookMetadata(selectedBook);
          return (
            <section className="dashboard-section">
              <h2 className="dashboard-section__title">Selected just for you</h2>
              <div 
                className="hero-book-card" 
                onClick={() => handleBookClick(selectedBook.id)}
              >
                <div className="hero-book-card__cover">
                  <img 
                    src={selectedBook.imageLink} 
                    alt={selectedBook.title} 
                    className="hero-book-card__img" 
                  />
                  {selectedBook.subscriptionRequired && (
                    <span className="premium-badge">Premium</span>
                  )}
                </div>
                <div className="hero-book-card__info">
                  <h3 className="hero-book-card__title">{selectedBook.title}</h3>
                  {selectedBook.subTitle && (
                    <h4 className="hero-book-card__subtitle">{selectedBook.subTitle}</h4>
                  )}
                  <p className="hero-book-card__author">{selectedBook.author}</p>
                  
                  <div className="hero-book-card__meta">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{meta.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ================= RECOMMENDED BOOKS SECTION ================= */}
        <section className="dashboard-section">
          <h2 className="dashboard-section__title">Recommended Books</h2>
          <div className="for-you__sub--title">We think you'll like thses</div>
          <div className="books-grid">
            {recommendedBooks.map((book) => {
              const meta = getBookMetadata(book);
              return (
                <div 
                  key={book.id} 
                  className="grid-book-card" 
                  onClick={() => handleBookClick(book.id)}
                >
                  <div className="grid-book-card__cover">
                    <img 
                      src={book.imageLink} 
                      alt={book.title} 
                      className="grid-book-card__img" 
                    />
                    {book.subscriptionRequired && (
                      <span className="premium-badge">Premium</span>
                    )}
                  </div>
                  <div className="grid-book-card__body">
                    <h3 className="grid-book-card__title">{book.title}</h3>
                    <p className="grid-book-card__author">{book.author}</p>
                    <h5 className="grid-book-card__subtitle">{book.subTitle}</h5>
                    
                    <div className="grid-book-card__meta">
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{meta.duration}</span>
                      </div>
                      <div className="meta-item meta-item--rating">
                        <Star size={14} />
                        <span>{meta.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SUGGESTED BOOKS SECTION ================= */}
        <section className="dashboard-section">
          <h2 className="dashboard-section__title">Suggested Books</h2>
          <div className="for-you__sub--title">Browse those books</div>
          <div className="books-grid">
            {suggestedBooks.map((book) => {
              const meta = getBookMetadata(book);
              return (
                <div 
                  key={book.id} 
                  className="grid-book-card" 
                  onClick={() => handleBookClick(book.id)}
                >
                  <div className="grid-book-card__cover">
                    <img 
                      src={book.imageLink} 
                      alt={book.title} 
                      className="grid-book-card__img" 
                    />
                    {book.subscriptionRequired && (
                      <span className="premium-badge">Premium</span>
                    )}
                  </div>
                  <div className="grid-book-card__body">
                    <h3 className="grid-book-card__title">{book.title}</h3>
                    <p className="grid-book-card__author">{book.author}</p>
                    <h5 className="grid-book-card__subtitle">{book.subTitle}</h5>
                    
                    <div className="grid-book-card__meta">
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{meta.duration}</span>
                      </div>
                      <div className="meta-item meta-item--rating">
                        <Star size={14} />
                        <span>{meta.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

