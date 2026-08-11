import { useState, useEffect, useRef, useMemo } from 'react';
import { GameShell } from './GameShell';
import { GAMES } from './gamesData';
import { speakTaiyu } from '../../lib/speech';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';
import {
  Volume2,
  Trophy,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { recordGameResult } from '../../lib/progressStore';
import BadgeToast from './BadgeToast';

// Vocabulary item interface
export interface WordPair {
  id: number;
  mandarin: string;
  taiyuHanzi: string;
  tailo: string;
}

// 50-item Lukang & Daily Life Word Bank
export const LUKANG_VOCAB_BANK: WordPair[] = [
  { id: 1, mandarin: '麵茶', taiyuHanzi: '麵茶', tailo: 'mī-tê' },
  { id: 2, mandarin: '牛舌餅', taiyuHanzi: '牛舌餅', tailo: 'gû-tsi̍h-piánn' },
  { id: 3, mandarin: '圓仔湯', taiyuHanzi: '圓仔湯', tailo: 'înn-á-thng' },
  { id: 4, mandarin: '麻粩', taiyuHanzi: '麻粩', tailo: 'muâ-láu' },
  { id: 5, mandarin: '鹿港', taiyuHanzi: '鹿港', tailo: 'Lo̍k-káng' },
  { id: 6, mandarin: '老街', taiyuHanzi: '老街', tailo: 'lāu-kue' },
  { id: 7, mandarin: '三輪車', taiyuHanzi: '三輪車', tailo: 'sann-lián-tshia' },
  { id: 8, mandarin: '伴手禮', taiyuHanzi: '等路', tailo: 'tán-lōo' },
  { id: 9, mandarin: '麵線糊', taiyuHanzi: '麵線糊', tailo: 'mī-suànn-kôo' },
  { id: 10, mandarin: '肉圓', taiyuHanzi: '肉圓', tailo: 'bah-uân' },
  { id: 11, mandarin: '廟', taiyuHanzi: '廟', tailo: 'biō' },
  { id: 12, mandarin: '古蹟', taiyuHanzi: '古蹟', tailo: 'kóo-tsik' },
  { id: 13, mandarin: '豆花', taiyuHanzi: '豆花', tailo: 'tāu-hue' },
  { id: 14, mandarin: '芋丸', taiyuHanzi: '芋丸', tailo: 'ōo-uân' },
  { id: 15, mandarin: '肉包', taiyuHanzi: '肉包', tailo: 'bah-pau' },
  { id: 16, mandarin: '粉粿', taiyuHanzi: '粉粿', tailo: 'hún-kué' },
  { id: 17, mandarin: '秫米糋', taiyuHanzi: '秫米糋', tailo: 'tsu̍t-bí-tsìn' },
  { id: 18, mandarin: '李仔攕', taiyuHanzi: '李仔攕', tailo: 'lí-á-tshiám' },
  { id: 19, mandarin: '糕仔餅', taiyuHanzi: '糕仔餅', tailo: 'ko-á-piánn' },
  { id: 20, mandarin: '葵扇', taiyuHanzi: '葵扇', tailo: 'khuê-sìnn' },
  { id: 21, mandarin: '擲筊', taiyuHanzi: '跋桮', tailo: 'pua̍h-pue' },
  { id: 22, mandarin: '眉角', taiyuHanzi: '鋩角', tailo: 'mâi-kak' },
  { id: 23, mandarin: '高鐵', taiyuHanzi: '高鐵', tailo: 'kao-the̍h' },
  { id: 24, mandarin: '拜拜', taiyuHanzi: '拜拜', tailo: 'pài-pài' },
  { id: 25, mandarin: '橘子', taiyuHanzi: '柑仔', tailo: 'kam-á' },
  { id: 26, mandarin: '香蕉', taiyuHanzi: '弓蕉', tailo: 'king-tsiou' },
  { id: 27, mandarin: '芭樂', taiyuHanzi: '番石榴', tailo: 'nap-á' },
  { id: 28, mandarin: '鳳梨', taiyuHanzi: '王梨', tailo: 'ông-lâi' },
  { id: 29, mandarin: '蓮霧', taiyuHanzi: '蓮霧', tailo: 'lián-bū' },
  { id: 30, mandarin: '木瓜', taiyuHanzi: '木瓜', tailo: 'bo̍k-kue' },
  { id: 31, mandarin: '葡萄', taiyuHanzi: '葡萄', tailo: 'pû-tôo' },
  { id: 32, mandarin: '柚子', taiyuHanzi: '柚仔', tailo: 'iū-á' },
  { id: 33, mandarin: '梨子', taiyuHanzi: '梨仔', tailo: 'lâi-á' },
  { id: 34, mandarin: '玉米', taiyuHanzi: '番麥', tailo: 'huan-be̍h' },
  { id: 35, mandarin: '柳丁', taiyuHanzi: '柳丁', tailo: 'liū-ting' },
  { id: 36, mandarin: '西瓜', taiyuHanzi: '西瓜', tailo: 'si-kue' },
  { id: 37, mandarin: '芒果', taiyuHanzi: '檨仔', tailo: 'suāinn-á' },
  { id: 38, mandarin: '地瓜', taiyuHanzi: '番薯', tailo: 'han-tsî' },
  { id: 39, mandarin: '蘿蔔', taiyuHanzi: '菜頭', tailo: 'tshài-thâu' },
  { id: 40, mandarin: '茄子', taiyuHanzi: '茄仔', tailo: 'kiô-á' },
  { id: 41, mandarin: '竹筍', taiyuHanzi: '筍仔', tailo: 'sún-á' },
  { id: 42, mandarin: '香菇', taiyuHanzi: '香菇', tailo: 'hiang-koo' },
  { id: 43, mandarin: '豆腐', taiyuHanzi: '豆腐', tailo: 'tāu-hū' },
  { id: 44, mandarin: '綠豆湯', taiyuHanzi: '綠豆湯', tailo: 'li̍k-tāu-thng' },
  { id: 45, mandarin: '車輪餅', taiyuHanzi: '紅豆餅', tailo: 'âng-tāu-piánn' },
  { id: 46, mandarin: '糖果', taiyuHanzi: '飴仔', tailo: 'am-á' },
  { id: 47, mandarin: '雞蛋', taiyuHanzi: '雞卵', tailo: 'ke-nn̄g' },
  { id: 48, mandarin: '珍珠奶茶', taiyuHanzi: '珍珠奶茶', tailo: 'tsin-tsu nai-tshâ' },
  { id: 49, mandarin: '冰棒', taiyuHanzi: '枝仔冰', tailo: 'ki-á-ping' },
  { id: 50, mandarin: '牙膏', taiyuHanzi: '齒膏', tailo: 'khí-ko' },
];

export type GameMode = 'basic' | 'standard' | 'challenge';

// Helper to speak Mandarin aloud
function speakMandarin(text: string) {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.95;
  synth.speak(utterance);
}

// Pseudo-random deterministic shuffle helper based on seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let m = result.length, t, i;
  let s = seed;
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    i = Math.floor((s / 233280) * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
}

export default function Game7Airport({ onNext, onHome }: { onNext: () => void; onHome?: () => void }) {
  // Game Configuration State
  const [roundIndex, setRoundIndex] = useState(0); // Round counter
  const [mode, setMode] = useState<GameMode>('standard');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Gameplay Progress State
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completed, setCompleted] = useState(false);

  const recordedRef = useRef(false);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);
  useEffect(() => {
    if (completed && !recordedRef.current) {
      recordedRef.current = true;
      const answered = 12 + errorCount;
      const accuracy = answered > 0 ? Math.round((12 / answered) * 100) : 100;
      const r = recordGameResult({ gameKey: 'game7', score, accuracy });
      if (r.newlyEarnedBadges.length > 0) {
        setNewBadges(r.newlyEarnedBadges.map((b) => `${b.icon} ${b.title}`));
      }
    }
    if (!completed) recordedRef.current = false;
  }, [completed]);

  // Interaction State
  const [selectedMandarinId, setSelectedMandarinId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{ mandarinId: number; taiyuId: number } | null>(null);
  const [flashingHintTaiyuId, setFlashingHintTaiyuId] = useState<number | null>(null);
  const [lastMatchedWord, setLastMatchedWord] = useState<WordPair | null>(null);
  const [comboPopupText, setComboPopupText] = useState<string | null>(null);

  // Timers
  const lastMatchTimeRef = useRef<number>(Date.now());
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Derive current round's 12 items from the 50-word bank
  const currentRoundItems = useMemo(() => {
    // Pick 12 items based on roundIndex chunk + shuffle
    const total = LUKANG_VOCAB_BANK.length;
    const startIndex = (roundIndex * 12) % total;
    let selected: WordPair[] = [];
    for (let i = 0; i < 12; i++) {
      selected.push(LUKANG_VOCAB_BANK[(startIndex + i) % total]);
    }
    return selected;
  }, [roundIndex]);

  // Shuffled Mandarin cards (order differs from Taiwanese cards)
  const mandarinCards = useMemo(() => {
    return seededShuffle(currentRoundItems, roundIndex * 100 + 1);
  }, [currentRoundItems, roundIndex]);

  // Shuffled Taiwanese cards
  const taiyuCards = useMemo(() => {
    return seededShuffle(currentRoundItems, roundIndex * 100 + 2);
  }, [currentRoundItems, roundIndex]);

  // Timer loop
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setElapsedTime((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [completed]);

  // Reset round
  const startRound = (rIdx: number) => {
    setRoundIndex(rIdx);
    setMatchedIds([]);
    setSelectedMandarinId(null);
    setWrongPair(null);
    setFlashingHintTaiyuId(null);
    setCombo(0);
    setMaxCombo(0);
    setErrorCount(0);
    setHintsUsed(0);
    setElapsedTime(0);
    setCompleted(false);
    setLastMatchedWord(null);
    setComboPopupText(null);
    lastMatchTimeRef.current = Date.now();
  };

  // Handle clicking a Mandarin card
  const handleSelectMandarin = (item: WordPair) => {
    if (matchedIds.includes(item.id) || wrongPair !== null || completed) return;
    setSelectedMandarinId(item.id);
    setWrongPair(null);
    if (soundEnabled) {
      speakMandarin(item.mandarin);
    }
  };

  // Handle clicking a Taiwanese card
  const handleSelectTaiyu = (item: WordPair) => {
    if (matchedIds.includes(item.id) || wrongPair !== null || completed) return;

    if (selectedMandarinId === null) {
      // Speak Taiwanese pronunciation even if no Mandarin card is selected
      if (soundEnabled) {
        speakTaiyu(item.taiyuHanzi, undefined, item.tailo);
      }
      return;
    }

    const isMatch = selectedMandarinId === item.id;

    if (isMatch) {
      // MATCH SUCCESS
      playCorrectSound();
      const now = Date.now();
      const timeDiffSeconds = (now - lastMatchTimeRef.current) / 1000;
      lastMatchTimeRef.current = now;

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Score Calculation
      let points = 100; // Base score
      if (newCombo >= 3) points += 20; // Combo 3+ bonus
      if (timeDiffSeconds <= 5) points += 50; // Speed bonus (< 5s)
      if (newCombo >= 5) points *= 2; // Combo 5+ multiplier

      setScore((prev) => prev + points);

      const newMatched = [...matchedIds, item.id];
      setMatchedIds(newMatched);
      setSelectedMandarinId(null);
      setLastMatchedWord(item);

      // Speak Taiwanese pronunciation on match success
      if (soundEnabled) {
        speakTaiyu(item.taiyuHanzi, undefined, item.tailo);
      }

      // Combo Praise Messages
      const praises = ['足𠢕！', '配對著矣！', '閣一組！', '臺語真輪轉！'];
      const praise = praises[Math.floor(Math.random() * praises.length)];
      setComboPopupText(praise);
      setTimeout(() => setComboPopupText(null), 1200);

      // Check for round completion (12 pairs matched)
      if (newMatched.length === 12) {
        setTimeout(() => {
          setCompleted(true);
          // Save personal best
          const prevBest = parseInt(localStorage.getItem('game7_best_score') || '0', 10);
          if (score + points > prevBest) {
            localStorage.setItem('game7_best_score', String(score + points));
          }
        }, 800);
      }
    } else {
      // MATCH ERROR
      playWrongSound();
      setWrongPair({ mandarinId: selectedMandarinId, taiyuId: item.id });
      setCombo(0);
      setErrorCount((e) => e + 1);
      setScore((s) => Math.max(0, s - 20));

      setTimeout(() => {
        setWrongPair(null);
        setSelectedMandarinId(null);
      }, 1000);
    }
  };

  // Hint function (提示)
  const handleUseHint = () => {
    if (completed || matchedIds.length >= 12) return;

    setHintsUsed((h) => h + 1);
    setScore((s) => Math.max(0, s - 30));

    let targetId: number | null = selectedMandarinId;
    if (targetId === null) {
      // Pick first unmatched item
      const unmatched = currentRoundItems.find((w) => !matchedIds.includes(w.id));
      if (unmatched) {
        targetId = unmatched.id;
        setSelectedMandarinId(unmatched.id);
      }
    }

    if (targetId !== null) {
      setFlashingHintTaiyuId(targetId);
      const targetItem = currentRoundItems.find((w) => w.id === targetId);
      if (targetItem && soundEnabled) {
        speakTaiyu(targetItem.taiyuHanzi, undefined, targetItem.tailo);
      }
      setTimeout(() => {
        setFlashingHintTaiyuId(null);
      }, 2000);
    }
  };

  // Replay Audio function
  const handleReplayLastAudio = () => {
    if (lastMatchedWord) {
      speakTaiyu(lastMatchedWord.taiyuHanzi, undefined, lastMatchedWord.tailo);
    } else if (selectedMandarinId) {
      const item = currentRoundItems.find((w) => w.id === selectedMandarinId);
      if (item) speakMandarin(item.mandarin);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselContainerRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      carouselContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleGameSelect = (key: string) => {
    if (typeof (window as any).globalNavigate === 'function') {
      (window as any).globalNavigate(key);
    } else {
      onHome?.();
    }
  };

  const activeStars = score >= 1200 ? 3 : score >= 600 ? 2 : score > 0 ? 1 : 0;
  const bestScore = localStorage.getItem('game7_best_score') || '1200';

  return (
    <GameShell onHome={onHome}>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
      {/* ==================== TOP NAVIGATION CAROUSEL ==================== */}
      <div className="relative flex items-center bg-amber-50/75 border border-orange-200/50 rounded-3xl p-1.5 shadow-xs shrink-0 w-full overflow-hidden select-none">
        <button
          onClick={() => scrollCarousel('left')}
          className="p-1.5 rounded-full bg-[#E4772E] hover:bg-[#CC6620] text-white shadow-xs active:scale-90 transition-all cursor-pointer absolute left-1 z-20"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
        </button>

        <div
          ref={carouselContainerRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 px-8 w-full scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {GAMES.map((g) => {
            const isSelf = g.key === 'game7';
            return (
              <div
                key={g.key}
                onClick={() => handleGameSelect(g.key)}
                className={`flex-none w-52 rounded-2xl p-2 flex items-center gap-2 border-2 transition-all duration-300 select-none cursor-pointer ${
                  isSelf
                    ? 'bg-emerald-50/95 border-emerald-500 shadow-md scale-[1.02] ring-2 ring-emerald-400/25 font-black'
                    : 'bg-white/80 border-amber-100 hover:border-orange-300 hover:bg-white font-bold'
                }`}
              >
                <img
                  src={g.icon}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-amber-100"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold tracking-wider ${isSelf ? 'text-emerald-700' : 'text-orange-700'}`}>
                    第 {g.id} 關
                  </div>
                  <div className={`text-xs truncate ${isSelf ? 'text-emerald-950 font-black' : 'text-gray-700'}`}>
                    {g.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scrollCarousel('right')}
          className="p-1.5 rounded-full bg-[#E4772E] hover:bg-[#CC6620] text-white shadow-xs active:scale-90 transition-all cursor-pointer absolute right-1 z-20"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>

      {/* ==================== MAIN GAME BOARD (LAB SCI-FI THEME) ==================== */}
      <div className="relative border-4 border-[#0369A1] rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col justify-between gap-4 flex-1 bg-[#060D1A] text-white select-none overflow-hidden min-h-[640px]">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        {/* ==================== STYLIZED HEADER SECTION ==================== */}
        <div className="relative w-full z-10 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0F172A]/90 border border-sky-500/40 rounded-2xl p-3 shadow-md backdrop-blur-sm">
          {/* Title and Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-lg flex items-center justify-center shadow-md border border-amber-300">
              07
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-emerald-300 to-amber-300 text-xl md:text-2xl tracking-wide">
                  華臺詞卡配對王
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  鹿港篇 · 第 {roundIndex + 1} 回
                </span>
              </div>
              <p className="text-xs text-sky-200/80 font-bold mt-0.5">
                請先選華語詞卡，再選對應的台語詞卡。
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#1E293B] border border-sky-500/30 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setMode('basic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'basic'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-sky-300/70 hover:text-white'
              }`}
            >
              基礎 (漢字)
            </button>
            <button
              onClick={() => setMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'standard'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              標準 (漢字+臺羅)
            </button>
            <button
              onClick={() => setMode('challenge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'challenge'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-300/70 hover:text-white'
              }`}
            >
              挑戰 (純臺羅)
            </button>
          </div>
        </div>

        {/* ==================== STATUS BAR ==================== */}
        <div className="relative z-10 bg-[#0F172A]/80 border border-sky-500/30 rounded-xl p-2.5 flex items-center justify-between flex-wrap text-xs md:text-sm font-black text-sky-100 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400" /> 分數：
              <span className="font-mono text-base font-black text-white">{score}</span>
            </span>

            {combo > 1 && (
              <span className="flex items-center gap-1 text-orange-400 animate-bounce">
                <Zap className="w-4 h-4 fill-orange-400" /> 連擊：
                <span className="font-mono text-base font-black">×{combo}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sky-300 font-bold">配對進度</span>
            <div className="w-24 sm:w-36 h-2.5 rounded-full bg-[#1E293B] overflow-hidden border border-sky-500/30">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${(matchedIds.length / 12) * 100}%` }}
              />
            </div>
            <span className="font-mono text-emerald-300">{matchedIds.length} / 12</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-300">
              <Clock className="w-4 h-4 text-sky-400" /> 時間：
              <span className="font-mono text-white">{elapsedTime}s</span>
            </span>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Combo Praise Popup */}
        <AnimatePresence>
          {comboPopupText && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1.2, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xl px-6 py-2 rounded-full shadow-2xl border-2 border-white pointer-events-none"
            >
              🎉 {comboPopupText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== CORE INTERACTIVE GRID ==================== */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
          
          {/* LEFT SIDE: MASCOT & LAB PANEL (3 cols) */}
          <div className="lg:col-span-3 bg-[#0F172A]/90 border border-sky-500/30 rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sky-300 text-sm tracking-wider">配對研究所</h3>
              </div>

              {/* Dinosaur Mascot Container */}
              <div className="flex flex-col items-center justify-center bg-[#1E293B]/80 rounded-xl p-3 border border-sky-500/20 my-1 relative">
                <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-400/50 flex items-center justify-center text-3xl shadow-inner">
                  🦖
                </div>
                <span className="text-[10px] font-black text-emerald-300 mt-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  恐龍博士
                </span>

                {/* Dynamic Tip Bubble */}
                <div className="mt-2 bg-sky-950/80 border border-sky-500/40 rounded-xl p-2.5 text-[11px] text-sky-100 font-bold text-center leading-snug w-full">
                  {selectedMandarinId !== null
                    ? `已選華語：${mandarinCards.find((c) => c.id === selectedMandarinId)?.mandarin}！請在下方點選正確台語。`
                    : '小提示：先選華語詞卡，再選台語講法！'}
                </div>
              </div>

              {/* Game Rules Checklist */}
              <div className="mt-2 flex flex-col gap-1.5 text-[11px] text-sky-200/80 font-medium leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0">1</span>
                  <span>點華語詞卡播放華語語音。</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0">2</span>
                  <span>點對應台語詞卡鎖定配對。</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white font-bold text-[9px] flex items-center justify-center shrink-0">3</span>
                  <span>配對成功播放台語發音！</span>
                </div>
              </div>
            </div>

            {/* Round Controls */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => startRound(Math.max(0, roundIndex - 1))}
                  className="py-1.5 px-2 rounded-xl bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-500/30 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> 前一回
                </button>
                <button
                  onClick={() => startRound(roundIndex + 1)}
                  className="py-1.5 px-2 rounded-xl bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-500/30 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  後一回 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => startRound(roundIndex)}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 閣耍一擺 (重新抽題)
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: CARDS BOARD (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            
            {/* UPPER: MANDARIN CARDS SECTION */}
            <div className="bg-[#0F172A]/90 border border-cyan-500/40 rounded-2xl p-3 relative shadow-md">
              <div className="absolute -top-3 left-4 bg-cyan-600 text-white text-[11px] font-black px-3 py-0.5 rounded-full border border-cyan-300 shadow-xs flex items-center gap-1">
                <span>💬</span> 華語詞卡區 (先選此處)
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mt-1.5">
                {mandarinCards.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedMandarinId === item.id;
                  const isWrong = wrongPair?.mandarinId === item.id;

                  let borderStyle = 'border-cyan-500/30 hover:border-cyan-400 bg-[#1E293B]/90 text-sky-100';
                  if (isMatched) {
                    borderStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 opacity-60';
                  } else if (isWrong) {
                    borderStyle = 'border-rose-500 bg-rose-950/80 text-rose-200 animate-shake ring-2 ring-rose-400';
                  } else if (isSelected) {
                    borderStyle = 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/80 shadow-lg';
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectMandarin(item)}
                      disabled={isMatched}
                      className={`relative py-3.5 px-2 rounded-xl border-2 font-black text-sm md:text-base tracking-wide transition-all duration-200 select-none cursor-pointer flex items-center justify-center shadow-sm ${borderStyle}`}
                    >
                      {item.mandarin}

                      {/* Status Icon Indicator */}
                      {isMatched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                      )}
                      {isWrong && (
                        <XCircle className="w-4 h-4 text-rose-400 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LOWER: TAIWANESE CARDS SECTION */}
            <div className="bg-[#0F172A]/90 border border-emerald-500/40 rounded-2xl p-3 relative shadow-md">
              <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[11px] font-black px-3 py-0.5 rounded-full border border-emerald-300 shadow-xs flex items-center gap-1">
                <span>🔊</span> 台語詞卡區 (對應配對)
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mt-1.5">
                {taiyuCards.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isWrong = wrongPair?.taiyuId === item.id;
                  const isFlashingHint = flashingHintTaiyuId === item.id;

                  let borderStyle = 'border-emerald-500/30 hover:border-emerald-400 bg-[#1E293B]/90 text-emerald-100';
                  if (isMatched) {
                    borderStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 opacity-60';
                  } else if (isWrong) {
                    borderStyle = 'border-rose-500 bg-rose-950/80 text-rose-200 animate-shake ring-2 ring-rose-400';
                  } else if (isFlashingHint) {
                    borderStyle = 'border-amber-400 bg-amber-500/30 text-amber-200 ring-4 ring-amber-300 animate-pulse';
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTaiyu(item)}
                      disabled={isMatched}
                      className={`relative py-2.5 px-1.5 rounded-xl border-2 font-black transition-all duration-200 select-none cursor-pointer flex flex-col items-center justify-center text-center shadow-sm min-h-[64px] ${borderStyle}`}
                    >
                      {/* Render based on Mode */}
                      {mode === 'basic' && (
                        <span className="text-sm md:text-base font-black leading-tight text-emerald-200">
                          {item.taiyuHanzi}
                        </span>
                      )}

                      {mode === 'standard' && (
                        <>
                          <span className="text-sm md:text-base font-black leading-tight text-emerald-200">
                            {item.taiyuHanzi}
                          </span>
                          <span className="text-[10px] md:text-[11px] text-emerald-400/90 font-mono font-bold leading-none mt-1">
                            {item.tailo}
                          </span>
                        </>
                      )}

                      {mode === 'challenge' && (
                        <span className="text-xs md:text-sm font-mono font-black leading-tight text-emerald-300">
                          {item.tailo}
                        </span>
                      )}

                      {/* Status Icon Indicator */}
                      {isMatched && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                      )}
                      {isWrong && (
                        <XCircle className="w-4 h-4 text-rose-400 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* ==================== FOOTER ACTIONS ==================== */}
        <div className="relative z-10 flex items-center justify-between gap-3 pt-2 border-t border-sky-500/20 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseHint}
              disabled={completed || matchedIds.length >= 12}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-black text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" /> 提示 (-30分)
            </button>

            <button
              onClick={handleReplayLastAudio}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-black text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> 重播發音
            </button>
          </div>

          <div className="text-xs text-sky-300/80 font-bold">
            最高分紀錄：<span className="text-amber-400 font-mono font-black">{bestScore}</span>
          </div>
        </div>

        {/* ==================== ROUND COMPLETE SUMMARY OVERLAY ==================== */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 p-6 flex flex-col items-center justify-center text-center overflow-y-auto"
            >
              <div className="bg-[#0F172A] border-2 border-emerald-500/60 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl flex flex-col items-center gap-5 text-white">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl animate-bounce">
                  🏆
                </div>

                <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300">
                  有夠𠢕！完成本回合！
                </h2>

                {/* Score & Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full my-1">
                  <div className="bg-[#1E293B] border border-sky-500/30 rounded-xl p-2.5">
                    <span className="text-[11px] text-sky-300 font-bold block">本局得分</span>
                    <span className="text-xl font-mono font-black text-amber-400">{score}</span>
                  </div>
                  <div className="bg-[#1E293B] border border-sky-500/30 rounded-xl p-2.5">
                    <span className="text-[11px] text-sky-300 font-bold block">完成時間</span>
                    <span className="text-xl font-mono font-black text-emerald-400">{elapsedTime}s</span>
                  </div>
                  <div className="bg-[#1E293B] border border-sky-500/30 rounded-xl p-2.5">
                    <span className="text-[11px] text-sky-300 font-bold block">最高連擊</span>
                    <span className="text-xl font-mono font-black text-orange-400">×{maxCombo}</span>
                  </div>
                  <div className="bg-[#1E293B] border border-sky-500/30 rounded-xl p-2.5">
                    <span className="text-[11px] text-sky-300 font-bold block">正確配對</span>
                    <span className="text-xl font-mono font-black text-emerald-400">12 / 12</span>
                  </div>
                  <div className="bg-[#1E293B] border border-sky-500/30 rounded-xl p-2.5">
                    <span className="text-[11px] text-sky-300 font-bold block">錯誤次數</span>
                    <span className="text-xl font-mono font-black text-rose-400">{errorCount}</span>
                  </div>
                  <div className="bg-[#1E293B] border border-sky-500/30 rounded-xl p-2.5">
                    <span className="text-[11px] text-sky-300 font-bold block">個人最佳</span>
                    <span className="text-xl font-mono font-black text-amber-300">{bestScore}</span>
                  </div>
                </div>

                {/* Practice Vocab Word List */}
                <div className="w-full bg-[#1E293B]/70 border border-sky-500/20 rounded-2xl p-3 text-left">
                  <span className="text-xs font-black text-sky-300 mb-2 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> 本局練習詞彙 (點擊發音)：
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                    {currentRoundItems.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => speakTaiyu(w.taiyuHanzi, undefined, w.tailo)}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-[#0F172A] hover:bg-sky-900/40 border border-sky-500/20 text-xs text-sky-100 transition-colors cursor-pointer"
                      >
                        <span className="font-bold">{w.mandarin} → {w.taiyuHanzi}</span>
                        <Volume2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Modal Actions */}
                <div className="flex items-center justify-center gap-3 flex-wrap w-full mt-2">
                  <button
                    onClick={() => startRound(roundIndex)}
                    className="py-2.5 px-5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-black text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    閣耍一擺
                  </button>
                  <button
                    onClick={() => startRound(Math.max(0, roundIndex - 1))}
                    className="py-2.5 px-5 rounded-full bg-sky-700 hover:bg-sky-600 text-white font-black text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    前一回
                  </button>
                  <button
                    onClick={() => startRound(roundIndex + 1)}
                    className="py-2.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    後一回
                  </button>
                  <button
                    onClick={onHome}
                    className="py-2.5 px-5 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-black text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    轉去遊戲頭頁 🏠
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </GameShell>
  );
}
