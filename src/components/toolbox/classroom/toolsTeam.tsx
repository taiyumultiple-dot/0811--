import { useState, useEffect, useMemo, useRef } from 'react';
import { Trophy, Users, Plus, Minus, RotateCcw, Trash2, Undo2, Bell, Grid3x3, Lock, LockOpen } from 'lucide-react';
import { playSuccessSound, playPopSound } from '../../../utils/soundEffects';
import {
  Panel,
  ProjectionButton,
  ProjectionStage,
  useProjection,
  shuffled,
  readStored,
  writeStored,
  TEAMS_KEY,
} from './shared';

// 分組相關：計分板 / 隨機分組 / 隨機座位表 / 分組搶答鈴

export type Team = { id: string; name: string; score: number };

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * 組別清單存在 localStorage，計分板與搶答鈴共用同一份，
 * 所以搶答完可以直接把分數加到計分板上，不必兩邊各建一次組。
 */
export function useTeams(): [Team[], React.Dispatch<React.SetStateAction<Team[]>>] {
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const parsed = JSON.parse(readStored(TEAMS_KEY, '[]'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    writeStored(TEAMS_KEY, JSON.stringify(teams));
  }, [teams]);

  return [teams, setTeams];
}

// ─────────────────────────── 計分板 ───────────────────────────

type ScoreEvent = { id: string; team: string; delta: number };

