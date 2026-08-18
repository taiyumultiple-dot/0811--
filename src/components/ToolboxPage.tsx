import { useState, useEffect, useMemo } from 'react';
import { Search, Star, ArrowLeft, Wrench } from 'lucide-react';
import { HubShell } from './games/GameShell';

const FAV_KEY = 'taigi_toolbox_favs';

type Tool = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  group: 'student' | 'teacher';
  /** false 的工具只做骨架，點進去顯示「即將推出」 */
  ready: boolean;
};

const TOOLS: Tool[] = [
  // ── 學生用 ──
  {
    id: 'translator',
    name: '台語翻譯機',
    desc: '打華語，馬上看到台語漢字、台羅拼音，並可以聽發音。',
    emoji: '🔄',
    group: 'student',
    ready: false,
  },
  {
    id: 'read-aloud',
    name: '拼音朗讀練習',
    desc: '輸入台羅拼音，逐字慢速朗讀，可錄音跟自己的發音比對。',
    emoji: '🎙️',
    group: 'student',
    ready: false,
  },
  {
    id: 'dialogue',
    name: '情境對話產生器',
    desc: '選一個場景（買菜、看醫生、坐車、拜訪長輩），產生一段生活對話，逐句練習。',
    emoji: '💬',
    group: 'student',
    ready: false,
  },
  {
    id: 'flashcards',
    name: '我的單字卡',
    desc: '把學過的詞收進來，用間隔複習排程，每天抽考幾張。',
    emoji: '🗂️',
    group: 'student',
    ready: false,
  },
  // ── 老師用 ──
  {
    id: 'worksheet',
    name: '台語學習單產生器',
    desc: '輸入主題與年級，產生可列印的學習單。',
    emoji: '📄',
    group: 'teacher',
    ready: false,
  },
  {
    id: 'quiz-maker',
    name: '台語試題產生器',
    desc: '產生字音字形、聽力、情境選擇題，附解答。',
    emoji: '📝',
    group: 'teacher',
    ready: false,
  },
  {
    id: 'classroom',
    name: '課堂小工具',
    desc: '抽籤、計分、搶答、座位、大字卡、評量、親師訊息共 14 個工具，上課直接投影用。',
    emoji: '🎲',
    group: 'teacher',
    ready: true,
  },
  {
    id: 'proverbs',
    name: '台語諺語小字典',
    desc: '查俗諺、看意思與使用情境，附例句。',
    emoji: '📖',
    group: 'teacher',
    ready: false,
  },
];

const SECTIONS: { key: Tool['group']; label: string; emoji: string }[] = [
  { key: 'student', label: '學生用', emoji: '🎒' },
  { key: 'teacher', label: '老師用', emoji: '🍎' },
];

function loadFavs(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch (e) {
    return [];
  }
}

