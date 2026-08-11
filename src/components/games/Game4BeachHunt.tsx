import { useRef, useState } from 'react';
import { Home, Maximize2 } from 'lucide-react';
import { useGameScoreBridge } from './useGameScoreBridge';
import BadgeToast from './BadgeToast';

/**
 * 臺語太空礦場（臺語詞彙挖寶王：鹿港美食篇）
 *
 * 這一關改為直接嵌入獨立製作的 HTML/CSS/JS 版本遊戲
 * （國語出題、直接點擊礦石抓取、難度模式選擇、TNT／提示道具、
 * 每局隨機抽10題、答錯磚不扣命只扣分等規則），檔案放在
 * public/games/taigi-mining.html，透過 iframe 載入，不需要額外的
 * 建置流程即可運作。
 *
 * 舊版 React 實作備份在 Game4BeachHunt.legacy.tsx.bak，
 * 之後若要切換回舊版，可以直接把該檔內容還原成 Game4BeachHunt.tsx。
 */
export default function Game4SpaceMiner({
  onNext,
  onHome,
}: {
  onNext: () => void;
  onHome?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);
  useGameScoreBridge('game4', (titles) => setNewBadges(titles));

  const goFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div ref={wrapRef} className="fixed inset-0 bg-black flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-cyan-500/20 shrink-0">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" /> 返回大廳
        </button>
        <div className="text-cyan-400 text-xs font-black tracking-widest font-mono">
          臺語太空礦場・臺語詞彙挖寶王
        </div>
        <button
          onClick={goFullscreen}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" /> 沉浸全螢幕
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <iframe
          src="/games/taigi-mining.html"
          title="臺語太空礦場"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
    </div>
  );
}