export function ScoreTool() {
  const [teams, setTeams] = useTeams();
  const [newName, setNewName] = useState('');
  const [log, setLog] = useState<ScoreEvent[]>([]);
  const projection = useProjection();

  const addTeam = () => {
    const name = newName.trim();
    if (!name) return;
    setTeams((prev) => [...prev, { id: `${name}-${prev.length}-${Date.now()}`, name, score: 0 }]);
    setNewName('');
    playPopSound();
  };

  /** 一鍵開好第 1～N 組，比一組一組打字快很多 */
  const quickCreate = (n: number) => {
    setTeams(
      Array.from({ length: n }, (_, i) => ({ id: `g${i}-${Date.now()}`, name: `第 ${i + 1} 組`, score: 0 })),
    );
    setLog([]);
    playPopSound();
  };

  const bump = (id: string, delta: number) => {
    const team = teams.find((t) => t.id === id);
    if (!team) return;
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, score: t.score + delta } : t)));
    setLog((prev) => [{ id: `${id}-${Date.now()}`, team: team.name, delta }, ...prev].slice(0, 12));
    if (delta > 0) playSuccessSound();
    else playPopSound();
  };

  /** 加減分難免按錯，留一顆復原鈕比叫老師自己扣回去實在 */
  const undo = () => {
    const last = log[0];
    if (!last) return;
    setTeams((prev) => prev.map((t) => (t.name === last.team ? { ...t, score: t.score - last.delta } : t)));
    setLog((prev) => prev.slice(1));
    playPopSound();
  };

  const ranked = useMemo(() => [...teams].sort((a, b) => b.score - a.score), [teams]);
  const top = ranked[0]?.score ?? 0;

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        <h2 className="font-black text-amber-300 text-[5vw] leading-none">🏆 計分板</h2>
        <div className="w-full max-w-5xl flex flex-col gap-3 md:gap-4">
          {ranked.map((team, idx) => (
            <div
              key={team.id}
              className={`flex items-center gap-4 rounded-3xl border-4 px-6 py-4 ${
                idx === 0 && top > 0 ? 'bg-amber-500/20 border-amber-300' : 'bg-[#0a1626] border-cyan-500/40'
              }`}
            >
              <span className="text-[4vw] w-[6vw] text-center shrink-0">{MEDALS[idx] ?? idx + 1}</span>
              <span className="flex-1 min-w-0 font-black text-white text-[4vw] truncate">{team.name}</span>
              <span className="font-black text-amber-300 text-[6vw] tabular-nums leading-none">{team.score}</span>
            </div>
          ))}
          {ranked.length === 0 && (
            <p className="text-center font-black text-cyan-200 text-[3vw]">還沒有組別</p>
          )}
        </div>
      </ProjectionStage>
    );
  }

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
        <ProjectionButton onClick={projection.enter} />
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-center text-cyan-200/60 font-black text-base md:text-lg">還沒有組別，快速開好幾組：</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[2, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => quickCreate(n)}
                className="px-6 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 text-cyan-100 hover:border-cyan-300 hover:text-white font-black text-base transition-all active:scale-95 cursor-pointer"
              >
                {n} 組
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ranked.map((team, idx) => (
            <div
              key={team.id}
              className={`flex items-center gap-3 md:gap-4 rounded-2xl border-2 p-3 md:p-4 transition-colors ${
                idx === 0 && top > 0 ? 'bg-amber-500/10 border-amber-400/70' : 'bg-[#030b17] border-cyan-500/40'
              }`}
            >
              <span className="text-2xl md:text-3xl w-10 text-center shrink-0">
                {MEDALS[idx] ?? `${idx + 1}.`}
              </span>

              <span className="flex-1 min-w-0 font-black text-white text-lg md:text-2xl truncate">{team.name}</span>

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

          {log.length > 0 && (
            <div className="rounded-2xl bg-[#030b17] border-2 border-cyan-500/30 p-3 md:p-4 flex flex-col gap-2">
              <span className="font-black text-cyan-200 text-sm md:text-base">加分歷程</span>
              <div className="flex flex-wrap gap-2">
                {log.map((e) => (
                  <span
                    key={e.id}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs md:text-sm border ${
                      e.delta > 0
                        ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200'
                        : 'bg-rose-500/15 border-rose-400/60 text-rose-200'
                    }`}
                  >
                    {e.team} {e.delta > 0 ? `+${e.delta}` : e.delta}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={undo}
              disabled={log.length === 0}
              className="px-5 py-3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" strokeWidth={2.5} />
              復原上一筆
            </button>
            <button
              onClick={() => {
                setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
                setLog([]);
              }}
              className="px-5 py-3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              分數歸零
            </button>
            <button
              onClick={() => {
                setTeams([]);
                setLog([]);
              }}
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

// ─────────────────────────── 隨機分組 ───────────────────────────

const GROUP_COLORS = [
  'border-emerald-400',
  'border-amber-400',
  'border-rose-400',
  'border-sky-400',
  'border-violet-400',
  'border-lime-400',
];

export function GroupTool({ names }: { names: string[] }) {
  const [groupCount, setGroupCount] = useState(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const projection = useProjection();

  const shuffle = () => {
    if (names.length === 0) return;

    // 洗牌後輪流發牌 → 各組人數最多差一人
    const pool = shuffled(names);
    const n = Math.max(1, Math.min(groupCount, pool.length));
    const result: string[][] = Array.from({ length: n }, () => []);
    pool.forEach((name, i) => result[i % n].push(name));

    setGroups(result);
    playSuccessSound();
  };

  const grid = (big: boolean) => (
    <div className={`grid gap-4 w-full ${big ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
      {groups.map((members, i) => (
        <div
          key={i}
          className={`rounded-2xl bg-[#030b17] border-2 ${GROUP_COLORS[i % GROUP_COLORS.length]} p-4 flex flex-col gap-3 shadow-lg`}
        >
          <div className={`font-black text-white flex items-center justify-between ${big ? 'text-[2.2vw]' : 'text-lg md:text-xl'}`}>
            <span>第 {i + 1} 組</span>
            <span className={big ? 'text-[1.4vw] text-cyan-200' : 'text-sm text-cyan-200'}>{members.length} 人</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <span
                key={m}
                className={`px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-white font-black ${
                  big ? 'text-[1.8vw]' : 'text-sm md:text-base'
                }`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        <div className="w-full max-w-6xl">{grid(true)}</div>
        <button
          onClick={shuffle}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-2xl shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <Users className="w-7 h-7" strokeWidth={2.5} />
          重新分組
        </button>
      </ProjectionStage>
    );
  }

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

        {groups.length > 0 && <ProjectionButton onClick={projection.enter} />}
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">
          {names.length === 0 ? '請先在下方貼上班級名單' : '按「一鍵分組」開始'}
        </p>
      ) : (
        grid(false)
      )}
    </Panel>
  );
}

// ─────────────────────────── 隨機座位表 ───────────────────────────

type Seat = { name: string; locked: boolean };

export function SeatingTool({ names }: { names: string[] }) {
  const [cols, setCols] = useState(6);
  const [seats, setSeats] = useState<Seat[]>([]);
  const projection = useProjection();

  /** 重排時鎖住的位子不動，其餘的人重新洗牌填進空位 */
  const arrange = () => {
    if (names.length === 0) return;

    const lockedAt = new Map<number, string>();
    seats.forEach((s, i) => {
      if (s.locked && names.includes(s.name)) lockedAt.set(i, s.name);
    });

    const rest = shuffled(names.filter((n) => ![...lockedAt.values()].includes(n)));
    const total = Math.max(names.length, lockedAt.size ? Math.max(...lockedAt.keys()) + 1 : 0);

    let cursor = 0;
    const next: Seat[] = Array.from({ length: total }, (_, i) => {
      const locked = lockedAt.get(i);
      if (locked) return { name: locked, locked: true };
      return { name: rest[cursor++] ?? '', locked: false };
    });

    setSeats(next.filter((s) => s.name));
    playSuccessSound();
  };

  const toggleLock = (idx: number) =>
    setSeats((prev) => prev.map((s, i) => (i === idx ? { ...s, locked: !s.locked } : s)));

  const board = (big: boolean) => (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className="grid gap-2 md:gap-3 w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {seats.map((s, i) => (
          <button
            key={`${s.name}-${i}`}
            onClick={() => !big && toggleLock(i)}
            className={`rounded-xl border-2 px-2 py-3 font-black text-white transition-all flex flex-col items-center gap-1 ${
              big ? 'text-[1.6vw] cursor-default' : 'text-sm md:text-base cursor-pointer hover:border-cyan-300'
            } ${s.locked ? 'bg-amber-500/20 border-amber-400' : 'bg-[#030b17] border-cyan-500/40'}`}
            title={big ? undefined : s.locked ? '點一下解除固定' : '點一下固定這個座位'}
          >
            <span className="truncate w-full text-center">{s.name}</span>
            {!big &&
              (s.locked ? (
                <Lock className="w-3.5 h-3.5 text-amber-300" strokeWidth={2.5} />
              ) : (
                <LockOpen className="w-3.5 h-3.5 text-cyan-500/50" strokeWidth={2.5} />
              ))}
          </button>
        ))}
      </div>

      <div className={`w-2/3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/40 text-center font-black text-cyan-200 py-2 ${big ? 'text-[2vw]' : 'text-sm md:text-base'}`}>
        🧑‍🏫 講台
      </div>
    </div>
  );

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        <div className="w-full max-w-6xl">{board(true)}</div>
      </ProjectionStage>
    );
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <label className="flex items-center gap-2 text-white font-black text-base md:text-lg">
          每排
          <input
            type="number"
            min="2"
            max="10"
            value={cols}
            onChange={(e) => setCols(Math.max(2, Math.min(10, Number(e.target.value) || 6)))}
            aria-label="每排幾個座位"
            className="w-20 px-3 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-lg text-center transition-colors"
          />
          個
        </label>

        <button
          onClick={arrange}
          disabled={names.length === 0}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg md:text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Grid3x3 className="w-6 h-6" strokeWidth={2.5} />
          隨機排座位
        </button>

        {seats.length > 0 && <ProjectionButton onClick={projection.enter} />}
      </div>

      {seats.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">
          {names.length === 0 ? '請先在下方貼上班級名單' : '按「隨機排座位」開始，排好後點座位可以固定住某些人'}
        </p>
      ) : (
        board(false)
      )}
    </Panel>
  );
}

