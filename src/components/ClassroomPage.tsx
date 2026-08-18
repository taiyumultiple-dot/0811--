import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Wrench } from 'lucide-react';
import { HubShell } from './games/GameShell';
import {
  Panel,
  RosterInput,
  parseRoster,
  readStored,
  writeStored,
  ROSTER_KEY,
} from './toolbox/classroom/shared';
import { DrawTool, TimerTool, SignalTool } from './toolbox/classroom/toolsBasic';
import { ScoreTool, GroupTool, SeatingTool, BuzzerTool } from './toolbox/classroom/toolsTeam';
import { FlashCardTool, WheelTool } from './toolbox/classroom/toolsTaigi';
import { SpeakingRubricTool, QuizScoreTool, HomeworkTool } from './toolbox/classroom/toolsAssess';
import { ParentMessageTool, NoticeTool } from './toolbox/classroom/toolsComm';
import AnimationZone from './AnimationZone';

// 課堂小工具總頁：分類 → 工具卡牆 → 點進去單一工具。
//
// 分成一頁一個工具（而不是一整排分頁）是因為工具會愈加愈多，
// 分頁列會擠爆；而且老師上課時通常只用其中一個，滿版比較好投影。

type ToolKey =
  | 'draw' | 'score' | 'buzzer' | 'timer' | 'group' | 'seating' | 'signal'
  | 'flashcard' | 'wheel' | 'anime'
  | 'rubric' | 'quiz' | 'homework'
  | 'parentmsg' | 'notice';

type ToolDef = {
  key: ToolKey;
  name: string;
  desc: string;
  emoji: string;
  /** 需要班級名單的工具，畫面下方會出現名單輸入框 */
  needsRoster?: boolean;
};

type Category = {
  key: string;
  label: string;
  emoji: string;
  hint: string;
  tools: ToolDef[];
};

const CATEGORIES: Category[] = [
  {
    key: 'class',
    label: '班級經營與互動',
    emoji: '🎒',
    hint: '上課當下就會用到的，開了直接投影',
    tools: [
      { key: 'draw', name: '抽籤點名', desc: '滾動抽出一位同學，可設定抽過的不再抽。', emoji: '🎲', needsRoster: true },
      { key: 'score', name: '小組計分板', desc: '自訂組別加減分，看得到加分歷程，按錯可以復原。', emoji: '🏆' },
      { key: 'buzzer', name: '分組搶答鈴', desc: '各組搶答，記錄先後順序與反應時間，可直接加分。', emoji: '🔔' },
      { key: 'timer', name: '倒數計時', desc: '大字倒數，最後十秒會閃紅提醒，時間到有音效。', emoji: '⏱️' },
      { key: 'group', name: '隨機分組', desc: '一鍵把全班平均分成幾組，各組人數最多差一人。', emoji: '👥', needsRoster: true },
      { key: 'seating', name: '隨機座位表', desc: '自動排座位，可以把某些人的位子鎖住再重排。', emoji: '🪑', needsRoster: true },
      { key: 'signal', name: '課堂音量號誌', desc: '投影現在這個活動可以講多大聲，不用一直喊安靜。', emoji: '🚦' },
    ],
  },
  {
    key: 'taigi',
    label: '台語教學',
    emoji: '🧪',
    hint: '這個站專屬的，配課本詞彙用',
    tools: [
      { key: 'flashcard', name: '台語大字卡', desc: '全螢幕大字投影，可遮住拼音讓學生猜，能聽發音、掃碼帶回家。', emoji: '🃏' },
      { key: 'wheel', name: '台語詞彙轉盤', desc: '隨機轉出一個台語詞讓學生唸，唸完再揭曉拼音。', emoji: '🎡' },
      { key: 'anime', name: '動畫專區', desc: '教育部推薦的台語動畫片單，可依學齡篩選，字幕能切漢字／羅馬字。', emoji: '📺' },
    ],
  },
  {
    key: 'assess',
    label: '評量與作業批改',
    emoji: '📋',
    hint: '當場打分數、當場統計，可匯出 CSV',
    tools: [
      { key: 'rubric', name: '台語口說評量表', desc: '發音、聲調、流暢、表情四向度四點量表，自動算總分與等第。', emoji: '🎤', needsRoster: true },
      { key: 'quiz', name: '隨堂小考計分', desc: '輸入答對題數自動換算百分比，即時看到平均與及格人數。', emoji: '💯', needsRoster: true },
      { key: 'homework', name: '作業繳交檢核', desc: '點名字切換已交／未交／訂正中，一鍵複製未交名單。', emoji: '✅', needsRoster: true },
    ],
  },
  {
    key: 'comm',
    label: '親師溝通與行政',
    emoji: '✉️',
    hint: '固定句型拼出草稿，不接 AI、不上傳學生資料',
    tools: [
      { key: 'parentmsg', name: '親師訊息產生器', desc: '選情境與語氣，產出可貼到 LINE 或聯絡簿的訊息草稿。', emoji: '💬', needsRoster: true },
      { key: 'notice', name: '班級通知單', desc: '填活動時間地點，產出可直接列印的通知單。', emoji: '📄' },
    ],
  },
];

const ALL_TOOLS = CATEGORIES.flatMap((c) => c.tools);

