/**
 * favoriteStore.ts
 * ------------------------------------------------------------------
 * 使用者『我的單字本』收藏資料層。
 * 支援新增、刪除、檢查與跨組件同步。
 * 資料儲存在 localStorage `taiyu_favorite_vocab_v1`
 * ------------------------------------------------------------------
 */

export interface FavoriteWord {
  id?: string;          // 唯一識別，如 hanzi+tailo 或特定 key
  hanzi: string;       // 漢字 / 詞彙，如「鹿仔」、「爸」
  mandarin?: string;   // 華語說明 / 釋義，如「小鹿」、「父親」
  tailo: string;       // 台羅拼音，如「lau-á」、「bā」
  category?: string;   // 分類/來源，如「拼音單詞」、「鹿野觀察」、「日常用語」
  addedAt?: string;    // ISO 時間戳記
}

const STORAGE_KEY = 'taiyu_favorite_vocab_v1';
const EVENT_NAME = 'tai_lo_favorites_updated';

function safeGet(): FavoriteWord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function safeSet(list: FavoriteWord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    // ignore quota errors
  }
}

/** 取得所有已收藏的單字列表 */
export function getFavorites(): FavoriteWord[] {
  return safeGet();
}

/** 生成唯一 ID */
export function makeVocabId(hanzi: string, tailo: string): string {
  return `${hanzi.trim()}_${tailo.trim()}`;
}

/** 檢查是否已收藏 */
export function isFavorite(idOrHanzi: string, tailo?: string): boolean {
  const targetId = tailo ? makeVocabId(idOrHanzi, tailo) : idOrHanzi;
  const list = safeGet();
  return list.some((item) => item.id === targetId || (item.hanzi === idOrHanzi && (!tailo || item.tailo === tailo)));
}

/** 新增收藏單字 */
export function addFavorite(item: Omit<FavoriteWord, 'addedAt'>): FavoriteWord[] {
  const list = safeGet();
  const id = item.id || makeVocabId(item.hanzi, item.tailo);
  if (list.some((x) => x.id === id || (x.hanzi === item.hanzi && x.tailo === item.tailo))) {
    return list;
  }
  const newItem: FavoriteWord = {
    ...item,
    id,
    addedAt: new Date().toISOString(),
  };
  const updated = [newItem, ...list];
  safeSet(updated);
  return updated;
}

/** 取消/移除收藏單字 */
export function removeFavorite(idOrHanzi: string, tailo?: string): FavoriteWord[] {
  const targetId = tailo ? makeVocabId(idOrHanzi, tailo) : idOrHanzi;
  const list = safeGet();
  const updated = list.filter((item) => item.id !== targetId && !(item.hanzi === idOrHanzi && (!tailo || item.tailo === tailo)));
  safeSet(updated);
  return updated;
}

/** 切換收藏狀態（已收藏則移除，未收藏則加入），回傳更新後的收藏狀態 (boolean) */
export function toggleFavorite(item: Omit<FavoriteWord, 'addedAt'>): boolean {
  const id = item.id || makeVocabId(item.hanzi, item.tailo);
  if (isFavorite(id)) {
    removeFavorite(id);
    return false;
  } else {
    addFavorite({ ...item, id });
    return true;
  }
}
