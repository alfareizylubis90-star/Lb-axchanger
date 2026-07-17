/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppConfig, AdminStats, HistoryItem } from "./types";
import {
  loadConfig,
  saveConfig,
  loadStats,
  saveStats,
  loadHistory,
  saveHistory,
  formatRupiah,
} from "./utils";
import BackgroundParticles from "./components/BackgroundParticles";
import Header from "./components/Header";
import RateSection from "./components/RateSection";
import Calculator from "./components/Calculator";
import AdminPanel from "./components/AdminPanel";
import {
  MessageSquare,
  Send,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Megaphone,
  Sparkles,
  DollarSign
} from "lucide-react";

export default function App() {
  // Global React States
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [stats, setStats] = useState<AdminStats>(loadStats());
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory());
  
  // Dialog Controllers
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Visitor Count and Announcement
  useEffect(() => {
    // Simulated smooth intro loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    // Track visitors on refresh/mount
    const currentStats = loadStats();
    currentStats.jumlahVisitor += 1;
    saveStats(currentStats);
    setStats(currentStats);

    // If active announcement exist, show popup banner
    const currentConfig = loadConfig();
    if (currentConfig.pengumuman.aktif) {
      setIsAnnouncementOpen(true);
    }

    return () => clearTimeout(timer);
  }, []);

  // Save Config handler from Admin Cockpit
  const handleSaveConfig = (updatedConfig: AppConfig) => {
    // Check if Rate USD or Rate KHR changed to append rate update history log
    if (
      updatedConfig.rateUsd !== config.rateUsd ||
      updatedConfig.rateKhr !== config.rateKhr
    ) {
      const timestamp = new Date().toLocaleString("id-ID", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      
      const newRateLog = {
        timestamp,
        rateUsd: updatedConfig.rateUsd,
        rateKhr: updatedConfig.rateKhr,
      };

      const updatedStats = {
        ...stats,
        rateHistory: [...stats.rateHistory, newRateLog],
      };

      saveStats(updatedStats);
      setStats(updatedStats);
    }

    saveConfig(updatedConfig);
    setConfig(updatedConfig);
  };

  // Sync Stats Resets from Admin Cockpit
  const handleResetStats = () => {
    const refreshedStats: AdminStats = {
      jumlahPerhitungan: 0,
      jumlahVisitor: 1,
      rateHistory: [
        {
          timestamp: new Date().toLocaleString("id-ID", { hour12: false }),
          rateUsd: config.rateUsd,
          rateKhr: config.rateKhr,
        },
      ],
    };
    saveStats(refreshedStats);
    setStats(refreshedStats);
  };

  const handleClearHistory = () => {
    saveHistory([]);
    setHistory([]);
  };

  // Sync calculations from active user inputs
  const handleCalculationTriggered = (item: HistoryItem) => {
    // Append to local state list
    const updatedHistory = [...history, item];
    saveHistory(updatedHistory);
    setHistory(updatedHistory);

    // Increment admin computation statistics
    const updatedStats = {
      ...stats,
      jumlahPerhitungan: stats.jumlahPerhitungan + 1,
    };
    saveStats(updatedStats);
    setStats(updatedStats);
  };

  const telegramIdClean = config.telegramId ? config.telegramId.replace("@", "").trim() : "";
  const telegramPersonalUrl = telegramIdClean ? `https://t.me/${telegramIdClean}` : "";
  const lineIdClean = config.lineId ? config.lineId.replace("@", "").trim() : "";
  const lineUrl = lineIdClean ? `https://line.me/R/ti/p/~${lineIdClean}` : "";

  return (
    <div
      className="min-h-screen text-white select-none relative flex flex-col font-sans overflow-x-hidden bg-[#08110D]"
      style={
        config.bannerUrl
          ? {
              backgroundImage: `radial-gradient(circle at center, rgba(8, 17, 13, 0.82) 0%, #08110D 100%), url(${config.bannerUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      {/* Intro Loading Spinner Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08110D]"
          >
            {config.logo && (config.logo.startsWith("data:") || config.logo.startsWith("http")) ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-2xl overflow-hidden border border-brand-green/30 shadow-[0_0_20px_rgba(0,255,136,0.35)] mb-4 flex items-center justify-center bg-black/40"
              >
                <img
                  src={config.logo}
                  alt="Loading Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full shadow-[0_0_20px_rgba(0,255,136,0.3)] mb-4"
              />
            )}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-display font-black tracking-widest text-brand-green neon-text-green uppercase"
            >
              {config.namaWebsite}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6 }}
              className="text-xs font-mono text-gray-400 mt-1"
            >
              Loading Secure OTC Systems...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated Background Particles */}
      <BackgroundParticles />

      {/* EMERGENCY POPUP ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {isAnnouncementOpen && config.pengumuman.aktif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-[fade-in_0.25s_ease]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl glass-panel-heavy border border-brand-green/30 p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.15)]"
            >
              {/* Decorative side accent */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green shadow-[0_0_15px_rgba(0,255,136,0.5)]"></div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shrink-0">
                  <Megaphone className="w-6 h-6 text-brand-green animate-bounce" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-display font-extrabold text-white tracking-wide uppercase">
                    {config.pengumuman.judul}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono whitespace-pre-line">
                    {config.pengumuman.isi}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  id="btn-close-announcement"
                  onClick={() => setIsAnnouncementOpen(false)}
                  className="px-5 py-2 rounded-xl bg-brand-green text-black font-bold text-xs tracking-wider uppercase hover:bg-brand-green/80 cursor-pointer transition active:scale-95 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                >
                  SAYA MENGERTI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      <Header config={config} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full flex flex-col justify-start relative z-10 py-4 select-none">
        
        {/* HERO INTRO & INFORMATION BANNER */}
        <div className="max-w-4xl mx-auto px-4 text-center mt-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-brand-green mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-gold" />
            <span>EXCHANGER INDONESIA - KAMBOJA TERPERCAYA</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none mb-3"
          >
            SOLUSI FINANSIAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-white to-brand-gold">
              PREMIUM & AMAN
            </span>
          </motion.h2>

          <p className="text-xs md:text-sm text-gray-400 font-mono max-w-xl mx-auto leading-relaxed">
            {config.bannerText}
          </p>
        </div>

        {/* LATEST RATE BOARDS */}
        <RateSection config={config} />

        {/* CONVERSION CALCULATOR GLASS PANEL */}
        <Calculator
          config={config}
          onCalculationTriggered={handleCalculationTriggered}
        />

        {/* HELPER CTA QUICK WIDGETS */}
        <div className="max-w-4xl mx-auto px-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-10">
          {/* WhatsApp CTA card */}
          <a
            href={`https://wa.me/${config.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between p-5 rounded-2xl glass-panel hover:border-brand-green/30 group transition-all duration-300 min-h-[140px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-11 h-11 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                <MessageSquare className="w-5.5 h-5.5 text-brand-green" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold font-display tracking-wide text-white group-hover:text-brand-green transition-colors uppercase">
                WhatsApp Admin
              </h4>
              <p className="text-[10px] font-mono text-gray-400 mt-1">Transaksi langsung instan</p>
            </div>
          </a>

          {/* Telegram Channel CTA card */}
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col justify-between p-5 rounded-2xl glass-panel hover:border-brand-gold/30 group transition-all duration-300 min-h-[140px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                <Send className="w-5.5 h-5.5 text-brand-gold" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold font-display tracking-wide text-white group-hover:text-brand-gold transition-colors uppercase">
                Telegram Channel
              </h4>
              <p className="text-[10px] font-mono text-gray-400 mt-1">Update promo rate harian</p>
            </div>
          </a>

          {/* Telegram Personal Chat CTA card */}
          <a
            href={telegramPersonalUrl || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!telegramPersonalUrl) {
                e.preventDefault();
                alert("ID Telegram belum dikonfigurasi oleh admin.");
              }
            }}
            className="flex flex-col justify-between p-5 rounded-2xl glass-panel hover:border-sky-500/30 group transition-all duration-300 min-h-[140px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <Send className="w-5.5 h-5.5 text-sky-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold font-display tracking-wide text-white group-hover:text-sky-400 transition-colors uppercase">
                Telegram Personal
              </h4>
              <p className="text-[10px] font-mono text-gray-400 mt-1">
                {config.telegramId ? `@${config.telegramId}` : "Hubungi via Telegram"}
              </p>
            </div>
          </a>

          {/* Line ID CTA card */}
          <a
            href={lineUrl || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!lineUrl) {
                e.preventDefault();
                alert("ID Line belum dikonfigurasi oleh admin.");
              }
            }}
            className="flex flex-col justify-between p-5 rounded-2xl glass-panel hover:border-green-500/30 group transition-all duration-300 min-h-[140px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <MessageSquare className="w-5.5 h-5.5 text-green-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold font-display tracking-wide text-white group-hover:text-green-400 transition-colors uppercase">
                Line ID Admin
              </h4>
              <p className="text-[10px] font-mono text-gray-400 mt-1">
                {config.lineId ? config.lineId : "Hubungi via Line"}
              </p>
            </div>
          </a>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full bg-[#030906] border-t border-white/5 py-6 mt-auto relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span>{config.footerText}</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="text-brand-green font-bold">Ver 1.1 Stable</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="text-brand-gold font-bold">{config.namaWebsite}</span>
          </div>
        </div>
      </footer>

      {/* COCKPIT ADMINISTRATIVE PANEL (DRAWER MODAL) */}
      <AdminPanel
        config={config}
        stats={stats}
        history={history}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSaveConfig={handleSaveConfig}
        onResetStats={handleResetStats}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
