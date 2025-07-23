'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/notebook-bg.PNG')"
      }}
    >

      {/* Header */}
      <header className="relative z-10 p-6 ml-20">
        <div className="flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-normal text-blue-800 tracking-wide font-chalk transform -rotate-1">
            Doodle Noodle
          </h1>
        </div>
        <p className="text-center text-blue-700 text-lg mt-2 font-riscada text-2xl transform rotate-1">
          For Artists, By An Artist
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20 ml-20">
        
        {!selectedType ? (
          /* Type Selection Screen */
          <div className="relative">
            <img 
              src="/text-bg.PNG" 
              alt="background" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 rotate-3 scale-180 translate-y-20"
            />
            <div className="p-8 transform -rotate-1 relative z-10">
              {/* Notebook paper lines effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="border-b border-blue-200 h-8"></div>
                ))}
              </div>
              
              <h2 className="text-4xl font-medium text-blue-800 mb-8 text-center font-riscada relative z-10 transform rotate-3">
                What would you like to create?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <button 
                  onClick={() => handleTypeSelect('character')}
                  className="group bg-white/95 rounded-xl p-6 border-2 border-blue-200 hover:scale-105 transition-all duration-300 hover:shadow-lg text-center transform rotate-2 hover:rotate-0 hover:bg-blue-50"
                >
                  <div className="text-5xl mb-3">👤</div>
                  <h3 className="text-xl font-medium text-blue-800 mb-2 font-riscada">Character Design</h3>
                  <p className="text-blue-600 font-riscada text-lg">Create detailed character prompts with personality and visual elements</p>
                </button>
                
                <button 
                  onClick={() => handleTypeSelect('scene')}
                  className="group bg-white/95 rounded-xl p-6 border-2 border-blue-200 hover:scale-105 transition-all duration-300 hover:shadow-lg text-center transform -rotate-1 hover:rotate-0 hover:bg-blue-50"
                >
                  <div className="text-5xl mb-3">🌄</div>
                  <h3 className="text-xl font-medium text-blue-800 mb-2 font-riscada">Scene Illustration</h3>
                  <p className="text-blue-600 font-riscada text-lg">Generate atmospheric scenes and environments for your art</p>
                </button>
                
                <button 
                  onClick={() => handleTypeSelect('comic')}
                  className="group bg-white/95 rounded-xl p-6 border-2 border-blue-200 hover:scale-105 transition-all duration-300 hover:shadow-lg text-center transform rotate-1 hover:rotate-0 hover:bg-blue-50"
                >
                  <div className="text-5xl mb-3">📚</div>
                  <h3 className="text-xl font-medium text-blue-800 mb-2 font-riscada">Comic Strip</h3>
                  <p className="text-blue-600 font-riscada text-lg">Create comic panels with story beats and visual storytelling</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Detail Form Screen */
          <div 
            className="p-8 transform rotate-1 relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/text-bg.PNG')"
            }}
          >
            {/* Notebook paper lines effect */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="border-b border-blue-200 h-8"></div>
              ))}
            </div>
            
            <div className="flex items-center mb-6 relative z-10">
              <button 
                onClick={handleBack}
                className="text-blue-800 hover:text-blue-600 text-3xl mr-4 p-2 rounded-full hover:bg-blue-100 transition-all font-riscada"
              >
                ←
              </button>
              <h2 className="text-3xl font-medium text-blue-800 font-riscada">
                📝 {selectedType === 'character' ? 'Character Design' : selectedType === 'scene' ? 'Scene Illustration' : 'Comic Strip'} Details
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              {/* Genre Selection */}
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-xl font-riscada transform -rotate-1">
                  📚 Genre
                </label>
                <select className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform rotate-1">
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

              {/* Tone Selection */}
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-xl font-riscada transform rotate-1">
                  ✨ Tone
                </label>
                <select className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all transform -rotate-1">
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

              {/* Emotion */}
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-xl font-riscada transform rotate-1">
                  💭 Emotion
                </label>
                <input 
                  type="text" 
                  placeholder="joy, melancholy, excitement, wonder..."
                  className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -rotate-1"
                />
              </div>

              {/* Color Palette (Optional) */}
              <div>
                <label className="block text-blue-800 font-medium mb-3 text-xl font-riscada transform -rotate-1">
                  🎨 Color Palette <span className="text-base font-normal text-blue-600">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="warm pastels, neon, monochrome, earth tones..."
                  className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform rotate-1"
                />
              </div>
            </div>

            {/* Keywords (Optional) - Full Width */}
            <div className="mt-6 relative z-10">
              <label className="block text-blue-800 font-medium mb-3 text-xl font-riscada transform rotate-1">
                🔗 Keywords <span className="text-base font-normal text-blue-600">(Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="magic, forest, glowing eyes, ancient ruins, flowing cape..."
                className="w-full p-4 border-2 border-blue-300 rounded-lg bg-blue-50/80 text-blue-800 font-riscada text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-blue-500 transform -rotate-1"
              />
            </div>

            {/* Generate Button */}
            <div className="mt-8 text-center relative z-10">
              <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-800 font-riscada rotate-1 hover:rotate-0">
                <span className="relative z-10">✏️ Generate Prompt & Mood Board</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}