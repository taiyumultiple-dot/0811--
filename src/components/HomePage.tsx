import { HubShell } from './games/GameShell';



// 四大功能卡片。插圖是水彩繪本風的手繪圖（跟課本動畫同一種畫風），檔案放在
// public/images/home/，不走 base64 內嵌以免把 JS bundle 撐大。每張卡片有自己
// 的主色，邊框與箭頭吃同一個色，四張並排才看得出是一組的。
const FEATURE_CARDS = [
  {
    title: '拼音學習',
    desc: '跟著課本學發音，有真人錄音',
    button: '去學習',
    accent: '#34d399',
    img: 'images/home/feature-phonics.jpg',
  },
  {
    title: '互動遊戲',
    desc: '十款遊戲，邊玩邊記詞彙',
    button: '去遊戲',
    accent: '#a78bfa',
    img: 'images/home/feature-game.jpg',
  },
  {
    title: '動畫專區',
    desc: '教育部推薦的台語動畫',
    button: '去觀看',
    accent: '#fbbf24',
    img: 'images/home/feature-anime.jpg',
  },
  {
    title: '學習紀錄',
    desc: '看自己練到哪、通關幾關',
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
      {/* 首頁要「一個畫面看完」：桌機左右兩欄——左邊橫幅照原比例滿版（不裁切也
          不留白邊），右邊四大功能排成 2×2 的橫式小卡。手機才上下堆疊。 */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4 flex-1 min-h-0">
        {/* Hero banner：標題文字已經畫在插畫裡，這裡只留一顆真的按鈕 */}
        <div className="relative lg:w-[60%] shrink-0 self-start rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(2,132,199,0.2)]">
          <button
            onClick={() => onNavigate('phonics', 'phonics_scheme')}
            aria-label="開始學習"
            className="block w-full cursor-pointer group"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/home/hero.jpg`}
              alt="歡迎來學台語！用遊戲、互動學習，快樂開口說台語！一起來探索台語的聲音與奧妙！"
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
          <button
            onClick={() => onNavigate('phonics', 'phonics_scheme')}
            data-sound="pop"
            className="absolute right-[8%] bottom-[10%] px-4 sm:px-5 md:px-6 py-1.5 md:py-2.5 rounded-2xl bg-[#4E9B5D] hover:bg-[#3E8552] text-white font-black text-[11px] sm:text-sm md:text-base shadow-lg active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            開始學習 <span className="text-[9px] sm:text-xs">▶</span>
          </button>
        </div>

        {/* 四大功能：2×2 橫式小卡 */}
        <div className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_20px_rgba(2,132,199,0.15)] p-3.5 md:p-4 flex flex-col gap-3 flex-1 min-h-0">
          <div className="flex flex-wrap items-baseline gap-2 shrink-0">
            <h2 className="font-black text-white text-lg md:text-xl tracking-wide">探索四大功能</h2>
            <span className="font-black text-cyan-300 text-xs md:text-sm">點卡片就進去</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0">
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
              const desc = (cardTitle === '學習紀錄' && isTeacher) ? '學生成效與班級管理' : cardDesc;
              const buttonText = (cardTitle === '學習紀錄' && isTeacher) ? '進入後台' : button;

              return (
                <button
                  key={cardTitle}
                  onClick={() => handleFeatureClick(cardTitle)}
                  data-sound="pop"
                  className="group text-left rounded-2xl p-3 flex items-center gap-3 min-h-0 bg-[#040e1c] border-2 transition-all hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
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
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${accent}59` }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${img}`}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-black text-white text-base md:text-lg tracking-wide">{title}</h3>
                    <p className="text-[11px] md:text-xs text-cyan-100/85 font-bold leading-snug">
                      {desc}
                    </p>
                    <span
                      className="font-black text-xs md:text-sm flex items-center gap-1.5"
                      style={{ color: accent }}
                    >
                      {buttonText}
                      <span className="text-[10px] transition-transform group-hover:translate-x-1">❯</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2 text-xs md:text-sm font-black bg-cyan-950/50 px-3 py-2 rounded-xl border border-cyan-500/40">
            <span>💡</span>
            <span className="text-amber-300 shrink-0">學習小提醒：</span>
            <span className="text-cyan-100">每天學習 15 分鐘，台語會越來越流利！</span>
          </div>
        </div>
      </div>
    </HubShell>
  );
}
