import React from 'react';
import NavBar from './components/NavBar.jsx';
import Hero3D from './components/Hero3D.jsx';
import CommPanel from './components/CommPanel.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <NavBar />
      <main>
        <section id="home">
          <Hero3D />
        </section>
        <section id="comms" className="relative py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/10 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 max-w-7xl">
            <CommPanel />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