export default function ClassroomPage({
  onNavigate,
  initialTool = null,
}: {
  onNavigate: (view: string, tabId?: string) => void;
  /** 從別頁直接指定要開哪一項工具（首頁的「動畫專區」卡片會傳 'anime'） */
  initialTool?: string | null;
}) {
  const [open, setOpen] = useState<ToolKey | null>((initialTool as ToolKey) ?? null);
  const [search, setSearch] = useState('');
  // 名單一次貼好，抽籤、分組、座位、評量、作業都共用
  const [rosterText, setRosterText] = useState(() => readStored(ROSTER_KEY, ''));

  useEffect(() => {
    writeStored(ROSTER_KEY, rosterText);
  }, [rosterText]);

  // 外面指定的工具換了就跟著開；沒指定（從導覽列進來）就回到工具卡牆
  useEffect(() => {
    setOpen((initialTool as ToolKey) ?? null);
  }, [initialTool]);

  const names = useMemo(() => parseRoster(rosterText), [rosterText]);
  const activeTool = open ? ALL_TOOLS.find((t) => t.key === open) ?? null : null;

  const kw = search.trim().toLowerCase();
  const matched = (t: ToolDef) => !kw || t.name.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw);

  // ── 單一工具畫面 ──
  if (activeTool) {
    return (
      <HubShell activeKey="classroom" onHome={() => onNavigate('home')}>
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen(null)}
              data-sound="pop"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              <span>回到課堂小工具</span>
            </button>
            <h2 className="font-black text-white text-lg md:text-2xl flex items-center gap-2">
              <span>{activeTool.emoji}</span>
              {activeTool.name}
            </h2>
          </div>

          {open === 'draw' && <DrawTool names={names} />}
          {open === 'score' && <ScoreTool />}
          {open === 'buzzer' && <BuzzerTool />}
          {open === 'timer' && <TimerTool />}
          {open === 'group' && <GroupTool names={names} />}
          {open === 'seating' && <SeatingTool names={names} />}
          {open === 'signal' && <SignalTool />}
          {open === 'flashcard' && <FlashCardTool />}
          {open === 'wheel' && <WheelTool />}
          {/* 動畫專區是原本拼音頁搬過來的，底色是米白的，所以另外包一層白底卡片 */}
          {open === 'anime' && (
            <div className="bg-white rounded-3xl p-5 md:p-7 shadow-sm flex flex-col">
              <AnimationZone />
            </div>
          )}
          {open === 'rubric' && <SpeakingRubricTool names={names} />}
          {open === 'quiz' && <QuizScoreTool names={names} />}
          {open === 'homework' && <HomeworkTool names={names} />}
          {open === 'parentmsg' && <ParentMessageTool names={names} />}
          {open === 'notice' && <NoticeTool />}

          {activeTool.needsRoster && (
            <Panel>
              <RosterInput value={rosterText} onChange={setRosterText} count={names.length} />
            </Panel>
          )}
        </div>
      </HubShell>
    );
  }

  // ── 工具卡牆 ──
  return (
    <HubShell activeKey="classroom" onHome={() => onNavigate('home')}>
      <div className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_20px_rgba(2,132,199,0.15)] p-5 md:p-6 flex flex-col gap-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧑‍🏫</span>
            <h2 className="font-black text-white text-xl md:text-2xl tracking-wide">課堂小工具</h2>
            <span className="text-amber-300 font-black text-sm md:text-base">不用網路、不用 AI，開了就能投影</span>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" strokeWidth={2.5} />
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

        {CATEGORIES.map((cat) => {
          const items = cat.tools.filter(matched);
          if (items.length === 0) return null;

          return (
            <div key={cat.key} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-2 border-l-4 border-amber-300 pl-3">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="font-black text-white text-lg md:text-xl tracking-wide">{cat.label}</h3>
                <span className="font-black text-cyan-300 text-xs md:text-sm">{cat.hint}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {items.map((tool) => (
                  <button
                    key={tool.key}
                    onClick={() => setOpen(tool.key)}
                    data-sound="pop"
                    className="text-left rounded-2xl bg-[#030b17] p-4 md:p-5 flex flex-col gap-3 border-2 border-cyan-500/40 hover:border-cyan-300 shadow-xl transition-all group hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl shrink-0 bg-cyan-950/80 border border-cyan-400/60 shadow-sm flex items-center justify-center text-2xl">
                        {tool.emoji}
                      </div>
                      <div className="font-black text-white text-base md:text-lg leading-snug group-hover:text-amber-300 transition-colors">
                        {tool.name}
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-cyan-50 font-black leading-relaxed flex-1">{tool.desc}</p>

                    <span className="w-full py-2.5 rounded-xl font-black text-sm md:text-base bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-md flex items-center justify-center gap-1.5">
                      開始使用 <span className="text-xs font-bold">❯</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {ALL_TOOLS.filter(matched).length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Wrench className="w-10 h-10 text-cyan-500/60" strokeWidth={2.5} />
            <p className="text-cyan-100 font-black text-base">找不到「{search}」相關的工具</p>
          </div>
        )}

        <Panel>
          <RosterInput value={rosterText} onChange={setRosterText} count={names.length} />
        </Panel>
      </div>
    </HubShell>
  );
}
