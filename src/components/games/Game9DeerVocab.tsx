import { useState, useEffect, useRef } from 'react';
import { speakTaiyu } from '../../lib/speech';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';
import { Trophy, Search, Lightbulb, RotateCcw, ChevronRight, Volume2, CheckCircle2 } from 'lucide-react';
import { GameShell } from './GameShell';
import { GameHeader } from './GameHeader';
import { deerLandscape } from '../../assets/images/games';
import { recordGameResult } from '../../lib/progressStore';
import BadgeToast from './BadgeToast';
import { BookmarkButton } from '../BookmarkButton';

interface Spot {
  id: string;
  name: string;
  tailo: string;
  x: number;
  y: number;
  emoji: string;
  bgColor: string;
}

const SPOTS: Spot[] = [
  { id: 'deer', name: '鹿仔', tailo: 'lau-á', x: 20, y: 65, emoji: '🦌', bgColor: '#FFF3E0' },
  { id: 'grass', name: '草仔', tailo: 'tsháu-á', x: 42, y: 75, emoji: '🌿', bgColor: '#E8F5E9' },
  { id: 'mountain', name: '山頭', tailo: 'suann-thâu', x: 28, y: 28, emoji: '⛰️', bgColor: '#E0F2F1' },
  { id: 'flower', name: '花仔', tailo: 'hue-á', x: 80, y: 82, emoji: '🌸', bgColor: '#FCE4EC' },
  { id: 'rock', name: '石頭', tailo: 'tsioh-thâu', x: 60, y: 85, emoji: '🪨', bgColor: '#EFEBE9' },
  { id: 'sky', name: '天空', tailo: 'thiⁿ-khong', x: 82, y: 15, emoji: '☁️', bgColor: '#E3F2FD' },
  { id: 'sea', name: '海邊', tailo: 'hái-pinn', x: 62, y: 35, emoji: '🏖️', bgColor: '#E0F7FA' },
  { id: 'tree', name: '樹仔', tailo: 'tshiū-á', x: 85, y: 48, emoji: '🌳', bgColor: '#F1F8E9' },
];

