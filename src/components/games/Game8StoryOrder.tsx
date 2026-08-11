import { useRef, useState } from 'react';
import { Home, Maximize2 } from 'lucide-react';
import { useGameScoreBridge } from './useGameScoreBridge';
import BadgeToast from './BadgeToast';

/**
 * 臺語字詞排序研究所（鹿港美食篇）
 *
 * 這一關改為直接嵌入獨立製作的 HTML/CSS/JS 版本遊戲
 * （拖曳／點擊交換字詞卡排出正確台語句子順序、三階段提示、
 * 教典彈窗、難度模式選擇等規則），檔案放在
 * public/games/taigi-order.html，透過 iframe 載入，不需要額外的
 * 建置流程即可運作。
 *
 * 舊版 React 實作備份在 Game8StoryOrder.legacy.tsx.bak，
 * 之後若要切換回舊版，可以直接把該檔內容還原成 Game8StoryOrder.tsx。
 */
export default function Game8StoryOrder({
  onNext,
  onHome,
}: {
  onNext: () => void;
  onHome?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);
  useGameScoreBridge('game8', (titles) => setNewBadges(titles));

  const goFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div ref={wrapRef} className="fixed inset-0 bg-black flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-lime-500/20 shrink-0">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-lime-500/40 text-lime-300 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" /> 返回大廳
        </button>
        <div className="text-lime-300 text-xs font-black tracking-widest font-mono">
          臺語字詞排序研究所・鹿港美食篇
        </div>
        <button
          onClick={goFullscreen}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-lime-500/40 text-lime-300 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" /> 沉浸全螢幕
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <iframe
          src="/games/taigi-order.html"
          title="臺語字詞排序研究所"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
    </div>
  );
}
