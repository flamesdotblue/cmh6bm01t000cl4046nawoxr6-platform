import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="container mx-auto px-4 py-8 max-w-7xl text-sm text-white/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} NeonLink. A futuristic communication demo.</p>
        <p className="text-white/50">Built with React, Tailwind, and a live 3D Spline scene.</p>
      </div>
    </footer>
  );
}
