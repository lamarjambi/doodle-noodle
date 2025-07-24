'use client';
import React, { useState, useEffect } from 'react';

export default function CharacterPage() {
  // Remove hardcoded corpora

  // Default corpus if nothing is selected
  const defaultCorpus = `A quirky character with glowing eyes and a mysterious past. Their flowing cape catches the wind as they leap across rooftops. A gentle smile hides a world of secrets. Magic shimmers at their fingertips, and laughter follows wherever they go. Shadows linger, but hope is never far behind.`;

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

  // Typewriter effect: animate displayedPrompt when prompt changes
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
    fetch(`/corpora/character/${genre.toLowerCase().replace(/ /g, '-')}.txt`)
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

  const handleGenerate = () => {
    let genreSentence = getRandomSentence(genreCorpus);
    let toneSentence = getRandomSentence(toneCorpus);
    let promptParts = [];
    if (genreSentence) promptParts.push(genreSentence);
    if (toneSentence) promptParts.push(toneSentence);
    const combinedPrompt = promptParts.join(' ');
    setPrompt(combinedPrompt);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/img/notebook-bg.PNG')"
      }}
    >
      {/* Header */}
      <header className="relative z-10 p-6 ml-20">
        <div className="flex items-center justify-center">
          <img src="/img/logo.PNG" alt="Logo" className="h-26 w-auto mr-4" />
          <h1 className="text-5xl md:text-8xl font-normal text-blue-800 tracking-wide font-silly transform -rotate-1">
            Doodle Noodle
          </h1>
        </div>
        <p className="text-center text-blue-700 mt-2 font-riscada text-3xl transform rotate-1">
          For Artists, By An Artist
        </p>
      </header>
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 flex flex-col md:flex-row gap-8">
        {/* Left: Notebook area with background and controls */}
        <div className="relative flex-1 min-w-0">
          <img 
            src="/img/text-shadow.PNG" 
            alt="Shadow" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 -translate-x-18.5 translate-y-7.5 scale-129"
          />
          <img 
            src="/img/text-bg.PNG" 
            alt="background" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 -translate-x-23 translate-y-2 rotate-3 scale-129"
          />
          <div className="p-8 transform -rotate-1 relative z-10">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(15)].map((_, i) => (<div key={i} className="border-b border-blue-200 h-8"></div>))}
            </div>
            <div className="flex items-center mb-6 relative z-10">
              <a href="/" className="transition-all rotate-4 -translate-x-30 -translate-y-6 group" aria-label="Back">
                <img 
                  src="/img/back.PNG" 
                  alt="Back" 
                  className="w-8 h-8 transition-opacity duration-200 group-hover:opacity-0"
                />
                <img 
                  src="/img/back-hover.PNG" 
                  alt="Back Hover" 
                  className="w-8 h-8 absolute top-0 left-0 duration-200 opacity-0 group-hover:opacity-100"
                  style={{ pointerEvents: 'none' }}
                />
              </a>
              <h2 className="text-3xl font-medium text-blue-800 rotate-3 font-riscada -translate-x-28 -translate-y-4">Character Design Details :3</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -translate-x-21 -translate-y-3 rotate-4">Genre</label>
                <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada rotate-4 text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -translate-y-4 -translate-x-22 rotate-1">
                  <option>Choose a genre...</option>
                  <option>Fantasy</option>
                  <option>Cyberpunk</option>
                  <option>Horror</option>
                  <option>Adventure</option>
                  <option>Post-Apocalyptic</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -rotate-1 -translate-x-22 translate-y-1">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -rotate-1 -translate-x-21">
                  <option>Pick a tone...</option>
                  <option>Whimsical</option>
                  <option>Creepy</option>
                  <option>Dramatic</option>
                  <option>Peaceful</option>
                  <option>Mysterious</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -translate-y-3 -translate-x-22 rotate-1">Keywords <span className="text-lg font-normal text-blue-600">(Optional)</span></label>
                <input type="text" value={emotion} onChange={e => setEmotion(e.target.value)} placeholder="joy, melancholy, excitement, wonder..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-7 -translate-x-22.5 -rotate-1" />
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform rotate-3 -translate-x-22">Color Palette <span className="text-lg font-normal text-blue-600">(Optional)</span></label>
                <input type="text" value={palette} onChange={e => setPalette(e.target.value)} placeholder="warm pastels, neon, monochrome, earth tones..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-2 -translate-x-22.5 rotate-4" />
              </div>
            </div>
            <div className="mt-8 text-center relative z-10 translate-x-1">
              <button onClick={handleGenerate} className="group relative hover:scale-105 transition-all duration-300 rotate-1 hover:rotate-0 bg-transparent -translate-x-25 focus:outline-none" aria-label="Generate Prompt & Mood Board">
                <img 
                  src="/img/generate.PNG" 
                  alt="Generate Prompt & Mood Board" 
                  className="w-48 h-auto scale-120 transition-opacity duration-200 group-hover:opacity-0"
                />
                <img 
                  src="/img/generate-hover.PNG" 
                  alt="Generate Prompt & Mood Board Hover" 
                  className="absolute top-0 left-0 duration-200 opacity-0 group-hover:opacity-100 scale-120"
                  style={{ pointerEvents: 'none' }}
                />
              </button>
            </div>
          </div>
        </div>
        {/* Right: Prompt always on the right side of the screen */}
        <div className="w-full md:w-[28rem] flex-shrink-0 flex items-start justify-center md:justify-end">
          {(prompt || displayedPrompt) && (
            <div className="mt-8 md:mt-0 p-6 bg text-black-800 font-riscada text-5xl max-w-2xl w-full relative z-10 min-h-[6rem]">
              <span>{displayedPrompt}</span>
              <span className={isTyping ? 'animate-pulse' : ''} style={{fontWeight: 'bold'}}>{isTyping ? '|' : ''}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 