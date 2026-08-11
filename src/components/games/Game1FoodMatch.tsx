import { useRef, useState } from 'react';
import { Home, Maximize2 } from 'lucide-react';
import { useGameScoreBridge } from './useGameScoreBridge';
import BadgeToast from './BadgeToast';

/**
 * 太空台語生存戰 -「臺羅宇宙生存戰：鹿港美食宇宙」
 *
 * 這一關改為直接嵌入獨立製作的 HTML/CSS/JS 版本遊戲
 * （60 秒倒數計時、隨機抽 50 題、依參考圖調整過的視覺風格），
 * 檔案放在 public/games/taigi-survival.html，透過 iframe 載入，
 * 不需要額外的建置流程即可運作。
 *
 * 舊版 React／Canvas 實作備份在 Game1FoodMatch.legacy.tsx.bak，
 * 之後若要切換回舊版，可以直接把該檔內容還原成 Game1FoodMatch.tsx。
 */
export default function Game1FoodMatch({
  onNext,
  onHome,
}: {
  onNext: () => void;
  onHome?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);
  useGameScoreBridge('game1', (titles) => setNewBadges(titles));

  const goFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div ref={wrapRef} className="fixed inset-0 bg-black flex flex-col">
      {/* 頂部工具列（不影響遊戲畫面本身，方便返回大廳／切換全螢幕） */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-cyan-500/20 shrink-0">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" /> 返回大廳
        </button>
        <div className="text-cyan-400 text-xs font-black tracking-widest font-mono">
          太空台語生存戰・臺羅宇宙生存戰
        </div>
        <button
          onClick={goFullscreen}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" /> 沉浸全螢幕
        </button>
      </div>

      {/* 遊戲本體：嵌入獨立製作的 index.html */}
      <div className="flex-1 min-h-0">
        <iframe
          src={`${import.meta.env.BASE_URL}games/taigi-survival.html`}
          title="太空台語生存戰"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
    </div>
  );
}