export default function ToolboxPage({
  onNavigate,
}: {
  onNavigate: (view: string, tabId?: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [favs, setFavs] = useState<string[]>(loadFavs);
  const [openTool, setOpenTool] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    } catch (e) {
      // localStorage 滿了或被停用時只是不能記住收藏，不該讓整頁壞掉
      console.warn('無法儲存我的最愛');
    }
  }, [favs]);

  const toggleFav = (id: string) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // 搜尋比對名稱與說明；收藏過的排最前面
  const visible = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return TOOLS.filter(
      (t) => !kw || t.name.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw),
    ).sort((a, b) => Number(favs.includes(b.id)) - Number(favs.includes(a.id)));
  }, [search, favs]);

  const activeTool = openTool ? TOOLS.find((t) => t.id === openTool) ?? null : null;

  // ── 單一工具畫面 ──
  if (activeTool) {
    return (
      <HubShell activeKey="toolbox" onHome={() => onNavigate('home')}>
        <div className="flex flex-col gap-4 flex-1">
          <button
            onClick={() => setOpenTool(null)}
            data-sound="pop"
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            <span>回到工具箱</span>
          </button>

          {/* 課堂小工具已經是獨立分頁，這裡剩下的都是還沒開工的工具 */}
          <div className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center gap-4 shadow-[0_0_20px_rgba(2,132,199,0.15)]">
              <div className="text-6xl md:text-7xl">{activeTool.emoji}</div>
              <h2 className="font-black text-white text-2xl md:text-3xl tracking-wide">
                {activeTool.name}
              </h2>
              <p className="text-cyan-100 font-black text-sm md:text-base max-w-xl leading-relaxed">
                {activeTool.desc}
              </p>
              <div className="mt-2 px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-base md:text-lg border-2 border-amber-300 shadow-md">
                🚧 即將推出
              </div>
          </div>
        </div>
      </HubShell>
    );
  }

  // ── 工具牆 ──
  return (
    <HubShell activeKey="toolbox" onHome={() => onNavigate('home')}>
      <div className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_20px_rgba(2,132,199,0.15)] p-5 md:p-6 flex flex-col gap-5 flex-1">
        {/* 標題 + 搜尋 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧰</span>
            <h2 className="font-black text-white text-xl md:text-2xl tracking-wide">台語工具箱</h2>
            <span className="text-amber-300 font-black text-sm md:text-base">AI 學習小幫手</span>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none"
              strokeWidth={2.5}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋工具…"
              aria-label="搜尋工具"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/50 transition-colors"
            />
          </div>
        </div>

        {/* 分區卡片牆 */}
        {SECTIONS.map((section) => {
          const items = visible.filter((t) => t.group === section.key);
          if (items.length === 0) return null;

          return (
            <div key={section.key} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-l-4 border-amber-300 pl-3">
                <span className="text-xl">{section.emoji}</span>
                <h3 className="font-black text-white text-lg md:text-xl tracking-wide">
                  {section.label}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {items.map((tool) => {
                  const faved = favs.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      className="relative rounded-2xl bg-[#030b17] p-4 md:p-5 flex flex-col gap-3 border-2 border-cyan-500/40 hover:border-cyan-300 shadow-xl transition-all group hover:-translate-y-0.5"
                    >
                      {/* 我的最愛 */}
                      <button
                        onClick={() => toggleFav(tool.id)}
                        data-sound="pop"
                        aria-label={faved ? `取消收藏 ${tool.name}` : `收藏 ${tool.name}`}
                        aria-pressed={faved}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-cyan-900/60 transition-colors cursor-pointer active:scale-90"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            faved ? 'text-amber-300 fill-amber-300' : 'text-cyan-500/60'
                          }`}
                          strokeWidth={2.5}
                        />
                      </button>

                      <div className="flex items-center gap-3 pr-8">
                        <div className="w-12 h-12 rounded-xl shrink-0 bg-cyan-950/80 p-1.5 border border-cyan-400/60 shadow-sm flex items-center justify-center text-2xl">
                          {tool.emoji}
                        </div>
                        <div className="font-black text-white text-base md:text-lg leading-snug group-hover:text-amber-300 transition-colors">
                          {tool.name}
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-cyan-50 font-black leading-relaxed flex-1">
                        {tool.desc}
                      </p>

                      <button
                        onClick={() =>
                          tool.id === 'classroom' ? onNavigate('classroom') : setOpenTool(tool.id)
                        }
                        data-sound="pop"
                        className={`w-full py-2.5 md:py-3 rounded-xl font-black text-sm md:text-base transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                          tool.ready
                            ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110'
                            : 'bg-cyan-950 border-2 border-cyan-500/50 text-cyan-200 hover:text-white hover:bg-cyan-900'
                        }`}
                      >
                        <span>{tool.ready ? '開始使用' : '即將推出'}</span>
                        {tool.ready && <span className="text-xs font-bold">❯</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Wrench className="w-10 h-10 text-cyan-500/60" strokeWidth={2.5} />
            <p className="text-cyan-100 font-black text-base">
              找不到「{search}」相關的工具
            </p>
          </div>
        )}

        {/* 錯誤回報入口 */}
        <div className="mt-auto pt-4 border-t border-cyan-500/30 text-center">
          {/* TODO: 換成實際的回報表單網址 */}
          <a
            href="#"
            className="text-xs md:text-sm text-cyan-300 hover:text-amber-300 font-extrabold underline underline-offset-4 transition-colors"
          >
            工具有問題？點此回報
          </a>
        </div>
      </div>
    </HubShell>
  );
}
