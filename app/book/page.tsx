// "use client";
// import React, { useEffect, useState } from 'react';
// import { auth, signOut } from '../Firebase';
// import { useRouter } from 'next/navigation';
// import { 
//   Home, 
//   Library, 
//   Highlighter, 
//   Search, 
//   Settings, 
//   HelpCircle, 
//   LogOut 
// } from 'lucide-react';

// // Exact Book object type definition matching your specifications
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

//   // Sidebar States
//   const [activeTab, setActiveTab] = useState('Home');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     async function fetchAllBooks() {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all three endpoints simultaneously
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

//         // status=selected returns a single book object
//         setSelectedBook(Array.isArray(selectedData) ? selectedData[0] : selectedData);
//         // status=recommended and suggested return arrays
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

//   const handleLogout = () => {
//     // Implement your Firebase signout or auth clearing here
//     console.log("Logging out user...");
    
//   };

//   if (loading) return <div className="dashboard__loading">Loading bookshelf...</div>;
//   if (error) return <div className="dashboard__error">Error: {error}</div>;

//   return (
//     <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
//       {/* ================= SIDEBAR COMPONENT ================= */}
//       <aside className="w-64 fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
//         {/* Brand / Logo Container */}
//         <div className="p-5 flex items-center gap-3 border-b border-slate-800">
//           <span className="font-semibold text-lg text-white tracking-wide">Summarist</span>
//         </div>

//         {/* Top Input Search Bar Row */}
//         <div className="p-4">
//           <div className="relative">
//             <Search className="absolute left-4 top-2.5 h-4 w-4 text-slate-500" />
//             <input
//               type="text"
//               placeholder="Search layout..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
//             />
//           </div>
//         </div>

//         {/* Main Menu Links Grid */}
//         <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
   
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
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
//                 }`}
//               >
//                 <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
//                 {item.name}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Account Controls Bottom Bracket */}
//         <div className="p-3 border-t border-slate-800 space-y-1">
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
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-indigo-600 text-white'
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
//                 }`}
//               >
//                 <Icon className="h-5 w-5 text-slate-400" />
//                 {item.name}
//               </button>
//             );
//           })}

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-2"
//           >
//             <LogOut className="h-5 w-5 text-rose-400" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT APP CONTAINER ================= */}
//       <main className="flex-1 pl-64 p-8 dashboard__wrapper">
        
//         {/* ================= SELECTED BOOK SECTION ================= */}
//         {selectedBook && (
//           <section className="section section--selected mb-8">
//             <h2 className="section__title text-xl font-bold mb-4">Selected just for you</h2>
//             <div 
//               className="book-card book-card--large bg-slate-900 border border-slate-800 p-6 rounded-xl flex gap-6 cursor-pointer hover:border-slate-700 transition-all" 
//               onClick={() => handleBookClick(selectedBook.id)}
//             >
//               <div className="book-card__image-container w-36 h-52 flex-shrink-0 relative bg-slate-800 rounded-lg overflow-hidden">
//                 <img src={selectedBook.imageLink} alt={selectedBook.title} className="book-card__img w-full h-full object-cover" />
//                 {selectedBook.subscriptionRequired && (
//                   <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                     Premium
//                   </span>
//                 )}
//               </div>
//               <div className="book-card__details flex flex-col justify-center">
//                 <h3 className="book-card__title text-2xl font-bold text-white mb-1">{selectedBook.title}</h3>
//                 {selectedBook.subTitle && <h4 className="book-card__subtitle text-md text-slate-400 mb-2">{selectedBook.subTitle}</h4>}
//                 <p className="book-card__author text-sm text-indigo-400 mb-3"> {selectedBook.author}</p>
//                 {/* <p className="book-card__description text-sm text-slate-300 max-w-2xl line-clamp-3 mb-4">{selectedBook.bookDescription}</p> */}
                
