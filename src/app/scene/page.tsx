'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function ScenePage() {
  // Remove hardcoded corpora


  // Markov chain (trigram) implementation
  function buildMarkovChain(text: string): { chain: Record<string, string[]>, starts: string[] } {
    const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
    const chain: Record<string, string[]> = {};
    const starts: string[] = [];
    for (const line of lines) {
      const words = line.split(/\s+/);
      if (words.length < 4) continue;
      // Store the first three words as a possible start
      starts.push(words.slice(0, 3).join(' '));
      for (let i = 0; i < words.length - 3; i++) {
        const key = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
        const next = words[i + 3];
        if (!chain[key]) chain[key] = [];
        chain[key].push(next);
      }
    }
    return { chain, starts };
  }

  function generateMarkovText(chain: Record<string, string[]>, starts: string[], length: number = 30): string {
    if (starts.length === 0) return '';
    let key = starts[Math.floor(Math.random() * starts.length)];
    let result = key.split(' ');
    for (let i = 0; i < length - 3; i++) {
      const nextWords = chain[key];
      if (!nextWords || nextWords.length === 0) {
        // Restart from a sentence beginning
        key = starts[Math.floor(Math.random() * starts.length)];
        result.push(...key.split(' '));
        i += 2;
        continue;
      }
      const next = nextWords[Math.floor(Math.random() * nextWords.length)];
      result.push(next);
      key = result[result.length - 3] + ' ' + result[result.length - 2] + ' ' + result[result.length - 1];
    }
    return result.join(' ');
  }

  // Post-process: split into sentences, filter for complete, capitalized, properly punctuated ones
  function extractValidSentences(text: string, maxCount: number = 2): string {
    // Split on period, exclamation, or question mark followed by space or end of string
    const sentences = text.match(/[^.!?]*[.!?]/g) || [];
    const valid = sentences
      .map(s => s.trim())
      .filter(s => s.length > 10 && /^[A-Z]/.test(s) && /[.!?]$/.test(s));
    return valid.slice(0, maxCount).join(' ');
  }

  // Post-process the generated prompt for basic grammar
  function postProcessPrompt(text: string): string {
    let trimmed = text.trim();
    // Capitalize first letter
    trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    // Remove trailing conjunctions or incomplete words
    trimmed = trimmed.replace(/( and| or| but|,|;|:)\s*$/i, '');
    // Ensure it ends with a period, exclamation, or question mark
    if (!/[.!?]$/.test(trimmed)) {
      trimmed += '.';
    }
    return trimmed;
  }

  // Helper: Get a random sentence from a corpus string
  function getRandomSentence(corpus: string): string {
    if (!corpus) return '';
    // Split on period, exclamation, or question mark followed by space or end of string
    const sentences = corpus.match(/[^.!?]*[.!?]/g)?.map(s => s.trim()).filter(Boolean) || [];
    if (sentences.length === 0) return '';
    return sentences[Math.floor(Math.random() * sentences.length)];
  }

  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [tone, setTone] = useState('');
  const [emotion, setEmotion] = useState('');
  const [palette, setPalette] = useState('');
  const [keywords, setKeywords] = useState('');

  // Typewriter animation state
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // typewriter effect
  useEffect(() => {
    if (!prompt) {
      setDisplayedPrompt('');
      setIsTyping(false);
      return;
    }
    setDisplayedPrompt('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedPrompt(prompt.slice(0, i + 1));
      i++;
      if (i >= prompt.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18); // Adjust speed as desired
    return () => clearInterval(interval);
  }, [prompt]);

  // New: State for loaded corpora
  const [genreCorpus, setGenreCorpus] = useState('');
  const [toneCorpus, setToneCorpus] = useState('');
  const [loadingGenre, setLoadingGenre] = useState(false);
  const [loadingTone, setLoadingTone] = useState(false);

  // Fetch genre corpus when genre changes
  useEffect(() => {
    if (!genre || genre === 'Choose a genre...') {
      setGenreCorpus('');
      return;
    }
    setLoadingGenre(true);
    fetch(`/corpora/scene/${genre.toLowerCase().replace(/ /g, '-')}.txt`)
      .then(res => res.ok ? res.text() : '')
      .then(text => setGenreCorpus(text))
      .catch(() => setGenreCorpus(''))
      .finally(() => setLoadingGenre(false));
  }, [genre]);

  // Fetch tone corpus when tone changes
  useEffect(() => {
    if (!tone || tone === 'Pick a tone...') {
      setToneCorpus('');
      return;
    }
    setLoadingTone(true);
    fetch(`/corpora/character/${tone.toLowerCase().replace(/ /g, '-')}.txt`)
      .then(res => res.ok ? res.text() : '')
      .then(text => setToneCorpus(text))
      .catch(() => setToneCorpus(''))
      .finally(() => setLoadingTone(false));
  }, [tone]);

  // --- Inspiration Images State ---
  const [inspoImages, setInspoImages] = useState<any[]>([]);
  const [loadingInspo, setLoadingInspo] = useState(false);
  const [inspoError, setInspoError] = useState('');
  const [showInspo, setShowInspo] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState<{ [key: number]: number }>({});

  // Fetch inspiration images after prompt is generated
  useEffect(() => {
    if (!showInspo) return;
    setLoadingInspo(true);
    setInspoError('');
    fetch(`/api/inspo-images?genre=${encodeURIComponent(genre)}&tone=${encodeURIComponent(tone)}&keywords=${encodeURIComponent([emotion, palette, keywords].filter(Boolean).join(' '))}`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => setInspoImages(data.images || []))
      .catch(() => setInspoError('Could not load inspiration images.'))
      .finally(() => setLoadingInspo(false));
  }, [showInspo, genre, tone, emotion, palette, keywords]);

  // Modified handleGenerate to show inspiration section
  const handleGenerate = () => {
    let genreSentence = getRandomSentence(genreCorpus);
    let toneSentence = getRandomSentence(toneCorpus);
    let promptParts = [];
    if (genreSentence) promptParts.push(genreSentence);
    if (toneSentence) promptParts.push(toneSentence);
    const combinedPrompt = promptParts.join(' ');
    setPrompt(combinedPrompt);
    setShowInspo(true);
  };

  // Parallax background scroll effect
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (bgRef.current) {
        // Slower effect: use a smaller multiplier
        bgRef.current.style.backgroundPositionY = `${-(scrolled * 0.08)}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={bgRef}
      className="min-h-screen overflow-x-hidden mobile-bg"
      style={{
        backgroundImage: "url('/img/notebook-bg.PNG')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      }}
    >
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6 sm:ml-10 md:ml-20">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <a href="/">
            <img src="/img/logo.PNG" alt="Logo" className="h-28 sm:h-20 md:h-26 w-auto mb-2 sm:mb-0 sm:mr-4" />
          </a>
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-normal text-blue-800 tracking-wide font-silly transform -rotate-1" style={{color: "#8587ed" }}>
            Doodle Noodle
          </h1>
        </div>
        <p className="text-center text-blue-700 mt-2 font-riscada text-xl sm:text-2xl md:text-3xl transform rotate-1">
          For Artists, By An Artist
        </p>
      </header>
      <main className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-6 pb-20 sm:ml-10 md:ml-20 flex flex-col md:flex-row gap-4 sm:gap-8">

        <div className="relative flex-1 min-w-0">
          {/* Shadow Images: mobile and desktop */}
          <img
            src="/img/text-shadow-sm.PNG"
            alt="Shadow"
            className="absolute inset-0 w-2/3 sm:w-full h-auto object-contain pointer-events-none select-none z-0 scale-150 sm:scale-118 translate-x-18 translate-y-30 sm:translate-x-6 sm:translate-y-4 block sm:hidden"
          />
          <img
            src="/img/text-shadow.PNG"
            alt="Shadow"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 scale-118 translate-x-17 translate-y-4 hidden sm:block"
          />
          {/* Background Images: mobile and desktop */}
          <img
            src="/img/text-bg-sm.PNG"
            alt="background"
            className="absolute inset-0 w-2/3 sm:w-full h-auto object-contain pointer-events-none select-none z-0 rotate-3 scale-150 sm:scale-118 translate-x-15 translate-y-28 sm:translate-x-2 sm:-translate-y-2 block sm:hidden"
          />
          <img
            src="/img/text-bg.PNG"
            alt="background"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 rotate-3 scale-118 translate-x-13 -translate-y-2 hidden sm:block"
          />
          <div className="p-4 sm:p-8 transform -rotate-1 relative z-10">
            <div className="flex items-center mb-4 sm:mb-6 relative z-10">
              <a href="/" className="transition-all rotate-4 translate-x-2 -translate-y-6 group hidden sm:block sm:translate-x-12" aria-label="Back">
                <img 
                  src="/img/back.PNG" 
                  alt="Back" 
                  className="w-6 sm:w-8 h-6 sm:h-8 transition-opacity duration-200 group-hover:opacity-0"
                />
                <img 
                  src="/img/back-hover.PNG" 
                  alt="Back Hover" 
                  className="w-6 sm:w-8 h-6 sm:h-8 absolute top-0 left-0 duration-200 opacity-0 group-hover:opacity-100"
                  style={{ pointerEvents: 'none' }}
                />
              </a>
              <h2 className="text-xl sm:text-3xl font-medium text-blue-800 rotate-4 font-riscada translate-x-6 sm:translate-x-14 translate-y-12 sm:-translate-y-3" style={{color: "#8587ed" }}>Scene Illustration Details :3</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
              <div>
                <label className="block text-blue-800 font-medium mb-2 sm:mb-3 text-lg sm:text-2xl font-riscada transform translate-x-5 sm:translate-y-0 translate-y-11 sm:translate-x-13 rotate-4">Genre</label>
                <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full max-w-xs sm:max-w-none p-3 sm:p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada rotate-4 text-lg sm:text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform translate-x-3 sm:translate-x-12 translate-y-8 sm:-translate-y-2 rotate-1">
                  <option>Choose a genre...</option>
                  <option>Fantasy</option>
                  <option>Cyberpunk</option>
                  <option>Horror</option>
                  <option>Adventure</option>
                  <option>Post-Apocalyptic</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-2 sm:mb-3 text-lg sm:text-2xl font-riscada transform -rotate-1 translate-x-3 sm:translate-x-12 sm:translate-y-1 translate-y-3">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full max-w-xs sm:max-w-none p-3 sm:p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg sm:text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -rotate-1 translate-x-2 sm:translate-x-13">
                  <option>Pick a tone...</option>
                  <option>Whimsical</option>
                  <option>Creepy</option>
                  <option>Dramatic</option>
                  <option>Peaceful</option>
                  <option>Mysterious</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-2 sm:mb-3 text-lg sm:text-2xl font-riscada transform translate-y-1 sm:-translate-y-3 translate-x-3 sm:translate-x-11 -rotate-2">Keywords <span className="text-sm sm:text-lg font-normal text-blue-600">(Optional)</span></label>
                <input type="text" value={emotion} onChange={e => setEmotion(e.target.value)} placeholder="magic, forest..." className="w-full max-w-xs sm:max-w-none p-3 sm:p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg sm:text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-1 sm:-translate-y-5 translate-x-1 sm:translate-x-11 -rotate-2" />
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-2 sm:mb-3 text-lg sm:text-2xl font-riscada transform rotate-3 translate-x-2 sm:translate-x-13 translate-y-1">Color Palette <span className="text-sm sm:text-lg font-normal text-blue-600">(Optional)</span></label>
                <input type="text" value={palette} onChange={e => setPalette(e.target.value)} placeholder="pastels, neon, earth tones..." className="w-full max-w-xs sm:max-w-none p-3 sm:p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg sm:text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-1 sm:-translate-y-2 -translate-x-1 sm:translate-x-12 rotate-4" />
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-center relative z-10 -translate-y-4 -translate-x-4">
              <button onClick={handleGenerate} className="group relative hover:scale-105 transition-all duration-300 rotate-1 hover:rotate-0 bg-transparent focus:outline-none sm:translate-x-10" aria-label="Generate"
                onTouchStart={(e) => {
                  e.currentTarget.classList.add('touch-active');
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.classList.remove('touch-active');
                }}
              >
                <img 
                  src="/img/generate.PNG" 
                  alt="Generate" 
                  className="w-32 sm:w-48 h-auto scale-120 transition-opacity duration-200 group-hover:opacity-0 group-[.touch-active]:opacity-0"
                />
                <img 
                  src="/img/generate-hover.PNG" 
                  alt="Generate" 
                  className="absolute top-0 left-0 duration-200 opacity-0 group-hover:opacity-100 group-[.touch-active]:opacity-100 scale-120"
                  style={{ pointerEvents: 'none' }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[28rem] flex-shrink-0 flex items-start justify-center md:justify-end">
          {(prompt || displayedPrompt) && (
            <div className="mt-4 sm:mt-8 md:mt-0 p-4 sm:p-6 bg text-black-800 font-riscada text-2xl sm:text-5xl max-w-2xl w-full relative z-10 sm:translate-x-20 min-h-[4rem] sm:min-h-[6rem]">
              <span>{displayedPrompt}</span>
              <span className={isTyping ? 'animate-pulse' : ''} style={{fontWeight: 'bold'}}>{isTyping ? '|' : ''}</span>
            </div>
          )}
        </div>
      </main>
      {showInspo && (
        <section className="max-w-6xl mx-auto mt-6 sm:mt-10 mb-16 sm:mb-20 p-4 sm:p-6 bg-white/80 rounded-xl shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-riscada text-blue-800 mb-4 sm:mb-6">Inspo Board :]</h3>
          {loadingInspo && <p className="text-blue-700 font-riscada mb-4">Loading images...</p>}
          {inspoError && <p className="text-red-600 font-riscada mb-4">{inspoError}</p>}
          {!loadingInspo && !inspoError && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
              {inspoImages.length === 0 && (
                <p className="text-blue-700 font-riscada">No inspiration images found for your search.</p>
              )}
              {inspoImages.map((img, idx) => {
                const aspectRatio = imageAspectRatios[idx] || 1; // default to square
                return (
                  <a
                    key={idx}
                    href={img.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-2 sm:mb-4 break-inside-avoid transition-all group"
                    title={img.alt}
                    onTouchStart={(e) => {
                      e.currentTarget.classList.add('touch-active');
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.classList.remove('touch-active');
                    }}
                  >
                    <div
                      className="relative w-full mx-auto"
                      style={{ aspectRatio: `${aspectRatio}`}}
                    >
                      <img
                        src={img.src}
                        alt={img.alt || 'Inspiration'}
                        className="absolute top-[8%] left-[8%] w-[84%] h-[84%] object-cover"
                        style={{ zIndex: 1, borderRadius: 0 }}
                        onLoad={e => {
                          const { naturalWidth, naturalHeight } = e.currentTarget;
                          setImageAspectRatios(prev => ({ ...prev, [idx]: naturalWidth / naturalHeight }));
                        }}
                      />
                      <img
                        src="/img/frame.PNG"
                        alt="Frame"
                        className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
                        style={{ objectFit: 'fill', zIndex: 2 }}
                      />
                      {/* hover overlay for details */}
                      <div
                        className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white/80 opacity-0 group-hover:opacity-100 group-[.touch-active]:opacity-100 transition-opacity duration-200 z-10 p-2 sm:p-4 text-center rounded-lg"
                      >
                        <div className="text-blue-800 font-riscada text-sm sm:text-lg mb-2 break-words">
                          {img.alt?.slice(0, 120) || 'Untitled'}
                        </div>
                        <div className="text-blue-400 text-xs sm:text-sm font-riscada">
                          {img.source}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer w-full mt-20 sm:mt-40 min-h-[120px] sm:min-h-[160px]" style={{ background: 'transparent' }}>
        <div className="footer-content flex flex-col items-center justify-center py-8 sm:py-16">
          <div className="social-links flex flex-wrap flex-row space-x-4 sm:space-x-6 mb-2 justify-center">
            <a href="mailto:play.lmjambi@gmail.com" className="social-icon" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e573e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            <a href="https://www.linkedin.com/in/lamar-jambi/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e573e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://github.com/lamarjambi" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e573e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://instagram.com/the.jamboala" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#e573e9" className="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
            </a>
            <a href="https://itch.io/profile/playlamar" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Itch.io">
            <img src="/img/itchio.svg" alt="itch.io" width="24" height="24" />
            </a>
          </div>
          <div className="copyright text-base sm:text-2xl font-riscada text-center translate-y-1 sm:translate-y-2" style={{ color: '#e573e9' }}>
            <p>© 2025 All rights reserved to J@mbo</p>
            <p>Made with ★ in San Francisco, CA</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 