// ─────────────────────────── 分組搶答鈴 ───────────────────────────

const BUZZ_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function BuzzerTool() {
  const [teams, setTeams] = useTeams();
  const [armed, setArmed] = useState(false);
  const [order, setOrder] = useState<{ name: string; ms: number }[]>([]);
  const startedAt = useRef<number>(0);
  const projection = useProjection();

  const buzz = (name: string) => {
    if (!armed) return;
    if (order.some((o) => o.name === name)) return; // 一組只能搶一次
    setOrder((prev) => [...prev, { name, ms: Date.now() - startedAt.current }]);
    playSuccessSound();
  };

  // 鍵盤 1～9 對應第 1～9 組，老師站在講台前用一支簡報筆或鍵盤就能操作
  useEffect(() => {
    if (!armed) return;
    const onKey = (e: KeyboardEvent) => {
      const idx = BUZZ_KEYS.indexOf(e.key);
      if (idx >= 0 && teams[idx]) buzz(teams[idx].name);
      if (e.key === ' ') e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, teams, order]);

  const start = () => {
    setOrder([]);
    startedAt.current = Date.now();
    setArmed(true);
    playPopSound();
  };

  const awardFirst = () => {
    const first = order[0];
    if (!first) return;
    setTeams((prev) => prev.map((t) => (t.name === first.name ? { ...t, score: t.score + 1 } : t)));
    playSuccessSound();
  };

  const buzzers = (big: boolean) => (
    <div className={`grid gap-3 md:gap-4 w-full ${teams.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {teams.map((t, i) => {
        const rank = order.findIndex((o) => o.name === t.name);
        const got = rank >= 0;
        return (
          <button
            key={t.id}
            onClick={() => buzz(t.name)}
            disabled={!armed || got}
            className={`rounded-3xl border-4 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed ${
              big ? 'py-[4vh]' : 'py-8'
            } ${
              rank === 0
                ? 'bg-amber-400 border-amber-200 text-slate-950'
                : got
                  ? 'bg-cyan-900/60 border-cyan-500/40 text-cyan-200'
                  : armed
                    ? 'bg-emerald-500/20 border-emerald-400 text-white hover:bg-emerald-500/35'
                    : 'bg-[#030b17] border-cyan-500/30 text-cyan-500/60'
            }`}
          >
            <span className={`font-black ${big ? 'text-[3vw]' : 'text-xl md:text-2xl'}`}>{t.name}</span>
            <span className={`font-black ${big ? 'text-[1.6vw]' : 'text-sm'}`}>
              {rank === 0 ? '🔔 最快！' : got ? `第 ${rank + 1} 個` : `按鍵盤 ${i + 1}`}
            </span>
            {got && (
              <span className={`font-black tabular-nums ${big ? 'text-[1.4vw]' : 'text-xs'}`}>
                {(order[rank].ms / 1000).toFixed(2)} 秒
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <span className="font-black text-[3vw] text-cyan-200">
            {armed ? '搶答開始！' : '按「開始搶答」後才能按鈴'}
          </span>
          {buzzers(true)}
          <button
            onClick={start}
            className="px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-[2.5vw] shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-3"
          >
            <Bell className="w-[3vw] h-[3vw]" strokeWidth={2.5} />
            開始搶答
          </button>
        </div>
      </ProjectionStage>
    );
  }

  return (
    <Panel>
      {teams.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">
          請先到「計分板」新增組別，搶答鈴會用同一批組別
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={start}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg md:text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Bell className="w-6 h-6" strokeWidth={2.5} />
              {armed ? '重新開始搶答' : '開始搶答'}
            </button>

            <button
              onClick={awardFirst}
              disabled={order.length === 0}
              className="px-5 py-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm md:text-base shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" strokeWidth={2.5} />
              第一名加 1 分
            </button>

            <button
              onClick={() => {
                setArmed(false);
                setOrder([]);
              }}
              className="px-5 py-4 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              清除
            </button>

            <ProjectionButton onClick={projection.enter} />
          </div>

          <p className="text-center font-black text-cyan-200 text-sm md:text-base">
            {armed ? '搶答中：點按鈕或按鍵盤 1～9' : '按「開始搶答」後才會計時'}
          </p>

          {buzzers(false)}

          {order.length > 0 && (
            <div className="rounded-2xl bg-[#030b17] border-2 border-cyan-500/30 p-4 flex flex-wrap gap-2 justify-center">
              {order.map((o, i) => (
                <span
                  key={o.name}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-400/50 text-white font-black text-sm"
                >
                  {i + 1}. {o.name}（{(o.ms / 1000).toFixed(2)} 秒）
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </Panel>
  );
}
