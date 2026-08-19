import {
  iconGame1,
  iconGame2,
  iconGame3,
  iconGame4,
  iconGame5,
  iconGame6,
  iconGame7,
  iconGame8,
  iconGame9,
  iconGame10,
} from '../../assets/images/games';

export type GameCategory = 'situational' | 'outdoor' | 'life';

export interface GameMeta {
  id: number;
  key: string;
  title: string;
  desc: string;
  icon?: string;
  category: GameCategory;
}

export const GAMES: GameMeta[] = [
  { id: 1, key: 'game1', title: '太空台語生存戰', desc: '收集正確詞卡，避開錯誤拼音', icon: iconGame1, category: 'life' },
  { id: 2, key: 'game2', title: '臺羅聲韻打磚王', desc: '聽音打掉正確的詞磚', icon: iconGame2, category: 'situational' },
  { id: 3, key: 'game4', title: '臺語太空礦場', desc: '聽音抓出正確的台語詞彙', icon: iconGame4, category: 'outdoor' },
  { id: 4, key: 'game3', title: '臺羅送批大挑戰', desc: '收集詞卡，閃過障礙送到老街', icon: iconGame3, category: 'outdoor' },
  { id: 5, key: 'game5', title: '臺羅戰機防衛戰', desc: '聽音擊落正確答案，練反應', icon: iconGame5, category: 'life' },
  { id: 6, key: 'game6', title: '臺羅拼音方塊研究所', desc: '拼出拼音方塊，練聲韻調號', icon: iconGame6, category: 'situational' },
  { id: 7, key: 'game7', title: '華臺詞卡配對王', desc: '看華語揣台語，配對詞卡', icon: iconGame7, category: 'situational' },
  { id: 8, key: 'game8', title: '臺語字詞排序研究所', desc: '聽發音排詞序，組成句子', icon: iconGame8, category: 'situational' },
  { id: 9, key: 'game9', title: '鹿野觀察詞彙配對', desc: '看插畫找位置，配對詞彙', icon: iconGame9, category: 'outdoor' },
  { id: 10, key: 'game10', title: '伴手禮採買任務', desc: '聽採買清單，預算內買齊', icon: iconGame10, category: 'life' },
];

export const getNextGameKey = (currentKey: string): string | null => {
  const idx = GAMES.findIndex((g) => g.key === currentKey);
  if (idx === -1 || idx === GAMES.length - 1) return null;
  return GAMES[idx + 1].key;
};
