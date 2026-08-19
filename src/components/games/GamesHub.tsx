import { HubShell } from './GameShell';
import { GAMES, type GameCategory } from './gamesData';

// 遊戲區卡牆。
//
// 2026-08-19 重排：原本第一款是一張佔滿左欄的大卡、其餘擠在右邊，十張卡的
// 圖又是各自為政（前七張是遊戲畫面的示意圖，後三張是風格不一的插畫）。
// 現在十款一律平等、同一種水彩插畫、同樣大小，一眼掃得完；每張卡整張可點，
// 十顆滿版綠色大按鈕改成一行主色文字連結，版面才不會被按鈕淹沒。

const CATEGORY_LABEL: Record<GameCategory, string> = {
  situational: '情境對話',
  outdoor: '戶外踏查',
  life: '生活應用',
};

const gameArt = (id: number) =>
  `${import.meta.env.BASE_URL}images/games/game-${String(id).padStart(2, '0')}.jpg`;

export default function GamesHub({
  onSelectGame,
  onHome,
}: {
  onSelectGame: (key: string) => void;
  onHome?: () => void;
}) {
  return (
    <HubShell activeKey="games" onHome={onHome}>
      <div className="bg-[#FFFDF9]  rounded-[28px] border-2 border-[#E7DFCF] shadow-md p-4 md:p-6 lg:p-7 flex-1 flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="font-black text-[#3E2723] text-xl md:text-2xl tracking-wide">互動遊戲</h2>
          <span className="font-black text-[#8A8378] text-sm md:text-base">
            十款遊戲，題目都取自課本詞彙與鹿港在地文化
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {GAMES.map((g) => (
            <button
              key={g.key}
              onClick={() => onSelectGame(g.key)}
              data-sound="pop"
              className="group text-left rounded-2xl p-2.5 md:p-3 flex flex-col gap-2 bg-white border-2 border-[#E7DFCF] hover:border-[#4E9B5D] hover:-translate-y-1 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              {/* 插畫＋編號 */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7DFCF]">
                <img
                  src={gameArt(g.id)}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 w-8 h-8 rounded-xl bg-[#FFFDF9]/85 border border-[#D9CFB8] text-[#3E2723] font-black text-sm flex items-center justify-center shadow-md">
                  {String(g.id).padStart(2, '0')}
                </span>
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[#FFFDF9]/85 border border-amber-300/70 text-[#E4772E] font-black text-[11px] shadow-md">
                  {CATEGORY_LABEL[g.category]}
                </span>
              </div>

              <h3 className="font-black text-[#3E2723] text-base md:text-lg leading-snug tracking-wide">
                {g.title}
              </h3>

              <p className="text-xs md:text-sm text-[#6B6357] font-bold leading-relaxed flex-1">
                {g.desc}
              </p>

              <span className="font-black text-sm md:text-base text-[#4E9B5D] flex items-center gap-1.5">
                進入遊戲
                <span className="text-xs transition-transform group-hover:translate-x-1">❯</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </HubShell>
  );
}
