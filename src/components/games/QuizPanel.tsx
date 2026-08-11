import { useEffect, useState } from 'react';
import { Lightbulb, RotateCcw, ChevronRight, Trophy, Clock, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  charDad,
  charAming,
  charAhui,
  charMom,
  charGrandpa,
} from '../../assets/images/characters';

export interface QuizQuestion {
  prompt: string;
  subPrompt?: string;
  options: { label: string; tailo?: string; correct?: boolean }[];
}

export function useQuizEngine(questions: QuizQuestion[], totalTime: number) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctFlash, setCorrectFlash] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [hints, setHints] = useState(3);

  const q = questions[step];
  const done = step >= questions.length;

  useEffect(() => {
    if (done || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [done, timeLeft]);

  const pick = (idx: number) => {
    if (picked !== null || done) return;
    setPicked(idx);
    const isCorrect = q.options[idx].correct;
    if (isCorrect) {
      setScore((s) => s + 50 + combo * 10);
      setCombo((c) => c + 1);
      setCorrectFlash(idx);
    } else {
      setCombo(0);
    }
    setTimeout(() => {
      setPicked(null);
      setCorrectFlash(null);
      if (isCorrect) setStep((s) => s + 1);
    }, 700);
  };

  const restart = () => {
    setStep(0);
    setScore(0);
    setCombo(0);
    setPicked(null);
    setTimeLeft(totalTime);
    setHints(3);
  };

  const useHint = (onReveal: (correctIdx: number) => void) => {
    if (hints <= 0 || done) return;
    setHints((h) => h - 1);
    onReveal(q.options.findIndex((o) => o.correct));
  };

  return { step, q, done, score, combo, picked, correctFlash, timeLeft, hints, pick, restart, useHint, total: questions.length };
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

const LETTERS = ['A', 'B', 'C', 'D'];

// Helper to parse the prompt text into a structured speaker/dialogue format
function parsePrompt(promptStr: string) {
  // Pattern 1: 女伴：「遮 ê 溫泉氣氛真好，你欲袂欲來去泡湯？」
  const matchWithColon = promptStr.match(/^([^「」]+?)：「([\s\S]+?)」(.*)$/);
  if (matchWithColon) {
    return {
      speaker: matchWithColon[1].trim(),
      dialogue: matchWithColon[2].trim(),
      extra: matchWithColon[3].trim(),
      hasDialogue: true
    };
  }

  // Pattern 2: 「鹽酥雞，一包三十，卡緊來喔！」聽起來是咧賣啥物？
  const matchQuotes = promptStr.match(/^「([\s\S]+?)」([\s\S]*)$/);
  if (matchQuotes) {
    return {
      speaker: "老闆",
      dialogue: matchQuotes[1].trim(),
      extra: matchQuotes[2].trim(),
      hasDialogue: true
    };
  }

  return {
    speaker: "系統",
    dialogue: promptStr,
    extra: "",
    hasDialogue: false
  };
}

// Map the parsed speaker name to the correct cute cartoon image
function getSpeakerAvatar(speaker: string) {
  switch (speaker) {
    case '女伴':
    case '阿輝':
    case 'Ahui':
      return charAhui;
    case '阿明':
    case 'Aming':
      return charAming;
    case '阿爸':
    case '爸爸':
    case '阿爸/爸爸':
    case '老闆':
    case '店家':
    case '商家':
      return charDad;
    case '媽媽':
    case '阿母':
      return charMom;
    case '阿公':
    case 'Grandpa':
      return charGrandpa;
    default:
      return charAming; // default friendly Aming helper
  }
}

import { speakTaiyu } from '../../lib/speech';

export function QuizPanel({
  engine,
  onFinish,
  accentColor = '#4E9B5D',
  progressLabel = '關卡進度',
}: {
  engine: ReturnType<typeof useQuizEngine>;
  onFinish: () => void;
  accentColor?: string;
  progressLabel?: string;
}) {
  const { step, q, done, score, timeLeft, hints, picked, correctFlash, pick, restart, useHint, total } = engine;
  const [hintIdx, setHintIdx] = useState<number | null>(null);

  useEffect(() => {
    // Automatically synthesize speech for the dialog if it loads
    if (q && !done) {
      const parsed = parsePrompt(q.prompt);
      speakTaiyu(parsed.dialogue);
    }
  }, [step, done]);

  if (done) {
    return (
      <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-10 flex-1 flex flex-col items-center justify-center text-center gap-3">
        <Trophy className="w-10 h-10 text-[#F2B84B]" />
        <h3 className="font-black text-[#2D2A26] text-xl">全部答對啦！目前分數 {score} 分</h3>
        <p className="text-sm text-[#8A8378]">準備好就前往下一關吧！</p>
        <button
          onClick={onFinish}
          className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E4772E] text-white font-bold text-sm hover:bg-[#CC6620] transition-colors"
        >
          下一關 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const parsed = parsePrompt(q.prompt);
  const avatar = getSpeakerAvatar(parsed.speaker);

  return (
    <>
      <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4 md:p-5 flex items-center gap-6 flex-wrap text-sm font-bold text-[#5C5548]">
        <span className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4" style={{ color: accentColor }} /> 目前分數{' '}
          <span className="text-[#2D2A26]">{score} 分</span>
        </span>
        <span className="flex items-center gap-2">
          {progressLabel}
          <span className="w-40 h-2 rounded-full bg-[#EFE8D8] overflow-hidden inline-block">
            <span
              className="h-full block transition-all"
              style={{ width: `${(step / total) * 100}%`, backgroundColor: accentColor }}
            />
          </span>
          <span className="text-[#2D2A26]">{step} / {total}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" style={{ color: accentColor }} /> 剩餘時間{' '}
          <span className="text-[#2D2A26]">{formatTime(timeLeft)}</span>
        </span>
      </div>

      <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-5 md:p-6 flex-1 flex flex-col gap-6">
        
        {/* Immersive Conversational Speech Bubble Layout */}
        <div className="flex items-start gap-4 md:gap-5 flex-col sm:flex-row">
          
          {/* Speaker Cartoon Avatar */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-[#FFFDF6] to-[#F1ECE0] border-2 border-[#EFE8D8] p-1.5 flex items-center justify-center shadow-sm select-none"
          >
            <img src={avatar} alt={parsed.speaker} className="w-full h-full object-contain filter drop-shadow-md" />
          </motion.div>

          {/* Speech Balloon Bubble */}
          <div 
            onClick={() => speakTaiyu(parsed.dialogue)}
            className="flex-1 relative bg-white border-2 border-[#EFE8D8] rounded-2xl p-4 md:p-5 shadow-xs cursor-pointer hover:border-[#4E9B5D]/40 transition-colors group"
          >
            {/* Triangular Tail pointing to avatar (desktop only for neat vertical flow on mobile) */}
            <div className="hidden sm:block absolute top-7 -left-2 w-4 h-4 bg-white border-l-2 border-b-2 border-[#EFE8D8] transform rotate-45" />

            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[11px] font-black px-2.5 py-0.5 bg-[#4E9B5D]/10 text-[#4E9B5D] rounded-full">
                🗣️ {parsed.speaker} 講台語
              </span>
              <Volume2 className="w-4.5 h-4.5 text-[#8A8378] group-hover:text-[#4E9B5D] group-hover:scale-110 transition-all shrink-0" />
            </div>

            <h3 className="font-black text-[#3E2723] text-base md:text-lg leading-relaxed select-none">
              {parsed.hasDialogue ? `「${parsed.dialogue}」` : parsed.dialogue}
            </h3>

            {parsed.extra && (
              <div className="text-xs text-[#8A8378] font-bold mt-2 pt-2 border-t border-dashed border-[#EFE8D8] flex items-center gap-1">
                <span>🎯</span> {parsed.extra}
              </div>
            )}
            
            {q.subPrompt && (
              <div className="text-xs text-[#E4772E] font-black mt-1 flex items-center gap-1">
                <span>👉</span> {q.subPrompt}
              </div>
            )}
          </div>
        </div>

        {/* Reply choices options container styled as responsive conversational choices */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-black text-[#8A8378] px-1 flex items-center gap-1 select-none">
            💬 點選最適合的回應（My Reply）：
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              const isPicked = picked === idx;
              const isCorrectFlash = correctFlash === idx;
              const isWrongPicked = isPicked && !opt.correct;
              const isHinted = hintIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    pick(idx);
                    speakTaiyu(opt.label, undefined, opt.tailo);
                  }}
                  disabled={picked !== null}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${
                    isCorrectFlash
                      ? 'border-[#4E9B5D] bg-[#EAF6EC] ring-2 ring-[#4E9B5D]/20'
                      : isWrongPicked
                      ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                      : isHinted
                      ? 'border-[#F2B84B] bg-[#FFF7E0] animate-pulse'
                      : 'border-[#EFE8D8] bg-white hover:border-[#4E9B5D] hover:shadow-xs active:scale-98'
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 select-none shadow-sm"
                    style={{ backgroundColor: isCorrectFlash ? '#4E9B5D' : isWrongPicked ? '#EF4444' : accentColor }}
                  >
                    {LETTERS[idx]}
                  </span>
                  <span className="flex-1">
                    <div className="font-bold text-[#2D2A26] text-sm leading-snug flex items-center gap-1">
                      {opt.label}
                      <Volume2 className="w-3.5 h-3.5 text-gray-300 hover:text-[#4E9B5D] shrink-0" />
                    </div>
                    {opt.tailo && <div className="text-xs text-[#8A8378] font-mono mt-0.5">{opt.tailo}</div>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <button
          onClick={() =>
            useHint((idx) => {
              setHintIdx(idx);
              setTimeout(() => setHintIdx(null), 1500);
            })
          }
          disabled={hints <= 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          <Lightbulb className="w-4 h-4" /> 提示 <span className="bg-white/25 rounded-full px-1.5 font-mono text-xs">{hints}</span>
        </button>
        <button
          onClick={restart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A8378] text-white font-bold text-sm hover:bg-[#736C60] transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> 重新開始
        </button>
      </div>
    </>
  );
}