//                 {/* <div className="book-card__tags flex gap-2">
//                   {selectedBook.tags?.slice(0, 3).map((tag, i) => (
//                     <span key={i} className="book-card__tag text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">{tag}</span>
//                   ))}
//                 </div> */}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* ================= RECOMMENDED BOOKS SECTION ================= */}
//         <section className="section mb-8">
//           <h2 className="section__title text-xl font-bold mb-4">Recommended Books</h2>
//           <div className="books__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {recommendedBooks.map((book) => (
//               <div 
//                 key={book.id} 
//                 className="book-card bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex flex-col" 
//                 onClick={() => handleBookClick(book.id)}
//               >
//                 <div className="book-card__image-container w-full h-48 bg-slate-800 rounded-lg overflow-hidden relative mb-3">
//                   <img src={book.imageLink} alt={book.title} className="book-card__img w-full h-full object-cover" />
//                   {book.subscriptionRequired && (
//                     <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                       Premium
//                     </span>
//                   )}
//                 </div>
//                 <h3 className="book-card__title font-semibold text-sm line-clamp-1 text-white">{book.title}</h3>
//                 <p className="book-card__author text-xs text-slate-400 mt-1">{book.author}</p>
//                 <h5 className="book-card__subtitle text-xs text-slate-400 mb-1">{book.subTitle}</h5>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ================= SUGGESTED BOOKS SECTION ================= */}
//         <section className="section">
//           <h2 className="section__title text-xl font-bold mb-4">Suggested Books</h2>
//           <div className="books__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {suggestedBooks.map((book) => (
//               <div 
//                 key={book.id} 
//                 className="book-card bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex flex-col" 
//                 onClick={() => handleBookClick(book.id)}
//               >
//                 <div className="book-card__image-container w-full h-48 bg-slate-800 rounded-lg overflow-hidden relative mb-3">
//                   <img src={book.imageLink} alt={book.title} className="book-card__img w-full h-full object-cover" />
//                   {book.subscriptionRequired && (
//                     <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                       Premium
//                     </span>
//                   )}
//                 </div>
//                 <h3 className="book-card__title font-semibold text-sm line-clamp-1 text-white">{book.title}</h3>
//                 <p className="book-card__author text-xs text-slate-400 mt-1">{book.author}</p>
//                 <h5 className="book-card__subtitle text-xs text-slate-400 mb-1">{book.subTitle}</h5>
//               </div>
//             ))}
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }







// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Home, 
//   Library, 
//   Highlighter, 
//   Search, 
//   Settings, 
//   HelpCircle, 
//   LogOut,
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

//   const [activeTab, setActiveTab] = useState('Home');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Helper function to generate unique durations and robust ratings dynamically per book
//   const getBookMetadata = (book: Book) => {
//     // Generate a unique number of minutes based on title string length or keyIdeas
//     const numericalIdeas = parseInt(book.keyIdeas as string) || 6;
//     const computedDuration = (book.title.length % 5) + (numericalIdeas * 3) + 8;
    
//     // Safety check for rating layouts if database attributes are empty
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

//   const handleLogout = () => {
//     console.log("Logging out user...");
//   };

//   if (loading) return <div className="dashboard__loading">Loading bookshelf...</div>;
//   if (error) return <div className="dashboard__error">Error: {error}</div>;

//   return (
//     <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
//       {/* ================= SIDEBAR COMPONENT ================= */}
//       <aside className="w-64 fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
//         <div className="p-5 flex items-center gap-3 border-b border-slate-800">
//           <span className="font-semibold text-lg text-white tracking-wide">Summarist</span>
//         </div>

//         <div className="p-4">
//           <div className="relative">
//             <Search className="absolute left-4 top-2.5 h-4 w-4 text-slate-500" />
//             <input
//               type="text"
//               placeholder="Search layout..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
//             />
//           </div>
//         </div>

//         <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
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
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
//                 }`}
//               >
//                 <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
//                 {item.name}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-3 border-t border-slate-800 space-y-1">
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
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-indigo-600 text-white'
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
//                 }`}
//               >
//                 <Icon className="h-5 w-5 text-slate-400" />
//                 {item.name}
//               </button>
//             );
//           })}

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-2"
//           >
//             <LogOut className="h-5 w-5 text-rose-400" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT APP CONTAINER ================= */}
//       <main className="flex-1 pl-64 p-8 dashboard__wrapper">
        
