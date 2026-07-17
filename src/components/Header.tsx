import { AppConfig } from "../types";
import { TrendingUp, Clock, AlertCircle, Sparkles } from "lucide-react";

interface HeaderProps {
  config: AppConfig;
  onOpenAdmin: () => void;
}

export default function Header({ config, onOpenAdmin }: HeaderProps) {
  const isOpen = config.statusMarket === "OPEN";

  return (
    <header className="relative w-full z-10 select-none">
      {/* Top Ticker / Running Text */}
      <div className="w-full bg-[#030906] border-b border-white/5 py-2.5 overflow-hidden flex items-center justify-center">
        <div className="max-w-7xl w-full px-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-brand-green/10 px-2.5 py-0.5 rounded text-xs font-mono font-medium text-brand-green border border-brand-green/20 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
            <span>INFO RUNNING</span>
          </div>
          <div className="relative flex-1 overflow-hidden h-5 marquee-container">
            <div className="absolute whitespace-nowrap marquee-content text-xs md:text-sm text-gray-300 flex items-center gap-12 font-medium">
              <span>{config.runningText}</span>
              <span className="text-brand-gold">★ Jam Operasional: {config.jamOperasional} ★</span>
              <span>Layanan Terpercaya: {config.layanan.join(" • ")}</span>
              <span className="text-brand-green">🟢 Rate Terbaik Terupdate Realtime! 🟢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-5 md:py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-brand-green/30 shadow-[0_0_15px_rgba(0,255,136,0.15)] group-hover:scale-105 transition-all duration-300 overflow-hidden">
            {config.logo && (config.logo.startsWith("data:") || config.logo.startsWith("http")) ? (
              <img
                src={config.logo}
                alt="Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-2xl animate-pulse">🔥</span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-wider text-white flex items-center gap-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-green to-brand-gold drop-shadow-md">
                {config.namaWebsite}
              </span>
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-brand-green/70">
              PREMIUM OTC EXCHANGER
            </span>
          </div>
        </div>

        {/* Status and Info Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3.5">
          {/* Jam Operasional */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-panel text-xs font-mono text-gray-300">
            <Clock className="w-4 h-4 text-brand-gold" />
            <span>{config.jamOperasional}</span>
          </div>

          {/* Status Market */}
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider hidden xs:block">
              MARKET STATUS:
            </div>
            <div
              className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide select-none transition-all duration-300 ${
                isOpen
                  ? "bg-brand-green/10 text-brand-green border-brand-green/30 shadow-[0_0_15px_rgba(0,255,136,0.25)] animate-[pulse_3s_infinite]"
                  : "bg-brand-danger/10 text-brand-danger border-brand-danger/30 shadow-[0_0_15px_rgba(255,68,68,0.25)]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-brand-green animate-ping" : "bg-brand-danger"}`}></span>
              <span>{isOpen ? "🟢 OPEN" : "🔴 CLOSE"}</span>
            </div>
          </div>

          {/* Admin Control Button */}
          <button
            id="btn-admin-login"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-brand-gold/30 bg-brand-gold/5 text-brand-gold hover:bg-brand-gold/15 active:scale-95 text-xs font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_10px_rgba(255,215,0,0.05)]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-brand-gold" />
            <span>ADMIN COCKPIT</span>
          </button>
        </div>
      </div>

      {/* CSS Animation injection for scrolling marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-container {
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }
        .marquee-content {
          animation: marquee 42s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
