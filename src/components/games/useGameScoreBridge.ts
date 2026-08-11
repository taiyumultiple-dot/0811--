import { useEffect, useRef } from 'react';
import { recordGameResult } from '../../lib/progressStore';

/**
 * useGameScoreBridge
 * ------------------------------------------------------------------
 * 讓「獨立 HTML 遊戲（iframe 嵌入）」把分數回報給 React／progressStore。
 *
 * 使用方式（在遊戲的 HTML/JS 裡）：
 *   window.parent.postMessage({
 *     type: 'TAIYU_GAME_RESULT',
 *     gameKey: 'game1',      // 對應 gamesData.ts 裡的 key
 *     score: 1234,
 *     accuracy: 92           // 0-100，可省略
 *   }, window.location.origin);
 *
 * 這個 hook 掛在包裝該遊戲的 React 元件裡（例如 Game1FoodMatch.tsx），
 * 收到訊息後會自動寫入 progressStore，並在拿到「新徽章」時回呼 onBadges。
 * ------------------------------------------------------------------
 */
export function useGameScoreBridge(gameKey: string, onBadges?: (badgeTitles: string[]) => void) {
  const savedOnBadges = useRef(onBadges);
  savedOnBadges.current = onBadges;

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.type !== 'TAIYU_GAME_RESULT') return;
      // 只接受該元件自己負責的關卡，避免同時開多個遊戲時互相干擾
      if (data.gameKey && data.gameKey !== gameKey) return;

      const score = Number(data.score) || 0;
      const accuracy = data.accuracy != null ? Number(data.accuracy) : undefined;

      const result = recordGameResult({ gameKey, score, accuracy });
      if (result.newlyEarnedBadges.length > 0) {
        savedOnBadges.current?.(result.newlyEarnedBadges.map((b) => `${b.icon} ${b.title}`));
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameKey]);
}
