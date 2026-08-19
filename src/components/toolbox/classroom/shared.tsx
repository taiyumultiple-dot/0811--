import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Maximize2, X, Download, Upload } from 'lucide-react';

// 課堂小工具的共用零件：面板外框、班級名單、投影全螢幕。
// 這些工具都是老師在課堂上投影出來用的，所以共同的設計原則是
// 「後排同學看得到」：字級大、對比強、按鈕大顆。

export const ROSTER_KEY = 'taigi_classroom_roster';
export const TEAMS_KEY = 'taigi_classroom_teams';
export const SEATS_KEY = 'taigi_classroom_seats';
export const WORDS_KEY = 'taigi_classroom_words';

/** 把 textarea 的名單文字切成乾淨的名字陣列（一行一個、去空白、去重複） */
export function parseRoster(text: string): string[] {
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

export function readStored(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (e) {
    return fallback;
  }
}

export function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // localStorage 滿了或被停用時只是不能記住設定，不該讓整頁壞掉
    console.warn('無法儲存課堂小工具設定');
  }
}

/** Fisher-Yates 洗牌，回傳新陣列，不動到原本的 */
export function shuffled<T>(list: T[]): T[] {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/** 共用的面板外框，每個分頁長得一致 */
export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#FFFDF9] border-2 border-[#E7DFCF] rounded-3xl shadow-sm p-5 md:p-6 flex flex-col gap-5">
      {children}
    </div>
  );
}

// ─────────────────────────── 投影模式 ───────────────────────────

/**
 * 投影模式：把工具的主畫面獨立蓋成整片黑底大字，並且進入瀏覽器全螢幕。
 *
 * 為什麼不直接叫使用者按 F11：老師的畫面上還有頁首、分頁、設定欄，
 * F11 只是去掉瀏覽器外框，該小的字還是小。這裡是換一套「只有結果」的版面。
 * 全螢幕 API 被拒絕（例如某些 iPad）時仍然會蓋滿整個視窗，不會壞掉。
 */
export function useProjection() {
  const [projecting, setProjecting] = useState(false);

  const enter = useCallback(() => {
    setProjecting(true);
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        // 使用者拒絕或裝置不支援：維持蓋滿視窗的版面就好
      });
    }
  }, []);

  const exit = useCallback(() => {
    setProjecting(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // 使用者自己按 Esc 離開全螢幕時，版面也要跟著退回來
  useEffect(() => {
    if (!projecting) return;
    const onFsChange = () => {
      if (!document.fullscreenElement) setProjecting(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [projecting]);

  return { projecting, enter, exit };
}

export function ProjectionButton({ onClick, label = '投影模式' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      data-sound="pop"
      className="px-4 py-2.5 rounded-xl bg-[#F5F0E4] border-2 border-[#E7DFCF] text-[#5C5548] hover:text-[#3E2723] hover:bg-[#F1ECE0] font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center gap-2"
    >
      <Maximize2 className="w-4 h-4" strokeWidth={2.5} />
      {label}
    </button>
  );
}

/** 投影模式的黑底畫布，右上角固定一顆離開鈕 */
export function ProjectionStage({ onExit, children }: { onExit: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] bg-[#020814] flex flex-col items-center justify-center p-6 md:p-10 gap-6 select-none">
      <button
        onClick={onExit}
        aria-label="離開投影模式"
        className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-2xl bg-[#F5F0E4] border-2 border-[#E7DFCF] text-cyan-200 hover:text-[#3E2723] hover:bg-[#F1ECE0] transition-colors cursor-pointer z-10"
      >
        <X className="w-6 h-6" strokeWidth={2.5} />
      </button>
      {children}
    </div>
  );
}

// ─────────────────────────── 班級名單 ───────────────────────────

/**
 * 班級名單輸入框。抽籤、分組、座位表、搶答鈴共用同一份名單，
 * 貼一次四個工具都能用。匯出／匯入是為了換一台電腦（例如從辦公室
 * 換到教室的講桌機）時不必重打，資料只是一個純文字檔。
 */
export function RosterInput({
  value,
  onChange,
  count,
}: {
  value: string;
  onChange: (v: string) => void;
  count: number;
}) {
  const exportRoster = () => {
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '班級名單.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importRoster = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ''));
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="font-black text-[#3E2723] text-base md:text-lg flex items-center gap-2">
          <span>班級名單</span>
          <span className="text-xs md:text-sm text-cyan-200 font-extrabold">
            一行一個名字，共 {count} 人
          </span>
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={exportRoster}
            disabled={count === 0}
            className="px-3 py-2 rounded-xl bg-[#F5F0E4] border-2 border-[#E7DFCF] text-[#5C5548] hover:text-[#3E2723] hover:bg-[#F1ECE0] font-black text-xs md:text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            匯出
          </button>

          <label className="px-3 py-2 rounded-xl bg-[#F5F0E4] border-2 border-[#E7DFCF] text-[#5C5548] hover:text-[#3E2723] hover:bg-[#F1ECE0] font-black text-xs md:text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5">
            <Upload className="w-4 h-4" strokeWidth={2.5} />
            匯入
            <input
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={(e) => {
                importRoster(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={'王小明\n陳美玲\n林志豪'}
        className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF9] border-2 border-[#E7DFCF] focus:border-cyan-300 outline-hidden text-[#3E2723] font-black text-sm md:text-base placeholder:text-cyan-200/40 resize-y transition-colors"
      />
    </div>
  );
}
