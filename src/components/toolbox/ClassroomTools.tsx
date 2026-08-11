import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { Dices, Trophy, Timer, Users, Plus, Minus, RotateCcw, Play, Pause, Trash2 } from 'lucide-react';
import { playSuccessSound, playPopSound } from '../../utils/soundEffects';

// 課堂小工具：抽籤點名 / 計分板 / 倒數計時 / 隨機分組
// 這四個都不需要 AI，老師當天就能投影使用，所以字級與對比都往「投影機看得到」的方向做。

const ROSTER_KEY = 'taigi_classroom_roster';
const TEAMS_KEY = 'taigi_classroom_teams';

type TabKey = 'draw' | 'score' | 'timer' | 'group';

const TABS: { key: TabKey; label: string; icon: typeof Dices }[] = [
  { key: 'draw', label: '抽籤點名', icon: Dices },
  { key: 'score', label: '計分板', icon: Trophy },
  { key: 'timer', label: '倒數計時', icon: Timer },
  { key: 'group', label: '隨機分組', icon: Users },
];

/** 把 textarea 的名單文字切成乾淨的名字陣列（一行一個、去空白、去重複） */
function parseRoster(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split('\n')
    .map((n) => n.trim())
    .filter((n) => {
      if (!n || seen.has(n)) return false;
      seen.add(n);
      return true;
    });
}

function readStored(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (e) {
    return fallback;
  }
}

// 共用的面板外框，四個分頁長得一致
function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_20px_rgba(2,132,199,0.15)] p-5 md:p-6 flex flex-col gap-5">
      {children}
    </div>
  );
}

function RosterInput({
  value,
  onChange,
  count,
}: {
  value: string;
  onChange: (v: string) => void;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-black text-white text-base md:text-lg flex items-center gap-2">
        <span>班級名單</span>
        <span className="text-xs md:text-sm text-cyan-200 font-extrabold">
          一行一個名字，共 {count} 人
        </span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={'王小明\n陳美玲\n林志豪'}
        className="w-full px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 resize-y transition-colors"
      />
    </div>
  );
}

// ─────────────────────────── 抽籤點名 ───────────────────────────

