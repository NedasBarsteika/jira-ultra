'use client';
import { Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// ── Orbit ring ─────────────────────────────────────────────────────────────────

function OrbitRing({
  size,
  duration,
  reverse = false,
  dotColor,
}: {
  size: number;
  duration: number;
  reverse?: boolean;
  dotColor: string;
}) {
  return (
    <div
      className="absolute rounded-full border border-[#3d3868]/50 pointer-events-none"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: `spin-ring ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          background: dotColor,
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: `0 0 10px ${dotColor}`,
        }}
      />
    </div>
  );
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────────

function Breadcrumb({ path }: { path: string }) {
  const parts = path.split('/').filter(Boolean);
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-8">
      <span className="text-[#8b7cf7]">iterova.app</span>
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="opacity-40">/</span>
          <span
            className={
              i === parts.length - 1
                ? 'text-destructive line-through opacity-70'
                : 'text-foreground/60'
            }
          >
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const [glitchActive, setGlitchActive] = useState(false);

  // Trigger glitch every few seconds
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const triggerGlitch = () => {
      setGlitchActive(true);
      timeoutId = setTimeout(() => setGlitchActive(false), 350);
    };
    triggerGlitch();
    const id = setInterval(triggerGlitch, 4000);
    return () => {
      clearInterval(id);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {/* Keyframes injected inline */}
      <style>{`
        @keyframes float-particle {
          0%   { opacity: 0; transform: translateY(0px) scale(0.8); }
          30%  { opacity: 0.6; }
          70%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-60px) scale(1.2); }
        }
        @keyframes spin-ring {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes glitch-1 {
          0%,100% { clip-path: inset(0 0 100% 0); transform: translateX(0); }
          20% { clip-path: inset(10% 0 60% 0); transform: translateX(-6px); }
          40% { clip-path: inset(50% 0 30% 0); transform: translateX(6px); }
          60% { clip-path: inset(70% 0 10% 0); transform: translateX(-4px); }
          80% { clip-path: inset(30% 0 50% 0); transform: translateX(4px); }
        }
        @keyframes glitch-2 {
          0%,100% { clip-path: inset(100% 0 0 0); transform: translateX(0); }
          20% { clip-path: inset(60% 0 20% 0); transform: translateX(8px); }
          40% { clip-path: inset(20% 0 70% 0); transform: translateX(-8px); }
          60% { clip-path: inset(80% 0 5%  0); transform: translateX(5px); }
          80% { clip-path: inset(40% 0 40% 0); transform: translateX(-5px); }
        }
        @keyframes pulse-glow {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes drift {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%     { transform: translateY(-12px) rotate(1.5deg); }
          66%     { transform: translateY(8px) rotate(-1deg); }
        }
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .glitch-text.active::before {
          color: #60a5fa;
          animation: glitch-1 0.35s steps(1) forwards;
        }
        .glitch-text.active::after {
          color: #e5395d;
          animation: glitch-2 0.35s steps(1) forwards;
        }
      `}</style>

      <div className="relative h-[calc(100vh-73px)] bg-background flex flex-col items-center justify-center overflow-hidden px-6 py-20">
        {/* Background glow blobs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,124,247,0.08) 0%, transparent 70%)',
            animation: 'pulse-glow 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)',
            animation: 'pulse-glow 8s ease-in-out 2s infinite',
          }}
        />

        {/* Orbit rings (desktop only) */}
        <div className="absolute inset-0 items-center justify-center pointer-events-none hidden lg:flex">
          <OrbitRing size={420} duration={18} dotColor="#8b7cf7" />
          <OrbitRing size={560} duration={26} reverse dotColor="#60a5fa" />
          <OrbitRing size={700} duration={36} dotColor="#a78bfa" />
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
          {/* Breadcrumb */}
          {pathname !== '/' && <Breadcrumb path={pathname} />}

          {/* 404 hero */}
          <div className="mb-6 select-none" style={{ animation: 'drift 8s ease-in-out infinite' }}>
            {/* Big number */}
            <div
              className={`glitch-text ${glitchActive ? 'active' : ''}`}
              data-text="404"
              style={{
                fontSize: 'clamp(7rem, 22vw, 14rem)',
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #8b7cf7 0%, #60a5fa 50%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(139,124,247,0.35))',
              }}
            >
              404
            </div>

            {/* Subtitle tag */}
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full border border-[#3d3868] bg-[#2a2650]/60 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              PAGE_NOT_FOUND · STATUS_CODE_404
            </div>
          </div>

          {/* Message */}
          <h1 className="text-foreground mb-3" style={{ fontSize: '1.6rem' }}>
            Looks like this page drifted off the board
          </h1>
          <p className="text-muted-foreground mb-10 max-w-sm leading-relaxed text-sm">
            The URL you entered doesn&apos;t match any route in Iterova. It may have been moved,
            deleted, or perhaps it was never on the sprint backlog to begin with.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground hover:border-[#8b7cf7]/50 hover:bg-[#2a2650] transition-all duration-200"
            >
              <ArrowLeft className="size-4" />
              Go back
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-primary-foreground transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(139,124,247,0.35)]"
              style={{ background: 'linear-gradient(135deg, #8b7cf7, #6d5fd6)' }}
            >
              <Home className="size-4" />
              Home
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground hover:border-[#60a5fa]/50 hover:bg-[#2a2650] transition-all duration-200"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-10 text-xs text-muted-foreground/50 font-mono">
            ITEROVA · ERROR 404 · ROUTE UNRESOLVED
          </p>
        </div>
      </div>
    </>
  );
}
