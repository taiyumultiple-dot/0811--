import { HubShell } from './GameShell';
import { GAMES } from './gamesData';

export default function GamesHub({
  onSelectGame,
  onHome,
}: {
  onSelectGame: (key: string) => void;
  onHome?: () => void;
}) {
  const featured = GAMES[0];
  const rest = GAMES.slice(1);

  return (
    <HubShell activeKey="games" onHome={onHome}>
      {/* Main Bento Panel Grid Layout */}
      <div className="bg-[#030b17]/95 backdrop-blur-md rounded-[28px] border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(2,132,199,0.2)] p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-between gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Big Featured Card 01 (Left Column - Space Survival Game) */}
          <div className="lg:col-span-4 bg-[#071322] border-2 border-cyan-500/50 hover:border-cyan-300 rounded-[24px] p-5 md:p-6 flex flex-col justify-between shadow-[0_0_25px_rgba(2,132,199,0.2)] relative overflow-hidden group">
            <div>
              {/* Header with Number Badge & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-800/90 rounded-xl border border-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-black text-lg">01</span>
                </div>
                <h2 className="font-black text-white text-xl md:text-2xl tracking-tight leading-snug">
                  {featured.title}
                </h2>
              </div>

              {/* Gameplay Preview Frame (Entire image visible with object-contain) */}
              <div className="w-full rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-[#01060e] select-none my-3 relative group-hover:border-cyan-300 transition-all duration-300 p-2 flex items-center justify-center">
                <img 
                  src={featured.icon} 
                  alt={featured.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-48 md:h-60 object-contain rounded-xl drop-shadow-md" 
                />
              </div>

              {/* Description Text (High contrast bright text, large font) */}
              <p className="text-sm md:text-base text-cyan-50 font-black leading-relaxed my-3 bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-500/30">
                {featured.desc}
              </p>
            </div>

            <div>
              {/* Big Cyber Green Play Button */}
              <button
                onClick={() => onSelectGame(featured.key)}
                data-sound="pop"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-base md:text-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 group"
              >
                <span>進入遊戲</span>
                <span className="w-7 h-7 rounded-full bg-slate-950 text-emerald-300 flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">
                  ❯
                </span>
              </button>

              {/* Interactive Tag Capsules */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs md:text-sm font-black flex-wrap">
                <span className="px-3 py-1.5 bg-cyan-950/90 text-amber-300 border border-cyan-500/40 rounded-xl flex items-center gap-1 shadow-xs">
                  🏷️ 詞彙辨識
                </span>
                <span className="px-3 py-1.5 bg-cyan-950/90 text-amber-300 border border-cyan-500/40 rounded-xl flex items-center gap-1 shadow-xs">
                  📖 台語拼音
                </span>
                <span className="px-3 py-1.5 bg-cyan-950/90 text-amber-300 border border-cyan-500/40 rounded-xl flex items-center gap-1 shadow-xs">
                  🚀 太空冒險
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Standard Cards 02 to 07 (Right Side Columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {rest.map((g) => (
              <div 
                key={g.key} 
                className="bg-[#071322] border-2 border-cyan-500/40 hover:border-cyan-300 rounded-2xl p-4 md:p-5 flex flex-col justify-between transition-all duration-300 group shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  {/* Header Row: Number Badge and Bold Title */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-900/90 text-white font-black text-sm flex items-center justify-center shrink-0 border border-cyan-400 shadow-sm">
                      {String(g.id).padStart(2, '0')}
                    </div>
                    <span className="font-black text-white text-base md:text-lg leading-snug">
                      {g.title}
                    </span>
                  </div>

                  {/* Illustration Preview Thumbnail (Full Image Visible with object-contain) */}
                  <div className="w-full rounded-xl overflow-hidden border border-cyan-500/40 bg-[#01060e] select-none mb-3 p-1.5 flex items-center justify-center group-hover:border-cyan-300 transition-colors">
                    <img 
                      src={g.icon} 
                      alt={g.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-32 md:h-40 object-contain rounded-lg" 
                    />
                  </div>

                  {/* Description Text (Large, bright, fully readable) */}
                  <p className="text-xs md:text-sm text-cyan-50 font-extrabold leading-relaxed mb-4 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
                    {g.desc}
                  </p>
                </div>

                {/* Link Play Button */}
                <button
                  onClick={() => onSelectGame(g.key)}
                  data-sound="pop"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm md:text-base hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                >
                  <span>進入遊戲</span>
                  <span className="text-xs font-black">❯</span>
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Decorative Bottom Ribbon Banner */}
        <div className="w-full py-3 px-6 rounded-2xl bg-[#071322] border-2 border-cyan-500/40 shadow-[0_0_15px_rgba(2,132,199,0.15)] flex items-center justify-between gap-4 select-none flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400 text-amber-300 text-xs md:text-sm font-black shadow-xs">
            <span>⛩️</span> 鹿港老街主題特區
          </div>

          <div className="flex items-center justify-center gap-3 text-white font-black text-sm md:text-base tracking-widest mx-auto">
            <span className="text-amber-300 text-lg">🧬</span>
            <span className="text-emerald-400">💙</span>
            <span className="text-cyan-100">用心學台語，遊戲學習真趣味</span>
            <span className="text-emerald-400">💙</span>
            <span className="text-amber-300 text-lg">🧬</span>
          </div>
        </div>
      </div>

    </HubShell>
  );
}

