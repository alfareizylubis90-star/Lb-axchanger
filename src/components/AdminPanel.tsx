import React, { useState, useRef, useEffect } from "react";
import { AppConfig, AdminStats, HistoryItem } from "../types";
import { formatRupiah, formatKhr } from "../utils";
import {
  X, Lock, Unlock, Eye, Sparkles, Settings, EyeOff, Save, Trash2, Plus, RefreshCcw,
  TrendingUp, BarChart3, Users, Key, Calendar, MessageSquare, Info, ShieldAlert,
  ArrowRight, ToggleLeft, ToggleRight, Radio, ExternalLink, Image as ImageIcon
} from "lucide-react";

interface AdminPanelProps {
  config: AppConfig;
  stats: AdminStats;
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (updated: AppConfig) => void;
  onResetStats: () => void;
  onClearHistory: () => void;
}

export default function AdminPanel({
  config,
  stats,
  history,
  isOpen,
  onClose,
  onSaveConfig,
  onResetStats,
  onClearHistory,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Editable configurations states
  const [formConfig, setFormConfig] = useState<AppConfig>({ ...config });
  const [newLayanan, setNewLayanan] = useState<string>("");
  
  // Tab within admin
  const [adminTab, setAdminTab] = useState<"dashboard" | "settings" | "layanan" | "appearance">("dashboard");

  // Sync internal state with external config when opened
  useEffect(() => {
    if (isOpen) {
      setFormConfig({ ...config });
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  // Handle Authentication with PIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === formConfig.adminPin) {
      setIsAuthenticated(true);
      setPinError(null);
      setPinInput("");
    } else {
      setPinError("PIN Salah! Coba lagi.");
      setIsAuthenticated(false);
    }
  };

  // Handle saving configurations
  const handleSave = () => {
    onSaveConfig(formConfig);
    alert("Semua perubahan berhasil disimpan secara realtime!");
  };

  // Handle Service adding
  const addLayananItem = () => {
    if (!newLayanan.trim()) return;
    setFormConfig({
      ...formConfig,
      layanan: [...formConfig.layanan, newLayanan.trim()],
    });
    setNewLayanan("");
  };

  const removeLayananItem = (index: number) => {
    const updated = [...formConfig.layanan];
    updated.splice(index, 1);
    setFormConfig({
      ...formConfig,
      layanan: updated,
    });
  };

  // Convert File upload into Base64 with high-performance Canvas downscaling & compression to prevent localStorage saturation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "bannerUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to downscale
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimension limits (1000px for background, 300px for logo)
        const maxDim = field === "logo" ? 300 : 1000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress quality (0.75 for exceptional crispness & lightweight storage foot print)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          
          setFormConfig((prev) => ({ ...prev, [field]: compressedBase64 }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Container Box */}
      <div className="w-full max-w-5xl rounded-3xl glass-panel-heavy border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] my-8">
        
        {/* Header bar of admin panel */}
        <div className="px-6 py-4 bg-black/50 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-brand-gold animate-spin-slow" />
            <span className="text-sm font-mono font-bold tracking-wider text-brand-gold uppercase">
              LB EXCHANGER ADMIN SYSTEM
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* PIN LOGIN SCREEN */
          <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-brand-gold animate-bounce" />
            </div>
            
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Verifikasi Keamanan Admin
            </h3>
            <p className="text-xs text-gray-400 font-mono mb-8 max-w-sm leading-relaxed">
              Silakan masukkan PIN administrasi anda untuk membuka panel kontrol.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={12}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN Admin..."
                  className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-brand-gold"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-white"
                >
                  {showPin ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {pinError && (
                <div className="flex items-center gap-1.5 justify-center text-xs text-brand-danger font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-gold text-[#08110D] font-bold text-xs tracking-wider uppercase hover:bg-brand-gold/90 transition duration-200 cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.25)] flex items-center justify-center gap-2"
              >
                <span>BUKA AKSES</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        ) : (
          /* MAIN ADMIN SUITE */
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
            {/* Sidebar Tabs */}
            <div className="md:col-span-1 bg-black/30 border-r border-white/5 p-4 space-y-1.5">
              <div className="px-3.5 py-2.5 mb-4 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider">
                  Admin Terverifikasi
                </span>
              </div>

              <button
                onClick={() => setAdminTab("dashboard")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                  adminTab === "dashboard"
                    ? "bg-brand-green/15 text-brand-green border border-brand-green/15"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <BarChart3 className="w-4.5 h-4.5" />
                <span>Dashboard Stats</span>
              </button>

              <button
                onClick={() => setAdminTab("settings")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                  adminTab === "settings"
                    ? "bg-brand-green/15 text-brand-green border border-brand-green/15"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Pengaturan Inti</span>
              </button>

              <button
                onClick={() => setAdminTab("layanan")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                  adminTab === "layanan"
                    ? "bg-brand-green/15 text-brand-green border border-brand-green/15"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Radio className="w-4.5 h-4.5" />
                <span>Daftar Layanan</span>
              </button>

              <button
                onClick={() => setAdminTab("appearance")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                  adminTab === "appearance"
                    ? "bg-brand-green/15 text-brand-green border border-brand-green/15"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>Gaya & Tampilan</span>
              </button>

              <div className="pt-24">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-brand-danger bg-brand-danger/10 hover:bg-brand-danger/20 transition cursor-pointer flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Kunci Panel</span>
                </button>
              </div>
            </div>

            {/* Sub Panel Content Area */}
            <div className="md:col-span-3 flex flex-col h-[650px] overflow-hidden">
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                
                {/* DASHBOARD TAB */}
                {adminTab === "dashboard" && (
                  <div className="space-y-6">
                  <h4 className="text-base font-display font-bold text-white mb-4 border-b border-white/5 pb-2">
                    📊 Statistik & Laporan Realtime
                  </h4>

                  {/* Stat Widget Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Visitor counter */}
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                          Total Visitor
                        </span>
                        <span className="text-xl md:text-2xl font-display font-black text-brand-green">
                          {stats.jumlahVisitor}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-green" />
                      </div>
                    </div>

                    {/* Calculation counter */}
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                          Hitung Hari Ini
                        </span>
                        <span className="text-xl md:text-2xl font-display font-black text-brand-gold">
                          {stats.jumlahPerhitungan}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-brand-gold" />
                      </div>
                    </div>

                    {/* Market status info widget */}
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                          Status Market
                        </span>
                        <span
                          className={`text-sm font-bold block ${
                            formConfig.statusMarket === "OPEN" ? "text-brand-green" : "text-brand-danger"
                          }`}
                        >
                          {formConfig.statusMarket === "OPEN" ? "🟢 OPENING" : "🔴 CLOSED"}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setFormConfig({
                            ...formConfig,
                            statusMarket: formConfig.statusMarket === "OPEN" ? "CLOSE" : "OPEN",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        TOGGLE
                      </button>
                    </div>
                  </div>

                  {/* Rates Change history chart / records */}
                  <div className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                        📈 Log Perubahan Rate Terakhir
                      </span>
                      <span className="text-[10px] font-mono text-brand-green">Auto-synced</span>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {stats.rateHistory.slice().reverse().map((log, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs font-mono bg-black/20 p-2.5 rounded-lg border border-white/5"
                        >
                          <span className="text-gray-400">{log.timestamp}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-brand-green">USD: {formatRupiah(log.rateUsd)}</span>
                            <span className="text-brand-gold">KHR: {formatRupiah(log.rateKhr)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculations History Logs */}
                  <div className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                        📋 Riwayat Perhitungan Hari Ini
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={onClearHistory}
                          className="px-2.5 py-1 rounded bg-brand-danger/10 border border-brand-danger/20 text-[9px] font-mono text-brand-danger hover:bg-brand-danger/20 transition cursor-pointer"
                        >
                          HAPUS LOG
                        </button>
                        <button
                          onClick={onResetStats}
                          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-gray-300 hover:bg-white/10 transition cursor-pointer"
                        >
                          RESET STATS
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {history.length === 0 ? (
                        <div className="text-center py-6 text-xs text-gray-500 font-mono">
                          Belum ada transaksi perhitungan hari ini.
                        </div>
                      ) : (
                        history.slice().reverse().map((item) => (
                          <div
                            key={item.id}
                            className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-gray-500 text-[10px]">{item.timestamp}</span>
                              <span className="text-white">
                                {item.tipe === "USD_IDR" ? "🇺🇸 USD ke 🇲🇨 IDR" : "🇲🇨 IDR ke 🇰🇭 KHR"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">Input: {item.formattedInput}</span>
                              <span className="text-brand-green font-bold">Hasil: {item.formattedOutput}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {adminTab === "settings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h4 className="text-base font-display font-bold text-white">
                      ⚙️ Pengaturan Inti & Rate Realtime
                    </h4>
                    <span className="text-[10px] font-mono text-brand-gold">Mempengaruhi seluruh kalkulator</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Rate USD Beli */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Rate USD Beli (IDR)</label>
                      <input
                        type="number"
                        value={formConfig.rateUsd}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, rateUsd: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Rate KHR Beli */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Rate KHR Beli (IDR / 100.000 Riel)</label>
                      <input
                        type="number"
                        value={formConfig.rateKhr}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, rateKhr: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    {/* Nama Website */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Nama Website</label>
                      <input
                        type="text"
                        value={formConfig.namaWebsite}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, namaWebsite: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Logo Website */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Logo Website (Text / Emoji)</label>
                      <input
                        type="text"
                        value={formConfig.logo}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, logo: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Jam Operasional */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Jam Operasional</label>
                      <input
                        type="text"
                        value={formConfig.jamOperasional}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, jamOperasional: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Nomor WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Nomor WhatsApp (Kode Negara, e.g. 628123..)</label>
                      <input
                        type="text"
                        value={formConfig.whatsappNumber}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, whatsappNumber: e.target.value.replace(/[^0-9]/g, "") })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Telegram URL */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Telegram Channel/Username URL</label>
                      <input
                        type="text"
                        value={formConfig.telegramUrl}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, telegramUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Telegram ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Telegram Personal ID / Username</label>
                      <input
                        type="text"
                        value={formConfig.telegramId || ""}
                        placeholder="e.g. lbexchanger_admin"
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, telegramId: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* Line ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Line ID Admin</label>
                      <input
                        type="text"
                        value={formConfig.lineId || ""}
                        placeholder="e.g. lb_exchanger"
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, lineId: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    {/* PIN Admin */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400">Ubah PIN Keamanan Admin</label>
                      <input
                        type="text"
                        value={formConfig.adminPin}
                        onChange={(e) =>
                          setFormConfig({ ...formConfig, adminPin: e.target.value.replace(/[^0-9]/g, "") })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  {/* Running text block */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400">Running Text Ticker</label>
                    <textarea
                      rows={2}
                      value={formConfig.runningText}
                      onChange={(e) =>
                        setFormConfig({ ...formConfig, runningText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-brand-green"
                    />
                  </div>

                  {/* Banner Sub Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400">Banner Informasi Tambahan (Footer/Sub-Header)</label>
                    <input
                      type="text"
                      value={formConfig.bannerText}
                      onChange={(e) =>
                        setFormConfig({ ...formConfig, bannerText: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-xs focus:outline-none"
                    />
                  </div>

                </div>
              )}

              {/* LAYANAN TAB */}
              {adminTab === "layanan" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-base font-display font-bold text-white">
                      💸 Kelola Daftar Layanan
                    </h4>
                    <p className="text-xs text-gray-400 font-sans mt-0.5">
                      Tambahkan atau hapus layanan penukaran finansial yang ditampilkan di halaman depan.
                    </p>
                  </div>

                  {/* List of active services */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {formConfig.layanan.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-xl border border-white/5 group"
                      >
                        <span className="text-sm text-white font-mono font-medium">{item}</span>
                        <button
                          onClick={() => removeLayananItem(index)}
                          className="p-1.5 rounded-lg bg-brand-danger/10 hover:bg-brand-danger/25 text-brand-danger transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Service bar */}
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      value={newLayanan}
                      onChange={(e) => setNewLayanan(e.target.value)}
                      placeholder="Masukkan nama layanan baru..."
                      className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none"
                    />
                    <button
                      onClick={addLayananItem}
                      className="px-4 rounded-xl bg-brand-green text-black font-bold flex items-center justify-center gap-1 hover:bg-brand-green/80 cursor-pointer transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs font-mono">TAMBAH</span>
                    </button>
                  </div>

                </div>
              )}

              {/* APPEARANCE TAB */}
              {adminTab === "appearance" && (
                <div className="space-y-6">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-base font-display font-bold text-white">
                      🎨 Gaya & Pengumuman
                    </h4>
                    <p className="text-xs text-gray-400 font-sans mt-0.5">
                      Kelola warna tema premium, pengumuman pop-up darurat, dan asset latar belakang.
                    </p>
                  </div>

                  {/* Pengumuman Setup */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                        📢 Alert Pengumuman Utama (Popup Banner)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">Tampilkan?</span>
                        <input
                          type="checkbox"
                          checked={formConfig.pengumuman.aktif}
                          onChange={(e) =>
                            setFormConfig({
                              ...formConfig,
                              pengumuman: { ...formConfig.pengumuman, aktif: e.target.checked },
                            })
                          }
                          className="w-4.5 h-4.5 rounded text-brand-green focus:ring-0 cursor-pointer accent-brand-green"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={formConfig.pengumuman.judul}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            pengumuman: { ...formConfig.pengumuman, judul: e.target.value },
                          })
                        }
                        placeholder="Judul pengumuman..."
                        className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold"
                      />
                      <textarea
                        rows={3}
                        value={formConfig.pengumuman.isi}
                        onChange={(e) =>
                          setFormConfig({
                            ...formConfig,
                            pengumuman: { ...formConfig.pengumuman, isi: e.target.value },
                          })
                        }
                        placeholder="Detail pengumuman resmi..."
                        className="w-full px-3.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-sans"
                      />
                    </div>
                  </div>

                  {/* Asset Upload & Branding */}
                  <div className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4">
                    <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider block">
                      🖼️ Asset Branding & File Loader
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Logo Loader */}
                      <div className="p-3 bg-black/20 border border-white/5 rounded-lg space-y-3">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase">
                          Upload Custom Banner/Logo (Base64)
                        </span>
                        
                        {/* Thumbnail preview */}
                        {formConfig.logo && (formConfig.logo.startsWith("data:") || formConfig.logo.startsWith("http")) ? (
                          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/10">
                            <img
                              src={formConfig.logo}
                              alt="Logo Preview"
                              className="w-10 h-10 rounded object-cover border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-mono text-brand-green block">Logo Aktif</span>
                              <button
                                type="button"
                                onClick={() => setFormConfig((prev) => ({ ...prev, logo: "🔥 LB EXCHANGER 🔥" }))}
                                className="text-[9px] font-mono text-brand-danger hover:underline font-bold mt-0.5 block"
                              >
                                Hapus Custom Logo
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "logo")}
                          className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer w-full"
                        />
                      </div>

                      {/* BG Loader */}
                      <div className="p-3 bg-black/20 border border-white/5 rounded-lg space-y-3">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase">
                          Upload Custom Background (Base64)
                        </span>

                        {/* Thumbnail preview */}
                        {formConfig.bannerUrl ? (
                          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/10">
                            <img
                              src={formConfig.bannerUrl}
                              alt="Background Preview"
                              className="w-10 h-10 rounded object-cover border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-mono text-brand-gold block">Background Aktif</span>
                              <button
                                type="button"
                                onClick={() => setFormConfig((prev) => ({ ...prev, bannerUrl: "" }))}
                                className="text-[9px] font-mono text-brand-danger hover:underline font-bold mt-0.5 block"
                              >
                                Hapus Background
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "bannerUrl")}
                          className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW BEFOR SAVE (Realtime live-simulated card) */}
                  <div className="bg-black/40 border border-brand-gold/20 rounded-xl p-5 space-y-3.5">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-brand-gold animate-pulse" />
                      <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider">
                        PREVIEW REAL-TIME (SEBELUM SAVE)
                      </span>
                    </div>

                    <div 
                      className="p-4 rounded-xl bg-[#08110D] border border-white/10 space-y-3 font-sans relative overflow-hidden"
                      style={
                        formConfig.bannerUrl
                          ? {
                              backgroundImage: `radial-gradient(circle at center, rgba(8, 17, 13, 0.85) 0%, #08110D 100%), url(${formConfig.bannerUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : undefined
                      }
                    >
                      <div className="flex justify-between items-center text-xs relative z-10">
                        <div className="flex items-center gap-2">
                          {formConfig.logo && (formConfig.logo.startsWith("data:") || formConfig.logo.startsWith("http")) ? (
                            <img
                              src={formConfig.logo}
                              alt="Logo"
                              className="w-5 h-5 rounded object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-sm">🔥</span>
                          )}
                          <span className="text-white font-bold">{formConfig.namaWebsite}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                          formConfig.statusMarket === "OPEN" ? "bg-brand-green/10 text-brand-green" : "bg-brand-danger/10 text-brand-danger"
                        }`}>
                          {formConfig.statusMarket === "OPEN" ? "🟢 OPEN" : "🔴 CLOSE"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono relative z-10">
                        <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-2 rounded">
                          <span className="text-gray-400 block">USD RATE:</span>
                          <span className="text-brand-green font-bold">{formatRupiah(formConfig.rateUsd)}</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-2 rounded">
                          <span className="text-gray-400 block">KHR RATE:</span>
                          <span className="text-brand-gold font-bold">{formatRupiah(formConfig.rateKhr)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
              </div>

              {/* STICKY FOOTER FOR EDITABLE TABS */}
              {adminTab !== "dashboard" && (
                <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-end shrink-0">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-green text-[#030906] font-bold text-xs tracking-wider uppercase hover:bg-brand-green/85 transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>SIMPAN PERUBAHAN</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
