import { useState, useMemo } from 'react';
import { Download, Copy, Check, ClipboardList, Star, Percent } from 'lucide-react';
import { playPopSound, playSuccessSound } from '../../../utils/soundEffects';
import { Panel } from './shared';

// 評量與作業批改：台語口說評量表 / 隨堂小考計分 / 作業繳交檢核
// 三個都不需要 AI，資料只留在這台電腦的瀏覽器裡，不會上傳學生資料。

/** 匯出 CSV。加上 BOM，Excel 開起來中文才不會變亂碼 */
function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function CopyButton({ text, label = '複製名單' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }, () => {});
      }}
      disabled={!text}
      className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-2"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-300" strokeWidth={2.5} /> : <Copy className="w-4 h-4" strokeWidth={2.5} />}
      {copied ? '已複製' : label}
    </button>
  );
}

// ─────────────────────────── 台語口說評量表 ───────────────────────────

// 四個向度各 1～4 分，滿分 16。用四點量表是因為沒有中間值，
// 老師被迫要判斷「有沒有達到」，比五點量表好打分數也好跟學生解釋。
const RUBRIC = [
  { key: 'pron', label: '發音準確', hint: '聲母韻母唸對' },
  { key: 'tone', label: '聲調正確', hint: '含變調' },
  { key: 'fluent', label: '流暢度', hint: '不太停頓、句子完整' },
  { key: 'express', label: '音量表情', hint: '聽得清楚、有感情' },
] as const;

const LEVELS = [
  { v: 4, label: '優秀' },
  { v: 3, label: '良好' },
  { v: 2, label: '尚可' },
  { v: 1, label: '待加強' },
];

type RubricRecord = { name: string; scores: Record<string, number>; total: number };