function DrawTool({ names }: { names: string[] }) {
  const [display, setDisplay] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [rolling, setRolling] = useState(false);
  const [excludeDrawn, setExcludeDrawn] = useState(true);
  const [drawn, setDrawn] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 離開分頁時把還在跑的滾動停掉，不然會對已卸載的元件 setState
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pool = excludeDrawn ? names.filter((n) => !drawn.includes(n)) : names;

  const spin = () => {
    if (rolling || pool.length === 0) return;
    setRolling(true);
    setResult('');

    const TICKS = 30;
    let tick = 0;

    const step = () => {
      setDisplay(pool[Math.floor(Math.random() * pool.length)]);
      tick += 1;

      if (tick < TICKS) {
        // 越接近結束，間隔越長 → 名字滾動由快變慢再停住
        const delay = 45 + Math.pow(tick / TICKS, 3) * 300;
        timerRef.current = setTimeout(step, delay);
      } else {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        setDisplay(picked);
        setResult(picked);
        setRolling(false);
        playSuccessSound();
        if (excludeDrawn) setDrawn((prev) => [...prev, picked]);
      }
    };

    step();
  };

  return (
    <Panel>
      <div className="flex flex-col items-center gap-4">
        {/* 抽籤顯示區：投影用，字要非常大 */}
        <div
          className={`w-full min-h-40 md:min-h-56 rounded-3xl border-4 flex items-center justify-center px-6 py-8 transition-colors ${
            result
              ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]'
              : 'bg-[#030b17] border-cyan-500/40'
          }`}
        >
          {display ? (
            <span
              className={`font-black text-white text-center leading-tight transition-all duration-200 ${
                result
                  ? 'text-5xl md:text-7xl lg:text-8xl text-amber-300 drop-shadow-[0_0_25px_rgba(252,211,77,0.6)] scale-105'
                  : 'text-4xl md:text-6xl opacity-70'
              }`}
            >
              {display}
            </span>
          ) : (
            <span className="font-black text-cyan-200/50 text-xl md:text-2xl text-center">
              {names.length === 0 ? '請先在下方貼上班級名單' : '按「抽籤」開始'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={spin}
            disabled={rolling || pool.length === 0}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg md:text-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
          >
            <Dices className="w-6 h-6" strokeWidth={2.5} />
            {rolling ? '抽籤中…' : '抽籤'}
          </button>

          <button
            onClick={() => {
              setDrawn([]);
              setResult('');
              setDisplay('');
              playPopSound();
            }}
            className="px-5 py-4 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            重置抽籤池
          </button>

          <label className="flex items-center gap-2.5 px-4 py-4 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={excludeDrawn}
              onChange={(e) => setExcludeDrawn(e.target.checked)}
              className="w-5 h-5 accent-emerald-400 cursor-pointer"
            />
            <span className="text-cyan-100 font-black text-sm md:text-base">抽過的人不再抽到</span>
          </label>
        </div>

        <p className="text-cyan-200 font-extrabold text-sm md:text-base">
          剩餘可抽 <span className="text-amber-300 text-lg">{pool.length}</span> 人
          {drawn.length > 0 && <span className="ml-2">／ 已抽 {drawn.length} 人</span>}
        </p>

        {drawn.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 justify-center">
            {drawn.map((n, i) => (
              <span
                key={`${n}-${i}`}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-100 font-black text-xs md:text-sm"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

// ─────────────────────────── 計分板 ───────────────────────────

type Team = { id: string; name: string; score: number };

const MEDALS = ['🥇', '🥈', '🥉'];

function ScoreTool() {
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const parsed = JSON.parse(readStored(TEAMS_KEY, '[]'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  const [newName, setNewName] = useState('');

  // 分數存進 localStorage，重整或不小心關掉分頁都不會消失
  useEffect(() => {
    try {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
    } catch (e) {
      console.warn('無法儲存計分板');
    }
  }, [teams]);

  const addTeam = () => {
    const name = newName.trim();
    if (!name) return;
    setTeams((prev) => [...prev, { id: `${name}-${prev.length}-${Date.now()}`, name, score: 0 }]);
    setNewName('');
    playPopSound();
  };

  const bump = (id: string, delta: number) =>
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, score: t.score + delta } : t)));

  const ranked = useMemo(() => [...teams].sort((a, b) => b.score - a.score), [teams]);

  return (
    <Panel>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTeam()}
          placeholder="組別名稱（例如：第一組）"
          className="flex-1 px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 transition-colors"
        />
        <button
          onClick={addTeam}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm md:text-base shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" strokeWidth={3} />
          新增組別
        </button>
      </div>

      {teams.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">
          還沒有組別，先新增一組吧
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {ranked.map((team, idx) => (
            <div
              key={team.id}
              className="flex items-center gap-3 md:gap-4 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 p-3 md:p-4"
            >
              <span className="text-2xl md:text-3xl w-10 text-center shrink-0">
                {MEDALS[idx] ?? `${idx + 1}.`}
              </span>

              <span className="flex-1 min-w-0 font-black text-white text-lg md:text-2xl truncate">
                {team.name}
              </span>

              <span className="font-black text-amber-300 text-2xl md:text-4xl tabular-nums w-16 md:w-24 text-right shrink-0">
                {team.score}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => bump(team.id, -1)}
                  aria-label={`${team.name} 減 1 分`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-500/90 hover:bg-rose-400 text-white font-black flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
                >
                  <Minus className="w-5 h-5" strokeWidth={3} />
                </button>
                <button
                  onClick={() => bump(team.id, 1)}
                  aria-label={`${team.name} 加 1 分`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} />
                </button>
                <button
                  onClick={() => bump(team.id, 5)}
                  aria-label={`${team.name} 加 5 分`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm md:text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
                >
                  +5
                </button>
                <button
                  onClick={() => setTeams((prev) => prev.filter((t) => t.id !== team.id))}
                  aria-label={`刪除 ${team.name}`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-900 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })))}
              className="px-5 py-3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              分數歸零
            </button>
            <button
              onClick={() => setTeams([])}
              className="px-5 py-3 rounded-2xl bg-cyan-950 border-2 border-rose-500/50 text-rose-200 hover:text-white hover:bg-rose-900/50 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              清空所有組別
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

// ─────────────────────────── 倒數計時 ───────────────────────────

const PRESETS = [1, 3, 5];

function TimerTool() {
  const [total, setTotal] = useState(180); // 預設 3 分鐘
  const [remaining, setRemaining] = useState(180);
  const [running, setRunning] = useState(false);
  const [custom, setCustom] = useState('');
  const endAtRef = useRef<number>(0);

  // 用「結束時間戳」而不是每秒減一，分頁被切走再切回來也不會走鐘
  useEffect(() => {
    if (!running) return;

    endAtRef.current = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        playSuccessSound();
      }
    }, 200);

    return () => clearInterval(id);
    // remaining 故意不放進相依陣列：只在開始／暫停時重新對時，
    // 否則每次 tick 都會重建 interval。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const setMinutes = (min: number) => {
    const secs = Math.round(min * 60);
    setRunning(false);
    setTotal(secs);
    setRemaining(secs);
    playPopSound();
  };

  const applyCustom = () => {
    const min = parseFloat(custom);
    if (!isFinite(min) || min <= 0) return;
    setMinutes(Math.min(min, 180)); // 上限 3 小時，避免打錯字變成天文數字
    setCustom('');
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const urgent = remaining > 0 && remaining <= 10;
  const done = remaining === 0;
  const progress = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <Panel>
      <div className="flex flex-col items-center gap-5">
        <div
          className={`w-full rounded-3xl border-4 py-10 md:py-14 flex flex-col items-center gap-4 transition-colors ${
            done
              ? 'bg-rose-950/70 border-rose-400 shadow-[0_0_40px_rgba(251,113,133,0.4)]'
              : urgent
                ? 'bg-rose-950/50 border-rose-400 animate-pulse shadow-[0_0_40px_rgba(251,113,133,0.5)]'
                : 'bg-[#030b17] border-cyan-500/40'
          }`}
        >
          <span
            className={`font-black tabular-nums leading-none transition-colors ${
              urgent || done ? 'text-rose-300 text-7xl md:text-9xl' : 'text-white text-6xl md:text-8xl'
            }`}
          >
            {mm}:{ss}
          </span>

          {done && (
            <span className="font-black text-rose-200 text-2xl md:text-3xl">⏰ 時間到！</span>
          )}

          {/* 進度條 */}
          <div className="w-4/5 h-3 rounded-full bg-cyan-950 overflow-hidden border border-cyan-500/40">
            <div
              className={`h-full transition-all duration-200 ${
                urgent || done ? 'bg-rose-400' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (remaining === 0) return;
              setRunning((r) => !r);
            }}
            disabled={remaining === 0}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg md:text-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {running ? (
              <>
                <Pause className="w-6 h-6" strokeWidth={2.5} /> 暫停
              </>
            ) : (
              <>
                <Play className="w-6 h-6" strokeWidth={2.5} /> 開始
              </>
            )}
          </button>

          <button
            onClick={() => {
              setRunning(false);
              setRemaining(total);
              playPopSound();
            }}
            className="px-5 py-4 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            重設
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`px-6 py-3 rounded-2xl font-black text-base md:text-lg transition-all active:scale-95 cursor-pointer border-2 ${
                total === m * 60
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md'
                  : 'bg-[#030b17] border-cyan-500/40 text-cyan-100 hover:border-cyan-300 hover:text-white'
              }`}
            >
              {m} 分鐘
            </button>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyCustom()}
              placeholder="自訂"
              aria-label="自訂分鐘數"
              className="w-24 px-3 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-base text-center placeholder:text-cyan-200/40 transition-colors"
            />
            <span className="text-cyan-100 font-black text-base">分鐘</span>
            <button
              onClick={applyCustom}
              className="px-4 py-3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm transition-all active:scale-95 cursor-pointer"
            >
              設定
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ─────────────────────────── 隨機分組 ───────────────────────────

const GROUP_COLORS = [
  'border-emerald-400',
  'border-amber-400',
  'border-rose-400',
  'border-sky-400',
  'border-violet-400',
  'border-lime-400',
];

function GroupTool({ names }: { names: string[] }) {
  const [groupCount, setGroupCount] = useState(4);
  const [groups, setGroups] = useState<string[][]>([]);

  const shuffle = () => {
    if (names.length === 0) return;

    // Fisher-Yates 洗牌，再輪流發牌 → 各組人數最多差一人
    const pool = [...names];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const n = Math.max(1, Math.min(groupCount, pool.length));
    const result: string[][] = Array.from({ length: n }, () => []);
    pool.forEach((name, i) => result[i % n].push(name));

    setGroups(result);
    playSuccessSound();
  };

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <label className="flex items-center gap-2 text-white font-black text-base md:text-lg">
          分成
          <input
            type="number"
            min="1"
            max="12"
            value={groupCount}
            onChange={(e) => setGroupCount(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
            aria-label="組數"
            className="w-20 px-3 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-lg text-center transition-colors"
          />
          組
        </label>

        <button
          onClick={shuffle}
          disabled={names.length === 0}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg md:text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Users className="w-6 h-6" strokeWidth={2.5} />
          一鍵分組
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">
          {names.length === 0 ? '請先在下方貼上班級名單' : '按「一鍵分組」開始'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((members, i) => (
            <div
              key={i}
              className={`rounded-2xl bg-[#030b17] border-2 ${GROUP_COLORS[i % GROUP_COLORS.length]} p-4 flex flex-col gap-3 shadow-lg`}
            >
              <div className="font-black text-white text-lg md:text-xl flex items-center justify-between">
                <span>第 {i + 1} 組</span>
                <span className="text-sm text-cyan-200">{members.length} 人</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-white font-black text-sm md:text-base"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ─────────────────────────── 主元件 ───────────────────────────

export default function ClassroomTools() {
  const [tab, setTab] = useState<TabKey>('draw');
  // 名單由抽籤點名與隨機分組共用，貼一次兩邊都能用
  const [rosterText, setRosterText] = useState(() => readStored(ROSTER_KEY, ''));

  useEffect(() => {
    try {
      localStorage.setItem(ROSTER_KEY, rosterText);
    } catch (e) {
      console.warn('無法儲存班級名單');
    }
  }, [rosterText]);

  const names = useMemo(() => parseRoster(rosterText), [rosterText]);
  const needsRoster = tab === 'draw' || tab === 'group';

  return (
    <div className="flex flex-col gap-4">
      {/* 分頁切換 */}
      <div className="flex flex-wrap gap-2 bg-[#030a16] p-2 rounded-2xl border-2 border-cyan-500/40 shadow-inner">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              data-sound="tab"
              onClick={() => setTab(key)}
              className={`flex-1 min-w-[7.5rem] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm md:text-lg font-black transition-all active:scale-95 cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 border-2 border-emerald-300 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  : 'text-cyan-100 hover:text-white hover:bg-cyan-900/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-slate-950' : 'text-cyan-300'}`} strokeWidth={2.5} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {tab === 'draw' && <DrawTool names={names} />}
      {tab === 'score' && <ScoreTool />}
      {tab === 'timer' && <TimerTool />}
      {tab === 'group' && <GroupTool names={names} />}

      {needsRoster && (
        <Panel>
          <RosterInput value={rosterText} onChange={setRosterText} count={names.length} />
        </Panel>
      )}
    </div>
  );
}
