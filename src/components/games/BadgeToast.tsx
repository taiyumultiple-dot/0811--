import { useEffect } from 'react';

/**
 * BadgeToast
 * 遊戲結算、progressStore 判定有新徽章時彈出的小提示。
 * 5 秒後自動消失，也可以點擊關閉。
 */
export default function BadgeToast({
  badges,
  onClose,
}: {
  badges: string[] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!badges || badges.length === 0) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [badges, onClose]);

  if (!badges || badges.length === 0) return null;

  return (
    <div
      onClick={onClose}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 cursor-pointer"
    >
      {badges.map((b, i) => (
        <div
          key={i}
          className="px-5 py-2.5 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-black text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center gap-2 animate-bounce"
        >
          <span>🎉 獲得新徽章：{b}</span>
        </div>
      ))}
    </div>
  );
}
