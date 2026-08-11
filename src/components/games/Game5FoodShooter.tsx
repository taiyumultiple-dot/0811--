import { useRef, useState } from 'react';
import { Home, Maximize2 } from 'lucide-react';
import { useGameScoreBridge } from './useGameScoreBridge';
import BadgeToast from './BadgeToast';

/**
 * 臺羅戰機：鹿港美食防衛戰
 *
 * 這一關改為直接嵌入獨立製作的 HTML/CSS/JS 版本遊戲
 * （國語出題、縱向捲軸射擊、三種可選戰機、聲韻能量／臺語超載模式、
 * 聲韻炸彈、臺羅雷達提示、10題完成後挑戰鹿港大頭目等規則），
 * 檔案放在 public/games/taigi-shooter.html，透過 iframe 載入，
 * 不需要額外的建置流程即可運作。
 *
 * 舊版 React 實作備份在 Game5FoodShooter.legacy.tsx.bak，
 * 之後若要切換回舊版，可以直接把該檔內容還原成 Game5FoodShooter.tsx。
 */
export default function Game5FoodShooter({
  onNext,
  onHome,
}: {
  onNext: () => void;
  onHome?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);
  useGameScoreBridge('game5', (titles) => setNewBadges(titles));

  const goFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div ref={wrapRef} className="fixed inset-0 bg-black flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-purple-500/20 shrink-0">
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" /> 返回大廳
        </button>
        <div className="text-purple-300 text-xs font-black tracking-widest font-mono">
          臺羅戰機・鹿港美食防衛戰
        </div>
        <button
          onClick={goFullscreen}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" /> 沉浸全螢幕
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <iframe
          src="/games/taigi-shooter.html"
          title="臺羅戰機防衛戰"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
    </div>
  );
}
