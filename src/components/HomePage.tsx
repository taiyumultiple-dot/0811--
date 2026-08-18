import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { HubShell } from './games/GameShell';

import {
  heroFull,
  iconPhonics,
  iconTone,
  iconGame,
  iconLinks,
  featureIconPhonics,
  featureIconGame,
  featureIconTone,
  featureIconRecord,
  frogDecor,
  bearDecor,
} from '../assets/images/homepage';

type SidebarItem = {
  /** 圖檔（base64）。台語工具箱改用 emoji，所以是選填 */
  icon?: string;
  emoji?: string;
  title: string;
  subtitle: string;
  active: boolean;
  /** 直接跳頁面（不是拼音頁的分頁），例如互動遊戲大廳 */
  external?: string;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: iconPhonics, title: '拼音方案', subtitle: '聲母、韻母、拼音一次學', active: true },
  { icon: iconTone, title: '動畫專區', subtitle: '台語精彩動畫影片', active: false },
  { icon: iconGame, title: '互動遊戲', subtitle: '遊戲中學台語', active: false, external: 'gamesHub' },
  { icon: iconLinks, title: '相關連結', subtitle: '更多學習資源', active: false },
  // 用 emoji 而不是圖檔：assets/images/homepage/index.ts 已經是 458KB 的 base64，不要再加大首屏
  { emoji: '🧰', title: '台語工具箱', subtitle: '課堂小工具．投影就能用', active: false },
];

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

const MAP_SIDEBAR_TABS: Record<string, string> = {
  '拼音方案': 'phonics_scheme',
  '動畫專區': 'tone_practice',
  '相關連結': 'related_links',
};

export default function HomePage({ onNavigate }: { onNavigate: (view: string, tabId?: string) => void }) {
  const [customImage, setCustomImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('custom_sidebar_decor_img') || null;
    } catch (e) {
      return null;
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImage(result);
          try {
            localStorage.setItem('custom_sidebar_decor_img', result);
          } catch (err) {
            console.warn('Image cached in state');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setCustomImage(null);
    localStorage.removeItem('custom_sidebar_decor_img');
  };

  const handleSidebarClick = (title: string) => {
    // 台語工具箱是獨立頁面，不是拼音頁的分頁
    if (title === '台語工具箱') {
      onNavigate('classroom');
      return;
    }
    const item = SIDEBAR_ITEMS.find((i) => i.title === title);
    if (item?.external) {
      onNavigate(item.external);
      return;
    }
    const tabId = MAP_SIDEBAR_TABS[title];
    if (tabId) {
      onNavigate('phonics', tabId);
    }
  };

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
        {/* Left column: Sidebar */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-4">
          <aside className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl p-4 md:p-5 shadow-[0_0_20px_rgba(2,132,199,0.15)]">
            <div className="mb-4 flex justify-center">
              <div className="px-5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-black text-base shadow-xs flex items-center gap-2">
                <span className="text-lg">🧪</span> 學習主題 <span className="text-lg">🧪</span>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {SIDEBAR_ITEMS.map((item) => (
                <li
                  key={item.title}
                  onClick={() => handleSidebarClick(item.title)}
                  className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 cursor-pointer transition-all bg-[#030b17] hover:bg-[#0c1f38] border-2 border-cyan-500/40 hover:border-cyan-300 shadow-md group active:scale-98"
                >
                  {item.icon ? (
                    <img src={item.icon} alt="" className="w-12 h-12 rounded-xl object-contain shrink-0 bg-cyan-950/80 p-1.5 border border-cyan-400/60 shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl shrink-0 bg-cyan-950/80 p-1.5 border border-cyan-400/60 shadow-sm flex items-center justify-center text-2xl">
                      {item.emoji}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-white text-base md:text-lg group-hover:text-amber-300 transition-colors leading-snug">{item.title}</div>
                    <div className="text-xs md:text-sm text-cyan-200 font-extrabold mt-0.5 leading-snug">{item.subtitle}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-300 shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </li>
              ))}
            </ul>
          </aside>

          {/* Photo container below sidebar */}
          <div className="hidden lg:block mt-auto rounded-3xl overflow-hidden border-2 border-cyan-500/40 relative shadow-md bg-[#030b17]">
            <img 
              src={customImage || frogDecor} 
              alt="宣傳照片" 
              className="w-full h-auto object-cover" 
            />
          </div>
        </div>

        {/* Hero + Feature cards column */}
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
