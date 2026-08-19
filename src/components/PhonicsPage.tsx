import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Award,
  Megaphone,
  Music,
  PenTool,
  Sparkles,
  Info,
  Keyboard,
  Type,
  BookMarked,
  Compass,
  ChevronLeft,
  Home
} from 'lucide-react';
import { logoMark, frogDecor, heroFull } from '../assets/images/homepage';
import { HubShell } from './games/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import {
  TONES_DATA, INITIAL_GROUPS, INITIALS_DATA,
  FINAL_GROUPS, type InitialSymbol, type Tone,
  SCHEME_INTRO_LINKS, INPUT_METHODS, CHAR_USAGE_NOTE, DICTIONARIES, LEARNING_RESOURCE_HUB,
  SLIDE_SECTIONS, slideUrl, SLIDE_AUDIO,
  SLIDE_SECTIONS_PRACTICE, slidePracticeUrl, SLIDE_AUDIO_PRACTICE,
  SLIDE_GROUPS, SLIDE_GROUPS_PRACTICE, groupContaining, type SlideGroup,
} from '../data/phonicsData';
import LessonAudio, { type LessonAudioHandle } from './LessonAudio';

/** 拼音練習頁用：依臺羅標調規則把韻母＋聲調組合成正確拼字，不需要每個組合都湊例字 */
function applyTaiLoTone(final: string, tone: Tone): string {
  const TONE_MARKS: Record<number, string> = { 2: '́', 3: '̀', 5: '̂', 7: '̄', 8: '̍' };
  const entering = /[ptkh]$/.test(final);
  if (tone === 1 || (tone === 4 && entering)) return final;
  const mark = TONE_MARKS[tone];
  if (!mark) return final;
  // 獨立鼻音 ng／m 當韻母時，調號標在 n（ng）或 m 本身
  if (final === 'ng') return ('n' + mark).normalize('NFC') + 'g';
  if (final === 'm') return ('m' + mark).normalize('NFC');
  let idx = final.startsWith('oo') ? 0 : -1;
  if (idx === -1) idx = [...final].findIndex((c) => 'aoe'.includes(c));
  if (idx === -1) {
    // 只有 i／u：標在後面那個母音上（如 ui -> uì、iu -> iù）
    const positions = [...final].map((c, i) => ('iu'.includes(c) ? i : -1)).filter((i) => i >= 0);
    idx = positions.length ? positions[positions.length - 1] : -1;
  }
  if (idx === -1) return final;
  const chars = [...final];
  chars[idx] = (chars[idx] + mark).normalize('NFC');
  return chars.join('');
}



