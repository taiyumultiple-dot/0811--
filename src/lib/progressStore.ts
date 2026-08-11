/**
 * progressStore.ts
 * ------------------------------------------------------------------
 * 統一的學生學習進度資料層（單一真相來源）。
 *
 * 為什麼需要這個檔案：
 * 在這之前，「遊戲分數」「學習紀錄 (RecordPage)」「教師後台 (TeacherDashboard /
 * classDataStore)」是三套互不相通的資料，遊戲玩完分數不會存到任何地方。
 * 這個檔案負責把「玩家是誰」「玩了哪些關卡、拿了幾分、連續玩了幾天」
 * 統一記錄下來，之後 RecordPage、GamesHub（關卡地圖）、TeacherDashboard
 * 都改讀這裡的資料，而不是各自的假資料。
 *
 * 資料儲存在 localStorage，key 為 `taiyu_progress_v1`，
 * 內容是 Record<userId, UserProgress>，userId 由 getCurrentUserId() 決定。
 * ------------------------------------------------------------------
 */

import { recordStudentActivity } from './classDataStore';
import { GAMES } from '../components/games/gamesData';

const STORAGE_KEY = 'taiyu_progress_v1';
const ANON_ID_KEY = 'taiyu_anon_id';

export interface GamePlayRecord {
  gameKey: string;
  bestScore: number;
  lastScore: number;
  playCount: number;
  bestAccuracy?: number;
  lastPlayedAt: string; // ISO timestamp
}

export interface StreakInfo {
  current: number;      // 目前連續天數
  longest: number;      // 歷史最長連續天數
  lastActiveDate: string; // YYYY-MM-DD，最後一次有進度的日期
}

export interface UserProgress {
  userId: string;
  userName: string;
  games: Record<string, GamePlayRecord>;
  streak: StreakInfo;
  totalPlays: number;
  updatedAt: string;
}

export interface BadgeDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  check: (p: UserProgress) => boolean;
}

// ---------------------------------------------------------------
// 徽章定義：之後要新增徽章，只要在這個陣列加一筆規則即可
// ---------------------------------------------------------------
export const BADGES: BadgeDef[] = [
  { id: 'first_play', title: '初次冒險', desc: '完成第一次遊戲挑戰', icon: '🎮', check: (p) => p.totalPlays >= 1 },
  { id: 'five_games', title: '關卡探索者', desc: '玩過 5 款不同的遊戲', icon: '🗺️', check: (p) => Object.keys(p.games).length >= 5 },
  { id: 'all_games', title: '全關卡達人', desc: '玩過全部關卡', icon: '🏆', check: (p) => Object.keys(p.games).length >= GAMES.length },
  { id: 'streak_3', title: '連續三天', desc: '連續 3 天登入學習', icon: '🔥', check: (p) => p.streak.longest >= 3 },
  { id: 'streak_7', title: '一週不間斷', desc: '連續 7 天登入學習', icon: '⚡', check: (p) => p.streak.longest >= 7 },
  { id: 'high_scorer', title: '高分玩家', desc: '單一關卡分數突破 5000', icon: '⭐', check: (p) => Object.values(p.games).some((g) => g.bestScore >= 5000) },
  { id: 'practice_maker', title: '勤奮練習生', desc: '總遊玩次數達 20 次', icon: '💪', check: (p) => p.totalPlays >= 20 },
];

// ---------------------------------------------------------------
// 使用者識別
// ---------------------------------------------------------------
function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore quota / privacy mode errors */ }
}

function getOrCreateAnonId(): string {
  let id = safeGet(ANON_ID_KEY);
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2, 10);
    safeSet(ANON_ID_KEY, id);
  }
  return id;
}

