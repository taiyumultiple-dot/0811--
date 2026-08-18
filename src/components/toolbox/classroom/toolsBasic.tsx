import { useState, useEffect, useRef } from 'react';
import { Dices, RotateCcw, Play, Pause, Volume2 } from 'lucide-react';
import { playSuccessSound, playPopSound } from '../../../utils/soundEffects';
import { Panel, ProjectionButton, ProjectionStage, useProjection } from './shared';

// 基本款：抽籤點名 / 倒數計時 / 課堂音量號誌

// ─────────────────────────── 抽籤點名 ───────────────────────────

export function DrawTool({ names }: { names: string[] }) {
  const [display, setDisplay] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [rolling, setRolling] = useState(false);
  const [excludeDrawn, setExcludeDrawn] = useState(true);
  const [drawn, setDrawn] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projection = useProjection();

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

  const stage = (
    <>
      <div className="text-center">
        <span className="font-black text-white leading-none block break-all text-[16vw] md:text-[13vw]">
          {display || '？'}
        </span>
        {result && !projection.projecting && (
          <span className="font-black text-amber-300 text-2xl">被抽到了！</span>
        )}
      </div>
      <button
        onClick={spin}
        disabled={rolling || pool.length === 0}
        className="px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-2xl md:text-4xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3"
      >
        <Dices className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
        {rolling ? '抽籤中…' : '抽籤'}
      </button>
      <p className="font-black text-cyan-200 text-lg md:text-2xl">
        剩下 {pool.length} 人可抽{excludeDrawn && drawn.length > 0 ? `，已抽 ${drawn.length} 人` : ''}
      </p>
    </>
  );

  if (projection.projecting) {
    return <ProjectionStage onExit={projection.exit}>{stage}</ProjectionStage>;
  }

  return (
    <Panel>
      <div className="flex justify-end">
        <ProjectionButton onClick={projection.enter} />
      </div>

      <div
        className={`w-full rounded-3xl border-4 py-10 md:py-14 flex flex-col items-center gap-5 transition-colors ${
          result ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]' : 'bg-[#030b17] border-cyan-500/40'
        }`}
      >
        <span className="font-black text-white text-5xl md:text-8xl leading-none break-all text-center px-4">
          {display || (names.length ? '？' : '請先貼上名單')}
        </span>
        {result && <span className="font-black text-amber-300 text-xl md:text-3xl">🎉 {result}，換你囉！</span>}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={spin}
          disabled={rolling || pool.length === 0}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg md:text-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
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

        <label className="flex items-center gap-2 text-cyan-100 font-black text-sm md:text-base cursor-pointer select-none">
          <input
            type="checkbox"
            checked={excludeDrawn}
            onChange={(e) => setExcludeDrawn(e.target.checked)}
            className="w-5 h-5 accent-emerald-400 cursor-pointer"
          />
          抽過的不再抽
        </label>
      </div>

      <p className="text-center text-cyan-200 font-black text-sm md:text-base">
        剩下 {pool.length} 人可抽{excludeDrawn && drawn.length > 0 ? `　已抽：${drawn.join('、')}` : ''}
      </p>
    </Panel>
  );
}

// ─────────────────────────── 倒數計時 ───────────────────────────

const PRESETS = [1, 3, 5];

