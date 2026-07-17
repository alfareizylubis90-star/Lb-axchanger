import { useState, useEffect } from "react";
import { AppConfig, HistoryItem } from "../types";
import { formatRupiah, formatUsd, formatKhr } from "../utils";
import { Calculator as CalcIcon, RefreshCw, Copy, Check, Info, ArrowLeftRight, Landmark, DollarSign, Wallet } from "lucide-react";

interface CalculatorProps {
  config: AppConfig;
  onCalculationTriggered: (item: HistoryItem) => void;
}

export default function Calculator({ config, onCalculationTriggered }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState<"usd_idr" | "idr_khr">("usd_idr");

  // Mode 1 State (USD -> IDR)
  const [usdInput, setUsdInput] = useState<string>("100");
  const [idrOutput, setIdrOutput] = useState<number>(0);

  // Mode 2 State (IDR -> KHR)
  const [idrInput, setIdrInput] = useState<string>("452000");
  const [khrOutput, setKhrOutput] = useState<number>(0);

  // Interaction feedback states
  const [copied, setCopied] = useState<boolean>(false);
  const [calculated, setCalculated] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Handle Mode 1 Live Math
  useEffect(() => {
    const amount = parseFloat(usdInput.replace(/,/g, "")) || 0;
    const rate = config.rateUsd;
    setIdrOutput(amount * rate);
  }, [usdInput, config.rateUsd]);

  // Handle Mode 2 Live Math
  useEffect(() => {
    const rupiah = parseFloat(idrInput.replace(/\./g, "").replace(/,/g, "")) || 0;
    const rate = config.rateKhr;
    if (rate > 0) {
      // 452.000 Rupiah / 452.000 Rate * 100.000 = 100.000 Riel
      setKhrOutput((rupiah / rate) * 100000);
    } else {
      setKhrOutput(0);
    }
  }, [idrInput, config.rateKhr]);

  // Trigger formatted copy to clipboard
  const handleCopy = () => {
    let textToCopy = "";
    if (activeTab === "usd_idr") {
      textToCopy = `Konversi USD ke Rupiah\nJumlah: ${formatUsd(parseFloat(usdInput) || 0)}\nRate: ${formatRupiah(config.rateUsd)}\nHasil: ${formatRupiah(idrOutput)}`;
    } else {
      textToCopy = `Konversi Rupiah ke Riel (KHR)\nJumlah: ${formatRupiah(parseFloat(idrInput) || 0)}\nRate: ${formatRupiah(config.rateKhr)} per 100.000 KHR\nHasil: ${formatKhr(khrOutput)}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    triggerToast("Hasil konversi berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Reset Input Forms
  const handleReset = () => {
    if (activeTab === "usd_idr") {
      setUsdInput("0");
    } else {
      setIdrInput("0");
    }
    setCalculated(false);
    triggerToast("Input berhasil di-reset.");
  };

  // Process core "Hitung" Action (creates detailed log / triggers state for visual glow)
  const handleCalculate = () => {
    setCalculated(true);

    const timestamp = new Date().toLocaleString("id-ID", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    let newItem: HistoryItem;

    if (activeTab === "usd_idr") {
      const inputVal = parseFloat(usdInput) || 0;
      const rateVal = config.rateUsd;
      newItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        tipe: "USD_IDR",
        inputAmount: inputVal,
        rate: rateVal,
        outputAmount: idrOutput,
        formattedInput: formatUsd(inputVal),
        formattedOutput: formatRupiah(idrOutput),
      };
    } else {
      const inputVal = parseFloat(idrInput) || 0;
      const rateVal = config.rateKhr;
      newItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        tipe: "IDR_KHR",
        inputAmount: inputVal,
        rate: rateVal,
        outputAmount: khrOutput,
        formattedInput: formatRupiah(inputVal),
        formattedOutput: formatKhr(khrOutput),
      };
    }

    onCalculationTriggered(newItem);
    triggerToast("Konversi berhasil dihitung & dicatat!");
    
    // Auto reset the glow animation trigger after a delay
    setTimeout(() => setCalculated(false), 1200);
  };

  // Format Helper for Input typing
  const cleanAndSetUsd = (val: string) => {
    // allow numbers and single dot
    const clean = val.replace(/[^0-9.]/g, "");
    setUsdInput(clean);
  };

  const cleanAndSetRupiah = (val: string) => {
    // remove non-digits
    const clean = val.replace(/[^0-9]/g, "");
    setIdrInput(clean);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 z-10 relative">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-brand-bg/95 border border-brand-green/30 shadow-[0_0_20px_rgba(0,255,136,0.15)] rounded-xl text-white text-xs font-medium animate-[fade-in_0.2s_ease-out]">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Main Glassmorphism Calculator Block */}
      <div className="rounded-3xl glass-panel-heavy border border-white/10 p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Title */}
        <div className="flex items-center gap-3.5 mb-6 md:mb-8 border-b border-white/5 pb-5">
          <div className="w-11 h-11 rounded-2xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-center animate-pulse">
            <CalcIcon className="w-5.5 h-5.5 text-brand-green" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-extrabold text-white tracking-wide">
              📊 KALKULATOR EXCHANGER
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Konversi instan dengan rate pasar terupdate
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-8 p-1.5 bg-black/40 rounded-xl border border-white/5">
          <button
            onClick={() => {
              setActiveTab("usd_idr");
              setCalculated(false);
            }}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-xs md:text-sm font-bold font-display tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === "usd_idr"
                ? "bg-brand-green/15 text-brand-green border border-brand-green/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <DollarSign className="w-4.5 h-4.5" />
            <span>USD ➔ RUPIAH (IDR)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("idr_khr");
              setCalculated(false);
            }}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-xs md:text-sm font-bold font-display tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === "idr_khr"
                ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Wallet className="w-4.5 h-4.5" />
            <span>RUPIAH (IDR) ➔ RIEL (KHR)</span>
          </button>
        </div>

        {/* Form Area */}
        <div className="space-y-6">
          {activeTab === "usd_idr" ? (
            /* MODE 1: USD -> IDR */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 flex flex-col justify-center">
                {/* Input USD */}
                <div className="space-y-2">
                  <label className="text-xs font-mono tracking-wider text-gray-400 block uppercase font-medium">
                    Jumlah USD
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-green font-bold">
                      $
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={usdInput}
                      onChange={(e) => cleanAndSetUsd(e.target.value)}
                      placeholder="Masukkan nilai USD..."
                      className="w-full pl-9 pr-24 py-4 rounded-xl bg-black/30 border border-white/10 text-white font-display font-bold text-lg focus:outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/30 group-hover:border-white/20 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center text-[10px] font-mono text-gray-400 pointer-events-none">
                      USD CURRENCY
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 block">
                    Format: {formatUsd(parseFloat(usdInput) || 0)}
                  </span>
                </div>
              </div>
 
              {/* Mode 1 Output Screen */}
              <div className="flex flex-col justify-between p-6 rounded-2xl bg-black/30 border border-white/5 relative group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono tracking-wider text-gray-400 uppercase font-medium">
                      Hasil Konversi Rupiah
                    </span>
                    <Landmark className="w-4.5 h-4.5 text-brand-green animate-pulse" />
                  </div>
                  <div className="pt-4 pb-6 min-h-[90px] flex items-center">
                    <span
                      className={`text-2xl md:text-3xl font-display font-black tracking-tight text-brand-green select-all transition-all duration-300 ${
                        calculated ? "scale-105 filter brightness-125 text-shadow-[0_0_15px_rgba(0,255,136,0.4)]" : ""
                      }`}
                    >
                      {formatRupiah(idrOutput)}
                    </span>
                  </div>
                </div>
 
                <div className="bg-[#0b1611]/60 border border-brand-green/10 p-3 rounded-lg flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-300 leading-normal font-mono">
                    Perhitungan: {usdInput || "0"} USD × {formatRupiah(config.rateUsd)} ={" "}
                    {formatRupiah(idrOutput)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: IDR -> KHR */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 flex flex-col justify-center">
                {/* Input IDR */}
                <div className="space-y-2">
                  <label className="text-xs font-mono tracking-wider text-gray-400 block uppercase font-medium">
                    Jumlah Rupiah (IDR)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gold font-bold">
                      Rp
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={idrInput}
                      onChange={(e) => cleanAndSetRupiah(e.target.value)}
                      placeholder="Masukkan nilai Rupiah..."
                      className="w-full pl-10 pr-24 py-4 rounded-xl bg-black/30 border border-white/10 text-white font-display font-bold text-lg focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 group-hover:border-white/20 transition-all"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center text-[10px] font-mono text-gray-400 pointer-events-none">
                      INDONESIAN RUPIAH
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 block">
                    Format: {formatRupiah(parseFloat(idrInput) || 0)}
                  </span>
                </div>
              </div>
 
              {/* Mode 2 Output Screen */}
              <div className="flex flex-col justify-between p-6 rounded-2xl bg-black/30 border border-white/5 relative group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono tracking-wider text-gray-400 uppercase font-medium">
                      Hasil Riel Kamboja (KHR)
                    </span>
                    <Landmark className="w-4.5 h-4.5 text-brand-gold animate-pulse" />
                  </div>
                  <div className="pt-4 pb-6 min-h-[90px] flex items-center">
                    <span
                      className={`text-2xl md:text-3xl font-display font-black tracking-tight text-brand-gold select-all transition-all duration-300 ${
                        calculated ? "scale-105 filter brightness-125 text-shadow-[0_0_15px_rgba(255,215,0,0.4)]" : ""
                      }`}
                    >
                      {formatKhr(khrOutput)}
                    </span>
                  </div>
                </div>
 
                <div className="bg-[#18150c]/60 border border-brand-gold/10 p-3 rounded-lg flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-300 leading-normal font-mono">
                    Perhitungan: ({formatRupiah(parseFloat(idrInput) || 0)} / {formatRupiah(config.rateKhr)}) × 100.000 ={" "}
                    {formatKhr(khrOutput)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 border-t border-white/5 pt-6">
          <button
            id="btn-hitung"
            onClick={handleCalculate}
            className={`flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold tracking-wider cursor-pointer transition-all duration-300 active:scale-95 ${
              activeTab === "usd_idr"
                ? "bg-brand-green text-[#030906] hover:bg-brand-green/80 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                : "bg-brand-gold text-[#08110D] hover:bg-brand-gold/80 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            }`}
          >
            <CalcIcon className="w-4.5 h-4.5" />
            <span>HITUNG</span>
          </button>

          <button
            id="btn-reset"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 text-sm font-semibold tracking-wider cursor-pointer transition-all active:scale-95"
          >
            <RefreshCw className="w-4.5 h-4.5 text-gray-400" />
            <span>RESET</span>
          </button>

          <button
            id="btn-copy"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 text-sm font-semibold tracking-wider cursor-pointer transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4.5 h-4.5 text-brand-green" />
                <span className="text-brand-green font-bold">TERCOPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-4.5 h-4.5 text-gray-400" />
                <span>COPY HASIL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
