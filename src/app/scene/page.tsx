import React from 'react';

export default function ScenePage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/notebook-bg.PNG')" }}>
      <header className="relative z-10 p-6 ml-20">
        <div className="flex items-center justify-center">
          <img src="/img/logo.PNG" alt="Logo" className="h-26 w-auto mr-4" />
          <h1 className="text-5xl md:text-8xl font-normal text-blue-800 tracking-wide font-silly transform -rotate-1">Doodle Noodle</h1>
        </div>
        <p className="text-center text-blue-700 mt-2 font-riscada text-3xl transform rotate-1">For Artists, By An Artist</p>
      </header>
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20 ml-20">

        <div className="relative">
            <img 
              src="/img/text-shadow.PNG" 
              alt="Shadow" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 translate-x-5 -translate-y-3.5 scale-107"
            />
            <img 
              src="/img/text-bg.PNG" 
              alt="background" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 -translate-y-9 rotate-3 scale-107"
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
              <h2 className="text-3xl font-medium text-blue-800 rotate-3 font-riscada translate-x-7 -translate-y-4">Scene Illustration Details :3</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform translate-x-4 -translate-y-3 rotate-4">Genre</label>
                <select className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada rotate-4 text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -translate-y-4 translate-x-3 rotate-1">
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
                <select className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -rotate-1">
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
                <input type="text" placeholder="joy, melancholy, excitement, wonder..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-7 translate-x-1 -rotate-1" />
              </div>
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform rotate-3 translate-x-1">Color Palette <span className="text-lg font-normal text-blue-600">(Optional)</span></label>
                <input type="text" placeholder="warm pastels, neon, monochrome, earth tones..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-2 rotate-4" />
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <label className="block text-blue-800 font-medium mb-3 text-2xl font-riscada transform -translate-y-3 rotate-1">Keywords <span className="text-lg font-normal text-blue-600">(Optional)</span></label>
              <input type="text" placeholder="magic, forest, glowing eyes, ancient ruins, flowing cape..." className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -translate-y-4 -translate-x-1 rotate-1" />
            </div>
            <div className="mt-8 text-center relative z-10 translate-x-1">
              <button className="group relative hover:scale-105 transition-all duration-300 rotate-1 hover:rotate-0 bg-transparent focus:outline-none -translate-y-7" aria-label="Generate Prompt & Mood Board">
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
      </main>
    </div>
  );
} 