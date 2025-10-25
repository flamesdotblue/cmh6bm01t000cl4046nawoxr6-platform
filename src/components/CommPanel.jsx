import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Phone, Video, Mic, MicOff, PhoneCall, PhoneOff, Send, Camera, CameraOff, Volume2 } from 'lucide-react';

export default function CommPanel() {
  const tabs = [
    { key: 'chat', label: 'Chat', icon: MessageSquare },
    { key: 'voice', label: 'Voice', icon: Phone },
    { key: 'video', label: 'Video', icon: Video },
  ];
  const [active, setActive] = useState('chat');

  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-fuchsia-600/40 via-purple-500/30 to-indigo-600/40 rounded-3xl blur-xl pointer-events-none" />
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/10">
          <div className="flex items-center overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`group flex items-center gap-2 px-5 py-4 text-sm transition ${
                  active === t.key ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <t.icon size={18} className={active === t.key ? 'text-fuchsia-300' : 'text-white/50 group-hover:text-fuchsia-200'} />
                {t.label}
                {active === t.key && (
                  <span className="ml-2 h-1 w-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-4 sm:p-6">
            {active === 'chat' && <ChatView />}
            {active === 'voice' && <VoiceView />}
            {active === 'video' && <VideoView />}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-white/10 p-4 sm:p-6 bg-white/5">
            <SideInfo active={active} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SideInfo({ active }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Session Info</h3>
      <p className="text-sm text-white/70 mt-2">
        Mode: <span className="text-fuchsia-300 font-medium uppercase">{active}</span>
      </p>
      <ul className="mt-4 space-y-3 text-sm text-white/80">
        <li>Encrypted local demo environment</li>
        <li>No data leaves your browser</li>
        <li>Video uses your webcam locally</li>
        <li>Voice visualizes live mic input</li>
      </ul>
      <div className="mt-6 rounded-xl border border-white/10 p-4 bg-black/30">
        <p className="text-xs text-white/60">
          Note: This is a self-contained demo without a signaling server. Voice and video run locally to simulate a call experience.
        </p>
      </div>
    </div>
  );
}

function ChatView() {
  const [messages, setMessages] = useState([
    { id: 1, author: 'System', text: 'Welcome to NeonLink. Your chat is local and private.', t: new Date() },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const newMsg = { id: now.getTime(), author: 'You', text, t: now };
    setMessages((m) => [...m, newMsg]);
    setInput('');
    // playful echo assistant
    const reply = {
      id: now.getTime() + 1,
      author: 'Neon AI',
      text: `Echo: ${text}`,
      t: new Date(now.getTime() + 500),
    };
    setTimeout(() => setMessages((m) => [...m, reply]), 450);
  }

  return (
    <div className="h-[50vh] sm:h-[56vh] flex flex-col">
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] ${m.author === 'You' ? 'ml-auto' : ''}`}>
            <div className={`text-xs mb-1 ${m.author === 'You' ? 'text-right text-fuchsia-300' : 'text-indigo-300'}`}>{m.author}</div>
            <div className={`rounded-2xl px-4 py-3 border ${
              m.author === 'You'
                ? 'bg-fuchsia-600/20 border-fuchsia-400/30'
                : 'bg-indigo-600/20 border-indigo-400/30'
            }`}>{m.text}</div>
            <div className="text-[10px] mt-1 text-white/50">
              {m.t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a futuristic message..."
          className="flex-1 rounded-full bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-fuchsia-500/60"
        />
        <button onClick={send} className="p-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:opacity-95 transition">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function VoiceView() {
  const [isCalling, setIsCalling] = useState(false);
  const [muted, setMuted] = useState(false);
  const [level, setLevel] = useState(0);
  const mediaRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(0);
  const oscillatorRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    return () => stopCall();
  }, []);

  async function startCall() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaRef.current = stream;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyserRef.current = analyser;
      source.connect(analyser);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        // compute RMS-like level
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setLevel(rms);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      // synth ring
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 440;
      g.gain.value = 0.0001;
      o.connect(g).connect(ctx.destination);
      o.start();
      oscillatorRef.current = { o, g };

      // ramp in a pulsing manner for a short ring
      let on = true;
      const ringInterval = setInterval(() => {
        if (!oscillatorRef.current) return clearInterval(ringInterval);
        on = !on;
        oscillatorRef.current.g.gain.linearRampToValueAtTime(on ? 0.03 : 0.0001, ctx.currentTime + 0.12);
      }, 180);

      setIsCalling(true);
    } catch (e) {
      console.error(e);
      alert('Microphone permission required for voice demo.');
    }
  }

  function stopCall() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((t) => t.stop());
      mediaRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.g.gain.exponentialRampToValueAtTime(0.00001, audioCtxRef.current?.currentTime + 0.1);
        oscillatorRef.current.o.stop(audioCtxRef.current?.currentTime + 0.12);
      } catch {}
      oscillatorRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    setIsCalling(false);
    setLevel(0);
    setMuted(false);
  }

  function toggleMute() {
    if (!mediaRef.current) return;
    const tracks = mediaRef.current.getAudioTracks();
    tracks.forEach((t) => (t.enabled = !t.enabled));
    setMuted((m) => !m);
  }

  const barCount = 24;
  const activeBars = Math.min(barCount, Math.max(0, Math.round(level * barCount * 1.8)));

  return (
    <div>
      <h2 className="text-xl font-semibold">Voice Call</h2>
      <p className="text-sm text-white/70 mt-1">Local mic visualizer simulates an encrypted call.</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2">
          <div className="relative h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-indigo-500/10 to-black/20 p-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(217,70,239,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.15),transparent_40%)]" />
            <div className="flex items-end gap-1 h-full">
              {Array.from({ length: barCount }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t bg-gradient-to-t from-fuchsia-500/40 to-indigo-400/60 transition-all duration-75 ${
                    i < activeBars ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{ height: `${Math.max(6, (i < activeBars ? (i + 4) * 3 : (i + 2))) * 2}px` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {!isCalling ? (
            <button onClick={startCall} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 px-4 py-3 font-medium">
              <PhoneCall size={18} /> Start Call
            </button>
          ) : (
            <button onClick={stopCall} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 px-4 py-3 font-medium">
              <PhoneOff size={18} /> End Call
            </button>
          )}
          <button onClick={toggleMute} disabled={!isCalling} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium border border-white/10 ${
            isCalling ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
          }`}>
            {muted ? <MicOff size={18} /> : <Mic size={18} />} {muted ? 'Unmute' : 'Mute'}
          </button>
          <div className="text-xs text-white/60 flex items-center gap-2">
            <Volume2 size={14} className="text-fuchsia-300" /> Live mic levels
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoView() {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  useEffect(() => () => stop(), []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;
      // Simulated remote: clone tracks to a second MediaStream
      const cloned = new MediaStream(stream.getTracks().map((t) => t.clone()));
      if (remoteRef.current) remoteRef.current.srcObject = cloned;
      setCamOn(true);
      setMicOn(true);
      setActive(true);
    } catch (e) {
      console.error(e);
      alert('Camera and microphone permission required for video demo.');
    }
  }

  function stop() {
    if (localRef.current?.srcObject) {
      localRef.current.srcObject.getTracks().forEach((t) => t.stop());
      localRef.current.srcObject = null;
    }
    if (remoteRef.current?.srcObject) {
      remoteRef.current.srcObject.getTracks().forEach((t) => t.stop());
      remoteRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setActive(false);
    setCamOn(false);
    setMicOn(false);
  }

  function toggleCam() {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((v) => !v);
  }

  function toggleMic() {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((v) => !v);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Video Call</h2>
      <p className="text-sm text-white/70 mt-1">Simulated two-party call using your local camera feed.</p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VideoTile label="You" refEl={localRef} accent="from-fuchsia-500/30 to-pink-500/20" />
          <VideoTile label="Remote" refEl={remoteRef} accent="from-indigo-500/30 to-sky-500/20" />
        </div>
        <div className="flex flex-col gap-3">
          {!active ? (
            <button onClick={start} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 px-4 py-3 font-medium">
              <Video size={18} /> Start Video
            </button>
          ) : (
            <button onClick={stop} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 px-4 py-3 font-medium">
              <PhoneOff size={18} /> End
            </button>
          )}
          <button onClick={toggleCam} disabled={!active} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium border border-white/10 ${
            active ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
          }`}>
            {camOn ? <Camera size={18} /> : <CameraOff size={18} />} {camOn ? 'Camera On' : 'Camera Off'}
          </button>
          <button onClick={toggleMic} disabled={!active} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium border border-white/10 ${
            active ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
          }`}>
            {micOn ? <Mic size={18} /> : <MicOff size={18} />} {micOn ? 'Mic On' : 'Mic Off'}
          </button>
          <div className="text-xs text-white/60">This uses MediaStreams only on your device.</div>
        </div>
      </div>
    </div>
  );
}

function VideoTile({ label, refEl, accent }) {
  return (
    <div className={`relative rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br ${accent}`}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="absolute left-3 top-3 z-10 text-xs px-2 py-1 rounded-full bg-black/50 border border-white/10">{label}</div>
      <video ref={refEl} autoPlay playsInline muted className="relative w-full h-48 sm:h-56 md:h-64 object-cover" />
    </div>
  );
}