function readCurrentUser(): { name?: string; email?: string } | null {
  const raw = safeGet('tai_lo_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/** 目前使用者的唯一識別（已登入用 email/name，訪客用裝置端匿名 id） */
export function getCurrentUserId(): string {
  const u = readCurrentUser();
  if (u?.email) return `user_${u.email}`;
  if (u?.name) return `user_${u.name}`;
  return getOrCreateAnonId();
}

/** 目前使用者的顯示名稱 */
export function getCurrentUserName(): string {
  const u = readCurrentUser();
  return u?.name || '訪客學習者';
}

// ---------------------------------------------------------------
// 讀寫底層資料
// ---------------------------------------------------------------
function readAll(): Record<string, UserProgress> {
  const raw = safeGet(STORAGE_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function writeAll(all: Record<string, UserProgress>): void {
  safeSet(STORAGE_KEY, JSON.stringify(all));
}

function todayStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

function emptyProgress(userId: string, userName: string): UserProgress {
  return {
    userId,
    userName,
    games: {},
    streak: { current: 0, longest: 0, lastActiveDate: '' },
    totalPlays: 0,
    updatedAt: new Date().toISOString(),
  };
}

/** 取得目前使用者的完整進度（不存在時回傳空白進度，不會寫入） */
export function getUserProgress(userId: string = getCurrentUserId()): UserProgress {
  const all = readAll();
  return all[userId] || emptyProgress(userId, getCurrentUserName());
}

// ---------------------------------------------------------------
// 核心：紀錄一次遊戲結果
// ---------------------------------------------------------------
export interface RecordResultInput {
  gameKey: string;
  score: number;
  accuracy?: number; // 0-100
}

export interface RecordResultOutput {
  progress: UserProgress;
  newlyEarnedBadges: BadgeDef[];
  isNewBestScore: boolean;
  streakIncreased: boolean;
}

export function recordGameResult(input: RecordResultInput): RecordResultOutput {
  const userId = getCurrentUserId();
  const userName = getCurrentUserName();
  const all = readAll();
  const prev = all[userId] || emptyProgress(userId, userName);
  const prevBadgeIds = new Set(BADGES.filter((b) => b.check(prev)).map((b) => b.id));

  const today = todayStr();
  const existingGame = prev.games[input.gameKey];
  const isNewBestScore = !existingGame || input.score > existingGame.bestScore;

  const updatedGame: GamePlayRecord = {
    gameKey: input.gameKey,
    bestScore: existingGame ? Math.max(existingGame.bestScore, input.score) : input.score,
    lastScore: input.score,
    playCount: (existingGame?.playCount || 0) + 1,
    bestAccuracy: input.accuracy != null
      ? Math.max(existingGame?.bestAccuracy ?? 0, input.accuracy)
      : existingGame?.bestAccuracy,
    lastPlayedAt: new Date().toISOString(),
  };

  // streak 計算：同一天不重複累加；昨天有玩則 +1；中斷過則重置為 1
  let streak = { ...prev.streak };
  let streakIncreased = false;
  if (streak.lastActiveDate === today) {
    // 今天已經算過了，不變動
  } else if (streak.lastActiveDate && daysBetween(streak.lastActiveDate, today) === 1) {
    streak.current += 1;
    streakIncreased = true;
  } else {
    streak.current = 1;
    streakIncreased = true;
  }
  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastActiveDate = today;

  const next: UserProgress = {
    ...prev,
    userName,
    games: { ...prev.games, [input.gameKey]: updatedGame },
    streak,
    totalPlays: prev.totalPlays + 1,
    updatedAt: new Date().toISOString(),
  };

  all[userId] = next;
  writeAll(all);

  const newlyEarnedBadges = BADGES.filter((b) => !prevBadgeIds.has(b.id) && b.check(next));

  // 盡力而為：同步一份到教師後台的班級資料，讓 TeacherDashboard 也能看到真實動態
  // （找不到對應班級/學生時，classDataStore 內部會建立一筆新的，不會拋出錯誤）
  try {
    const gameMeta = GAMES.find((g) => g.key === input.gameKey);
    recordStudentActivity({
      studentName: userName,
      gameName: gameMeta?.title || input.gameKey,
      scoreAdded: input.score,
      accuracy: input.accuracy,
    });
  } catch {
    // 教師後台同步失敗不應影響學生端的紀錄流程
  }

  return { progress: next, newlyEarnedBadges, isNewBestScore, streakIncreased };
}

/** 目前使用者已獲得的徽章清單 */
export function getEarnedBadges(userId: string = getCurrentUserId()): BadgeDef[] {
  const p = getUserProgress(userId);
  return BADGES.filter((b) => b.check(p));
}

/** 玩過的關卡數 / 總關卡數，方便顯示「完成度」 */
export function getCompletionStats(userId: string = getCurrentUserId()): { played: number; total: number } {
  const p = getUserProgress(userId);
  return { played: Object.keys(p.games).length, total: GAMES.length };
}