function SpotIllustration({ id, className = "w-12 h-12" }: { id: string; className?: string }) {
  switch (id) {
    case 'deer':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#FFE0B2" />
          <path d="M30 25 L20 10 M30 25 L15 20 M70 25 L80 10 M70 25 L85 20" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" />
          <path d="M35 35 C20 30 20 45 35 45 M65 35 C80 30 80 45 65 45" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
          <ellipse cx="50" cy="55" rx="25" ry="22" fill="#FB8C00" />
          <ellipse cx="50" cy="65" rx="14" ry="10" fill="#FFE0B2" />
          <circle cx="40" cy="48" r="4" fill="#3E2723" />
          <circle cx="60" cy="48" r="4" fill="#3E2723" />
          <ellipse cx="50" cy="62" rx="5" ry="3" fill="#3E2723" />
          <circle cx="40" cy="56" r="2" fill="#FFFFFF" />
          <circle cx="60" cy="56" r="2" fill="#FFFFFF" />
        </svg>
      );
    case 'grass':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#C8E6C9" />
          <path d="M25 75 Q30 35 50 20 Q40 45 42 75 Z" fill="#4CAF50" />
          <path d="M40 75 Q45 25 65 25 Q50 48 55 75 Z" fill="#388E3C" />
          <path d="M55 75 Q68 38 80 30 Q65 52 68 75 Z" fill="#81C784" />
          <ellipse cx="50" cy="78" rx="35" ry="6" fill="#A5D6A7" />
        </svg>
      );
    case 'mountain':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#B2DFDB" />
          <path d="M15 75 L45 25 L75 75 Z" fill="#00897B" />
          <path d="M45 25 L55 42 L38 45 Z" fill="#E0F2F1" />
          <path d="M35 75 L65 35 L90 75 Z" fill="#26A69A" />
          <path d="M65 35 L73 48 L58 50 Z" fill="#FFFFFF" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#F8BBD0" />
          <circle cx="50" cy="30" r="15" fill="#F48FB1" />
          <circle cx="70" cy="50" r="15" fill="#F48FB1" />
          <circle cx="50" cy="70" r="15" fill="#F48FB1" />
          <circle cx="30" cy="50" r="15" fill="#F48FB1" />
          <circle cx="38" cy="38" r="15" fill="#F06292" />
          <circle cx="62" cy="38" r="15" fill="#F06292" />
          <circle cx="62" cy="62" r="15" fill="#F06292" />
          <circle cx="38" cy="62" r="15" fill="#F06292" />
          <circle cx="50" cy="50" r="14" fill="#FFEB3B" />
        </svg>
      );
    case 'rock':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#D7CCC8" />
          <path d="M20 65 Q25 35 55 30 Q85 35 80 65 Q70 80 35 80 Z" fill="#8D6E63" />
          <path d="M25 60 Q30 38 52 35 Q40 55 25 60 Z" fill="#A1887F" />
          <path d="M60 75 Q75 70 78 60 Q70 65 60 75 Z" fill="#6D4C41" />
        </svg>
      );
    case 'sky':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#BBDEFB" />
          <circle cx="75" cy="30" r="12" fill="#FFD54F" />
          <path d="M25 60 C25 50 35 45 45 48 C50 40 65 40 70 48 C80 48 85 58 80 65 C78 70 30 70 25 60 Z" fill="#FFFFFF" />
        </svg>
      );
    case 'sea':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#B2EBF2" />
          <path d="M10 50 Q30 40 50 50 Q70 60 90 50 L90 90 L10 90 Z" fill="#00ACC1" />
          <path d="M10 65 Q30 55 50 65 Q70 75 90 65 L90 90 L10 90 Z" fill="#00838F" />
          <path d="M10 75 Q40 85 90 75 L90 90 L10 90 Z" fill="#FFE082" />
        </svg>
      );
    case 'tree':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#DCEDC8" />
          <rect x="42" y="50" width="16" height="35" rx="4" fill="#795548" />
          <circle cx="50" cy="38" r="24" fill="#558B2F" />
          <circle cx="36" cy="45" r="18" fill="#689F38" />
          <circle cx="64" cy="45" r="18" fill="#689F38" />
          <circle cx="50" cy="30" r="16" fill="#8BC34A" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Game9DeerVocab({ onNext, onHome }: { onNext: () => void; onHome?: () => void }) {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [wrongSpotId, setWrongSpotId] = useState<string | null>(null);
  const [hints, setHints] = useState(3);
  const [hintId, setHintId] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const remaining = SPOTS.filter((s) => !found.has(s.id));
  const current = SPOTS[activeIdx] && !found.has(SPOTS[activeIdx].id) ? SPOTS[activeIdx] : remaining[0];
  const done = found.size === SPOTS.length;

  const recordedRef = useRef(false);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);

  useEffect(() => {
    if (done && !recordedRef.current) {
      recordedRef.current = true;
      const result = recordGameResult({ gameKey: 'game9', score: found.size * 45, accuracy: 100 });
      if (result.newlyEarnedBadges.length > 0) {
        setNewBadges(result.newlyEarnedBadges.map((b) => `${b.icon} ${b.title}`));
      }
    }
    if (!done) recordedRef.current = false;
  }, [done, found.size]);

  useEffect(() => {
    if (current && !done) {
      speakTaiyu(current.name, undefined, current.tailo);
    }
  }, [current?.id, done]);

  const handleSpotClick = (spotId: string) => {
    if (done || !current) return;

    if (found.has(spotId)) {
      const s = SPOTS.find((item) => item.id === spotId);
      if (s) speakTaiyu(s.name, undefined, s.tailo);
      return;
    }

    if (spotId === current.id) {
      playCorrectSound();
      setFound((prev) => new Set(prev).add(spotId));
    } else {
      playWrongSound();
      setWrongSpotId(spotId);
      setTimeout(() => setWrongSpotId(null), 500);
    }
  };

  const restart = () => {
    setFound(new Set());
    setHints(3);
    setHintId(null);
    setActiveIdx(0);
  };

  const useHint = () => {
    if (hints <= 0 || !current) return;
    setHints((h) => h - 1);
    setHintId(current.id);
    setTimeout(() => setHintId(null), 1800);
  };

  return (
    <GameShell onHome={onHome}>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
      <GameHeader
        stageNumber={9}
        title="鹿野觀察詞彙配對"
        subtitle="聽台語語音，點選正確的景點圖片圖卡！"
        headerImage={deerLandscape}
        onSpeakQuestion={() => {
          if (current) {
            speakTaiyu(current.name, undefined, current.tailo);
          }
        }}
      />

      <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4 md:p-5 flex items-center gap-6 flex-wrap text-sm font-bold text-[#5C5548]">
        <span className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#4E9B5D]" /> 目前分數{' '}
          <span className="text-[#2D2A26]">{found.size * 45} 分</span>
        </span>
        <span className="flex items-center gap-2">
          配對進度
          <span className="w-40 h-2 rounded-full bg-[#EFE8D8] overflow-hidden inline-block">
            <span className="h-full block bg-[#4E9B5D]" style={{ width: `${(found.size / SPOTS.length) * 100}%` }} />
          </span>
          <span className="text-[#2D2A26]">{found.size} / {SPOTS.length}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 flex-1">
        <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4 md:p-6 flex flex-col justify-between">
          {!done ? (
            <div className="mb-4 flex items-center justify-between bg-[#EAF6EC] border-2 border-[#4E9B5D]/30 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2.5 text-base md:text-lg font-black text-[#1E4620]">
                <Search className="w-5 h-5 text-[#4E9B5D]" />
                請點選圖片：<span className="text-[#E4772E] text-xl">「{current?.name}」</span>
                <span className="text-sm font-normal text-[#5C5548]">（{current?.tailo}）</span>
              </div>
              <div className="flex items-center gap-1.5">
                {current && (
                  <BookmarkButton
                    word={{ hanzi: current.name, tailo: current.tailo, mandarin: current.name, category: '鹿野觀察' }}
                    variant="badge"
                  />
                )}
                <button
                  onClick={() => current && speakTaiyu(current.name, undefined, current.tailo)}
                  className="p-2 bg-white rounded-full text-[#4E9B5D] hover:bg-[#D4EDDA] shadow-sm transition-colors cursor-pointer"
                  title="再聽一次語音"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 bg-[#EAF6EC] p-4 rounded-2xl flex items-center gap-2 text-base font-bold text-[#4E9B5D]">
              <Trophy className="w-5 h-5" /> 全部圖卡配對完成！恭喜達成滿分！
            </div>
          )}

          {/* 鹿野大自然景觀繪圖區（包含放置在景觀相應位置的圖卡） */}
          <div className="relative w-full h-64 md:h-72 rounded-2xl bg-gradient-to-b from-[#E0F7FA] via-[#E8F5E9] to-[#C8E6C9] border-2 border-[#81C784]/40 overflow-hidden shadow-inner mb-6">
            {/* 景觀背景細節裝飾 */}
            <div className="absolute top-3 left-6 text-2xl opacity-60">☁️</div>
            <div className="absolute top-6 right-12 text-3xl opacity-60">☁️</div>
            <div className="absolute top-2 right-2 text-4xl opacity-80">☀️</div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#A5D6A7]/40 rounded-t-3xl" />
            
            <div className="absolute top-2 left-3 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#2E7D32] shadow-xs">
              ⛰️ 鹿野高台風光觀察圖
            </div>

            {/* 八個位置圖卡點選 */}
            {SPOTS.map((s) => {
              const isFound = found.has(s.id);
              const isHint = hintId === s.id;
              const isWrong = wrongSpotId === s.id;
              const isCurrentTarget = current?.id === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => handleSpotClick(s.id)}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col items-center gap-1 shadow-md hover:scale-110 active:scale-95 ${
                    isFound
                      ? 'bg-[#EAF6EC] border-2 border-[#4E9B5D] text-[#4E9B5D] opacity-90'
                      : isWrong
                      ? 'bg-red-100 border-2 border-red-500 animate-bounce'
                      : isHint
                      ? 'bg-yellow-200 border-4 border-yellow-500 scale-125 animate-pulse z-20'
                      : isCurrentTarget
                      ? 'bg-white border-2 border-[#E4772E] ring-4 ring-[#E4772E]/30 z-10'
                      : 'bg-white/95 border-2 border-[#A5D6A7] hover:border-[#4E9B5D]'
                  }`}
                >
                  <div className="relative">
                    <SpotIllustration id={s.id} className="w-10 h-10 md:w-12 md:h-12" />
                    {isFound && (
                      <div className="absolute inset-0 bg-[#4E9B5D]/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-[#4E9B5D] bg-white rounded-full fill-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-black text-[#2D2A26] px-1.5 py-0.5 rounded-md bg-white/90 shadow-2xs">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 下方 8 張可直接點選的大圖卡選擇區 (圖片選項) */}
          <div>
            <div className="text-xs font-bold text-[#5C5548] mb-2 flex items-center justify-between">
              <span>🖼️ 點選圖卡完成配對：</span>
              <span className="text-[11px] text-[#8A8378]">也可直接點選下方圖片</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SPOTS.map((s) => {
                const isFound = found.has(s.id);
                const isWrong = wrongSpotId === s.id;
                const isHint = hintId === s.id;

                return (
                  <button
                    key={`card-${s.id}`}
                    onClick={() => handleSpotClick(s.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 shadow-sm hover:shadow-md ${
                      isFound
                        ? 'bg-[#EAF6EC] border-[#4E9B5D] text-[#4E9B5D]'
                        : isWrong
                        ? 'bg-red-50 border-red-400 animate-shake'
                        : isHint
                        ? 'bg-yellow-100 border-yellow-500 scale-105 z-10'
                        : 'bg-white border-[#EFE8D8] hover:border-[#E4772E]'
                    }`}
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center p-1" style={{ backgroundColor: s.bgColor }}>
                      <SpotIllustration id={s.id} className="w-10 h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-[#2D2A26] truncate">{s.name}</div>
                      <div className="text-xs text-[#8A8378] truncate">{s.tailo}</div>
                    </div>
                    {isFound && <CheckCircle2 className="w-5 h-5 text-[#4E9B5D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右側：台語詞彙清單 */}
        <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4 flex flex-col">
          <div className="font-black text-[#2D2A26] mb-3 flex items-center justify-between">
            <span>台語詞彙清單</span>
            <span className="text-xs text-[#8A8378]">點擊可收藏/發音</span>
          </div>
          <ul className="flex flex-col gap-2 text-sm">
            {SPOTS.map((s, i) => (
              <li
                key={s.id}
                onClick={() => {
                  setActiveIdx(i);
                  speakTaiyu(s.name, undefined, s.tailo);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer ${
                  found.has(s.id)
                    ? 'bg-[#EAF6EC] text-[#4E9B5D]'
                    : current?.id === s.id
                    ? 'bg-[#FFF3E8] text-[#2D2A26] ring-1 ring-[#E4772E]/40'
                    : 'bg-white text-[#3E2723]'
                }`}
              >
                <span className="flex-1">
                  <div className="font-bold">{s.name}</div>
                  <div className="text-[11px] opacity-70">{s.tailo}</div>
                </span>
                <BookmarkButton
                  word={{ hanzi: s.name, tailo: s.tailo, mandarin: s.name, category: '鹿野觀察' }}
                  size="sm"
                />
                <Volume2 className="w-3.5 h-3.5 opacity-60 hover:opacity-100 shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1 mt-2">
        <button
          onClick={useHint}
          disabled={hints <= 0 || done}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4E9B5D] text-white font-bold text-sm disabled:opacity-40 hover:bg-[#458752] transition-colors cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" /> 提示 <span className="bg-white/25 rounded-full px-1.5">{hints}</span>
        </button>
        <button
          onClick={restart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A8378] text-white font-bold text-sm hover:bg-[#736C60] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> 重新開始
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E4772E] text-white font-bold text-sm hover:bg-[#CC6620] transition-colors cursor-pointer"
        >
          下一關 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </GameShell>
  );
}

