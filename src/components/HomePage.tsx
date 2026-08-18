import { HubShell } from './games/GameShell';

import {
  heroFull,
  featureIconPhonics,
  featureIconGame,
  featureIconTone,
  featureIconRecord,
} from '../assets/images/homepage';

const FEATURE_CARDS = [
  {
    title: '拼音學習',
    desc: '從聲母韻母開始，打好台語發音基礎！',
    button: '去學習',
    icon: featureIconPhonics,
  },
  {
    title: '互動遊戲',
    desc: '玩遊戲學拼音，寓教於樂更有趣！',
    button: '去遊戲',
    icon: featureIconGame,
  },
  {
    title: '動畫專區',
    desc: '觀看精彩台語動畫，輕鬆學習道地台語發音！',
    button: '去觀看',
    icon: featureIconTone,
  },
  {
    title: '學習紀錄',
    desc: '記錄你的學習進度，見證成長',
    button: '看記錄',
    icon: featureIconRecord,
  },
];

export default function HomePage({ onNavigate }: { onNavigate: (view: string, tabId?: string) => void }) {
  const handleFeatureClick = (title: string) => {
    if (title === '拼音學習') onNavigate('phonics', 'phonics_scheme');
    else if (title === '互動遊戲') onNavigate('gamesHub');
    else if (title === '動畫專區') onNavigate('phonics', 'tone_practice');
    else if (title === '學習紀錄') onNavigate('record');
  };

  return (
    <HubShell activeKey="home" onHome={() => onNavigate('home')}>
      {/* ---------------- Main Row: Sidebar + Hero ---------------- */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1">
        {/* Hero + Feature cards column（「學習主題」側欄跟宣傳照片都拿掉了，這欄改滿版） */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Hero banner */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(2,132,199,0.2)]">
            <img src={heroFull} alt="歡迎來學台語！用遊戲、互動學習，快樂開口說台語！" className="w-full h-auto block" />
            <button
              onClick={() => onNavigate('phonics', 'phonics_scheme')}
              aria-label="開始學習"
              className="absolute cursor-pointer"
              style={{ left: '34.5%', top: '68%', width: '15%', height: '13%' }}
            />
          </div>

          {/* Feature Cards Container */}
          <div className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_20px_rgba(2,132,199,0.15)] p-5 md:p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧪</span>
              <h2 className="font-black text-white text-xl md:text-2xl tracking-wide">探索四大功能</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {FEATURE_CARDS.map((card) => {
                const currentUser = (() => {
                  try {
                    const stored = localStorage.getItem('tai_lo_user');
                    return stored ? JSON.parse(stored) : null;
                  } catch (e) {
                    return null;
                  }
                })();
                const isTeacher = currentUser?.role === 'teacher';

                const title = (card.title === '學習紀錄' && isTeacher) ? '教學後台' : card.title;
                const desc = (card.title === '學習紀錄' && isTeacher) ? '學生作答成效、通關率與教師班級管理' : card.desc;
                const buttonText = (card.title === '學習紀錄' && isTeacher) ? '進入後台' : card.button;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl bg-[#030b17] p-4 md:p-5 flex flex-col items-center text-center justify-between gap-3 border-2 border-cyan-500/40 hover:border-cyan-300 shadow-xl transition-all group hover:-translate-y-0.5"
                  >
                    {/* Card Icon Frame: clean light background so icons stand out completely */}
                    <div className="w-full h-28 md:h-36 rounded-2xl bg-gradient-to-b from-[#fffefc] to-[#f5eedc] border border-amber-200/90 p-2.5 flex items-center justify-center overflow-hidden shadow-inner">
                      <img
                        src={card.icon}
                        alt={title}
                        className="max-w-full max-h-full h-auto w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
                      />
                    </div>

                    {/* Title */}
                    <div className="font-black text-white text-base md:text-lg lg:text-xl flex items-center justify-center gap-1.5 tracking-wide mt-1">
                      <span>{title}</span>
                      <span className="text-amber-300 text-sm">🧪</span>
                    </div>

                    {/* Subtitle Description: High-contrast bright cyan/white text, larger font */}
                    <p className="text-xs md:text-sm text-cyan-50 font-black leading-relaxed min-h-[3rem] flex items-center justify-center px-1">
                      {desc}
                    </p>

                    {/* Action Button */}
                    <button
                      onClick={() => handleFeatureClick(card.title)}
                      data-sound="pop"
                      className="w-full py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm md:text-base hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 mt-1"
                    >
                      <span>{buttonText}</span>
                      <span className="text-xs font-bold">❯</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Tip Bar */}
            <div className="mt-2 pt-4 border-t border-cyan-500/30 flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-white font-black bg-cyan-950/50 p-4 rounded-2xl border border-cyan-500/40 shadow-sm">
              <span className="text-xl">💡</span>
              <span className="font-black text-amber-300 shrink-0">學習小提醒：</span>
              <span className="text-cyan-100 leading-normal">每天學習 15 分鐘，持續練習，台語會越來越流利！</span>
            </div>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
