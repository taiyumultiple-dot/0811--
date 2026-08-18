import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

// 課本真人錄音播放器。
//
// 2026-08-18 重建：這批音檔跟旁邊的聲母／韻母／聲調內容現在是同一個
// 來源（《臺灣台語銜接教材》課本頁碼），不像之前版本音檔跟文字各自
// 對到不同的例字組。檔案放在 public/audio/phonics/。

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

export default function LessonAudio({
  trackKey,
  title,
  compact = false,
  attached = false,
}: {
  trackKey: string;
  title?: string;
  compact?: boolean;
  /** 直接接在投影片圖片下緣、共用同一個外框卡片時用——拿掉自己的圓角／邊框，
   *  不留間距，靠外層卡片的 overflow-hidden 裁出底部圓角。 */
  attached?: boolean;
}) {
  const meta = LESSON_TRACKS[trackKey];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  if (!meta) return null;

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

  return (
    <div
      className={`bg-[#FFF7EE] flex items-center gap-3 ${
        attached ? 'px-4 py-3' : `rounded-2xl border-2 border-[#E4772E]/40 ${compact ? 'px-3 py-2' : 'px-4 py-3'}`
      }`}
    >
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/phonics/${trackKey}.mp3`}
        preload="none"
        onEnded={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        aria-label={playing ? `暫停 ${meta.label} 錄音` : `播放 ${meta.label} 錄音`}
        className="w-12 h-12 shrink-0 rounded-full bg-[#E4772E] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      >
        {playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
      </button>
      <div className="flex flex-col">
        <span className="font-black text-[#2D2A26] text-base">🎧 {title ?? `課本錄音：${meta.label}`}</span>
        <span className="text-[#8A8378] font-bold text-sm">課本 {meta.page}</span>
      </div>
    </div>
  );
}
