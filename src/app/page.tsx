'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();

  const handleTypeSelect = (type: string) => {
    router.push(`/${type}`);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/img/notebook-bg.PNG')",
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      }}
    >
      {/* Header */}
      <header className="relative z-10 p-6 ml-20">
        <div className="flex items-center justify-center">
          <img src="/img/logo.PNG" alt="Logo" className="h-26 w-auto mr-4" />
          <h1 className="text-5xl md:text-8xl font-normal text-blue-800 tracking-wide font-silly transform -rotate-1" style={{color: "#8587ed" }}>
            Doodle Noodle
          </h1>
        </div>
        <p className="text-center text-blue-700 mt-2 font-riscada text-3xl transform rotate-1">
          For Artists, By An Artist
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20 ml-20">
        <div className="relative">
          <img 
            src="/img/text-shadow.PNG" 
            alt="Shadow" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 scale-180 translate-x-4.5 translate-y-26"
          />
          <img 
            src="/img/text-bg.PNG" 
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
            <h2 className="text-4xl font-medium text-blue-800 mb-8 text-center font-riscada relative z-10 transform rotate-4 translate-y-4.5">
              What would you like to create?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {/* Character Design Button */}
              <button 
                onClick={() => handleTypeSelect('character')}
                className="group bg-transparent rounded-xl p-0 border-none shadow-none text-center transform rotate-5 hover:rotate-0 transition-all duration-300 focus:outline-none relative overflow-hidden translate-y-6"
                style={{ minHeight: '220px' }}
                aria-label="Character Design"
              >
                <span className="absolute inset-0 z-0">
                  <img 
                    src="/img/character.PNG" 
                    alt="Character Design" 
                    className="transition-opacity duration-300 group-hover:opacity-0 object-contain w-full h-full"
                  />
                  <img 
                    src="/img/character-folded.PNG" 
                    alt="Character Design Hover" 
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 object-contain w-full h-full"
                  />
                </span>
                {/* Overlay text on hover */}
                <span className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-2xl md:text-3xl font-medium text-black-800 font-riscada px-6 py-3">
                    Character Design
                  </span>
                </span>
              </button>
              {/* Scene Illustration Button */}
              <button 
                onClick={() => handleTypeSelect('scene')}
                className="group bg-transparent rounded-xl p-0 border-none shadow-none text-center transform -rotate-4 hover:rotate-0 transition-all duration-300 focus:outline-none relative overflow-hidden translate-y-7"
                style={{ minHeight: '220px' }}
                aria-label="Scene Illustration"
              >
                <span className="absolute inset-0 z-0">
                  <img 
                    src="/img/scene.PNG" 
                    alt="Scene Illustration" 
                    className="transition-opacity duration-300 group-hover:opacity-0 object-contain w-full h-full"
                  />
                  <img 
                    src="/img/scene-folded.PNG" 
                    alt="Scene Illustration Hover" 
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 object-contain w-full h-full"
                  />
                </span>
                {/* Overlay text on hover */}
                <span className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-2xl md:text-3xl font-medium text-blue-800 font-riscada px-6 py-3">
                    Scene Illustration
                  </span>
                </span>
              </button>
              {/* Comic Strip Button */}
              <button 
                onClick={() => handleTypeSelect('comic')}
                className="group bg-transparent rounded-xl p-0 border-none shadow-none text-center transform rotate-8 hover:rotate-0 transition-all duration-300 focus:outline-none relative overflow-hidden translate-y-12"
                style={{ minHeight: '220px' }}
                aria-label="Comic Strip"
              >
                <span className="absolute inset-0 z-0">
                  <img 
                    src="/img/comic.PNG" 
                    alt="Comic Strip" 
                    className="transition-opacity duration-300 group-hover:opacity-0 object-contain w-full h-full"
                  />
                  <img 
                    src="/img/comic-folded.PNG" 
                    alt="Comic Strip Hover" 
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 object-contain w-full h-full"
                  />
                </span>
                {/* Overlay text on hover */}
                <span className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-2xl md:text-3xl font-medium text-red-800 font-riscada px-6 py-3">
                    Comic Strip
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* FOOTER */}
      <footer className="footer w-full mt-40 min-h-[160px]" style={{ background: 'transparent' }}>
        <div className="footer-content flex flex-col items-center justify-center py-16">
          <div className="social-links flex flex-row space-x-6 mb-2">
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
          <div className="copyright sm:text-2xl font-chalk text-center translate-y-2" style={{ color: '#e573e9' }}>
            <p>© 2025 All rights reserved to J@mbo</p>
            <p>Made with ★ in San Francisco, CA</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
