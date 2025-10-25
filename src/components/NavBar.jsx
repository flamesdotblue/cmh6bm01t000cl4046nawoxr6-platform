import React from 'react';
import { Rocket, Phone, Video, MessageSquare } from 'lucide-react';

export default function NavBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <a href="#home" className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute inset-0 bg-fuchsia-500 blur-md opacity-60 rounded-full" />
            <Rocket className="relative text-fuchsia-300" />
          </div>
          <span className="font-semibold tracking-wide text-fuchsia-200">NEONLINK</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a href="#home" className="text-white/80 hover:text-white transition">Home</a>
          <a href="#comms" className="text-white/80 hover:text-white transition flex items-center gap-1">
            <Phone size={16} /> Voice
          </a>
          <a href="#comms" className="text-white/80 hover:text-white transition flex items-center gap-1">
            <Video size={16} /> Video
          </a>
          <a href="#comms" className="text-white/80 hover:text-white transition flex items-center gap-1">
            <MessageSquare size={16} /> Chat
          </a>
        </nav>
        <a
          href="#comms"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-medium shadow-[0_0_30px_-10px] shadow-fuchsia-500/50 hover:opacity-95 transition"
        >
          Launch Console
        </a>
      </div>
    </header>
  );
}
