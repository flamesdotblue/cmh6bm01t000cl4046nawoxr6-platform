import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <div className="relative h-[82vh] sm:h-[86vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Connect in 3D. <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-sky-300">Call, Video, Chat</span>.
            </h1>
            <p className="mt-4 text-white/80 max-w-xl">
              A futuristic communication hub with a living 3D interface. Make voice calls, hop on video, and chat in real-time—all in one neon-lit console.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#comms"
                className="rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-3 font-medium shadow-[0_0_40px_-12px] shadow-fuchsia-500/70 hover:opacity-95 transition"
              >
                Open Communications
              </a>
              <a href="#about" className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white/80 hover:text-white transition">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