export function SpeakingRubricTool({ names }: { names: string[] }) {
  const [who, setWho] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [records, setRecords] = useState<RubricRecord[]>([]);

  const total = RUBRIC.reduce((sum, r) => sum + (scores[r.key] ?? 0), 0);
  const filled = RUBRIC.every((r) => scores[r.key]);

  const grade = total >= 15 ? 'A＋' : total >= 13 ? 'A' : total >= 10 ? 'B' : total >= 7 ? 'C' : 'D';

  const save = () => {
    const name = who.trim();
    if (!name || !filled) return;
    setRecords((prev) => [{ name, scores: { ...scores }, total }, ...prev.filter((r) => r.name !== name)]);
    setWho('');
    setScores({});
    playSuccessSound();
  };

  return (
    <Panel>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          list="roster-names"
          value={who}
          onChange={(e) => setWho(e.target.value)}
          placeholder="學生姓名（可從名單挑）"
          className="flex-1 px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 transition-colors"
        />
        <datalist id="roster-names">
          {names.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <div className="px-6 py-3 rounded-2xl bg-[#030b17] border-2 border-amber-400/60 font-black text-amber-300 text-base md:text-lg flex items-center justify-center gap-2">
          <Star className="w-5 h-5" strokeWidth={2.5} />
          {total} / 16　{grade}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {RUBRIC.map((r) => (
          <div key={r.key} className="rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 p-3 md:p-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[9rem]">
              <span className="font-black text-white text-base md:text-lg block">{r.label}</span>
              <span className="font-black text-cyan-300 text-xs md:text-sm">{r.hint}</span>
            </div>
            <div className="flex gap-2">
              {LEVELS.map((lv) => {
                const on = scores[r.key] === lv.v;
                return (
                  <button
                    key={lv.v}
                    onClick={() => {
                      setScores((prev) => ({ ...prev, [r.key]: lv.v }));
                      playPopSound();
                    }}
                    className={`px-3 py-2.5 rounded-xl font-black text-sm md:text-base border-2 transition-all active:scale-95 cursor-pointer ${
                      on
                        ? 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-md'
                        : 'bg-[#071322] border-cyan-500/40 text-cyan-100 hover:border-cyan-300'
                    }`}
                  >
                    {lv.v} {lv.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={save}
          disabled={!who.trim() || !filled}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-base md:text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          記錄這位學生
        </button>
        <button
          onClick={() =>
            downloadCsv('台語口說評量.csv', [
              ['姓名', ...RUBRIC.map((r) => r.label), '總分'],
              ...records.map((r) => [r.name, ...RUBRIC.map((c) => r.scores[c.key] ?? ''), r.total]),
            ])
          }
          disabled={records.length === 0}
          className="px-5 py-4 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-2"
        >
          <Download className="w-4 h-4" strokeWidth={2.5} />
          匯出成績（CSV）
        </button>
      </div>

      {records.length > 0 && (
        <div className="rounded-2xl bg-[#030b17] border-2 border-cyan-500/30 p-4 flex flex-col gap-2">
          <span className="font-black text-cyan-200 text-sm md:text-base">已評 {records.length} 人</span>
          <div className="flex flex-wrap gap-2">
            {records.map((r) => (
              <span key={r.name} className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-400/50 text-white font-black text-sm">
                {r.name} {r.total}
              </span>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

// ─────────────────────────── 隨堂小考計分 ───────────────────────────

export function QuizScoreTool({ names }: { names: string[] }) {
  const [totalItems, setTotalItems] = useState(10);
  const [correct, setCorrect] = useState<Record<string, number>>({});

  const rows = useMemo(
    () =>
      names.map((n) => {
        const c = correct[n];
        const pct = c === undefined ? null : Math.round((c / Math.max(1, totalItems)) * 100);
        return { name: n, correct: c, pct };
      }),
    [names, correct, totalItems],
  );

  const done = rows.filter((r) => r.pct !== null);
  const avg = done.length ? Math.round(done.reduce((s, r) => s + (r.pct ?? 0), 0) / done.length) : 0;
  const pass = done.filter((r) => (r.pct ?? 0) >= 60).length;

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-white font-black text-base md:text-lg">
          總題數
          <input
            type="number"
            min="1"
            max="100"
            value={totalItems}
            onChange={(e) => setTotalItems(Math.max(1, Math.min(100, Number(e.target.value) || 10)))}
            className="w-24 px-3 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-lg text-center transition-colors"
          />
          題
        </label>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <span className="px-4 py-2.5 rounded-xl bg-[#030b17] border-2 border-amber-400/60 font-black text-amber-300 text-sm md:text-base flex items-center gap-2">
            <Percent className="w-4 h-4" strokeWidth={2.5} />
            平均 {avg} 分
          </span>
          <span className="px-4 py-2.5 rounded-xl bg-[#030b17] border-2 border-cyan-500/40 font-black text-cyan-100 text-sm md:text-base">
            及格 {pass} / {done.length} 人
          </span>
          <button
            onClick={() =>
              downloadCsv('隨堂小考成績.csv', [
                ['姓名', '答對題數', '總題數', '百分比'],
                ...rows.map((r) => [r.name, r.correct ?? '', totalItems, r.pct ?? '']),
              ])
            }
            disabled={done.length === 0}
            className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-2"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            匯出 CSV
          </button>
        </div>
      </div>

      {names.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">請先在下方貼上班級名單</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((r) => (
            <div key={r.name} className="rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 p-3 flex items-center gap-3">
              <span className="flex-1 min-w-0 font-black text-white text-base md:text-lg truncate">{r.name}</span>
              <input
                type="number"
                min="0"
                max={totalItems}
                value={r.correct ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setCorrect((prev) => {
                    if (v === '') {
                      const next = { ...prev };
                      delete next[r.name];
                      return next;
                    }
                    return { ...prev, [r.name]: Math.max(0, Math.min(totalItems, Number(v))) };
                  });
                }}
                aria-label={`${r.name} 答對題數`}
                placeholder="—"
                className="w-20 px-2 py-2 rounded-xl bg-[#071322] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-base text-center transition-colors"
              />
              <span
                className={`w-14 text-right font-black text-base md:text-lg tabular-nums ${
                  r.pct === null ? 'text-cyan-500/50' : r.pct >= 60 ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {r.pct === null ? '—' : `${r.pct}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ─────────────────────────── 作業繳交檢核 ───────────────────────────

const STATES = [
  { key: 'none', label: '未交', cls: 'bg-[#030b17] border-cyan-500/40 text-cyan-100' },
  { key: 'done', label: '已交', cls: 'bg-emerald-500/20 border-emerald-400 text-white' },
  { key: 'fix', label: '訂正中', cls: 'bg-amber-500/20 border-amber-400 text-white' },
] as const;

export function HomeworkTool({ names }: { names: string[] }) {
  const [title, setTitle] = useState('');
  const [state, setState] = useState<Record<string, string>>({});

  // 點一下在「未交 → 已交 → 訂正中」之間輪替，比三顆按鈕省空間也快
  const cycle = (name: string) => {
    setState((prev) => {
      const cur = prev[name] ?? 'none';
      const idx = STATES.findIndex((s) => s.key === cur);
      return { ...prev, [name]: STATES[(idx + 1) % STATES.length].key };
    });
    playPopSound();
  };

  const missing = names.filter((n) => (state[n] ?? 'none') === 'none');
  const submitted = names.length - missing.length;

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="作業名稱（例如：第三課台語朗讀錄音）"
          className="flex-1 min-w-[12rem] px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 transition-colors"
        />
        <span className="px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-emerald-400/60 font-black text-emerald-300 text-sm md:text-base flex items-center gap-2">
          <ClipboardList className="w-4 h-4" strokeWidth={2.5} />
          已交 {submitted} / {names.length}
        </span>
      </div>

      {names.length === 0 ? (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">請先在下方貼上班級名單</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            {names.map((n) => {
              const s = STATES.find((x) => x.key === (state[n] ?? 'none')) ?? STATES[0];
              return (
                <button
                  key={n}
                  onClick={() => cycle(n)}
                  className={`rounded-2xl border-2 px-3 py-3 font-black transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-1 ${s.cls}`}
                >
                  <span className="text-sm md:text-base truncate w-full text-center">{n}</span>
                  <span className="text-xs md:text-sm opacity-90">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 justify-center items-center">
            <span className="font-black text-rose-200 text-sm md:text-base">
              未交 {missing.length} 人{missing.length > 0 ? `：${missing.join('、')}` : ''}
            </span>
            <CopyButton text={missing.join('、')} label="複製未交名單" />
            <button
              onClick={() =>
                downloadCsv(`${title || '作業'}繳交紀錄.csv`, [
                  ['作業', title || '（未命名）'],
                  ['姓名', '狀態'],
                  ...names.map((n) => [n, STATES.find((x) => x.key === (state[n] ?? 'none'))?.label ?? '未交']),
                ])
              }
              className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              匯出紀錄
            </button>
            <button
              onClick={() => setState({})}
              className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-rose-500/50 text-rose-200 hover:text-white hover:bg-rose-900/50 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer"
            >
              全部重設
            </button>
          </div>
        </>
      )}
    </Panel>
  );
}
