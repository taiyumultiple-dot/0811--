import { HubShell } from './games/GameShell';

import { heroFull } from '../assets/images/homepage';

// 四大功能卡片。插圖是水彩繪本風的手繪圖（跟課本動畫同一種畫風），檔案放在
// public/images/home/，不走 base64 內嵌以免把 JS bundle 撐大。每張卡片有自己
// 的主色，邊框與箭頭吃同一個色，四張並排才看得出是一組的。
const FEATURE_CARDS = [
  {
    title: '拼音學習',
    desc: '照著課本一頁一頁學，聲母韻母、聲調變調都有真人錄音。',
    button: '去學習',
    accent: '#34d399',
    img: 'images/home/feature-phonics.jpg',
  },
  {
    title: '互動遊戲',
    desc: '十款遊戲邊玩邊記，把課本學到的拼音真的用出來。',
    button: '去遊戲',
    accent: '#a78bfa',
    img: 'images/home/feature-game.jpg',
  },
  {
    title: '動畫專區',
    desc: '教育部推薦的台語動畫片單，可依學齡挑，字幕能切漢字／羅馬字。',
    button: '去觀看',
    accent: '#fbbf24',
    img: 'images/home/feature-anime.jpg',
  },
  {
    title: '學習紀錄',
    desc: '看得到自己練到哪、通關幾關，進步都留著。',
    button: '看記錄',
    accent: '#38bdf8',
    img: 'images/home/feature-record.jpg',
  },
];

export default function HomePage({ onNavigate }: { onNavigate: (view: string, tabId?: string) => void }) {
  const handleFeatureClick = (title: string) => {
    if (title === '拼音學習') onNavigate('phonics', 'phonics_scheme');
    else if (title === '互動遊戲') onNavigate('gamesHub');
    else if (title === '動畫專區') onNavigate('classroom', 'anime');
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
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="font-black text-white text-xl md:text-2xl tracking-wide">探索四大功能</h2>
              <span className="font-black text-cyan-300 text-sm md:text-base">點卡片就進去，四個都跟課本接得起來</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {FEATURE_CARDS.map(({ title: cardTitle, desc: cardDesc, button, accent, img }) => {
                const currentUser = (() => {
                  try {
                    const stored = localStorage.getItem('tai_lo_user');
                    return stored ? JSON.parse(stored) : null;
                  } catch (e) {
                    return null;
                  }
                })();
                const isTeacher = currentUser?.role === 'teacher';

                const title = (cardTitle === '學習紀錄' && isTeacher) ? '教學後台' : cardTitle;
                const desc = (cardTitle === '學習紀錄' && isTeacher) ? '學生作答成效、通關率與教師班級管理。' : cardDesc;
                const buttonText = (cardTitle === '學習紀錄' && isTeacher) ? '進入後台' : button;

                return (
                  <button
                    key={cardTitle}
                    onClick={() => handleFeatureClick(cardTitle)}
                    data-sound="pop"
                    className="group text-left rounded-3xl p-4 md:p-5 flex flex-col gap-3.5 bg-[#040e1c] border-2 transition-all hover:-translate-y-1 active:scale-[0.99] cursor-pointer"
                    style={{ borderColor: `${accent}59` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.boxShadow = `0 0 24px ${accent}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${accent}59`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* 插圖 */}
                    <div
                      className="w-full aspect-[4/3] rounded-2xl overflow-hidden"
                      style={{ border: `1px solid ${accent}59` }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}${img}`}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="font-black text-white text-lg md:text-xl tracking-wide">{title}</h3>

                    <p className="text-xs md:text-sm text-cyan-100/85 font-bold leading-relaxed flex-1">
                      {desc}
                    </p>

                    <span
                      className="font-black text-sm md:text-base flex items-center gap-1.5"
                      style={{ color: accent }}
                    >
                      {buttonText}
                      <span className="text-xs transition-transform group-hover:translate-x-1">❯</span>
                    </span>
                  </button>
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