//         {/* ================= SELECTED BOOK SECTION ================= */}
//         {selectedBook && (() => {
//           const meta = getBookMetadata(selectedBook);
//           return (
//             <section className="section section--selected mb-8">
//               <h2 className="section__title text-xl font-bold mb-4">Selected just for you</h2>
//               <div 
//                 className="book-card book-card--large bg-slate-900 border border-slate-800 p-6 rounded-xl flex gap-6 cursor-pointer hover:border-slate-700 transition-all" 
//                 onClick={() => handleBookClick(selectedBook.id)}
//               >
//                 <div className="book-card__image-container w-36 h-52 flex-shrink-0 relative bg-slate-800 rounded-lg overflow-hidden">
//                   <img src={selectedBook.imageLink} alt={selectedBook.title} className="book-card__img w-full h-full object-cover" />
//                   {selectedBook.subscriptionRequired && (
//                     <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                       Premium
//                     </span>
//                   )}
//                 </div>
//                 <div className="book-card__details flex flex-col justify-center">
//                   <h3 className="book-card__title text-2xl font-bold text-white mb-1">{selectedBook.title}</h3>
//                   {selectedBook.subTitle && <h4 className="book-card__subtitle text-md text-slate-400 mb-2">{selectedBook.subTitle}</h4>}
//                   <p className="book-card__author text-sm text-indigo-400 mb-3">{selectedBook.author}</p>
                  
//                   {/* Dynamic Metadata Row */}
//                   <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3.5 h-3.5 text-indigo-400" />
//                       <span>{meta.duration}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           );
//         })()}

//         {/* ================= RECOMMENDED BOOKS SECTION ================= */}
//         <section className="section mb-8">
//           <h2 className="section__title text-xl font-bold mb-4">Recommended Books</h2>
//           <div className="books__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {recommendedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="book-card bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex flex-col" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="book-card__image-container w-full h-48 bg-slate-800 rounded-lg overflow-hidden relative mb-3">
//                     <img src={book.imageLink} alt={book.title} className="book-card__img w-full h-full object-cover" />
//                     {book.subscriptionRequired && (
//                       <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                         Premium
//                       </span>
//                     )}
//                   </div>
//                   <h3 className="book-card__title font-semibold text-sm line-clamp-1 text-white">{book.title}</h3>
//                   <p className="book-card__author text-xs text-slate-400 mt-1">{book.author}</p>
//                   <h5 className="book-card__subtitle text-xs text-slate-400 mb-2 line-clamp-1">{book.subTitle}</h5>
                  
//                   {/* Grid Metadata Row */}
//                   <div className="flex items-center justify-between text-[11px] text-slate-500 mt-auto pt-2 border-t border-slate-800/60">
//                     <div className="flex items-center gap-0.5">
//                       <Clock className="w-3 h-3 text-slate-400" />
//                       <span>{meta.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-0.5">
//                       <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//                       <span>{meta.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ================= SUGGESTED BOOKS SECTION ================= */}
//         <section className="section">
//           <h2 className="section__title text-xl font-bold mb-4">Suggested Books</h2>
//           <div className="books__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {suggestedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="book-card bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex flex-col" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="book-card__image-container w-full h-48 bg-slate-800 rounded-lg overflow-hidden relative mb-3">
//                     <img src={book.imageLink} alt={book.title} className="book-card__img w-full h-full object-cover" />
//                     {book.subscriptionRequired && (
//                       <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                         Premium
//                       </span>
//                     )}
//                   </div>
//                   <h3 className="book-card__title font-semibold text-sm line-clamp-1 text-white">{book.title}</h3>
//                   <p className="book-card__author text-xs text-slate-400 mt-1">{book.author}</p>
//                   <h5 className="book-card__subtitle text-xs text-slate-400 mb-2 line-clamp-1">{book.subTitle}</h5>
                  
//                   {/* Grid Metadata Row */}
//                   <div className="flex items-center justify-between text-[11px] text-slate-500 mt-auto pt-2 border-t border-slate-800/60">
//                     <div className="flex items-center gap-0.5">
//                       <Clock className="w-3 h-3 text-slate-400" />
//                       <span>{meta.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-0.5">
//                       <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//                       <span>{meta.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }






// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Home, 
//   Library, 
//   Highlighter, 
//   Search, 
//   Settings, 
//   HelpCircle, 
//   LogOut,
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

//   const [activeTab, setActiveTab] = useState('Home');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Helper function to generate unique durations and robust ratings dynamically per book
//   const getBookMetadata = (book: Book) => {
//     // Generate a unique number of minutes based on title string length or keyIdeas
//     const numericalIdeas = parseInt(book.keyIdeas as string) || 6;
//     const computedDuration = (book.title.length % 5) + (numericalIdeas * 3) + 8;
    
