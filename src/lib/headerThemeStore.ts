/**
 * headerThemeStore.ts
 * ------------------------------------------------------------------
 * 提供使用者即時「更換背景圖片」、「調整圖層遮罩」與「外框樣式」的功能。
 * 設定同步儲存至 localStorage `taiyu_header_theme_v1`。
 * ------------------------------------------------------------------
 */

export interface HeaderThemeSettings {
  // 圖片設定
  headerImage: string; // 自訂背景圖片 URL 或 Base64

  // 圖層 (Layer) 設定
  overlayColor: string; // 遮罩顏色, e.g. '#000000', '#4A2810', '#0F172A'
  overlayOpacity: number; // 遮罩透明度 0 ~ 100
  imageOpacity: number; // 圖片透明度 0 ~ 100
  blendMode: 'overlay' | 'multiply' | 'normal' | 'screen' | 'darken';
  blurPx: number; // 模糊效果 0 ~ 20

  // 外框 (Frame & Border) 設定
  showOuterBorder: boolean; // 是否顯示外框
  borderColor: string; // 邊框顏色
  borderWidthPx: number; // 邊框粗細 0 ~ 12
  borderRadiusPx: number; // 圓角大小 0 ~ 48
  shadowType: 'none' | 'sm' | 'md' | 'lg' | 'glow'; // 陰影
  
  // 內層標籤卡片與內容設定
  showCenterText: boolean; // 是否顯示中間關卡標題與聽題目文字
  showInnerBorder: boolean;
  innerBgColor: string; // 內層字卡背景色
}

export const DEFAULT_HEADER_THEME: HeaderThemeSettings = {
  headerImage: '',
  overlayColor: '#000000',
  overlayOpacity: 0,
  imageOpacity: 100,
  blendMode: 'normal',
  blurPx: 0,

  showOuterBorder: false,
  borderColor: '#FFE7C4',
  borderWidthPx: 0,
  borderRadiusPx: 24,
  shadowType: 'none',

  showCenterText: false,
  showInnerBorder: false,
  innerBgColor: 'transparent',
};

const STORAGE_KEY = 'taiyu_header_theme_v1';
const EVENT_NAME = 'tai_lo_header_theme_updated';

export function getHeaderTheme(): HeaderThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HEADER_THEME;
    const parsed = { ...DEFAULT_HEADER_THEME, ...JSON.parse(raw) };
    if (parsed.innerBgColor && (parsed.innerBgColor.includes('74, 40, 16') || parsed.innerBgColor.includes('4A2810'))) {
      parsed.innerBgColor = 'transparent';
      parsed.showInnerBorder = false;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_HEADER_THEME;
  }
}

export function saveHeaderTheme(settings: Partial<HeaderThemeSettings>): HeaderThemeSettings {
  try {
    const current = getHeaderTheme();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
    return updated;
  } catch (e) {
    return getHeaderTheme();
  }
}

export function resetHeaderTheme(): HeaderThemeSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    // ignore
  }
  return DEFAULT_HEADER_THEME;
}
