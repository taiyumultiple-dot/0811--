import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, Volume2, Disc3 } from 'lucide-react';
import { playSuccessSound, playPopSound } from '../../../utils/soundEffects';
import { speakTaiyu } from '../../../lib/speech';
import { Panel, ProjectionButton, ProjectionStage, useProjection, shuffled, readStored, writeStored, WORDS_KEY } from './shared';
import { WORD_THEMES, parseWordLines, type Word } from './wordBank';
import { ShareQrButton } from './qrShare';

// 台語教學專用：大字卡投影 / 詞彙轉盤
// 兩個都吃同一份詞庫（可以選主題，也可以貼自己的詞單）。

/** 主題勾選 + 自訂詞單，回傳最後要用的詞卡陣列 */
function useWordSource() {
  const [picked, setPicked] = useState<string[]>(['food']);
  const [customText, setCustomText] = useState(() => readStored(WORDS_KEY, ''));
  const [useCustom, setUseCustom] = useState(() => readStored(WORDS_KEY, '').trim().length > 0);

  useEffect(() => {
    writeStored(WORDS_KEY, customText);
  }, [customText]);

  const words = useMemo<Word[]>(() => {
    if (useCustom) return parseWordLines(customText);
    return WORD_THEMES.filter((t) => picked.includes(t.key)).flatMap((t) => t.words);
  }, [useCustom, customText, picked]);

  const toggleTheme = (key: string) =>
    setPicked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const panel = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-black text-white text-base md:text-lg">詞卡來源</span>
        <button
          onClick={() => setUseCustom(false)}
          className={`px-4 py-2 rounded-xl font-black text-sm border-2 transition-all active:scale-95 cursor-pointer ${
            !useCustom ? 'bg-amber-400 border-amber-300 text-slate-950' : 'bg-[#030b17] border-cyan-500/40 text-cyan-100'
          }`}
        >
          課本主題
        </button>
        <button
          onClick={() => setUseCustom(true)}
          className={`px-4 py-2 rounded-xl font-black text-sm border-2 transition-all active:scale-95 cursor-pointer ${
            useCustom ? 'bg-amber-400 border-amber-300 text-slate-950' : 'bg-[#030b17] border-cyan-500/40 text-cyan-100'
          }`}
        >
          自己貼詞單
        </button>
        <span className="font-black text-cyan-200 text-sm ml-auto">目前 {words.length} 張</span>
      </div>

      {useCustom ? (
        <div className="flex flex-col gap-2">
          <span className="font-black text-cyan-200 text-xs md:text-sm">
            一行一個詞，用空白或逗號分成「漢字　台羅　華語」，後兩欄可留空
          </span>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={4}
            placeholder={'肉圓　bah-uân　肉圓\n豆花　tāu-hue　豆花'}
            className="w-full px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 resize-y transition-colors"
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {WORD_THEMES.map((t) => {
            const on = picked.includes(t.key);
            return (
              <button
                key={t.key}
                onClick={() => toggleTheme(t.key)}
                className={`px-3 py-2 rounded-xl font-black text-sm border-2 transition-all active:scale-95 cursor-pointer ${
                  on
                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                    : 'bg-[#030b17] border-cyan-500/40 text-cyan-100 hover:border-cyan-300'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return { words, panel };
}

function SpeakButton({ word, big = false }: { word: Word; big?: boolean }) {
  return (
    <button
      onClick={() => speakTaiyu(word.han, undefined, word.tailo)}
      aria-label={`唸出 ${word.han}`}
      className={`rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
        big ? 'px-8 py-4 text-2xl' : 'px-5 py-3 text-sm md:text-base'
      }`}
    >
      <Volume2 className={big ? 'w-8 h-8' : 'w-5 h-5'} strokeWidth={2.5} />
      聽發音
    </button>
  );
}

// ─────────────────────────── 台語大字卡 ───────────────────────────

export function FlashCardTool() {
  const { words, panel } = useWordSource();
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [showTailo, setShowTailo] = useState(true);
  const [showZh, setShowZh] = useState(false);
  const projection = useProjection();

  // 詞卡來源換了就重排順序，索引也要回到第一張
  useEffect(() => {
    setOrder(words.map((_, i) => i));
    setIdx(0);
  }, [words]);

  const current = words[order[idx]] ?? null;
  const go = (step: number) => {
    if (order.length === 0) return;
    setIdx((prev) => (prev + step + order.length) % order.length);
    playPopSound();
  };

  // 投影時用左右方向鍵翻卡，老師拿簡報筆就能操作
  useEffect(() => {
    if (!projection.projecting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1);
      if (e.key === 'Enter') setShowTailo((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projection.projecting, order.length]);

  const card = (big: boolean) => {
    if (!current) {
      return (
        <p className="text-center text-cyan-200/60 font-black py-10 text-base md:text-lg">
          請先選主題或貼上詞單
        </p>
      );
    }
    return (
      <div
        className={`w-full rounded-3xl border-4 border-cyan-500/40 bg-[#030b17] flex flex-col items-center justify-center gap-4 ${
          big ? 'flex-1 py-[6vh]' : 'py-12 md:py-16'
        }`}
      >
        <span className={`font-black text-white leading-none text-center break-all px-4 ${big ? 'text-[16vw]' : 'text-7xl md:text-9xl'}`}>
          {current.han}
        </span>
        <span className={`font-black text-amber-300 leading-none text-center ${big ? 'text-[6vw]' : 'text-2xl md:text-4xl'} ${showTailo ? '' : 'invisible'}`}>
          {current.tailo || '（無拼音）'}
        </span>
        <span className={`font-black text-cyan-200 text-center ${big ? 'text-[3vw]' : 'text-base md:text-2xl'} ${showZh ? '' : 'invisible'}`}>
          {current.zh || '—'}
        </span>
      </div>
    );
  };

  const controls = (big: boolean) => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => go(-1)}
        disabled={order.length === 0}
        aria-label="上一張"
        className={`rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-1 ${
          big ? 'px-8 py-4 text-2xl' : 'px-5 py-3 text-base'
        }`}
      >
        <ChevronLeft className={big ? 'w-8 h-8' : 'w-5 h-5'} strokeWidth={2.5} />
        上一張
      </button>

      <span className={`font-black text-cyan-200 tabular-nums ${big ? 'text-[2vw]' : 'text-base'}`}>
        {order.length === 0 ? '0 / 0' : `${idx + 1} / ${order.length}`}
      </span>

      <button
        onClick={() => go(1)}
        disabled={order.length === 0}
        aria-label="下一張"
        className={`rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-1 ${
          big ? 'px-8 py-4 text-2xl' : 'px-5 py-3 text-base'
        }`}
      >
        下一張
        <ChevronRight className={big ? 'w-8 h-8' : 'w-5 h-5'} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => setShowTailo((v) => !v)}
        className={`rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
          big ? 'px-8 py-4 text-2xl' : 'px-5 py-3 text-sm md:text-base'
        }`}
      >
        {showTailo ? <EyeOff className={big ? 'w-8 h-8' : 'w-5 h-5'} strokeWidth={2.5} /> : <Eye className={big ? 'w-8 h-8' : 'w-5 h-5'} strokeWidth={2.5} />}
        {showTailo ? '遮住拼音' : '顯示拼音'}
      </button>

      {current && <SpeakButton word={current} big={big} />}
    </div>
  );

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        {card(true)}
        {controls(true)}
      </ProjectionStage>
    );
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={() => {
            setOrder(shuffled(order));
            setIdx(0);
            playSuccessSound();
          }}
          disabled={order.length === 0}
          className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" strokeWidth={2.5} />
          洗牌
        </button>
        <label className="flex items-center gap-2 text-cyan-100 font-black text-sm md:text-base cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showZh}
            onChange={(e) => setShowZh(e.target.checked)}
            className="w-5 h-5 accent-emerald-400 cursor-pointer"
          />
          顯示華語
        </label>
        <ShareQrButton title="台語大字卡" words={words} />
        <ProjectionButton onClick={projection.enter} />
      </div>

      {card(false)}
      {controls(false)}
      {panel}
    </Panel>
  );
}

// ─────────────────────────── 台語詞彙轉盤 ───────────────────────────

export function WheelTool() {
  const { words, panel } = useWordSource();
  const [display, setDisplay] = useState<Word | null>(null);
  const [locked, setLocked] = useState<Word | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const [skipUsed, setSkipUsed] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projection = useProjection();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pool = skipUsed ? words.filter((w) => !used.includes(w.han)) : words;

  const spin = () => {
    if (rolling || pool.length === 0) return;
    setRolling(true);
    setRevealed(false);
    setLocked(null);

    const TICKS = 26;
    let tick = 0;

    const step = () => {
      setDisplay(pool[Math.floor(Math.random() * pool.length)]);
      tick += 1;
      if (tick < TICKS) {
        timerRef.current = setTimeout(step, 50 + Math.pow(tick / TICKS, 3) * 320);
      } else {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        setDisplay(picked);
        setLocked(picked);
        setRolling(false);
        setUsed((prev) => [...prev, picked.han]);
        playSuccessSound();
      }
    };

    step();
  };

  const stage = (big: boolean) => (
    <div
      className={`w-full rounded-3xl border-4 flex flex-col items-center justify-center gap-4 transition-colors ${
        locked ? 'bg-emerald-950/40 border-emerald-400' : 'bg-[#030b17] border-cyan-500/40'
      } ${big ? 'flex-1 py-[5vh]' : 'py-12 md:py-16'}`}
    >
      <span className={`font-black text-white leading-none text-center break-all px-4 ${big ? 'text-[15vw]' : 'text-6xl md:text-8xl'}`}>
        {display?.han ?? '？'}
      </span>

      {/* 先讓學生唸，唸完老師再按「看拼音」揭曉，答案不要一開始就在螢幕上 */}
      {revealed && locked ? (
        <>
          <span className={`font-black text-amber-300 leading-none ${big ? 'text-[6vw]' : 'text-2xl md:text-4xl'}`}>
            {locked.tailo || '（無拼音）'}
          </span>
          <span className={`font-black text-cyan-200 ${big ? 'text-[3vw]' : 'text-base md:text-2xl'}`}>{locked.zh}</span>
        </>
      ) : (
        <span className={`font-black text-cyan-300/70 ${big ? 'text-[3vw]' : 'text-base md:text-xl'}`}>
          {locked ? '請學生先唸唸看' : rolling ? '轉盤轉動中…' : '按「轉一個詞」開始'}
        </span>
      )}
    </div>
  );

  const controls = (big: boolean) => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={spin}
        disabled={rolling || pool.length === 0}
        className={`rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${
          big ? 'px-10 py-5 text-3xl' : 'px-8 py-4 text-lg md:text-2xl'
        }`}
      >
        <Disc3 className={big ? 'w-10 h-10' : 'w-6 h-6'} strokeWidth={2.5} />
        {rolling ? '轉動中…' : '轉一個詞'}
      </button>

      <button
        onClick={() => {
          setRevealed((v) => !v);
          playPopSound();
        }}
        disabled={!locked}
        className={`rounded-2xl bg-amber-400 text-slate-950 font-black shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${
          big ? 'px-10 py-5 text-3xl' : 'px-6 py-4 text-base md:text-xl'
        }`}
      >
        {revealed ? <EyeOff className={big ? 'w-9 h-9' : 'w-5 h-5'} strokeWidth={2.5} /> : <Eye className={big ? 'w-9 h-9' : 'w-5 h-5'} strokeWidth={2.5} />}
        {revealed ? '蓋回去' : '看拼音'}
      </button>

      {locked && <SpeakButton word={locked} big={big} />}
    </div>
  );

  if (projection.projecting) {
    return (
      <ProjectionStage onExit={projection.exit}>
        {stage(true)}
        {controls(true)}
        <span className="font-black text-cyan-200 text-[1.8vw]">剩下 {pool.length} 個詞</span>
      </ProjectionStage>
    );
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <label className="flex items-center gap-2 text-cyan-100 font-black text-sm md:text-base cursor-pointer select-none">
          <input
            type="checkbox"
            checked={skipUsed}
            onChange={(e) => setSkipUsed(e.target.checked)}
            className="w-5 h-5 accent-emerald-400 cursor-pointer"
          />
          轉過的不再轉
        </label>
        <button
          onClick={() => {
            setUsed([]);
            playPopSound();
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer"
        >
          重置
        </button>
        <ShareQrButton title="台語詞彙轉盤" words={words} />
        <ProjectionButton onClick={projection.enter} />
      </div>

      {stage(false)}
      {controls(false)}

      <p className="text-center font-black text-cyan-200 text-sm md:text-base">
        剩下 {pool.length} 個詞可轉{used.length > 0 ? `，已轉 ${used.length} 個` : ''}
      </p>

      {panel}
    </Panel>
  );
}
