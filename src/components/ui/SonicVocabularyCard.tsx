import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Radio, Activity, Zap } from "lucide-react";
import { useLanguage } from "@/lib/language";

interface SonicAsset {
  id: string;
  name: string;
  freq: string;
  freqVal: number;
  desc: string;
  type: OscillatorType;
  waveName: string;
}

interface TranslationContent {
  title: string;
  subtitle: string;
  audio_on: string;
  audio_off: string;
  freq: string;
  wave: string;
  status: string;
  active_dsp: string;
  assets: SonicAsset[];
}

const translations: Record<string, TranslationContent> = {
  en: {
    title: "SONIC IDENTITY ARCHITECTURE",
    subtitle: "Audio is a native dimension of KAIRMA. 5 fixed sonic assets engineered for zero-latency symbiosis.",
    audio_on: "AUDIO: ON",
    audio_off: "MUTE",
    freq: "FREQ",
    wave: "WAVE",
    status: "STATUS",
    active_dsp: "LIVE SYNTH",
    assets: [
      { id: "01", name: "BOOT SEQUENCE", freq: "432 Hz", freqVal: 432, desc: "System startup & neural core ignition", type: "sine", waveName: "SINE PULSE" },
      { id: "02", name: "AGENT SYNC", freq: "528 Hz", freqVal: 528, desc: "Autonomous agent handshakes & telemetry", type: "triangle", waveName: "HARMONIC WAVE" },
      { id: "03", name: "NEURAL PULSE", freq: "639 Hz", freqVal: 639, desc: "Deep inference & recursive logic loops", type: "sawtooth", waveName: "BASS DRONE" },
      { id: "04", name: "DATA CONFIRM", freq: "741 Hz", freqVal: 741, desc: "Secure transaction & consensus check", type: "sine", waveName: "CRISP PING" },
      { id: "05", name: "HARDWARE LINK", freq: "852 Hz", freqVal: 852, desc: "Physical sensor & edge device telemetry", type: "square", waveName: "RESONANCE SWEEP" },
    ],
  },
  "zh-TW": {
    title: "聲音識別體系 // SONIC",
    subtitle: "聲音是 KAIRMA 品牌的原生維度。五組專屬聲音資產，為零延遲的人機共生而生。",
    audio_on: "聲音開啟",
    audio_off: "靜音模式",
    freq: "頻率",
    wave: "波形",
    status: "狀態",
    active_dsp: "實時合成器",
    assets: [
      { id: "01", name: "啟動序列", freq: "432 Hz", freqVal: 432, desc: "系統核心啟動與神經網絡點火", type: "sine", waveName: "正弦波脈衝" },
      { id: "02", name: "智能體同步", freq: "528 Hz", freqVal: 528, desc: "自主數位員工握手與遙測同步", type: "triangle", waveName: "諧波振盪" },
      { id: "03", name: "神經脈衝", freq: "639 Hz", freqVal: 639, desc: "深度推理與遞歸邏輯運算迴圈", type: "sawtooth", waveName: "低頻共鳴" },
      { id: "04", name: "數據確認", freq: "741 Hz", freqVal: 741, desc: "安全交易與區塊鏈共識驗證", type: "sine", waveName: "清脆提示音" },
      { id: "05", name: "硬體連接", freq: "852 Hz", freqVal: 852, desc: "實體感測器與邊緣計算設備連接", type: "square", waveName: "共鳴掃描" },
    ],
  },
  ja: {
    title: "サウンド識別アーキテクチャ",
    subtitle: "オーディオはKAIRMAの原生的次元です。ゼロ遅延の共生のために設計された5つの固定音響アセット。",
    audio_on: "音声: ON",
    audio_off: "ミュート",
    freq: "周波数",
    wave: "波形",
    status: "ステータス",
    active_dsp: "リアルタイムDSP",
    assets: [
      { id: "01", name: "起動シーケンス", freq: "432 Hz", freqVal: 432, desc: "システム起動とニューラルコア点火", type: "sine", waveName: "サインパルス" },
      { id: "02", name: "エージェント同期", freq: "528 Hz", freqVal: 528, desc: "自律型エージェントの同期とテレメトリ", type: "triangle", waveName: "ハーモニック波" },
      { id: "03", name: "ニューラルパルス", freq: "639 Hz", freqVal: 639, desc: "推論と再帰的ロジックループ", type: "sawtooth", waveName: "ベースドローン" },
      { id: "04", name: "データ確認", freq: "741 Hz", freqVal: 741, desc: "セキュアなトランザクション確認", type: "sine", waveName: "クリスプピング" },
      { id: "05", name: "ハードウェアリンク", freq: "852 Hz", freqVal: 852, desc: "物理センサーとエッジデバイス接続", type: "square", waveName: "レゾナンススウィープ" },
    ],
  },
  ko: {
    title: "소닉 아이덴티티 아키텍처",
    subtitle: "오디오는 KAIRMA의 고유한 차원입니다. 제로 레이턴시 공생을 위해 설계된 5개의 고정 소닉 에셋.",
    audio_on: "오디오: 켜짐",
    audio_off: "음소거",
    freq: "주파수",
    wave: "파형",
    status: "상태",
    active_dsp: "실시간 신디사이저",
    assets: [
      { id: "01", name: "부팅 시퀀스", freq: "432 Hz", freqVal: 432, desc: "시스템 부팅 및 뉴럴 코어 점화", type: "sine", waveName: "사인 펄스" },
      { id: "02", name: "에이전트 동기화", freq: "528 Hz", freqVal: 528, desc: "자율 에이전트 핸드셰이크 및 원격 측정", type: "triangle", waveName: "하모닉 웨이브" },
      { id: "03", name: "뉴럴 펄스", freq: "639 Hz", freqVal: 639, desc: "심층 추론 및 재귀적 로직 루프", type: "sawtooth", waveName: "베이스 드론" },
      { id: "04", name: "데이터 확인", freq: "741 Hz", freqVal: 741, desc: "보안 트랜잭션 및 합의 확인", type: "sine", waveName: "크리스프 핑" },
      { id: "05", name: "하드웨어 링크", freq: "852 Hz", freqVal: 852, desc: "물리적 센서 및 엣지 장치 원격 측정", type: "square", waveName: "레조넌스 스윕" },
    ],
  },
};

