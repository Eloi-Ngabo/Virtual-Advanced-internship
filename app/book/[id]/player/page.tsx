



"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface BookData {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  summary: string;
  audioSrc: string;
  imageLink?: string; 
  duration?: number; 
  isPremium?: boolean;
}

export default function BookPlayer() {
  const params = useParams();
  const id = params?.id as string; 

  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(292); 
  const [playbackRate, setPlaybackRate] = useState<number>(1); 
  
  const [playerMode, setPlayerMode] = useState<'audio' | 'tts'>('audio');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const ttsIntervalRef = useRef<any>(null); 
  
  // Track array of words and rough mapping for TTS timeline scrubbers
  const [summaryWords, setSummaryWords] = useState<string[]>([]);
  const wordsPerSecondRef = useRef<number>(2.5); // Average reading pace multiplier (150 wpm)

  // 1. Fetch live book data from backend
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!response.ok) throw new Error("Could not fetch target resource payload schema.");
        
        const data: BookData = await response.json();
        setBook(data);
        
        if (data.summary) {
          // Break text into clean clean array of words
          setSummaryWords(data.summary.split(/\s+/).filter(Boolean));
        }
        
        if (data.duration) {
          setDuration(data.duration);
        }
      } catch (error) {
        console.error("Failed book content aggregation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Clean up synthesis queues and loops when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (ttsIntervalRef.current) clearInterval(ttsIntervalRef.current);
    };
  }, []);

  // 2. Continuous real-time audio time updates
  const whilePlaying = () => {
    const audio = audioRef.current;
    if (audio && playerMode === 'audio') {
      setCurrentTime(audio.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  // Automated progress tracking loop for Text-To-Speech engine
  const startTtsProgressSimulation = (startTime: number) => {
    if (ttsIntervalRef.current) clearInterval(ttsIntervalRef.current);
    
    // Recalculate estimated word pacing duration for TTS track
    const totalWords = summaryWords.length || 100;
    const wordsPerSecond = (150 / 60) * playbackRate; // base 150 words/minute
    wordsPerSecondRef.current = wordsPerSecond;
    
    const estimatedDuration = Math.ceil(totalWords / wordsPerSecond);
    setDuration(estimatedDuration);

    let simulatedTime = startTime;
    ttsIntervalRef.current = setInterval(() => {
      simulatedTime += 1;
      if (simulatedTime >= estimatedDuration) {
        handleAudioEnded();
      } else {
        setCurrentTime(simulatedTime);
      }
    }, 1000);
  };

  // Helper utility to clear and speak from a designated second offset index
  const speakTtsFromTime = (targetTime: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Clear whatever sentence it is working on

    // Find the word index corresponding to the targeted second marker
    const wordStartIndex = Math.floor(targetTime * wordsPerSecondRef.current);
    const remainingText = summaryWords.slice(wordStartIndex).join(" ");

    if (!remainingText.trim()) {
      handleAudioEnded();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.rate = playbackRate;
    utterance.onend = () => {
      // Only fire if we actually naturally exhaust speech loop
      if (!window.speechSynthesis.speaking) {
        handleAudioEnded();
      }
    };
    
    window.speechSynthesis.speak(utterance);
    startTtsProgressSimulation(targetTime);
  };

  // 3. Coordinate Play/Pause toggles across reader systems
  useEffect(() => {
    if (playerMode === 'audio') {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.play().catch((err) => console.log("Audio playback interrupted:", err));
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audio.pause();
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      }
    } else {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      if (isPlaying) {
        // If synthesis is paused by the system, resume, else build dynamic slice sequence
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          startTtsProgressSimulation(currentTime);
        } else {
          speakTtsFromTime(currentTime);
        }
      } else {
        window.speechSynthesis.pause();
        if (ttsIntervalRef.current) clearInterval(ttsIntervalRef.current);
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, playerMode]);

  // Dynamic engine/mode switching adjustments
  const handleModeToggle = (mode: 'audio' | 'tts') => {
    if (audioRef.current) audioRef.current.pause();
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    if (ttsIntervalRef.current) clearInterval(ttsIntervalRef.current);
    
    setCurrentTime(0);
    setPlayerMode(mode);
    
    if (mode === 'audio' && book?.duration) {
      setDuration(book.duration);
    } else {
      const wordsPerSecond = (150 / 60) * playbackRate;
      setDuration(Math.ceil(summaryWords.length / wordsPerSecond) || 200);
    }
    
    setIsPlaying(false);
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && playerMode === 'audio') {
      if (!book?.duration) {
        setDuration(Math.floor(audio.duration));
      }
      audio.playbackRate = playbackRate;
    }
  };

  const formatTime = (timeInSeconds: number = 0): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => {
    const newTime = parseFloat(e.currentTarget.value);
    setCurrentTime(newTime);

    if (playerMode === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    } else if (playerMode === 'tts' && isPlaying) {
      speakTtsFromTime(newTime);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    let newTime = currentTime + 10;
    if (newTime > duration) newTime = duration;
    setCurrentTime(newTime);

    if (playerMode === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    } else if (playerMode === 'tts' && isPlaying) {
      speakTtsFromTime(newTime);
    }
  };

  const skipBackward = () => {
    let newTime = currentTime - 10;
    if (newTime < 0) newTime = 0;
    setCurrentTime(newTime);

    if (playerMode === 'audio' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    } else if (playerMode === 'tts' && isPlaying) {
      speakTtsFromTime(newTime);
    }
  };

  const handleSpeedChange = () => {
    let nextRate = 1;
    if (playbackRate === 1) nextRate = 1.25;
    else if (playbackRate === 1.25) nextRate = 1.5;
    else if (playbackRate === 1.5) nextRate = 2.0;
    else nextRate = 1;

    setPlaybackRate(nextRate);

    if (playerMode === 'audio' && audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    } else if (playerMode === 'tts') {
      const wordsPerSecond = (150 / 60) * nextRate;
      wordsPerSecondRef.current = wordsPerSecond;
      setDuration(Math.ceil(summaryWords.length / wordsPerSecond));
      
      if (isPlaying) {
        speakTtsFromTime(currentTime);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (ttsIntervalRef.current) clearInterval(ttsIntervalRef.current);
  };

  if (loading) {
    return (
      <div className="player-container central-spinner">
        <p>Loading summary audio session...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="player-container">
        <p>Book details could not be found or loaded.</p>
      </div>
    );
  }

  return (
    <div className="player-container">
      <audio 
        ref={audioRef} 
        src={book.audioSrc} 
        preload="metadata" 
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <header className="book-header">
        <h1 className="book-title">{book.title}</h1>
        
        {/* Dynamic Reader Audio / Text Toggle Selection Tabs */}
        <div className="reader-mode-tabs" style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
          <button 
            className={`tab-btn ${playerMode === 'audio' ? 'active' : ''}`}
            onClick={() => handleModeToggle('audio')}
            style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: playerMode === 'audio' ? '#2bd97c' : '#ccc', border: 'none', borderRadius: '4px' }}
          >
            Original Audio Track
          </button>
          <button 
            className={`tab-btn ${playerMode === 'tts' ? 'active' : ''}`}
            onClick={() => handleModeToggle('tts')}
            style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: playerMode === 'tts' ? '#2bd97c' : '#ccc', border: 'none', borderRadius: '4px' }}
          >
            AI Voice Reader (TTS)
          </button>
        </div>

        <div className="book-summary" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{book.summary}</div>
      </header>

      <footer className="audio-player-wrapper">
        <div className="audio-player-inner">
          
          <div className="player-meta-block">
            <div className="player-cover-frame">
              {book.imageLink ? (
                <img src={book.imageLink} alt={book.title} className="player-cover-img" />
              ) : (
                <div className="player-cover-fallback">📖</div>
              )}
            </div>
            <div className="player-text-details">
              <div className="player-book-title">{book.title}</div>
              <div className="player-book-author">
                {playerMode === 'tts' ? 'Synthetic AI Engine' : (book.author || 'Unknown Author')}
              </div>
            </div>
          </div>

          <div className="player-central-controls">
            <div className="controls-group">
              <button onClick={skipBackward} className="control-btn skip-btn" aria-label="Skip back 10 seconds">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12.5 4.5l-8.5 6.5 8.5 6.5v-13zm1 0v13l8.5-6.5-8.5-6.5z"/>
                </svg>
              </button>
              
              <button onClick={togglePlayPause} className="control-btn play-pause-btn" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              
              <button onClick={skipForward} className="control-btn skip-btn" aria-label="Skip forward 10 seconds">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M11.5 4.5v13l8.5-6.5-8.5-6.5zm-1 0l-8.5 6.5 8.5 6.5v-13z"/>
                </svg>
              </button>
            </div>

            <div className="timeline-container">
              <span className="time-display current-time">{formatTime(currentTime)}</span>
              <input 
                type="range" 
                className="progress-bar"
                ref={progressBarRef}
                value={currentTime}
                min="0"
                max={duration}
                onInput={handleProgressChange}
                onChange={handleProgressChange}
              />
              <span className="time-display total-duration">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="player-right-options">
            <button 
              onClick={handleSpeedChange} 
              className="speed-controller-btn" 
              title="Change Reading Speed"
            >
              <span className="speed-icon">⚡</span>
              <span className="speed-label">{playbackRate}x</span>
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}















// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation"; // Imported to handle dynamic routing parameters

// interface BookData {
//   id: string;
//   title: string;
//   author: string;
//   imgUrl?: string; // Added optional image URL for the player mask
// }

// export default function AudioPlayerPage() {
//   // Navigation & UI States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   // Audio Player Interaction States
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(35); 

//   // Data Fetching States
//   const [book, setBook] = useState<BookData | null>(null);
//   const [loading, setLoading] = useState(true); // Default to true since we fetch on mount
//   const [error, setError] = useState<string | null>(null);

//   // Grab the actual ID from your dynamic route (e.g., /audio-player/[id])
//   const params = useParams();
//   const id = params?.id as string || "YOUR_DEFAULT_BOOK_ID"; 

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const togglePlayPause = () => setIsPlaying(!isPlaying);

//   const fetchBook = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(
//         `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
//       );
//       if (!response.ok) throw new Error("Could not fetch target resource.");
      
//       const data: BookData = await response.json();
//       setBook(data);
//     } catch (err: any) {
//       setError(err.message || "An error occurred");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchBook();
//     }
//   }, [id]);

//   return (
//     <div className="wrapper">
//       {/* Top Search & Header Bar */}
//       <div className="search__background">
//         <div className="search__wrapper">
//           <figure>
//             <div className="logo-placeholder">SUMMARIST</div>
//           </figure>
//           <div className="search__content">
//             <div className="search">
//               <div className="search__input--wrapper">
//                 <input
//                   className="search__input"
//                   placeholder="Search for books"
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <div className="search__icon">
//                   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             <div className="sidebar__toggle--btn" onClick={toggleSidebar}>
//               <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor"></path>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div 
//         className={`sidebar__overlay ${isSidebarOpen ? "" : "sidebar__overlay--hidden"}`}
//         onClick={() => setIsSidebarOpen(false)}
//       ></div>

//       {/* Navigation Sidebar */}
//       <div className={`sidebar ${isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}>
//         <div className="sidebar__logo">
//           <span>Summarist</span>
//         </div>
//         <div className="sidebar__wrapper">
//           <div className="sidebar__top">
//             <a className="sidebar__link--wrapper" href="/for-you">
//               <div className="sidebar__link--line"></div>
//               <div className="sidebar__icon--wrapper">
//                 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
//                 </svg>
//               </div>
//               <div className="sidebar__link--text">For you</div>
//             </a>
            
//             <a className="sidebar__link--wrapper" href="/library">
//               <div className="sidebar__link--line"></div>
//               <div className="sidebar__icon--wrapper">
//                 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"></path>
//                 </svg>
//               </div>
//               <div className="sidebar__link--text">My Library</div>
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Pane */}
//       <div className="summary">
//         <div className="summary__content-mock">
//           {loading ? (
//             <div className="audio__book--spinner">
//               <svg className="spinner-animation" stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" viewBox="0 0 16 16" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
//               </svg>
//             </div>
//           ) : error ? (
//             <p className="error-message">{error}</p>
//           ) : (
//             <>
//               <h2>{book?.title}</h2>
//               <p>{book?.author}</p>
//             </>
//           )}
//         </div>

//         {/* Floating Audio Controls Sticky Footer Bar */}
//         <div className="audio__wrapper">
//           <div className="audio__track--wrapper">
//             <figure className="audio__track--image-mask">
//               {loading ? (
//                 <div className="skeleton-img"></div>
//               ) : (
//                 <img src={book?.imgUrl || "/fallback-cover.jpg"} alt={book?.title || "Book Cover"} className="audio__track--image" />
//               )}
//             </figure>
//             <div className="audio__track--details-wrapper">
//               {loading ? (
//                 <>
//                   <div className="skeleton-text short"></div>
//                   <div className="skeleton-text long"></div>
//                 </>
//               ) : (
//                 <>
//                   <div className="audio__track--title">{book?.title}</div>
//                   <div className="audio__track--author">{book?.author}</div>
//                 </>
//               )}
//             </div>
//           </div>
          
//           <div className="audio__controls--wrapper">
//             <div className="audio__controls">
//               <button className="audio__controls--btn" aria-label="Skip Back">
//                 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
//                   <path fill="none" stroke="currentColor" strokeWidth="2" d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
//                 </svg>
//               </button>
              
//               <button 
//                 className="audio__controls--btn audio__controls--btn-play" 
//                 onClick={togglePlayPause}
//                 aria-label={isPlaying ? "Pause" : "Play"}
//               >
//                 {isPlaying ? (
//                   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M96 64h96v384H96zM320 64h96v384h-96z" />
//                   </svg>
//                 ) : (
//                   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M96 448l320-192L96 64v384z"></path>
//                   </svg>
//                 )}
//               </button>
              
//               <button className="audio__controls--btn" aria-label="Skip Forward">
//                 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
//                   <path fill="none" stroke="currentColor" strokeWidth="2" d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="audio__progress--wrapper">
//             <div className="audio__time">1:24</div>
//             <input
//               type="range"
//               style={{ background: `linear-gradient(to right, #2bd97c ${progress}%, #bac3c7 ${progress}%)` }}
//               className="audio__progress--bar"
//               value={progress}
//               min="0"
//               max="100"
//               onChange={(e) => setProgress(Number(e.target.value))}
//             />
//             <div className="audio__time">4:12</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




