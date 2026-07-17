import { AppConfig, AdminStats } from "./types";

export const DEFAULT_CONFIG: AppConfig = {
  namaWebsite: "LB EXCHANGER",
  logo: "🔥 LB EXCHANGER 🔥",
  statusMarket: "OPEN",
  rateUsd: 18300,
  rateKhr: 452000, // IDR cost per 100,000 KHR, meaning 100,000 KHR = 452,000 IDR
  layanan: ["CASH USD", "CASH KHR", "E-CASH", "ALL BANK"],
  runningText: "Selamat Datang di LB EXCHANGER - Layanan Tukar Mata Uang Aman, Cepat, Terpercaya dan Profesional! Hubungi admin untuk transaksi lebih lanjut.",
  pengumuman: {
    aktif: true,
    judul: "PENGUMUMAN PENTING",
    isi: "Harap selalu konfirmasi nomor rekening atau tujuan transfer ke WhatsApp Admin resmi sebelum melakukan transaksi pembayaran. Kami tidak bertanggung jawab atas kesalahan transfer ke rekening selain milik admin.",
  },
  warnaTema: {
    primary: "#00FF88",
    secondary: "#FFD700",
    danger: "#FF4444",
    background: "animated",
  },
  bannerUrl: "",
  bannerText: "Transaksi Cepat & Aman Tanpa Ribet. Rate bersaing setiap hari!",
  footerText: "© 2026 LB EXCHANGER. All Rights Reserved. Terpercaya sejak 2024.",
  whatsappNumber: "628123456789", // Default WhatsApp number
  telegramUrl: "https://t.me/lbexchanger", // Default Telegram URL
  telegramId: "lbexchanger_admin", // Default Telegram ID
  lineId: "lb_exchanger", // Default Line ID
  jamOperasional: "08:00 - 22:00 WIB",
  adminPin: "123456", // Default secure PIN
};

export const DEFAULT_STATS: AdminStats = {
  jumlahPerhitungan: 0,
  jumlahVisitor: 1,
  rateHistory: [
    { timestamp: "2026-07-16 10:00", rateUsd: 18300, rateKhr: 452000 },
  ],
};

// Formatting helpers
export function formatRupiah(value: number): string {
  if (isNaN(value)) return "Rp0";
  const rounded = Math.round(value);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${formatted}`;
}

export function formatUsd(value: number): string {
  if (isNaN(value)) return "0.00 USD";
  // Always format with 2 decimal places and USD suffix
  const formatted = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted} USD`;
}

export function formatKhr(value: number): string {
  if (isNaN(value)) return "0 KHR";
  // KHR usually has no decimals
  const rounded = Math.round(value);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} KHR`;
}

// Local Storage Keys
const CONFIG_KEY = "lb_exchanger_config_v1";
const STATS_KEY = "lb_exchanger_stats_v1";
const HISTORY_KEY = "lb_exchanger_history_v1";

export function loadConfig(): AppConfig {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Auto migrate old default KHR rate to the newly requested rate
      if (parsed.rateKhr === 542000) {
        parsed.rateKhr = 452000;
      }
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load config from localStorage", e);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config to localStorage", e);
  }
}

export function loadStats(): AdminStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.rateHistory) {
        parsed.rateHistory = parsed.rateHistory.map((item: any) => {
          if (item.rateKhr === 542000) {
            return { ...item, rateKhr: 452000 };
          }
          return item;
        });
      }
      return { ...DEFAULT_STATS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load stats from localStorage", e);
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: AdminStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save stats to localStorage", e);
  }
}

export function loadHistory(): any[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load history from localStorage", e);
  }
  return [];
}

export function saveHistory(history: any[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save history to localStorage", e);
  }
}