export const SonicVocabularyCard: React.FC = () => {
  const { lang } = useLanguage();
  const content = translations[lang] || translations.en;

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 40) + 15)
  );

  const currentAsset = content.assets[activeIdx] || content.assets[0];

  // Synthesize sound using Web Audio API
  const playTone = (freqVal: number, oscType: OscillatorType) => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = oscType;
      osc.frequency.setValueAtTime(freqVal, ctx.currentTime);

      // Soft cybernetic envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setIsPlaying(true);
      osc.stop(ctx.currentTime + 0.45);

      setTimeout(() => {
        setIsPlaying(false);
        if (ctx.state !== "closed") {
          ctx.close().catch(() => {});
        }
      }, 450);
    } catch (err) {
      console.warn("Web Audio API blocked or unavailable:", err);
    }
  };

  // Animate visualizer bars
  useEffect(() => {
    const interval = setInterval(() => {
      setVisualizerBars((prev) =>
        prev.map(() => {
          const base = isPlaying ? 55 : 20;
          const variance = isPlaying ? 45 : 30;
          return Math.floor(Math.random() * variance) + base;
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleAssetSelect = (idx: number) => {
    setActiveIdx(idx);
    const selected = content.assets[idx];
    playTone(selected.freqVal, selected.type);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full font-mono">
      {/* Top Header Area */}
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-theme-accent animate-pulse shrink-0" />
            <h2 className="text-sm md:text-base font-bold text-theme-text uppercase tracking-widest">
              {content.title}
            </h2>
          </div>

          {/* Mute / Audio Toggle Button */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all duration-200 border cursor-pointer select-none ${
              audioEnabled
                ? "bg-theme-accent/15 border-theme-accent/40 text-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]"
                : "bg-theme-void border-theme-border/50 text-theme-text-muted hover:text-theme-text"
            }`}
            aria-label="Toggle Audio Synthesis"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-bold tracking-wider">
              {audioEnabled ? content.audio_on : content.audio_off}
            </span>
          </button>
        </div>

        <p className="text-xs text-theme-text-muted font-sans line-clamp-2">
          {content.subtitle}
        </p>
      </div>

      {/* Center: Cybernetic Spectrum Visualizer & Oscilloscope Box */}
      <div className="relative rounded-lg bg-theme-void/90 border border-theme-border/60 p-3.5 mb-4 overflow-hidden shadow-inner flex flex-col gap-3 group">
        {/* Quote-style Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-theme-accent/80 pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-theme-accent/80 pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-theme-accent/80 pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-theme-accent/80 pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4" />

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-15 pointer-events-none z-10" />

        {/* Live Readouts Header */}
        <div className="flex items-center justify-between text-[10px] text-theme-text-muted z-10 border-b border-theme-border/30 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-ping" />
            <span className="text-theme-accent font-bold tracking-widest">{content.active_dsp} // LIVE</span>
          </div>
          <span className="font-bold tracking-wider">{currentAsset.freq}</span>
        </div>

        {/* Equalizer Bars Graphic */}
        <div className="h-16 flex items-end justify-between gap-1 z-10 pt-2 pb-1 px-1">
          {visualizerBars.map((heightVal, i) => {
            const isCenter = i >= 6 && i <= 9;
            const barHeight = Math.min(100, Math.max(10, isPlaying ? heightVal * (isCenter ? 1.3 : 1) : heightVal));
            return (
              <motion.div
                key={i}
                animate={{ height: `${barHeight}%` }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className={`w-full rounded-t-sm transition-colors ${
                  isPlaying || isCenter
                    ? "bg-theme-accent shadow-[0_0_6px_var(--color-theme-accent)]"
                    : "bg-theme-accent/30 hover:bg-theme-accent/60"
                }`}
              />
            );
          })}
        </div>

        {/* Selected Asset Telemetry Footer */}
        <div className="flex items-center justify-between text-[10px] text-theme-text z-10 pt-1 border-t border-theme-border/20">
          <span className="truncate max-w-[65%] font-sans text-theme-text-muted">{currentAsset.desc}</span>
          <span className="text-theme-accent font-bold tracking-wider shrink-0">[{currentAsset.waveName}]</span>
        </div>
      </div>

      {/* Bottom: 5 Clickable Sonic Asset Vocabulary Tabs */}
      <div className="flex flex-col gap-2 flex-1 justify-center">
        {content.assets.map((asset, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={asset.id}
              onClick={() => handleAssetSelect(idx)}
              className={`flex items-center justify-between px-3 py-2 rounded text-left transition-all duration-200 border cursor-pointer outline-none group/pad relative overflow-hidden ${
                isActive
                  ? "bg-theme-accent/15 border-theme-accent/60 text-theme-text shadow-[0_0_12px_var(--color-theme-accent)]"
                  : "bg-theme-void/50 border-theme-border/40 text-theme-text-muted hover:bg-theme-accent/5 hover:border-theme-accent/30 hover:text-theme-text"
              }`}
              aria-label={`Play sonic asset ${asset.name} at ${asset.freq}`}
            >
              {/* Active Indicator Bar on Left */}
              {isActive && (
                <motion.div
                  layoutId="activeSonicIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]"
                />
              )}

              {/* Asset Name & ID */}
              <div className="flex items-center gap-2.5 min-w-0 pl-1">
                <span className={`font-mono text-xs font-bold ${isActive ? "text-theme-accent" : "text-theme-text-muted group-hover/pad:text-theme-accent"}`}>
                  {asset.id}
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider truncate">
                  {asset.name}
                </span>
              </div>

              {/* Frequency Tag & Live Pulse Dot */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`font-mono text-[10px] tracking-widest px-1.5 py-0.5 rounded ${
                  isActive ? "bg-theme-accent/20 text-theme-accent border border-theme-accent/40" : "bg-theme-void text-theme-text-muted border border-theme-border/30"
                }`}>
                  {asset.freq}
                </span>
                <span className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-pulse" : "bg-theme-border/60 group-hover/pad:bg-theme-accent/50"
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
