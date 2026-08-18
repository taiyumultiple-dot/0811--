// 課堂小工具用的台語詞庫（大字卡、詞彙轉盤共用）。
//
// 用途是課堂上隨機抽詞讓學生唸，所以挑的是最常用、國中小課本會出現的生活詞彙。
// 台羅拼音採教育部臺灣閩南語羅馬字拼音方案；若編輯確認某個詞的用字或聲調
// 跟課本版本不同，直接改這裡即可，兩個工具會一起更新。

export type Word = {
  /** 台語漢字（教育部推薦用字） */
  han: string;
  /** 台羅拼音 */
  tailo: string;
  /** 對應的華語說法，方便老師確認詞義 */
  zh: string;
};

export type WordTheme = {
  key: string;
  label: string;
  emoji: string;
  words: Word[];
};

export const WORD_THEMES: WordTheme[] = [
  {
    key: 'greeting',
    label: '招呼與禮貌',
    emoji: '👋',
    words: [
      { han: '你好', tailo: 'lí-hó', zh: '你好' },
      { han: '𠢕早', tailo: 'gâu-tsá', zh: '早安' },
      { han: '多謝', tailo: 'to-siā', zh: '謝謝' },
      { han: '歹勢', tailo: 'pháinn-sè', zh: '不好意思' },
      { han: '無要緊', tailo: 'bô-iàu-kín', zh: '沒關係' },
      { han: '請問', tailo: 'tshiánn-mn̄g', zh: '請問' },
      { han: '再會', tailo: 'tsài-huē', zh: '再見' },
      { han: '食飽未', tailo: 'tsia̍h-pá--buē', zh: '吃飽了嗎' },
      { han: '恭喜', tailo: 'kiong-hí', zh: '恭喜' },
      { han: '拜託', tailo: 'pài-thok', zh: '拜託' },
    ],
  },
  {
    key: 'food',
    label: '食物',
    emoji: '🍜',
    words: [
      { han: '飯', tailo: 'pn̄g', zh: '飯' },
      { han: '麵', tailo: 'mī', zh: '麵' },
      { han: '肉', tailo: 'bah', zh: '肉' },
      { han: '魚', tailo: 'hî', zh: '魚' },
      { han: '菜', tailo: 'tshài', zh: '菜' },
      { han: '湯', tailo: 'thng', zh: '湯' },
      { han: '茶', tailo: 'tê', zh: '茶' },
      { han: '肉圓', tailo: 'bah-uân', zh: '肉圓' },
      { han: '豆花', tailo: 'tāu-hue', zh: '豆花' },
      { han: '鹹粥', tailo: 'kiâm-tsiok', zh: '鹹粥' },
      { han: '碗粿', tailo: 'uánn-kué', zh: '碗粿' },
      { han: '麵茶', tailo: 'mī-tê', zh: '麵茶' },
    ],
  },
  {
    key: 'fruit',
    label: '水果',
    emoji: '🍍',
    words: [
      { han: '王梨', tailo: 'ông-lâi', zh: '鳳梨' },
      { han: '芎蕉', tailo: 'kin-tsio', zh: '香蕉' },
      { han: '檨仔', tailo: 'suāinn-á', zh: '芒果' },
      { han: '蓮霧', tailo: 'lián-bū', zh: '蓮霧' },
      { han: '柑仔', tailo: 'kam-á', zh: '橘子' },
      { han: '葡萄', tailo: 'phû-tô', zh: '葡萄' },
      { han: '西瓜', tailo: 'si-kue', zh: '西瓜' },
      { han: '林菝仔', tailo: 'ná-pua̍t-á', zh: '芭樂' },
      { han: '柚仔', tailo: 'iū-á', zh: '柚子' },
      { han: '龍眼', tailo: 'lîng-gíng', zh: '龍眼' },
    ],
  },
  {
    key: 'animal',
    label: '動物',
    emoji: '🐶',
    words: [
      { han: '狗仔', tailo: 'káu-á', zh: '狗' },
      { han: '貓仔', tailo: 'niau-á', zh: '貓' },
      { han: '雞', tailo: 'ke', zh: '雞' },
      { han: '鴨', tailo: 'ah', zh: '鴨' },
      { han: '豬', tailo: 'ti', zh: '豬' },
      { han: '牛', tailo: 'gû', zh: '牛' },
      { han: '魚仔', tailo: 'hî-á', zh: '魚' },
      { han: '鳥仔', tailo: 'tsiáu-á', zh: '鳥' },
      { han: '鹿仔', tailo: 'lo̍k-á', zh: '鹿' },
      { han: '蟲豸', tailo: 'thâng-thuā', zh: '蟲子' },
    ],
  },
  {
    key: 'family',
    label: '家庭稱謂',
    emoji: '👨‍👩‍👧',
    words: [
      { han: '阿公', tailo: 'a-kong', zh: '爺爺' },
      { han: '阿媽', tailo: 'a-má', zh: '奶奶' },
      { han: '阿爸', tailo: 'a-pah', zh: '爸爸' },
      { han: '阿母', tailo: 'a-bú', zh: '媽媽' },
      { han: '阿兄', tailo: 'a-hiann', zh: '哥哥' },
      { han: '阿姊', tailo: 'a-tsí', zh: '姊姊' },
      { han: '小弟', tailo: 'sió-tī', zh: '弟弟' },
      { han: '小妹', tailo: 'sió-muē', zh: '妹妹' },
      { han: '囡仔', tailo: 'gín-á', zh: '小孩' },
      { han: '厝', tailo: 'tshù', zh: '家、房子' },
    ],
  },
  {
    key: 'school',
    label: '學校',
    emoji: '🏫',
    words: [
      { han: '學校', tailo: 'ha̍k-hāu', zh: '學校' },
      { han: '老師', tailo: 'lāu-su', zh: '老師' },
      { han: '學生', tailo: 'ha̍k-sing', zh: '學生' },
      { han: '教室', tailo: 'kàu-sik', zh: '教室' },
      { han: '冊', tailo: 'tsheh', zh: '書' },
      { han: '鉛筆', tailo: 'iân-pit', zh: '鉛筆' },
      { han: '紙', tailo: 'tsuá', zh: '紙' },
      { han: '烏枋', tailo: 'oo-pang', zh: '黑板' },
      { han: '功課', tailo: 'kong-khò', zh: '功課' },
      { han: '考試', tailo: 'khó-tshì', zh: '考試' },
    ],
  },
  {
    key: 'body',
    label: '身體',
    emoji: '🙋',
    words: [
      { han: '頭', tailo: 'thâu', zh: '頭' },
      { han: '目睭', tailo: 'ba̍k-tsiu', zh: '眼睛' },
      { han: '鼻仔', tailo: 'phīnn-á', zh: '鼻子' },
      { han: '喙', tailo: 'tshuì', zh: '嘴巴' },
      { han: '耳仔', tailo: 'hīnn-á', zh: '耳朵' },
      { han: '手', tailo: 'tshiú', zh: '手' },
      { han: '跤', tailo: 'kha', zh: '腳' },
      { han: '腹肚', tailo: 'pak-tóo', zh: '肚子' },
      { han: '頭毛', tailo: 'thâu-mn̂g', zh: '頭髮' },
      { han: '齒', tailo: 'khí', zh: '牙齒' },
    ],
  },
  {
    key: 'number',
    label: '數字',
    emoji: '🔢',
    words: [
      { han: '一', tailo: 'it', zh: '一' },
      { han: '二', tailo: 'jī', zh: '二' },
      { han: '三', tailo: 'sann', zh: '三' },
      { han: '四', tailo: 'sì', zh: '四' },
      { han: '五', tailo: 'gōo', zh: '五' },
      { han: '六', tailo: 'la̍k', zh: '六' },
      { han: '七', tailo: 'tshit', zh: '七' },
      { han: '八', tailo: 'peh', zh: '八' },
      { han: '九', tailo: 'káu', zh: '九' },
      { han: '十', tailo: 'tsa̍p', zh: '十' },
    ],
  },
  {
    key: 'time',
    label: '時間與天氣',
    emoji: '⛅',
    words: [
      { han: '今仔日', tailo: 'kin-á-ji̍t', zh: '今天' },
      { han: '明仔載', tailo: 'bîn-á-tsài', zh: '明天' },
      { han: '昨昏', tailo: 'tsa-hng', zh: '昨天' },
      { han: '早起', tailo: 'tsá-khí', zh: '早上' },
      { han: '下晡', tailo: 'ē-poo', zh: '下午' },
      { han: '暗時', tailo: 'àm-sî', zh: '晚上' },
      { han: '落雨', tailo: 'lo̍h-hōo', zh: '下雨' },
      { han: '好天', tailo: 'hó-thinn', zh: '晴天' },
      { han: '熱', tailo: 'jua̍h', zh: '熱' },
      { han: '寒', tailo: 'kuânn', zh: '冷' },
    ],
  },
  {
    key: 'place',
    label: '交通與地方',
    emoji: '🚌',
    words: [
      { han: '公車', tailo: 'kong-tshia', zh: '公車' },
      { han: '火車', tailo: 'hué-tshia', zh: '火車' },
      { han: '跤踏車', tailo: 'kha-ta̍h-tshia', zh: '腳踏車' },
      { han: '飛行機', tailo: 'hue-lîng-ki', zh: '飛機' },
      { han: '病院', tailo: 'pēnn-īnn', zh: '醫院' },
      { han: '市場', tailo: 'tshī-tiûnn', zh: '市場' },
      { han: '廟', tailo: 'biō', zh: '廟' },
      { han: '公園', tailo: 'kong-hn̂g', zh: '公園' },
      { han: '海邊', tailo: 'hái-pinn', zh: '海邊' },
      { han: '老街', tailo: 'lāu-ke', zh: '老街' },
    ],
  },
  {
    key: 'color',
    label: '顏色',
    emoji: '🎨',
    words: [
      { han: '紅', tailo: 'âng', zh: '紅' },
      { han: '白', tailo: 'pe̍h', zh: '白' },
      { han: '烏', tailo: 'oo', zh: '黑' },
      { han: '青', tailo: 'tshenn', zh: '綠、青' },
      { han: '黃', tailo: 'n̂g', zh: '黃' },
      { han: '藍', tailo: 'nâ', zh: '藍' },
      { han: '柑仔色', tailo: 'kam-á-sik', zh: '橘色' },
      { han: '殕色', tailo: 'phú-sik', zh: '灰色' },
    ],
  },
  {
    key: 'verb',
    label: '日常動作',
    emoji: '🏃',
    words: [
      { han: '食', tailo: 'tsia̍h', zh: '吃' },
      { han: '啉', tailo: 'lim', zh: '喝' },
      { han: '行', tailo: 'kiânn', zh: '走' },
      { han: '走', tailo: 'tsáu', zh: '跑' },
      { han: '看', tailo: 'khuànn', zh: '看' },
      { han: '聽', tailo: 'thiann', zh: '聽' },
      { han: '講', tailo: 'kóng', zh: '說' },
      { han: '寫', tailo: 'siá', zh: '寫' },
      { han: '讀', tailo: 'tha̍k', zh: '讀' },
      { han: '睏', tailo: 'khùn', zh: '睡' },
    ],
  },
];

/** 把使用者貼上的自訂詞單解析成詞卡：一行一個，用空白或逗號分成「漢字 台羅 華語」 */
export function parseWordLines(text: string): Word[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[,，\t]|\s{1,}/).filter(Boolean);
      return { han: parts[0] ?? '', tailo: parts[1] ?? '', zh: parts[2] ?? '' };
    })
    .filter((w) => w.han);
}

export function themeWords(keys: string[]): Word[] {
  const picked = WORD_THEMES.filter((t) => keys.includes(t.key));
  return picked.flatMap((t) => t.words);
}