export function TimerTool() {
  const [total, setTotal] = useState(180); // 預設 3 分鐘
  const [remaining, setRemaining] = useState(180);
  const [running, setRunning] = useState(false);
  const [custom, setCustom] = useState('');
  const endAtRef = useRef<number>(0);
  const projection = useProjection();

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

  const clock = (
    <span
      className={`font-black tabular-nums leading-none transition-colors ${
        urgent || done ? 'text-rose-300' : 'text-white'
      }`}
    >
      {mm}:{ss}
    </span>
  );

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        <div className={`text-[22vw] leading-none ${urgent ? 'animate-pulse' : ''}`}>{clock}</div>
        {done && <span className="font-black text-rose-300 text-5xl md:text-7xl">⏰ 時間到！</span>}
        <button
          onClick={() => setRunning((r) => !r)}
          disabled={remaining === 0}
          className="px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-2xl md:text-3xl shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-3"
        >
          {running ? <Pause className="w-8 h-8" strokeWidth={2.5} /> : <Play className="w-8 h-8" strokeWidth={2.5} />}
          {running ? '暫停' : '開始'}
        </button>
      </ProjectionStage>
    );
  }

  return (
    <Panel>
      <div className="flex justify-end">
        <ProjectionButton onClick={projection.enter} />
      </div>

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
          <div className={urgent || done ? 'text-7xl md:text-9xl' : 'text-6xl md:text-8xl'}>{clock}</div>

          {done && <span className="font-black text-rose-200 text-2xl md:text-3xl">⏰ 時間到！</span>}

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

// ─────────────────────────── 課堂音量號誌 ───────────────────────────

// 不需要麥克風權限：老師按一下切換目前允許的音量，投影出去讓學生自己看。
// 用「號誌」而不是分貝偵測，是因為教室裡的麥克風偵測值很不穩，
// 而且真正有用的是「現在這個活動可以講多大聲」這件事講清楚。
const SIGNALS = [
  { key: 'silent', label: '安靜', desc: '完全不出聲，自己做', emoji: '🤫', color: 'bg-rose-500', ring: 'border-rose-300', text: 'text-rose-100' },
  { key: 'pair', label: '兩人小聲', desc: '只有旁邊的同學聽得到', emoji: '🤝', color: 'bg-amber-500', ring: 'border-amber-300', text: 'text-amber-100' },
  { key: 'group', label: '小組討論', desc: '同組聽得到就好', emoji: '👥', color: 'bg-emerald-500', ring: 'border-emerald-300', text: 'text-emerald-100' },
  { key: 'present', label: '上台發表', desc: '大聲清楚，全班聽得到', emoji: '📢', color: 'bg-sky-500', ring: 'border-sky-300', text: 'text-sky-100' },
] as const;

export function SignalTool() {
  const [active, setActive] = useState<string>('group');
  const projection = useProjection();
  const current = SIGNALS.find((s) => s.key === active) ?? SIGNALS[2];

  const pick = (key: string) => {
    setActive(key);
    playPopSound();
  };

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        <div className={`w-full flex-1 rounded-[3rem] border-8 ${current.ring} ${current.color} flex flex-col items-center justify-center gap-6`}>
          <span className="text-[18vw] leading-none">{current.emoji}</span>
          <span className="font-black text-white text-[9vw] leading-none">{current.label}</span>
          <span className="font-black text-white/90 text-[3.5vw]">{current.desc}</span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {SIGNALS.map((s) => (
            <button
              key={s.key}
              onClick={() => pick(s.key)}
              className={`px-6 py-4 rounded-2xl font-black text-xl md:text-2xl border-4 transition-all active:scale-95 cursor-pointer ${
                s.key === active ? `${s.color} ${s.ring} text-white` : 'bg-[#0a1626] border-cyan-500/40 text-cyan-100'
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </ProjectionStage>
    );
  }

  return (
    <Panel>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-white font-black text-base md:text-lg">
          <Volume2 className="w-5 h-5 text-cyan-300" strokeWidth={2.5} />
          現在這個活動可以講多大聲
        </div>
        <ProjectionButton onClick={projection.enter} />
      </div>

      <div className={`w-full rounded-3xl border-4 ${current.ring} ${current.color} py-10 md:py-14 flex flex-col items-center gap-3`}>
        <span className="text-7xl md:text-8xl">{current.emoji}</span>
        <span className="font-black text-white text-4xl md:text-6xl">{current.label}</span>
        <span className="font-black text-white/90 text-base md:text-xl">{current.desc}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SIGNALS.map((s) => (
          <button
            key={s.key}
            onClick={() => pick(s.key)}
            className={`px-4 py-4 rounded-2xl font-black text-base md:text-lg border-2 transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-1 ${
              s.key === active
                ? `${s.color} ${s.ring} text-white shadow-lg`
                : 'bg-[#030b17] border-cyan-500/40 text-cyan-100 hover:border-cyan-300 hover:text-white'
            }`}
          >
            <span className="text-2xl">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </Panel>
  );
}