//     // Safety check for rating layouts if database attributes are empty
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

//   const handleLogout = () => {
//     console.log("Logging out user...");
//   };

//   if (loading) return <div className="dashboard__loading">Loading bookshelf...</div>;
//   if (error) return <div className="dashboard__error">Error: {error}</div>;

//   return (
//     <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
//       {/* ================= SIDEBAR COMPONENT ================= */}
//       <aside className="w-64 fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
//         <div className="p-5 flex items-center gap-3 border-b border-slate-800">
//           <span className="font-semibold text-lg text-white tracking-wide">Summarist</span>
//         </div>

//         <div className="p-4">
//           <div className="relative">
//             <Search className="absolute left-4 top-2.5 h-4 w-4 text-slate-500" />
//             <input
//               type="text"
//               placeholder="Search layout..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
//             />
//           </div>
//         </div>

//         <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
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
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
//                 }`}
//               >
//                 <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
//                 {item.name}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-3 border-t border-slate-800 space-y-1">
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
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-indigo-600 text-white'
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
//                 }`}
//               >
//                 <Icon className="h-5 w-5 text-slate-400" />
//                 {item.name}
//               </button>
//             );
//           })}

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-2"
//           >
//             <LogOut className="h-5 w-5 text-rose-400" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT APP CONTAINER ================= */}
//       <main className="flex-1 pl-64 p-8 dashboard__wrapper">
        
//         {/* ================= SELECTED BOOK SECTION ================= */}
//         {selectedBook && (() => {
//           const meta = getBookMetadata(selectedBook);
//           return (
//             <section className="section section--selected mb-8">
//               <h2 className="section__title text-xl font-bold mb-4">Selected just for you</h2>
//               <div 
//                 className="book-card book-card--large bg-slate-900 border border-slate-800 p-6 rounded-xl flex gap-6 cursor-pointer hover:border-slate-700 transition-all" 
//                 onClick={() => handleBookClick(selectedBook.id)}
//               >
//                 <div className="book-card__image-container w-36 h-52 flex-shrink-0 relative bg-slate-800 rounded-lg overflow-hidden">
//                   <img src={selectedBook.imageLink} alt={selectedBook.title} className="book-card__img w-full h-full object-cover" />
//                   {selectedBook.subscriptionRequired && (
//                     <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                       Premium
//                     </span>
//                   )}
//                 </div>
//                 <div className="book-card__details flex flex-col justify-center">
//                   <h3 className="book-card__title text-2xl font-bold text-white mb-1">{selectedBook.title}</h3>
//                   {selectedBook.subTitle && <h4 className="book-card__subtitle text-md text-slate-400 mb-2">{selectedBook.subTitle}</h4>}
//                   <p className="book-card__author text-sm text-indigo-400 mb-3">{selectedBook.author}</p>
                  
//                   {/* Dynamic Metadata Row */}
//                   <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3.5 h-3.5 text-indigo-400" />
//                       <span>{meta.duration}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           );
//         })()}

//         {/* ================= RECOMMENDED BOOKS SECTION ================= */}
//         <section className="section mb-8">
//           <h2 className="section__title text-xl font-bold mb-4">Recommended Books</h2>
//           <div className="books__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {recommendedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="book-card bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex flex-col" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="book-card__image-container w-full h-48 bg-slate-800 rounded-lg overflow-hidden relative mb-3">
//                     <img src={book.imageLink} alt={book.title} className="book-card__img w-full h-full object-cover" />
//                     {book.subscriptionRequired && (
//                       <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                         Premium
//                       </span>
//                     )}
//                   </div>
//                   <h3 className="book-card__title font-semibold text-sm line-clamp-1 text-white">{book.title}</h3>
//                   <p className="book-card__author text-xs text-slate-400 mt-1">{book.author}</p>
//                   <h5 className="book-card__subtitle text-xs text-slate-400 mb-2 line-clamp-1">{book.subTitle}</h5>
                  
