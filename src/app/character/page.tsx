'use client';
import React, { useState } from 'react';

export default function CharacterPage() {
  // Segmented corpora for genre and tone
  const genreCorpora: Record<string, string> = {
    Fantasy: `A wizard with a silver staff casts spells in a misty forest. A dragon sleeps beneath the mountain. Elves whisper secrets in the ancient trees. A magical sword glows with runes. A brave knight rides into the unknown.`,
    Cyberpunk: `Neon lights flicker in the rain-soaked city. Hackers type furiously in dark rooms. Augmented eyes scan the crowd. A rogue AI plots in the shadows. Chrome limbs glint under streetlights.`,
    Noir: `A detective in a trench coat lights a cigarette under a flickering streetlamp. Shadows stretch across the alley. A mysterious femme fatale enters the office. Rain taps on the window. Secrets are hidden in every glance.`,
    Steampunk: `Gears whir and steam hisses from brass machines. Airships float above the city. Inventors tinker in cluttered workshops. Goggles rest on every brow. Clockwork birds sing in the morning fog.`,
    Horror: `A chill wind howls through the abandoned house. Shadows move where they shouldn't. Eyes glint in the darkness. A scream echoes in the night. The candle flickers, barely holding back the gloom.`,
    Romance: `Two souls meet under a starlit sky. A gentle touch sparks a thousand feelings. Letters are exchanged in secret. Hearts race in the quiet moments. Love blooms in unexpected places.`,
    Adventure: `A map flutters in the explorer's hand. The jungle teems with unknown sounds. A treasure chest waits beneath the waves. Boots crunch on ancient ruins. The horizon calls to the brave.`,
    'Slice of Life': `A cat naps in a sunbeam. Friends laugh over coffee. Rain patters on the window as music plays softly. A bike ride through the park. Quiet moments make the day special.`,
    'Post-Apocalyptic': `Ruins stretch as far as the eye can see. Survivors scavenge for supplies. Hope glimmers in the darkness. A radio crackles with static. The world is silent, but not empty.`,
    Historical: `A carriage rattles down a cobblestone street. Quills scratch on parchment. Lanterns glow in the evening. A duel is fought at dawn. History is written in every step.`,
  };

  const toneCorpora: Record<string, string> = {
    Whimsical: `Clouds shaped like animals drift across the sky. Laughter bubbles up for no reason. Shoes squeak on polished floors. The world feels light and full of possibility.`,
    Creepy: `Footsteps echo in the empty hallway. Dolls stare with glassy eyes. The air is thick with secrets. Whispers come from the walls.`,
    Dramatic: `Thunder cracks as the hero falls to their knees. Tears mix with rain. Every word is heavy with meaning. The spotlight finds the truth.`,
    Peaceful: `A gentle breeze stirs the grass. Sunlight warms closed eyes. Birds sing in the distance. Everything is calm and still.`,
    Energetic: `Feet pound the pavement in a wild race. Music blares from open windows. Laughter and shouts fill the air. The world is alive with motion.`,
    Mysterious: `A locked door waits at the end of the hall. Shadows flicker in candlelight. A riddle is carved into stone. Eyes watch from the darkness.`,
    'Cute & Cozy': `Blankets pile high on a rainy day. Hot cocoa steams in a favorite mug. A kitten purrs on a soft pillow. The world feels safe and small.`,
    'Epic & Heroic': `Banners wave above the battlefield. A hero stands atop a mountain. The crowd roars in triumph. Legends are born in fire and steel.`,
    Melancholic: `Raindrops trace paths down the window. A single flower wilts in a forgotten vase. Memories linger in the quiet. The world feels distant and blue.`,
    Playful: `A ball bounces down the street. Friends chase each other in the sun. Jokes fly faster than the wind. Every moment is a new game.`,
  };

  // Default corpus if nothing is selected
  const defaultCorpus = `A quirky character with glowing eyes and a mysterious past. Their flowing cape catches the wind as they leap across rooftops. A gentle smile hides a world of secrets. Magic shimmers at their fingertips, and laughter follows wherever they go. Shadows linger, but hope is never far behind.`;

  // Markov chain (bigram) implementation
  function buildMarkovChain(text: string): Record<string, string[]> {
    const words = text.split(/\s+/);
    const chain: Record<string, string[]> = {};
    for (let i = 0; i < words.length - 2; i++) {
      const key = words[i] + ' ' + words[i + 1];
      const next = words[i + 2];
      if (!chain[key]) chain[key] = [];
      chain[key].push(next);
    }
    return chain;
  }

  function generateMarkovText(chain: Record<string, string[]>, length: number = 20): string {
    const keys = Object.keys(chain);
    let key = keys[Math.floor(Math.random() * keys.length)];
    let result = key.split(' ');
    for (let i = 0; i < length - 2; i++) {
      const nextWords = chain[key];
      if (!nextWords || nextWords.length === 0) {
        key = keys[Math.floor(Math.random() * keys.length)];
        result.push(...key.split(' '));
        i++;
        continue;
      }
      const next = nextWords[Math.floor(Math.random() * nextWords.length)];
      result.push(next);
      key = result[result.length - 2] + ' ' + result[result.length - 1];
    }
    return result.join(' ');
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

  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('');
  const [tone, setTone] = useState('');
  const [emotion, setEmotion] = useState('');
  const [palette, setPalette] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleGenerate = () => {
    let userCorpus = '';
    if (genre && genreCorpora[genre]) userCorpus += genreCorpora[genre] + ' ';
    if (tone && toneCorpora[tone]) userCorpus += toneCorpora[tone] + ' ';
    if (!userCorpus) userCorpus = defaultCorpus;
    if (emotion) userCorpus += ` ${emotion}`;
    if (palette) userCorpus += ` ${palette}`;
    if (keywords) userCorpus += ` ${keywords}`;
    const chain = buildMarkovChain(userCorpus);
    let markovPrompt = generateMarkovText(chain, 24);
    markovPrompt = postProcessPrompt(markovPrompt);
    setPrompt(markovPrompt);
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
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20 ml-20">
        <div className="relative">
            <img 
              src="/img/text-shadow.PNG" 
              alt="Shadow" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 translate-x-5 -translate-y-3.5 scale-110"
            />
            <img 
              src="/img/text-bg.PNG" 
              alt="background" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 -translate-y-9 rotate-3 scale-110"
            />
            <div className="p-8 transform -rotate-1 relative z-10">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(15)].map((_, i) => (<div key={i} className="border-b border-blue-200 h-8"></div>))}
            </div>
            <div className="flex items-center mb-6 relative z-10">
              <a href="/" className="transition-all rotate-4 translate-x-4 -translate-y-6 group" aria-label="Back">
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
              <h2 className="text-3xl font-medium text-blue-800 rotate-3 font-riscada translate-x-7 -translate-y-4">Character Design Details :3</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform translate-x-4 -translate-y-3 rotate-4">Genre</label>
                <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada rotate-4 text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -translate-y-4 translate-x-3 rotate-1">
                  <option>Choose a genre...</option>
                  <option>Fantasy</option>
                  <option>Cyberpunk</option>
                  <option>Noir</option>
                  <option>Steampunk</option>
                  <option>Horror</option>
                  <option>Romance</option>
                  <option>Adventure</option>
                  <option>Slice of Life</option>
                  <option>Post-Apocalyptic</option>
                  <option>Historical</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -rotate-1 translate-y-1">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -rotate-1">
                  <option>Pick a tone...</option>
                  <option>Whimsical</option>
                  <option>Creepy</option>
                  <option>Dramatic</option>
                  <option>Peaceful</option>
                  <option>Energetic</option>
                  <option>Mysterious</option>
                  <option>Cute & Cozy</option>
                  <option>Epic & Heroic</option>
                  <option>Melancholic</option>
                  <option>Playful</option>
                </select>
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -translate-y-3 translate-x-2 rotate-1">Emotion</label>
                <input type="text" value={emotion} onChange={e => setEmotion(e.target.value)} placeholder="joy, melancholy, excitement, wonder..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-7 translate-x-1 -rotate-1" />
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform rotate-3 translate-x-1">Color Palette <span className="text-lg font-normal text-blue-600">(Optional)</span></label>
                <input type="text" value={palette} onChange={e => setPalette(e.target.value)} placeholder="warm pastels, neon, monochrome, earth tones..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-2 rotate-4" />
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -translate-y-3 rotate-1">Keywords <span className="text-lg font-normal text-blue-600">(Optional)</span></label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="magic, forest, glowing eyes, ancient ruins, flowing cape..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-4 -translate-x-1 rotate-1" />
            </div>
            <div className="mt-8 text-center relative z-10 translate-x-1">
              <button onClick={handleGenerate} className="group relative hover:scale-105 transition-all duration-300 rotate-1 hover:rotate-0 bg-transparent focus:outline-none -translate-y-7" aria-label="Generate Prompt & Mood Board">
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
            {prompt && (
              <div className="mt-8 p-6 bg-blue-50/80 rounded-lg shadow-lg text-blue-800 font-riscada text-2xl border-2 border-blue-200 max-w-2xl mx-auto">
                {prompt}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 