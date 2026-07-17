import { AppConfig } from "../types";
import { formatRupiah, formatKhr } from "../utils";
import { DollarSign, Landmark, ArrowUpRight, ShieldCheck, CheckCircle2, Coins } from "lucide-react";

interface RateSectionProps {
  config: AppConfig;
}

export default function RateSection({ config }: RateSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-3 z-10 relative">
      {/* Services Card (Layanan) */}
      <div className="lg:col-span-1 rounded-2xl glass-panel p-6 border border-white/5 flex flex-col justify-between hover:border-brand-green/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.05)] transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
              <ShieldCheck className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <h3 className="text-sm font-mono tracking-wider text-brand-green uppercase font-semibold">
                💸 LAYANAN UTAMA
              </h3>
              <p className="text-[10px] text-gray-400">Tersedia untuk transaksi offline & online</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {config.layanan.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl border border-white/5 transition-all duration-200 group"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-green shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/90 font-display">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
          <span>Semua layanan aktif dan siap dilayani</span>
        </div>
      </div>

      {/* USD Buy Card */}
      <div className="rounded-2xl glass-panel p-6 border border-white/5 relative overflow-hidden group hover:border-brand-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-green/10 transition-all duration-500"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <h3 className="text-xs font-mono tracking-wider text-brand-green uppercase font-semibold">
                📈 RATE BELI USD
              </h3>
              <p className="text-[10px] text-gray-400">Dolar AS ke Rupiah</p>
            </div>
          </div>
          <span className="flex items-center gap-0.5 text-[10px] font-mono bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-md border border-brand-green/20">
            <ArrowUpRight className="w-3 h-3" />
            BEST RATE
          </span>
        </div>

        <div className="flex flex-col justify-center min-h-[90px]">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            NILAI TUKAR USD
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {formatRupiah(config.rateUsd)}
            </span>
            <span className="text-xs font-mono text-brand-green font-medium">/ 1 USD</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400">Auto Update Realtime</span>
          <span className="text-[10px] font-mono text-brand-green font-bold">100% SECURE</span>
        </div>
      </div>

      {/* KHR Buy Card */}
      <div className="rounded-2xl glass-panel p-6 border border-white/5 relative overflow-hidden group hover:border-brand-gold/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-500"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xs font-mono tracking-wider text-brand-gold uppercase font-semibold">
                📈 RATE BELI KHR
              </h3>
              <p className="text-[10px] text-gray-400">Riel Kamboja ke Rupiah</p>
            </div>
          </div>
          <span className="flex items-center gap-0.5 text-[10px] font-mono bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-md border border-brand-gold/20">
            <ArrowUpRight className="w-3 h-3" />
            TERBAIK
          </span>
        </div>

        <div className="flex flex-col justify-center min-h-[90px]">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            NILAI TUKAR KHR
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {formatRupiah(config.rateKhr)}
            </span>
            <span className="text-xs font-mono text-brand-gold font-medium">/ 100.000 Riel</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400">Mudah & Cepat</span>
          <span className="text-[10px] font-mono text-brand-gold font-bold">100.000 KHR UNIT</span>
        </div>
      </div>
    </div>
  );
}