export default function PhonicsPage({
  onNavigate,
  initialTab = 'phonics_scheme'
}: {
  onNavigate: (view: string) => void;
  initialTab?: string;
}) {
  const [activeSidebar, setActiveSidebar] = useState<string>(initialTab);

  // 讓使用者直接點投影片圖片（課本設計稿上的「仔細聽」耳機圖示）就能播放課本錄音，
  // 不用另外找下面／上面那顆播放鈕。兩本課本各自同時只會顯示一顆 LessonAudio。
  const introAudioRef = useRef<LessonAudioHandle>(null);
  const practiceAudioRef = useRef<LessonAudioHandle>(null);

  /** 這一節（投影片 lo~hi）裡面有哪幾個課本頁 */
  const sectionGroups = (all: SlideGroup[], lo: number, hi: number) =>
    all.filter((g) => g.slides[0] >= lo && g.slides[g.slides.length - 1] <= hi);

  // --- 拼音方案總覽頁：入門篇 / 練習篇兩本課本切換，各自跟 pptx 節次一致，一頁課本一頁的播放感 ---
  const [book, setBook] = useState<'intro' | 'practice'>('intro');

  const [schemeTab, setSchemeTab] = useState<
    'intro' | 'tones' | 'scheme' | 'input' | 'chars' | 'dict' | 'resources'
  >('intro');
  const tabSlideRange = (tab: string): [number, number] => {
    const secs = SLIDE_SECTIONS.filter((s) => s.tab === tab);
    return [Math.min(...secs.map((s) => s.range[0])), Math.max(...secs.map((s) => s.range[1]))];
  };
  const [slideNum, setSlideNum] = useState<number>(1);
  const goToScheme = (tab: typeof schemeTab) => {
    setSchemeTab(tab);
    setSlideNum(tabSlideRange(tab)[0]);
  };

  // --- 練習篇：課本 PART2，5 段（暖身／聲調變調／聲母韻母／調號書寫／逐聲母練習） ---
  const [practiceTab, setPracticeTab] = useState<
    'warmup' | 'tones' | 'initials_finals' | 'tone_marks' | 'drills'
  >('warmup');
  const practiceTabRange = (tab: string): [number, number] => {
    const secs = SLIDE_SECTIONS_PRACTICE.filter((s) => s.tab === tab);
    return [Math.min(...secs.map((s) => s.range[0])), Math.max(...secs.map((s) => s.range[1]))];
  };
  const [practiceSlideNum, setPracticeSlideNum] = useState<number>(1);
  const goToPracticeTab = (tab: typeof practiceTab) => {
    setPracticeTab(tab);
    setPracticeSlideNum(practiceTabRange(tab)[0]);
  };

  // 左右鍵翻頁，像真的在放 PPT 一樣。兩本課本都以「課本頁」為單位翻，
  // 同一頁課本被拆成的那幾張投影片是一起顯示的，所以翻頁要跳到下一組的第一張。
  useEffect(() => {
    if (activeSidebar !== 'phonics_scheme') return;
    const intro = book === 'intro';
    const [lo, hi] = intro ? tabSlideRange(schemeTab) : practiceTabRange(practiceTab);
    const all = intro ? SLIDE_GROUPS : SLIDE_GROUPS_PRACTICE;
    const tabGroups = sectionGroups(all, lo, hi);
    const setNum = intro ? setSlideNum : setPracticeSlideNum;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      setNum((n) => {
        const group = groupContaining(all, n);
        const pos = tabGroups.findIndex((g) => g.slides[0] === group.slides[0]);
        if (e.key === 'ArrowRight') return pos < tabGroups.length - 1 ? tabGroups[pos + 1].slides[0] : hi;
        return pos > 0 ? tabGroups[pos - 1].slides[0] : lo;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSidebar, book, schemeTab, practiceTab]);

  // --- 韻母學習 ---
  const [expandedFinalGroup, setExpandedFinalGroup] = useState<string | null>(FINAL_GROUPS[0].group);

  // --- 拼音練習：聲母＋韻母＋聲調組合器 ---
  const [comboInitial, setComboInitial] = useState<InitialSymbol>('p');
  const [comboFinal, setComboFinal] = useState('a');
  const [comboTone, setComboTone] = useState<Tone>(1);

  // 側欄拿掉了（跟頂部導覽列的「拼音學習」「動畫專區」重複），改由 initialTab
  // 這個 prop 直接決定要顯示哪個分頁；頂部導覽列換頁時 initialTab 會變，
  // 這裡要跟著同步，不然使用者從動畫專區點回拼音學習會沒反應。
  useEffect(() => {
    setActiveSidebar(initialTab);
  }, [initialTab]);

  return (
    <HubShell activeKey={activeSidebar} onHome={() => onNavigate('home')}>
      {/* ---------------- Main Content Body ---------------- */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 bg-white rounded-3xl p-5 md:p-7 shadow-sm flex flex-col">
          <AnimatePresence mode="wait">
            {activeSidebar === 'phonics_scheme' && (
              <motion.div
                key="phonics_scheme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="pb-2">
                  <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                    <span className="text-3xl">📖</span> 臺灣台語羅馬字拼音方案
                  </h1>
                  <p className="text-[#8A8378] text-base">
                    {book === 'intro'
                      ? '教育部民國 95 年公布的官方拼音系統，簡稱「臺羅」。分成壹～柒節，照課本順序一頁一頁學。'
                      : '課本 PART2 練習篇：暖身活動、聲調變調練習、聲母韻母學習步驟、調號書寫，最後逐個聲母「10 分鐘練武功」。'}
                  </p>
                </div>

                <div className="flex gap-2 bg-white border-2 border-[#EFE8D8] p-1.5 rounded-2xl w-fit">
                  {([
                    ['intro', '📘 入門篇'],
                    ['practice', '✏️ 練習篇'],
                  ] as const).map(([b, label]) => (
                    <button
                      key={b}
                      onClick={() => setBook(b)}
                      className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all active:scale-95 ${
                        book === b
                          ? 'bg-[#2D2A26] text-white shadow-md'
                          : 'text-[#5C5548] hover:bg-[#FAF8F2]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {book === 'intro' && (
                <>
                <div className="flex gap-2 bg-[#FAF8F2] p-1.5 rounded-2xl w-fit flex-wrap">
                  {([
                    ['intro', '壹．認識方案', Info],
                    ['tones', '貳．聲調與變調', Sparkles],
                    ['scheme', '參．聲母與韻母', Megaphone],
                    ['input', '肆．常用輸入法', Keyboard],
                    ['chars', '伍．漢字使用規範', Type],
                    ['dict', '陸．辭典使用指南', BookMarked],
                    ['resources', '柒．學習資源綜合包', Compass],
                  ] as const).map(([tab, label, TabIcon]) => (
                    <button
                      key={tab}
                      onClick={() => goToScheme(tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all active:scale-95 ${
                        schemeTab === tab
                          ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                          : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                      }`}
                    >
                      <TabIcon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex flex-col gap-8">
                  {(() => {
                    const [lo, hi] = tabSlideRange(schemeTab);
                    const n = Math.min(Math.max(slideNum, lo), hi);
                    const group = groupContaining(SLIDE_GROUPS, n);
                    const sec = SLIDE_SECTIONS.filter((s) => s.tab === schemeTab).find((s) => n >= s.range[0] && n <= s.range[1]);
                    const audio = SLIDE_AUDIO.find((a) => group.slides.includes(a.afterSlide));
                    // 這一節裡的課本頁清單（同一頁課本的投影片已經合併成一組）
                    const tabGroups = sectionGroups(SLIDE_GROUPS, lo, hi);
                    const pos = tabGroups.findIndex((g) => g.slides[0] === group.slides[0]);
                    const goPrev = () => setSlideNum(pos > 0 ? tabGroups[pos - 1].slides[0] : lo);
                    const goNext = () => setSlideNum(pos < tabGroups.length - 1 ? tabGroups[pos + 1].slides[0] : hi);
                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {sec?.title && <h3 className="font-black text-[#3E2723] text-lg">{sec.title}</h3>}
                          {group.page && <span className="font-black text-[#8A8378] text-sm">課本 {group.page}</span>}
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-[#EFE8D8] shadow-md">
                          {audio && <LessonAudio ref={introAudioRef} trackKey={audio.trackKey} attached />}
                          {group.slides.map((slideN) => (
                            <div
                              key={slideN}
                              className={`bg-[#1a1a1a] ${audio ? 'cursor-pointer' : ''}`}
                              onClick={audio ? () => introAudioRef.current?.toggle() : undefined}
                              role={audio ? 'button' : undefined}
                              aria-label={audio ? '播放課本錄音' : undefined}
                            >
                              <img
                                src={`${import.meta.env.BASE_URL}${slideUrl(slideN)}`}
                                alt={`課本入門篇${group.page ? ' ' + group.page : ''}（第 ${slideN} 張）`}
                                className="w-full h-auto block"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between bg-[#FAF8F2] rounded-2xl px-4 py-3">
                          <button
                            onClick={goPrev}
                            disabled={pos <= 0}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#EFE8D8] font-black text-sm text-[#5C5548] hover:border-[#4E9B5D] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" /> 上一頁
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSlideNum(lo)}
                              className="w-10 h-10 rounded-full bg-white border border-[#EFE8D8] flex items-center justify-center hover:border-[#4E9B5D] active:scale-95 transition-all shadow-sm"
                              aria-label="回到本節第一頁"
                            >
                              <Home className="w-4 h-4 text-[#5C5548]" />
                            </button>
                            <span className="font-mono font-black text-[#8A8378] text-sm">{pos + 1} / {tabGroups.length}</span>
                          </div>

                          <button
                            onClick={goNext}
                            disabled={pos >= tabGroups.length - 1}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4E9B5D] text-white font-black text-sm hover:bg-[#3E8552] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            下一頁 <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {schemeTab === 'intro' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SCHEME_INTRO_LINKS.map((l) => (
                        <a
                          key={l.title}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-5 rounded-2xl border border-[#EFE8D8] shadow-sm hover:border-[#4E9B5D] hover:shadow-md transition-all flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[#2D2A26] text-base">{l.title}</span>
                            <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                          </div>
                          <p className="text-sm text-[#8A8378]">{l.desc}</p>
                        </a>
                      ))}
                    </div>
                  )}

                  {schemeTab === 'scheme' && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="font-black text-[#3E2723] text-lg mb-3">延伸練習：韻母查詢（課本官方對照表）</h3>
                        <div className="flex flex-col gap-3">
                          {FINAL_GROUPS.map((g) => {
                            const isOpen = expandedFinalGroup === g.group;
                            return (
                              <div key={g.group} className="bg-white rounded-2xl border border-[#EFE8D8] shadow-sm overflow-hidden">
                                <button
                                  onClick={() => setExpandedFinalGroup(isOpen ? null : g.group)}
                                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAF8F2] transition-colors"
                                >
                                  <span className="font-black text-[#3E2723]">{g.group}</span>
                                  <span className="flex items-center gap-2 text-sm text-[#8A8378] font-bold">
                                    共 {g.items.length} 個
                                    <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                  </span>
                                </button>
                                {isOpen && (
                                  <div className="px-5 pb-5 flex flex-wrap gap-2">
                                    {g.items.map((it) => (
                                      <div key={it.symbol} className="px-3.5 py-2.5 rounded-xl bg-[#FFF9EC] border border-[#EFE8D8] flex items-baseline gap-2">
                                        <span className="font-mono font-black text-[#2D2A26] text-base">{it.symbol}</span>
                                        <span className="text-sm text-[#8A8378] font-bold">{it.desc}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-[#3E2723] text-lg mb-3">延伸練習：拼音組合器</h3>
                        <div className="max-w-2xl bg-[#FCFAF5] rounded-3xl border border-[#EFE8D8] p-6 flex flex-col gap-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">聲母</div>
                              <select
                                value={comboInitial}
                                onChange={(e) => setComboInitial(e.target.value as InitialSymbol)}
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EFE8D8] font-mono font-black text-[#2D2A26] bg-white"
                              >
                                {INITIAL_GROUPS.flatMap((g) => g.symbols).map((sym) => (
                                  <option key={sym} value={sym}>{INITIALS_DATA[sym].label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">韻母</div>
                              <select
                                value={comboFinal}
                                onChange={(e) => setComboFinal(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EFE8D8] font-mono font-black text-[#2D2A26] bg-white"
                              >
                                {FINAL_GROUPS.flatMap((g) => g.items).map((it) => (
                                  <option key={it.symbol} value={it.symbol}>{it.symbol}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">聲調</div>
                              <select
                                value={comboTone}
                                onChange={(e) => setComboTone(Number(e.target.value) as Tone)}
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EFE8D8] font-mono font-black text-[#2D2A26] bg-white"
                              >
                                {TONES_DATA.map((t) => (
                                  <option key={t.tone} value={t.tone}>第 {t.tone} 聲</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl border-2 border-[#4E9B5D]/30 p-6 flex flex-col items-center gap-2">
                            <div className="text-sm font-black text-[#8A8378] tracking-widest">拼字結果</div>
                            <div className="text-5xl font-black text-[#4E9B5D] font-mono">
                              {comboInitial === 'zero' ? '' : INITIALS_DATA[comboInitial].label}
                              {applyTaiLoTone(comboFinal, comboTone)}
                            </div>
                            <div className="text-sm text-[#8A8378]">
                              {(comboInitial === 'zero' ? '' : INITIALS_DATA[comboInitial].label)} + {comboFinal} + 第{comboTone}聲
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {schemeTab === 'input' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {INPUT_METHODS.map((m) => (
                          <a
                            key={m.name}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-sm hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-black text-[#2D2A26] text-sm">{m.name}</div>
                              <div className="text-xs text-[#8A8378] mt-0.5">{m.platform}</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {schemeTab === 'chars' && (
                    <div className="flex flex-col gap-2.5">
                      {CHAR_USAGE_NOTE.resources.map((r) => (
                        <a
                          key={r.title}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-4 rounded-2xl border border-[#EFE8D8] hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-black text-[#2D2A26] text-sm">{r.title}</div>
                            <div className="text-sm text-[#8A8378] mt-0.5">{r.desc}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {schemeTab === 'dict' && (
                    <div className="flex flex-col gap-2.5">
                      {DICTIONARIES.map((d) => (
                        <a
                          key={d.name}
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-4 rounded-2xl border border-[#EFE8D8] hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                        >
                          <div className="font-black text-[#2D2A26] text-sm">{d.name}</div>
                          <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {schemeTab === 'resources' && (
                    <a
                      href={LEARNING_RESOURCE_HUB.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-4 rounded-2xl border border-[#EFE8D8] hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="font-black text-[#2D2A26] text-sm">{LEARNING_RESOURCE_HUB.title}</div>
                      <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                    </a>
                  )}
                </div>
                </>
                )}

                {book === 'practice' && (
                <>
                <div className="flex gap-2 bg-[#FAF8F2] p-1.5 rounded-2xl w-fit flex-wrap">
                  {([
                    ['warmup', '暖身：講我的名', Info],
                    ['tones', '聲調與變調練習', Sparkles],
                    ['initials_finals', '聲母韻母學習步驟', Megaphone],
                    ['tone_marks', '調號書寫練習', PenTool],
                    ['drills', '逐聲母例字', Award],
                  ] as const).map(([tab, label, TabIcon]) => (
                    <button
                      key={tab}
                      onClick={() => goToPracticeTab(tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all active:scale-95 ${
                        practiceTab === tab
                          ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                          : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                      }`}
                    >
                      <TabIcon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex flex-col gap-8">
                  {(() => {
                    const [lo, hi] = practiceTabRange(practiceTab);
                    const n = Math.min(Math.max(practiceSlideNum, lo), hi);
                    const group = groupContaining(SLIDE_GROUPS_PRACTICE, n);
                    const sec = SLIDE_SECTIONS_PRACTICE.filter((s) => s.tab === practiceTab).find((s) => n >= s.range[0] && n <= s.range[1]);
                    const audio = SLIDE_AUDIO_PRACTICE.find((a) => group.slides.includes(a.afterSlide));
                    // 本節內的課本頁清單（同一頁課本的投影片已經合併成一組）
                    const tabGroups = sectionGroups(SLIDE_GROUPS_PRACTICE, lo, hi);
                    const pos = tabGroups.findIndex((g) => g.slides[0] === group.slides[0]);
                    const goPrev = () => setPracticeSlideNum(pos > 0 ? tabGroups[pos - 1].slides[0] : lo);
                    const goNext = () => setPracticeSlideNum(pos < tabGroups.length - 1 ? tabGroups[pos + 1].slides[0] : hi);
                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {sec?.title && <h3 className="font-black text-[#3E2723] text-lg">{sec.title}</h3>}
                          {group.page && <span className="font-black text-[#8A8378] text-sm">課本 {group.page}</span>}
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-[#EFE8D8] shadow-md">
                          {audio && <LessonAudio ref={practiceAudioRef} trackKey={audio.trackKey} attached />}
                          {group.slides.map((slideN) => (
                            <div
                              key={slideN}
                              className={`bg-[#1a1a1a] ${audio ? 'cursor-pointer' : ''}`}
                              onClick={audio ? () => practiceAudioRef.current?.toggle() : undefined}
                              role={audio ? 'button' : undefined}
                              aria-label={audio ? '播放課本錄音' : undefined}
                            >
                              <img
                                src={`${import.meta.env.BASE_URL}${slidePracticeUrl(slideN)}`}
                                alt={`課本練習篇${group.page ? ' ' + group.page : ''}（第 ${slideN} 張）`}
                                className="w-full h-auto block"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between bg-[#FAF8F2] rounded-2xl px-4 py-3">
                          <button
                            onClick={goPrev}
                            disabled={pos <= 0}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#EFE8D8] font-black text-sm text-[#5C5548] hover:border-[#4E9B5D] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" /> 上一頁
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setPracticeSlideNum(lo)}
                              className="w-10 h-10 rounded-full bg-white border border-[#EFE8D8] flex items-center justify-center hover:border-[#4E9B5D] active:scale-95 transition-all shadow-sm"
                              aria-label="回到本節第一頁"
                            >
                              <Home className="w-4 h-4 text-[#5C5548]" />
                            </button>
                            <span className="font-mono font-black text-[#8A8378] text-sm">{pos + 1} / {tabGroups.length}</span>
                          </div>

                          <button
                            onClick={goNext}
                            disabled={pos >= tabGroups.length - 1}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4E9B5D] text-white font-black text-sm hover:bg-[#3E8552] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            下一頁 <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </HubShell>
  );
}
