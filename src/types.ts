export interface AppConfig {
  namaWebsite: string;
  logo: string;
  statusMarket: "OPEN" | "CLOSE";
  rateUsd: number;
  rateKhr: number; // Rupiah per 100,000 KHR
  layanan: string[];
  runningText: string;
  pengumuman: {
    aktif: boolean;
    judul: string;
    isi: string;
  };
  warnaTema: {
    primary: string; // Hex color (e.g., #00FF88)
    secondary: string; // Hex color (e.g., #FFD700)
    danger: string; // Hex color (e.g., #FF4444)
    background: string; // Hex color or 'animated'
  };
  bannerUrl: string; // URL or base64
  bannerText: string;
  footerText: string;
  whatsappNumber: string;
  telegramUrl: string;
  telegramId: string;
  lineId: string;
  jamOperasional: string;
  adminPin: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  tipe: "USD_IDR" | "IDR_KHR";
  inputAmount: number;
  rate: number;
  outputAmount: number;
  formattedInput: string;
  formattedOutput: string;
}

export interface RateHistoryLog {
  timestamp: string;
  rateUsd: number;
  rateKhr: number;
}

export interface AdminStats {
  jumlahPerhitungan: number;
  jumlahVisitor: number;
  rateHistory: RateHistoryLog[];
}