//                   {/* Grid Metadata Row */}
//                   <div className="flex items-center justify-between text-[11px] text-slate-500 mt-auto pt-2 border-t border-slate-800/60">
//                     <div className="flex items-center gap-0.5">
//                       <Clock className="w-3 h-3 text-slate-400" />
//                       <span>{meta.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-0.5">
//                       <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//                       <span>{meta.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ================= SUGGESTED BOOKS SECTION ================= */}
//         <section className="section">
//           <h2 className="section__title text-xl font-bold mb-4">Suggested Books</h2>
//           <div className="books__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {suggestedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="book-card bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex flex-col" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="book-card__image-container w-full h-48 bg-slate-800 rounded-lg overflow-hidden relative mb-3">
//                     <img src={book.imageLink} alt={book.title} className="book-card__img w-full h-full object-cover" />
//                     {book.subscriptionRequired && (
//                       <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
//                         Premium
//                       </span>
//                     )}
//                   </div>
//                   <h3 className="book-card__title font-semibold text-sm line-clamp-1 text-white">{book.title}</h3>
//                   <p className="book-card__author text-xs text-slate-400 mt-1">{book.author}</p>
//                   <h5 className="book-card__subtitle text-xs text-slate-400 mb-2 line-clamp-1">{book.subTitle}</h5>
                  
//                   {/* Grid Metadata Row */}
//                   <div className="flex items-center justify-between text-[11px] text-slate-500 mt-auto pt-2 border-t border-slate-800/60">
//                     <div className="flex items-center gap-0.5">
//                       <Clock className="w-3 h-3 text-slate-400" />
//                       <span>{meta.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-0.5">
//                       <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//                       <span>{meta.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }





// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
//  import Image from "next/image";


// import { 
//   Home, 
//   Library, 
//   Highlighter, 
//   Search, 
//   Settings, 
//   HelpCircle, 
//   LogOut,
//   Clock,
//   Star,
//   LogOutIcon
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

//   const [activeTab, setActiveTab] = useState('Home');
//   const [searchQuery, setSearchQuery] = useState('');

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

//   const handleLogout = () => {
//     console.log("Logging out user...");
//   };

//   if (loading) return <div className="dashboard__loading">Loading bookshelf...</div>;
//   if (error) return <div className="dashboard__error">Error: {error}</div>;

//   return (
//     <div className="dashboard-layout">
      
    
//       {/* ================= MAIN CONTENT APP CONTAINER ================= */}
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
//                   <img src={selectedBook.imageLink} alt={selectedBook.title} className="hero-book-card__img" />
//                   {selectedBook.subscriptionRequired && (
//                     <span className="premium-badge">Premium</span>
//                   )}
//                 </div>
//                 <div className="hero-book-card__info">
//                   <h3 className="hero-book-card__title">{selectedBook.title}</h3>
//                   {selectedBook.subTitle && <h4 className="hero-book-card__subtitle">{selectedBook.subTitle}</h4>}
//                   <p className="hero-book-card__author">{selectedBook.author}</p>
                  
//                   <div className="hero-book-card__meta">
//                     <div className="meta-item">
//                       <Clock size={14} />
//                       <span>{meta.duration}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           );
//         })()}

//         {/* ================= RECOMMENDED BOOKS SECTION ================= */}
//         <section className="dashboard-section">
//           <h2 className="dashboard-section__title">Recommended Books</h2>
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
//                     <img src={book.imageLink} alt={book.title} className="grid-book-card__img" />
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
//                         <Clock size={12} />
//                         <span>{meta.duration}</span>
//                       </div>
//                       <div className="meta-item meta-item--rating">
//                         <Star size={12} />
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
//           <div className="books-grid">
//             {suggestedBooks.map((book) => {
//               const meta = getBookMetadata(book);
//               return (
//                 <div 
//                   key={book.id} 
//                   className="grid-book-card" 
//                   onClick={() => handleBookClick(book.id)}
//                 >
//                   <div className="grid-book-card__cover">
//                     <img src={book.imageLink} alt={book.title} className="grid-book-card__img" />
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
//                         <Clock size={12} />
//                         <span>{meta.duration}</span>
//                       </div>
//                       <div className="meta-item meta-item--rating">
//                         <Star size={12} />
//                         <span>{meta.rating}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//       </main>
//     </div>
//   );
// }









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

        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested')
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
    return (
      <div className="dashboard-status-container">
        <div className="dashboard__loading">Loading bookshelf...</div>
      </div>
    );
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