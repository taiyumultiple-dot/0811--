import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// 課本真人錄音播放器。
//
// 網站原本的發音是瀏覽器語音合成（speakTaiyu）——沒有台語語音的裝置只能
// 用中文語音硬唸，聲調常常是錯的。這裡放的是《閩南語銜接教材－聽看覓》
// 的真人錄音，聲母、韻母、聲調都有對應的段落，會比合成音準得多。
//
// 檔案放在 public/audio/phonics/，用 BASE_URL 組網址，
// 這樣本機（/）跟 GitHub Pages（/0818-Taiwanese/）都指得到。

export type LessonTrackKey =
  | 'tone-system' | 'tone-sandhi-chart' | 'tone-derived' | 'tone-review'
  | 'initials-overview' | 'finals-overview'
  | `initial-${string}`;

/** 課本頁碼對照，讓老師知道這段錄音是課本的哪一頁 */
export const LESSON_TRACKS: Record<string, { label: string; page: string }> = {
  'tone-system': { label: '聲調系統', page: 'P.7' },
  'tone-sandhi-chart': { label: '變調圖', page: 'P.8' },
  'tone-derived': { label: '衍生調', page: 'P.9' },
  'initials-overview': { label: '聲母總覽', page: 'P.10–11' },
  'finals-overview': { label: '韻母總覽', page: 'P.12–13' },
  'tone-review': { label: '聲調和變調複習', page: 'P.30' },
  'initial-p': { label: '聲母 p', page: 'P.36' },
  'initial-ph': { label: '聲母 ph', page: 'P.37' },
  'initial-b': { label: '聲母 b', page: 'P.38' },
  'initial-m': { label: '聲母 m', page: 'P.39' },
  'initial-t': { label: '聲母 t', page: 'P.40' },
  'initial-th': { label: '聲母 th', page: 'P.41' },
  'initial-n': { label: '聲母 n', page: 'P.42' },
  'initial-l': { label: '聲母 l', page: 'P.43' },
  'initial-ts': { label: '聲母 ts', page: 'P.44' },
  'initial-tsh': { label: '聲母 tsh', page: 'P.45' },
  'initial-s': { label: '聲母 s', page: 'P.46' },
  'initial-j': { label: '聲母 j', page: 'P.47' },
  'initial-k': { label: '聲母 k', page: 'P.48' },
  'initial-kh': { label: '聲母 kh', page: 'P.49' },
  'initial-h': { label: '聲母 h', page: 'P.50' },
  'initial-g': { label: '聲母 g', page: 'P.51' },
  'initial-ng': { label: '聲母 ng', page: 'P.52' },
  'initial-zero': { label: '零聲母', page: 'P.53' },
};

export function hasLessonAudio(key: string): boolean {
  return key in LESSON_TRACKS;
}

function mmss(sec: number) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LessonAudio({
  trackKey,
  title,
  compact = false,
}: {
  trackKey: string;
  title?: string;
  compact?: boolean;
}) {
  const meta = LESSON_TRACKS[trackKey];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(0);
  const [len, setLen] = useState(0);

  useEffect(() => {
    // 換一段錄音時把上一段停掉，不然兩段會疊在一起播
    setPlaying(false);
    setAt(0);
    setLen(0);
  }, [trackKey]);

  if (!meta) return null;

  const src = `${import.meta.env.BASE_URL}audio/phonics/${trackKey}.mp3`;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true), () => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const restart = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().then(() => setPlaying(true), () => {});
  };

  const seek = (v: number) => {
    const el = audioRef.current;
    if (!el || !isFinite(len)) return;
    el.currentTime = (v / 100) * len;
    setAt(el.currentTime);
  };

  return (
    <div
      className={`rounded-2xl border-2 border-[#E4772E]/40 bg-[#FFF7EE] flex items-center gap-3 ${
        compact ? 'px-3 py-2' : 'px-4 py-3'
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onLoadedMetadata={(e) => setLen(e.currentTarget.duration)}
        onTimeUpdate={(e) => setAt(e.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false);
          setAt(0);
        }}
      />

      <button
        onClick={toggle}
        aria-label={playing ? `暫停 ${meta.label} 錄音` : `播放 ${meta.label} 錄音`}
        className="w-11 h-11 shrink-0 rounded-full bg-[#E4772E] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      >
        {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="font-black text-[#2D2A26] text-sm md:text-base truncate">
            🎧 {title ?? `課本錄音：${meta.label}`}
          </span>
          <span className="text-[#8A8378] font-bold text-xs shrink-0">課本 {meta.page}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={len ? (at / len) * 100 : 0}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={`${meta.label} 播放進度`}
            className="flex-1 h-1.5 accent-[#E4772E] cursor-pointer"
          />
          <span className="text-[#8A8378] font-bold text-xs tabular-nums shrink-0">
            {mmss(at)} / {mmss(len)}
          </span>
        </div>
      </div>

      <button
        onClick={restart}
        aria-label={`從頭播放 ${meta.label}`}
        className="w-9 h-9 shrink-0 rounded-xl border-2 border-[#E4772E]/40 text-[#E4772E] flex items-center justify-center hover:bg-[#E4772E]/10 active:scale-95 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
