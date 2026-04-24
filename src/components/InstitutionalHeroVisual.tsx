import React, { useEffect, useRef, useState } from 'react';

interface InstitutionalHeroVisualProps {
  className?: string;
  showBackground?: boolean;
}

export default function InstitutionalHeroVisual({ className = '', showBackground = true }: InstitutionalHeroVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hudCount, setHudCount] = useState(2340);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLS: any[] = [];
    const CHARS = '01アイウエオ<>{}[]#/\\';
    let W: number, H: number;

    const resize = () => {
      const container = canvas.parentElement;
      W = canvas.width = container?.offsetWidth || window.innerWidth;
      H = canvas.height = container?.offsetHeight || window.innerHeight;
      const cols = Math.floor(W / 22);
      COLS.length = 0;
      for (let i = 0; i < cols; i++) {
        COLS.push({
          y: Math.random() * H,
          speed: 0.4 + Math.random() * 1.2,
          opacity: 0.08 + Math.random() * 0.18,
          len: 4 + Math.floor(Math.random() * 10),
          timer: Math.random() * 60
        });
      }
    };

    let animationFrame: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.font = '13px monospace';
      for (let i = 0; i < COLS.length; i++) {
        const c = COLS[i];
        c.timer++;
        if ((i + Math.floor(c.timer / 40)) % 5 !== 0) continue;
        c.y += c.speed;
        if (c.y > H + c.len * 16) {
          c.y = -c.len * 16;
          c.speed = 0.4 + Math.random() * 1.2;
          c.opacity = 0.06 + Math.random() * 0.16;
        }
        for (let j = 0; j < c.len; j++) {
          ctx.fillStyle = `rgba(0, 242, 255, ${c.opacity * (1 - j / c.len)})`;
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 22 + 4, c.y - j * 16);
        }
      }
      animationFrame = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    resize();
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHudCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${showBackground ? 'bg-[#0B0C10]' : ''} ${className}`}>
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover object-center saturate-[0.7] brightness-[0.65] z-0"
      >
        <source src="/videos/ginashe-institutional-hero.mp4" type="video/mp4" />
      </video>

      {/* Base Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10]/55 via-[#001e23]/35 to-[#0B0C10]/70 z-[1]" />

      {/* Scanlines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,242,255,0.025)_3px,rgba(0,242,255,0.025)_4px)] z-[2] pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_40%,rgba(11,12,16,0.85)_100%)] z-[3] pointer-events-none" />

      {/* Data Canvas (Matrix effect) */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.55] z-[4] pointer-events-none" />

      {/* Grid Drift */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.04)_1px,transparent_1px)] bg-[length:60px_60px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_50%,black_20%,transparent_75%)] z-[5] pointer-events-none animate-grid-drift" />

      {/* Glitch Effect */}
      <div className="absolute inset-0 bg-[rgba(0,242,255,0.03)] z-[9] pointer-events-none opacity-0 animate-glitch-flash" />

      {/* Scanbeam */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent z-[8] opacity-0 animate-scan-beam pointer-events-none" />

      {/* Circuits */}
      <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden opacity-40">
        <svg className="absolute bottom-[8%] left-[3%] w-[220px] animate-circuit-appear" viewBox="0 0 220 140" fill="none">
          <path d="M10 80 L40 80 L55 65 L90 65 L105 80 L160 80 L175 65 L210 65" stroke="#00f2ff" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M60 65 L60 35 L90 35" stroke="#00f2ff" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
          <circle cx="60" cy="65" r="3" fill="#00f2ff" opacity="0.8"/><circle cx="105" cy="80" r="2.5" fill="#00f2ff" opacity="0.6"/>
        </svg>
        <svg className="absolute top-[5%] right-[4%] w-[180px] scale-x-[-1] rotate-[15deg] animate-circuit-appear [animation-delay:2.1s]" viewBox="0 0 180 120" fill="none">
          <path d="M10 60 L50 60 L65 45 L110 45 L110 80 L140 80 L155 65 L170 65" stroke="#00f2ff" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="50" cy="60" r="3" fill="#00f2ff" opacity="0.7"/><circle cx="110" cy="45" r="2.5" fill="#00f2ff" opacity="0.9"/>
        </svg>
        <svg className="absolute bottom-[15%] right-[5%] w-[160px] rotate-[-10deg] animate-circuit-appear [animation-delay:4.2s]" viewBox="0 0 160 100" fill="none">
          <path d="M5 50 L30 50 L45 35 L80 35 L80 65 L110 65 L130 45 L155 45" stroke="#00f2ff" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="80" cy="35" r="3" fill="#00f2ff" opacity="0.8"/>
        </svg>
        <svg className="absolute top-[12%] left-[5%] w-[140px] rotate-[8deg] animate-circuit-appear [animation-delay:1.4s]" viewBox="0 0 140 90" fill="none">
          <path d="M5 45 L35 45 L50 30 L80 30 L95 45 L135 45" stroke="#00f2ff" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="50" cy="30" r="2.5" fill="#00f2ff" opacity="0.7"/>
        </svg>
      </div>

      {/* Corners */}
      <div className="absolute inset-0 z-[7] pointer-events-none">
        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#00f2ff] opacity-70 animate-corner-pulse" />
        <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[#00f2ff] opacity-70 animate-corner-pulse" />
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[#00f2ff] opacity-70 animate-corner-pulse" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#00f2ff] opacity-70 animate-corner-pulse" />
      </div>

      {/* Hex Nodes */}
      <HexNode className="top-[18%] left-[12%] [animation-delay:0s]" size={28} />
      <HexNode className="top-[65%] left-[88%] [animation-delay:1.8s]" size={22} />
      <HexNode className="top-[80%] left-[20%] [animation-delay:3.2s]" size={18} />
      <HexNode className="top-[15%] left-[80%] [animation-delay:0.9s]" size={24} />

      {/* HUD */}
      <div className="absolute bottom-7 right-9 z-[10] text-right font-outfit text-[10px] tracking-[0.15em] text-[#00f2ff]/50 pointer-events-none">
        <span className="block">UPLINK ACTIVE</span>
        <span className="block text-[18px] font-bold text-[#00f2ff] opacity-80">{hudCount.toString().padStart(4, '0')}</span>
        <span className="block">LEARNERS ONLINE</span>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent z-[10] animate-bar-glow" />
    </div>
  );
}

function HexNode({ className, size }: { className: string, size: number }) {
  return (
    <svg 
      className={`absolute z-[6] pointer-events-none opacity-0 animate-hex-pulse ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 28 28"
    >
      <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="none" stroke="#00f2ff" strokeWidth="1.2"/>
      <circle cx="14" cy="14" r="3" fill="#00f2ff"/>
    </svg>
  );
}
