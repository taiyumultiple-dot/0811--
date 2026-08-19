// 首頁四大功能卡片的插圖。
//
// 原本是四張現成的立體圖示（a/b 積木、手把、音符、剪貼板），放在米白色框裡，
// 跟整站的深藍霓虹風格搭不起來，四張的筆觸也不一致。改成自己畫的向量插圖：
// 同一套幾何語言、同一組線寬，每張只吃該卡片的主色，深色背景上直接發亮。
// 純 SVG，沒有外部檔案，換色只要改 accent。

type ArtProps = { accent: string };

const FRAME = 'w-16 h-16 md:w-20 md:h-20';

/** 拼音學習：對話泡泡＋聲調符號 */
export function ArtPhonics({ accent }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={FRAME} fill="none" aria-hidden="true">
      <path
        d="M14 24a10 10 0 0110-10h48a10 10 0 0110 10v30a10 10 0 01-10 10H44L27 78V64h-3a10 10 0 01-10-10V24z"
        fill={accent}
        fillOpacity="0.16"
        stroke={accent}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* 三個聲調符號：陰平、上聲、去聲的手寫感 */}
      <path d="M28 32h12" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M44 34l10-8" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M58 26l10 8" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      {/* 底下一行「字」的示意 */}
      <path d="M28 48h40" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.85" />
      <path d="M28 48h14" stroke={accent} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** 互動遊戲：遊戲手把 */
export function ArtGame({ accent }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={FRAME} fill="none" aria-hidden="true">
      <path
        d="M30 28h36c11 0 18 9 20 22l3 16c1.6 8-4 13-10 13-5 0-8-3-11-7l-5-6H33l-5 6c-3 4-6 7-11 7-6 0-11.6-5-10-13l3-16c2-13 9-22 20-22z"
        fill={accent}
        fillOpacity="0.16"
        stroke={accent}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* 十字鍵 */}
      <path d="M32 52h14M39 45v14" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      {/* 兩顆按鈕 */}
      <circle cx="63" cy="47" r="5" fill={accent} />
      <circle cx="72" cy="57" r="5" fill="#fff" fillOpacity="0.9" />
    </svg>
  );
}

/** 動畫專區：螢幕＋播放鍵 */
export function ArtAnime({ accent }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={FRAME} fill="none" aria-hidden="true">
      <path d="M32 16l12 12M64 16L52 28" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      <rect
        x="12" y="28" width="72" height="50" rx="10"
        fill={accent}
        fillOpacity="0.16"
        stroke={accent}
        strokeWidth="4"
      />
      <path d="M41 44l20 9-20 9V44z" fill="#fff" />
      <path d="M12 68h72" stroke={accent} strokeWidth="4" strokeOpacity="0.6" />
    </svg>
  );
}

/** 學習紀錄：長條圖＋打勾 */
export function ArtRecord({ accent }: ArtProps) {
  return (
    <svg viewBox="0 0 96 96" className={FRAME} fill="none" aria-hidden="true">
      <rect
        x="14" y="16" width="68" height="64" rx="10"
        fill={accent}
        fillOpacity="0.16"
        stroke={accent}
        strokeWidth="4"
      />
      <path d="M28 62V48" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <path d="M42 62V38" stroke={accent} strokeWidth="7" strokeLinecap="round" />
      <path d="M56 62V30" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="70" cy="34" r="12" fill={accent} />
      <path d="M64 34l4.5 4.5L77 30" stroke="#04121f" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
