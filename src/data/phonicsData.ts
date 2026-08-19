// 聲母、韻母、聲調的內容資料。
//
// 2026-08-18 整批重寫：原本網站對同一批聲母同時存在三套互不相同的例字
// （頁面口訣、拼音方案總覽表、鬥看覓 50 字清單各自一套），沒有一套真正
// 對得起來，這是「發音不對」的根本原因。這裡改成單一資料來源，內容全部
// 核對自《臺灣台語銜接教材》PART1 入門篇（P.7-13 官方對照表）與 PART2
// 練習篇（P.29-53「10 分鐘練武功」逐聲母例字），並用臺羅標調規則做過
// 自動一致性驗證。這批資料只給文字/表格呈現，不含發音功能。

export type Tone = 1 | 2 | 3 | 4 | 5 | 7 | 8;

export const TONE_NAMES: Record<Tone, string> = {
  1: '第一聲（高平調）',
  2: '第二聲（高降調）',
  3: '第三聲（中降調）',
  4: '第四聲（中入聲）',
  5: '第五聲（低升調）',
  7: '第七聲（中平調）',
  8: '第八聲（高入聲）',
};

/** P.7 聲調系統：官方例字「君滾棍骨群－郡滑」，調值取自課本官方調類表（陰平/陰上/陰去/陰入/陽平/陽去/陽入），
 *  臺灣優勢腔沒有第六聲（陽上）所以官方表也跳過 */
export const TONES_DATA: { tone: Tone; mark: string; category: string; example: string; tailo: string; pitch: string }[] = [
  { tone: 1, mark: '不標', category: '陰平', example: '君', tailo: 'kun', pitch: '44' },
  { tone: 2, mark: '銳音符 ˊ', category: '陰上', example: '滾', tailo: 'kún', pitch: '53' },
  { tone: 3, mark: '重音符 ˋ', category: '陰去', example: '棍', tailo: 'kùn', pitch: '21' },
  { tone: 4, mark: '不標，尾音 p/t/k/h', category: '陰入', example: '骨', tailo: 'kut', pitch: '32' },
  { tone: 5, mark: '揚音符 ˆ', category: '陽平', example: '群', tailo: 'kûn', pitch: '23' },
  { tone: 7, mark: '長音符 ˉ', category: '陽去', example: '郡', tailo: 'kūn', pitch: '33' },
  { tone: 8, mark: '直音符 ˙，尾音 p/t/k/h', category: '陽入', example: '滑', tailo: 'ku̍t', pitch: '4' },
];

/** P.29-30「聲調練習：AA 型重疊詞」，每個聲調的口語疊字例，最好懂的聲調練習素材 */
export const TONE_PRACTICE_WORDS: Record<Tone, { hanzi: string; tailo: string }[]> = {
  1: [
    { hanzi: '花花', tailo: 'hue-hue' },
    { hanzi: '酸酸', tailo: 'sng-sng' },
    { hanzi: '芳芳', tailo: 'phang-phang' },
    { hanzi: '甜甜', tailo: 'tinn-tinn' },
    { hanzi: '金金', tailo: 'kim-kim' },
    { hanzi: '冰冰', tailo: 'ping-ping' },
  ],
  2: [
    { hanzi: '好好', tailo: 'hó-hó' },
    { hanzi: '飽飽', tailo: 'pá-pá' },
    { hanzi: '短短', tailo: 'té-té' },
    { hanzi: '早早', tailo: 'tsá-tsá' },
    { hanzi: '冷冷', tailo: 'líng-líng' },
  ],
  3: [
    { hanzi: '臭臭', tailo: 'tshàu-tshàu' },
    { hanzi: '怪怪', tailo: 'kuài-kuài' },
    { hanzi: '暗暗', tailo: 'àm-àm' },
    { hanzi: '落落', tailo: 'làu-làu' },
    { hanzi: '拜拜', tailo: 'pài-pài' },
  ],
  4: [
    { hanzi: '束束', tailo: 'sok-sok' },
    { hanzi: '落漆', tailo: 'lak-tshat' },
    { hanzi: '闊闊', tailo: 'khuah-khuah' },
    { hanzi: '德國', tailo: 'Tik-kok' },
    { hanzi: '溼溼', tailo: 'sip-sip' },
  ],
  5: [
    { hanzi: '黃黃', tailo: 'n̂g-n̂g' },
    { hanzi: '紅紅', tailo: 'âng-âng' },
    { hanzi: '圓圓', tailo: 'înn-înn' },
    { hanzi: '長長', tailo: 'tn̂g-tn̂g' },
  ],
  7: [
    { hanzi: '低低', tailo: 'kē-kē' },
    { hanzi: '便便', tailo: 'piān-piān' },
    { hanzi: '大大', tailo: 'tuā-tuā' },
    { hanzi: '遠遠', tailo: 'hn̄g-hn̄g' },
    { hanzi: '厚厚', tailo: 'kāu-kāu' },
  ],
  8: [
    { hanzi: '白白', tailo: 'pe̍h-pe̍h' },
    { hanzi: '實實', tailo: 'tsa̍t-tsa̍t' },
    { hanzi: '十六', tailo: 'tsa̍p-la̍k' },
    { hanzi: '滑滑', tailo: 'ku̍t-ku̍t' },
  ],
};

export type InitialSymbol =
  | 'p' | 'ph' | 'b' | 'm' | 't' | 'th' | 'n' | 'l'
  | 'ts' | 'tsh' | 's' | 'j' | 'k' | 'kh' | 'g' | 'ng' | 'h' | 'zero';

/** P.10-11 官方聲母對照表：發音部位分組＋發音方法說明 */
export const INITIAL_GROUPS: { group: string; symbols: InitialSymbol[] }[] = [
  { group: '雙唇音', symbols: ['p', 'ph', 'b', 'm'] },
  { group: '舌尖音', symbols: ['t', 'th', 'n', 'l'] },
  { group: '齒音', symbols: ['ts', 'tsh', 's', 'j'] },
  { group: '舌根音', symbols: ['k', 'kh', 'g', 'ng'] },
  { group: '喉音', symbols: ['h', 'zero'] },
];

export const INITIALS_DATA: Record<InitialSymbol, { label: string; desc: string; example?: { hanzi: string; tailo: string } }> = {
  p: { label: 'p', desc: '雙唇清不送氣塞音，同國語ㄅ' },
  ph: { label: 'ph', desc: '雙唇清送氣塞音，同國語ㄆ' },
  b: { label: 'b', desc: '雙唇濁塞音，華語沒有這個音，發音前聲帶先振動，如「阿母」之 bú', example: { hanzi: '阿母', tailo: 'a-bú' } },
  m: { label: 'm', desc: '雙唇濁鼻音，同國語ㄇ' },
  t: { label: 't', desc: '舌尖清不送氣塞音，同國語ㄉ' },
  th: { label: 'th', desc: '舌尖清送氣塞音，同國語ㄊ' },
  n: { label: 'n', desc: '舌尖濁鼻音，同國語ㄋ' },
  l: { label: 'l', desc: '舌尖濁邊音，同國語ㄌ' },
  ts: { label: 'ts', desc: '舌尖前清不送氣塞擦音，同國語ㄗ／ㄐ' },
  tsh: { label: 'tsh', desc: '舌尖前清送氣塞擦音，同國語ㄘ／ㄑ' },
  s: { label: 's', desc: '舌尖前清擦音，同國語ㄙ／ㄒ' },
  j: { label: 'j', desc: '舌尖前濁擦音，華語沒有這個音，發音前聲帶先振動，如「日頭」之 jit', example: { hanzi: '日頭', tailo: 'ji̍t-thâu' } },
  k: { label: 'k', desc: '舌根清不送氣塞音，同國語ㄍ' },
  kh: { label: 'kh', desc: '舌根清送氣塞音，同國語ㄎ' },
  g: { label: 'g', desc: '舌根濁塞音，華語沒有這個音，發音前聲帶先振動，如「我」guá', example: { hanzi: '我', tailo: 'guá' } },
  ng: { label: 'ng', desc: '舌根濁鼻音，放在聲母的位置，華語沒有這個用法，如「雅」之 ngá', example: { hanzi: '雅', tailo: 'ngá' } },
  h: { label: 'h', desc: '喉清擦音，似國語ㄏ，但發音部位在喉部' },
  zero: { label: '（零聲母）', desc: '音節開頭沒有輔音，直接從韻母開始發音' },
};

/** P.36-53「10 分鐘練武功」逐聲母例字。已用臺羅標調規則做過自動核對，
 *  只留通過核對、確定跟課本一致的音節；不是每個聲母都湊得滿 7 個聲調，
 *  課本原本就不是每一格都有對應的常用字。*/
export const INITIAL_SYLLABLES: Record<InitialSymbol, { tone: Tone; syllable: string }[]> = {
  p: [
    { tone: 1, syllable: 'pan' }, { tone: 2, syllable: 'pái' }, { tone: 3, syllable: 'pì' },
    { tone: 4, syllable: 'pak' }, { tone: 5, syllable: 'pôo' }, { tone: 7, syllable: 'pn̄g' }, { tone: 8, syllable: 'po̍h' },
  ],
  ph: [
    { tone: 1, syllable: 'phang' }, { tone: 2, syllable: 'phóo' }, { tone: 3, syllable: 'phò' },
    { tone: 4, syllable: 'phik' }, { tone: 5, syllable: 'phû' }, { tone: 7, syllable: 'phē' }, { tone: 8, syllable: 'pha̍k' },
  ],
  b: [
    { tone: 1, syllable: 'bui' }, { tone: 2, syllable: 'bí' }, { tone: 3, syllable: 'bòng' },
    { tone: 4, syllable: 'bak' }, { tone: 5, syllable: 'bîng' }, { tone: 7, syllable: 'bū' }, { tone: 8, syllable: 'bo̍k' },
  ],
  m: [
    { tone: 1, syllable: 'mi' }, { tone: 2, syllable: 'má' }, { tone: 3, syllable: 'mài' },
    { tone: 4, syllable: 'mauh' }, { tone: 5, syllable: 'mn̂g' }, { tone: 7, syllable: 'mōo' }, { tone: 8, syllable: 'mih' },
  ],
  t: [
    { tone: 1, syllable: 'to' }, { tone: 2, syllable: 'tán' }, { tone: 3, syllable: 'tàu' },
    { tone: 4, syllable: 'tik' }, { tone: 5, syllable: 'tê' }, { tone: 7, syllable: 'tiān' }, { tone: 8, syllable: 'ta̍t' },
  ],
  th: [
    { tone: 1, syllable: 'thui' }, { tone: 2, syllable: 'thánn' }, { tone: 3, syllable: 'thàng' },
    { tone: 4, syllable: 'thok' }, { tone: 5, syllable: 'thuân' }, { tone: 7, syllable: 'thuā' }, { tone: 8, syllable: 'the̍h' },
  ],
  n: [
    { tone: 1, syllable: 'ni' }, { tone: 2, syllable: 'niá' }, { tone: 3, syllable: 'nǹg' },
    { tone: 4, syllable: 'nah' }, { tone: 5, syllable: 'nâ' },
  ],
  l: [
    { tone: 1, syllable: 'liu' }, { tone: 2, syllable: 'lián' }, { tone: 3, syllable: 'lò' },
    { tone: 4, syllable: 'lok' }, { tone: 5, syllable: 'lân' }, { tone: 7, syllable: 'lāi' }, { tone: 8, syllable: 'lo̍k' },
  ],
  ts: [
    { tone: 1, syllable: 'tsa' }, { tone: 2, syllable: 'tsí' }, { tone: 3, syllable: 'tsù' },
    { tone: 4, syllable: 'tsiah' }, { tone: 5, syllable: 'tsâi' }, { tone: 7, syllable: 'tsām' }, { tone: 8, syllable: 'tsua̍h' },
  ],
  tsh: [
    { tone: 1, syllable: 'tshun' }, { tone: 2, syllable: 'tshiánn' }, { tone: 3, syllable: 'tshù' },
    { tone: 4, syllable: 'tshiah' }, { tone: 5, syllable: 'tshâ' }, { tone: 7, syllable: 'tshī' }, { tone: 8, syllable: 'tshua̍h' },
  ],
  s: [
    { tone: 1, syllable: 'sing' }, { tone: 2, syllable: 'sú' }, { tone: 3, syllable: 'sè' },
    { tone: 4, syllable: 'sik' }, { tone: 5, syllable: 'sî' }, { tone: 7, syllable: 'sū' }, { tone: 8, syllable: 'su̍t' },
  ],
  j: [
    { tone: 1, syllable: 'jia' }, { tone: 2, syllable: 'jiáu' }, { tone: 3, syllable: 'jiàu' },
    { tone: 4, syllable: 'jiok' }, { tone: 5, syllable: 'jiân' }, { tone: 7, syllable: 'jūn' }, { tone: 8, syllable: 'jit' },
  ],
  k: [
    { tone: 1, syllable: 'kau' }, { tone: 2, syllable: 'kóo' }, { tone: 3, syllable: 'kuì' },
    { tone: 4, syllable: 'kak' }, { tone: 5, syllable: 'kînn' }, { tone: 7, syllable: 'kū' }, { tone: 8, syllable: 'kio̍k' },
  ],
  kh: [
    { tone: 1, syllable: 'khe' }, { tone: 2, syllable: 'khóo' }, { tone: 3, syllable: 'khàu' },
    { tone: 4, syllable: 'kheh' }, { tone: 5, syllable: 'khuân' }, { tone: 7, syllable: 'khiū' }, { tone: 8, syllable: 'kho̍k' },
  ],
  g: [
    { tone: 1, syllable: 'giang' }, { tone: 2, syllable: 'gí' }, { tone: 3, syllable: 'gàn' },
    { tone: 4, syllable: 'giap' }, { tone: 5, syllable: 'giâ' }, { tone: 7, syllable: 'gōng' }, { tone: 8, syllable: 'ga̍k' },
  ],
  ng: [
    { tone: 1, syllable: 'ngiau' }, { tone: 2, syllable: 'ngá' }, { tone: 4, syllable: 'ngeh' },
    { tone: 5, syllable: 'ngiâ' }, { tone: 7, syllable: 'ngē' }, { tone: 8, syllable: 'ngia̍uh' },
  ],
  h: [
    { tone: 1, syllable: 'hun' }, { tone: 2, syllable: 'hué' }, { tone: 3, syllable: 'hàn' },
    { tone: 4, syllable: 'hannh' }, { tone: 5, syllable: 'hî' }, { tone: 7, syllable: 'huē' }, { tone: 8, syllable: 'hua̍t' },
  ],
  zero: [
    { tone: 1, syllable: 'a' }, { tone: 2, syllable: 'í' }, { tone: 5, syllable: 'iâ' }, { tone: 7, syllable: 'ām' },
  ],
};

/** P.12-13 官方韻母對照表。教材對韻母只給「發音方法」說明，沒有像聲母那樣
 *  每個韻母配 8 聲調例字的練習頁，真人錄音也只有一段「韻母總覽」，所以這裡
 *  不硬湊例字，忠實呈現官方對照表的內容。 */
export const FINAL_GROUPS: { group: string; items: { symbol: string; desc: string }[] }[] = [
  {
    group: '舒聲韻・單元音',
    items: [
      { symbol: 'a', desc: '同國語ㄚ' }, { symbol: 'i', desc: '同國語ㄧ' }, { symbol: 'u', desc: '同國語ㄨ' },
      { symbol: 'e', desc: '同國語ㄝ' }, { symbol: 'oo', desc: '同國語ㄛ' }, { symbol: 'o', desc: '介於ㄛ與ㄜ之間' },
    ],
  },
  {
    group: '舒聲韻・複元音',
    items: [
      { symbol: 'ai', desc: '同國語ㄞ' }, { symbol: 'au', desc: '同國語ㄠ' }, { symbol: 'ia', desc: '同國語ㄧㄚ' },
      { symbol: 'iau', desc: '同國語ㄧㄠ' }, { symbol: 'io', desc: '同國語ㄧㄜ' }, { symbol: 'iu', desc: '同國語ㄧㄨ' },
      { symbol: 'ua', desc: '同國語ㄨㄚ' }, { symbol: 'ue', desc: '由ㄨ滑向ㄝ' }, { symbol: 'ui', desc: '同國語ㄨㄟ' },
      { symbol: 'uai', desc: '同國語ㄨㄞ' },
    ],
  },
  {
    group: '舒聲韻・鼻化韻',
    items: [
      { symbol: 'ann', desc: '鼻化ㄚ韻' }, { symbol: 'ainn', desc: '鼻化ㄞ韻' }, { symbol: 'aunn', desc: '鼻化ㄠ韻' },
      { symbol: 'enn', desc: '鼻化ㄝ韻' }, { symbol: 'inn', desc: '鼻化ㄧ韻' }, { symbol: 'iann', desc: '鼻化ㄧㄚ韻' },
      { symbol: 'iaunn', desc: '鼻化ㄧㄠ韻' }, { symbol: 'iunn', desc: '鼻化ㄧㄨ韻' }, { symbol: 'onn', desc: '鼻化ㄛ韻' },
      { symbol: 'uann', desc: '鼻化ㄨㄚ韻' }, { symbol: 'uinn', desc: '鼻化ㄨㄧ韻' }, { symbol: 'uainn', desc: '鼻化ㄨㄞ韻' },
    ],
  },
  {
    group: '舒聲韻・鼻音尾',
    items: [
      { symbol: 'am', desc: 'ㄇ尾ㄚ韻' }, { symbol: 'an', desc: '同國語ㄢ' }, { symbol: 'ang', desc: '同國語ㄤ' },
      { symbol: 'im', desc: 'ㄇ尾ㄧ韻' }, { symbol: 'in', desc: '類似國語ㄧㄣ' }, { symbol: 'ing', desc: '類似國語ㄧㄥ' },
      { symbol: 'iam', desc: 'ㄇ尾ㄧㄚ韻' }, { symbol: 'ian', desc: '同國語ㄧㄢ' }, { symbol: 'iang', desc: '同國語ㄧㄤ' },
      { symbol: 'iong', desc: '讀若ㄧㄨㄥ' }, { symbol: 'om', desc: 'ㄇ尾ㄛ韻' }, { symbol: 'ong', desc: '讀若ㄛㄥ' },
      { symbol: 'un', desc: '同國語ㄨㄣ' }, { symbol: 'uan', desc: '同國語ㄨㄢ' }, { symbol: 'uang', desc: '同國語ㄨㄤ' },
    ],
  },
  {
    group: '舒聲韻・獨立鼻音',
    items: [
      { symbol: 'm', desc: '獨立鼻音尾，不發母音，直接閉雙唇' }, { symbol: 'ng', desc: '獨立鼻音尾，不發母音，直接以舌根發鼻音' },
    ],
  },
  {
    group: '入聲韻（尾音 h／p／t／k）',
    items: [
      { symbol: 'ah', desc: 'h 尾ㄚ韻' }, { symbol: 'ap', desc: 'p 尾ㄚ韻' }, { symbol: 'at', desc: 't 尾ㄚ韻' }, { symbol: 'ak', desc: 'k 尾ㄚ韻' },
      { symbol: 'eh', desc: 'h 尾ㄝ韻' }, { symbol: 'ih', desc: 'h 尾ㄧ韻' }, { symbol: 'ip', desc: 'p 尾ㄧ韻' },
      { symbol: 'it', desc: 't 尾ㄧ韻' }, { symbol: 'ik', desc: 'k 尾ㄧ韻' },
      { symbol: 'iah', desc: 'h 尾ㄧㄚ韻' }, { symbol: 'iap', desc: 'p 尾ㄧㄚ韻' }, { symbol: 'iat', desc: 't 尾ㄧㄚ韻' },
      { symbol: 'iak', desc: 'k 尾ㄧㄚ韻' }, { symbol: 'ioh', desc: 'h 尾ㄧㄛ韻' }, { symbol: 'iok', desc: 'k 尾ㄧㄛ韻' },
      { symbol: 'oh', desc: 'h 尾ㄛ韻' }, { symbol: 'op', desc: 'p 尾ㄛ韻' }, { symbol: 'ok', desc: 'k 尾ㄛ韻' },
      { symbol: 'ooh', desc: 'h 尾ㄛ韻（oo）' }, { symbol: 'uh', desc: 'h 尾ㄨ韻' }, { symbol: 'ut', desc: 't 尾ㄨ韻' },
      { symbol: 'uah', desc: 'h 尾ㄨㄚ韻' }, { symbol: 'uat', desc: 't 尾ㄨㄚ韻' }, { symbol: 'ueh', desc: 'h 尾ㄨㄝ韻' }, { symbol: 'uih', desc: 'h 尾ㄨㄧ韻' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 以下核對自《臺灣台語銜接教材》PART1 入門篇壹、肆、伍、陸、柒節，
// 2026-08-18 補上，讓「拼音方案」頁完整跟著課本這一章的順序走。

/** 壹、認識「臺灣台語羅馬字拼音方案」P.04-06：官方資源連結 */
export const SCHEME_INTRO_LINKS = [
  {
    title: '臺灣台語羅馬字拼音方案使用手冊',
    desc: '教育部官方 PDF：聲母韻母符號、調號標記位置、音節結構、連字符使用原則。',
    url: 'https://language.moe.gov.tw/001/Upload/FileUpload/3677-15601/Documents/tshiutsheh_1081017.pdf',
  },
  {
    title: '教育部臺灣台語羅馬字拼音教學網',
    desc: '拼音方案、聲母學習、韻母學習、拼音練習、聲調練習、拼音遊戲、相關連結，本頁內容的主要參考來源。',
    url: 'https://tailo.moe.edu.tw/',
  },
];

/** 貳、衍生調 P.09：第九調、輕聲，臺羅八聲調之外的兩個特殊標記 */
export const DERIVED_TONES = [
  {
    name: '第九調',
    mark: '兩小撇「˝」標在韻母上，如 a̋',
    desc: '音值約 35，比第五調高，只在變調、合音或外語借詞時使用。',
    examples: [
      { hanzi: '久久久', tailo: 'kú-kú-kú', note: '實際唸成 kű-ku-kú' },
      { hanzi: '昨昏', tailo: 'tsa-hng', note: '合音唸作 tsa̋ng' },
      { hanzi: '看板（日語借詞）', tailo: '—', note: '實際唸 kha̋ng-páng' },
    ],
  },
  {
    name: '輕聲',
    mark: '兩槓「--」標記，槓前讀本調、槓後讀輕聲',
    desc: '沒有實際調值，跟華語的輕聲用法不完全相同。',
    examples: [
      { hanzi: '食落去', tailo: 'tsia̍h--lo̍h-khì', note: '實際唸 tsia̍h--lò-khì' },
      { hanzi: '我先來去囉', tailo: 'guá sing lâi-khì--looh', note: '實際唸 gua sīng laih--looh' },
    ],
  },
];

/** 肆、台語常用輸入法 P.14-19 */
export const INPUT_METHODS = [
  {
    name: '羅漢跤 Lohankha 台語輸入法',
    platform: '手機、平板（iPhone／iPad）',
    features: [
      '支援臺羅拼音（TL）及白話字（POJ），支援第六調、第九調',
      '可打出台語或華語常用正體漢字七千餘字',
      '支援簡拼（只打聲符或字首母音），如 tuu → 台灣話',
      '選詞列顯示 ruby 拼音，可輸出全羅詞、漢字詞或並列，支援漢字詞發音查詢',
    ],
    url: 'https://lohankha.tw/',
  },
  {
    name: 'PhahTaigi 台語輸入法',
    platform: '手機、平板（Android）',
    features: [
      '支援白話字，教育部漢字、拼音',
      '可無聲調選詞',
      '支援簡拼（多音節字詞只打各音節字首母音），例：sbh → sam-bûn-hî',
      '無網路訊號下可使用',
    ],
    url: 'https://play.google.com/store/apps/details?id=com.taccotap.phahtaigi&hl=zh_TW',
  },
  {
    name: '臺灣台語漢字輸入法',
    platform: '桌上型電腦／筆記型電腦',
    features: [
      '教育部開發，可以正確打出臺灣台語漢字',
      '用《臺灣台語羅馬字拼音方案》輸入臺羅拼音，即可從所有對應漢字選用，不用先知道華語字音',
      '內建《臺灣台語常用詞辭典》詞庫，使用者也可自編詞庫',
    ],
    url: 'https://language.moe.gov.tw/files/people_files/blgsujip%201110721.pdf',
  },
  {
    name: '信望愛台語文輸入法 FHL TaigiIME',
    platform: '桌上型電腦／筆記型電腦',
    features: [
      '可以在任何地方、任何應用程式內打字',
      '可自訂詞庫，可即時切換漢字／羅馬字順序',
      '教典中罕用漢字（如 𪜶 in、𫝛 siāng）用拼音輸入法在手機能顯示，但某些系統可能無法正常顯示，遇到時就用拼音',
    ],
    url: 'https://taigiol.fhl.net/vcd/rotaiugbk.php?user=taigi&bid=131&proc=list&msgno=5',
  },
];

/** 伍、漢字使用規範 P.20-21 */
export const CHAR_USAGE_NOTE = {
  intro: '台語文創作出版作品越來越多，漢字使用上教育部陸續推出數批推薦用字，作為認證、競賽、教科書用字的規準。民間用字不一定與推薦用字相同，有些人傾向使用「汝」「儂」等本字，而不用教育部的借字「你」「人」。',
  principles: [
    { name: '本字', desc: '傳統習用原則：優先採用傳統上通用的字。' },
    { name: '訓用字', desc: '若傳統通俗用字易產生混淆，改用華文習見之訓讀字。' },
    { name: '借音字', desc: '若以上通俗用字仍可能混淆，建議採用古漢字。' },
  ],
  resources: [
    {
      title: '臺灣台語推薦用字 700 字詞手冊及字卡',
      desc: '教育部語文成果網製作成便於攜帶閱讀的 PDF 檔，供使用者自行下載列印。',
      url: 'https://language.moe.gov.tw/result_l.aspx?classify_sn=23&subclassify_sn=439&thirdclassify_sn=476&content_sn=52',
    },
    {
      title: '教育部電子報專欄：臺灣閩南語按呢寫',
      desc: '詳細解釋推薦用字選用理由及參考資料，附用字解析清單。',
      url: 'https://sutian.moe.edu.tw/media/annesia.zip',
    },
    {
      title: '教育部電子報「閱讀越懂閩客語」專欄',
      desc: '收錄許多詞條，由專業老師提供單字、造句及閩客語字彙文章，收錄 102～110 年度文章。',
      url: 'https://language.moe.gov.tw/Result.aspx?classify_sn=46&subclassify_sn=497',
    },
  ],
  marsExamples: [
    { wrong: '婚逃賣卵蛋', correct: '菸蒂勿亂丟', note: '公共場所常見標語（火星文誤寫）' },
    { wrong: '薰頭莫亂擲', correct: '菸蒂勿亂丟', note: '正確台語漢字寫法' },
    { wrong: '美塞桃慢喔', correct: '不可偷採喔', note: '果園農場常見標語（火星文誤寫）' },
    { wrong: '袂使偷挽喔', correct: '不可偷採喔', note: '正確台語漢字寫法' },
  ],
};

/** 陸、辭典使用指南 P.22-25 */
export const DICTIONARIES = [
  {
    name: '教育部臺灣台語常用詞辭典',
    features: [
      '收錄多數地方的語音差異（腔口差），如黃 n̂g／uînn，與用詞差異',
      '首頁有四種查詢法：用臺灣台語查詞目／查用例、用華語查用例／查全文，也可語音輸入查詢',
      '進階查詢可用 Python 正規表達式，如輸入「^食」查「食」「食物」「食品」「食暗」',
      '索引查詢與附錄可查特定領域分類詞彙（天文、地理、人物品評…）與字姓、人名音讀、俗諺、地名等專項附錄',
    ],
    url: 'https://sutian.moe.edu.tw/zh-hant/',
  },
  {
    name: 'ChhoeTaigi 台語辭典＋',
    features: [
      '各大辭典集合在此查詢平台，輸入一次各大辭典內容全部列出，古早用字、文言詞彙都能找到',
      '「Kéng ê 方式」可選「Kāng 款--ê」（完全一樣）或「相關--ê」（有相關的）',
      '可用白話字或臺羅拼音查詢；用字可能與教典用字不同',
    ],
    url: 'https://chhoe.taigi.info/',
  },
  {
    name: 'iTaigi 愛台語',
    features: [
      '邀請大眾一起提供詞彙、編輯的平台，可以看到多元新出的詞彙',
      '「你的名字」可查詢姓名的台語發音；教典、ChhoeTaigi 都找不到時可在「查辭典」搜尋',
      '大眾提供的詞彙不一定完全正確，僅供參考；「好工具」列有其他相關學習資源',
    ],
    url: 'https://itaigi.tw/k',
  },
];

/** 柒、台語學習資源綜合包 P.26 */
export const LEARNING_RESOURCE_HUB = {
  title: '「栽一欉臺文語言樹」部落格匯整分類',
  desc: '幫學習者節省搜尋時間的分類匯整，類別廣泛，可善加利用。',
  url: 'https://estefaniajenlanguagetree.blogspot.com/2023/01/blog-post_81.html',
  categories: [
    '自修學習地圖', '字典', '臺羅拼音學習', '朗讀', '認證', '輸入法相關', '舊地名', '文化、綜合影音',
    '歌謠創作', 'Google 播客', '語言復振', '聽看覓 台語尪仔冊', '延伸閱讀 語言學', '醫用臺語',
    '口說實況類', '面冊網站', '演講講座類', '研討會議類', '廣告和創作', '植物ê 台語名', '諺語',
    '傳統民俗文化、節慶典故', '延伸語音資料庫',
  ],
};

/** 入門篇 pptx 逐張投影片截圖（PowerPoint 匯出，跟課本排版一模一樣），
 *  檔案在 public/images/phonics/slides/slide-NNN.png，按壹～柒節分組。 */
export const SLIDE_SECTIONS: { tab: string; title: string; range: [number, number] }[] = [
  { tab: 'intro', title: '封面／目錄', range: [1, 2] },
  { tab: 'intro', title: '壹．認識「臺灣台語羅馬字拼音方案」', range: [3, 8] },
  { tab: 'tones', title: '貳．台語的聲調與變調', range: [9, 24] },
  { tab: 'scheme', title: '參．台語的聲母與韻母', range: [25, 57] },
  { tab: 'input', title: '肆．台語常用輸入法', range: [58, 73] },
  { tab: 'chars', title: '伍．漢字使用規範', range: [74, 81] },
  { tab: 'dict', title: '陸．辭典使用指南', range: [82, 97] },
  { tab: 'resources', title: '柒．台語學習資源綜合包', range: [98, 100] },
];

export function slideUrl(n: number): string {
  return `images/phonics/slides/slide-${String(n).padStart(3, '0')}.png`;
}

/** 投影片本身在 pptx 裡就掛了播放圖示、按「投放」會出聲的那幾張，
 *  核對自 pptx XML 的 audioFile 關聯（第幾張投影片連到哪個 media 檔），
 *  音檔一律接在該範圍第一張投影片後面（原本簡報也是整段播一次）。 */
export const SLIDE_AUDIO: { afterSlide: number; trackKey: string }[] = [
  { afterSlide: 15, trackKey: 'tone-system' },       // P.07 聲調系統，media1.wav
  { afterSlide: 21, trackKey: 'tone-sandhi-chart' }, // P.08 變調圖，media2.wav
  { afterSlide: 24, trackKey: 'tone-derived' },      // P.09 衍生調，media3.wav
  { afterSlide: 28, trackKey: 'initials-overview' }, // P.10-11 聲母，media4.wav
  { afterSlide: 35, trackKey: 'finals-overview' },   // P.12-13 韻母，media5.wav
];

// ---------------------------------------------------------------------------
// 練習篇 pptx 逐張投影片截圖（2026-08-18 比照入門篇做法，PowerPoint 匯出，
// 跟課本排版一模一樣），檔案在 public/images/phonics/slides-practice/slide-NNN.png，
// 共 108 張，依課本章節分成 5 段。

export const SLIDE_SECTIONS_PRACTICE: { tab: string; title: string; range: [number, number] }[] = [
  { tab: 'warmup', title: '暖身：講我的名（P.28）', range: [1, 7] },
  { tab: 'tones', title: '聲調與變調練習（P.29-30）', range: [8, 19] },
  { tab: 'initials_finals', title: '聲母韻母學習步驟（P.31-32）', range: [20, 28] },
  { tab: 'tone_marks', title: '調號書寫練習（P.33-34）', range: [29, 34] },
  { tab: 'drills', title: '10 分鐘練武功：逐聲母例字（P.35-53）', range: [35, 108] },
];

export function slidePracticeUrl(n: number): string {
  return `images/phonics/slides-practice/slide-${String(n).padStart(3, '0')}.png`;
}

/** 核對自 pptx XML 的 audioFile 關聯，跟入門篇同一批 18 個聲母例字錄音
 *  ＋ P.30「聲調和變調複習」共用（trackKey 沿用 LessonAudio 既有的表）。 */
export const SLIDE_AUDIO_PRACTICE: { afterSlide: number; trackKey: string }[] = [
  { afterSlide: 13, trackKey: 'tone-review' },   // P.30 聲調和變調複習
  { afterSlide: 37, trackKey: 'initial-p' },     // P.36
  { afterSlide: 41, trackKey: 'initial-ph' },    // P.37
  { afterSlide: 45, trackKey: 'initial-b' },     // P.38
  { afterSlide: 49, trackKey: 'initial-m' },     // P.39
  { afterSlide: 53, trackKey: 'initial-t' },     // P.40
  { afterSlide: 57, trackKey: 'initial-th' },    // P.41
  { afterSlide: 61, trackKey: 'initial-n' },     // P.42
  { afterSlide: 65, trackKey: 'initial-l' },     // P.43
  { afterSlide: 69, trackKey: 'initial-ts' },    // P.44
  { afterSlide: 73, trackKey: 'initial-tsh' },   // P.45
  { afterSlide: 77, trackKey: 'initial-s' },     // P.46
  { afterSlide: 81, trackKey: 'initial-j' },     // P.47
  { afterSlide: 85, trackKey: 'initial-k' },     // P.48
  { afterSlide: 89, trackKey: 'initial-kh' },    // P.49
  { afterSlide: 93, trackKey: 'initial-h' },     // P.50
  { afterSlide: 97, trackKey: 'initial-g' },     // P.51
  { afterSlide: 101, trackKey: 'initial-ng' },   // P.52
  { afterSlide: 105, trackKey: 'initial-zero' }, // P.53
];

/** 課本同一頁常被拆成好幾張投影片（有的是逐步顯示，有的是同一張表格分批列出，
 *  有的是「點選放大」的全螢幕圖）。頁碼直接讀自 pptx 每張投影片的文字（P.xx），
 *  同一個課本頁碼的投影片歸成一組，播放器一次把整組由上往下顯示完，
 *  這樣「一頁課本＝網頁上的一頁」，不用為了同一頁翻好幾次。
 *  沒有頁碼的封面、目錄、節次跨頁自成一組；沒頁碼又緊接在某頁後面的（放大圖）
 *  併進前一頁。2026-08-19 依 pptx 重新產生。 */
export type SlideGroup = { page: string | null; slides: number[] };

/** 入門篇 100 張投影片 → 32 頁 */
export const SLIDE_GROUPS: SlideGroup[] = [
  { page: null, slides: [1] }, { page: null, slides: [2] }, { page: null, slides: [3] },
  { page: 'P.04', slides: [4, 5, 6] }, { page: 'P.05', slides: [7, 8] }, { page: null, slides: [9] },
  { page: 'P.06', slides: [10, 11] }, { page: 'P.07', slides: [12, 13, 14, 15] }, { page: 'P.08', slides: [16, 17, 18, 19, 20, 21] },
  { page: 'P.09', slides: [22, 23, 24] }, { page: null, slides: [25] }, { page: 'P.10', slides: [26, 27] },
  { page: 'P.11', slides: [28, 29, 30, 31, 32, 33, 34] }, { page: 'P.12', slides: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48] }, { page: 'P.13', slides: [49, 50, 51, 52, 53, 54, 55, 56, 57] },
  { page: null, slides: [58] }, { page: 'P.14', slides: [59, 60, 61] }, { page: 'P.15', slides: [62] },
  { page: 'P.16', slides: [63, 64, 65] }, { page: 'P.17', slides: [66, 67] }, { page: 'P.18', slides: [68, 69] },
  { page: 'P.19', slides: [70, 71, 72, 73] }, { page: null, slides: [74] }, { page: 'P.20', slides: [75, 76, 77, 78] },
  { page: 'P.21', slides: [79, 80, 81] }, { page: null, slides: [82] }, { page: 'P.22', slides: [83, 84, 85] },
  { page: 'P.23', slides: [86, 87, 88, 89, 90] }, { page: 'P.24', slides: [91, 92, 93] }, { page: 'P.25', slides: [94, 95, 96, 97] },
  { page: null, slides: [98] }, { page: 'P.26', slides: [99, 100] },
];

/** 練習篇 108 張投影片 → 28 頁 */
export const SLIDE_GROUPS_PRACTICE: SlideGroup[] = [
  { page: null, slides: [1] }, { page: null, slides: [2] }, { page: 'P.28', slides: [3, 4, 5, 6, 7] },
  { page: 'P.29', slides: [8, 9, 10, 11] }, { page: 'P.30', slides: [12, 13, 14, 15, 16, 17, 18, 19] }, { page: 'P.31', slides: [20, 21, 22, 23] },
  { page: 'P.32', slides: [24, 25, 26, 27, 28] }, { page: 'P.33', slides: [29, 30, 31] }, { page: 'P.34', slides: [32, 33, 34] },
  { page: 'P.35', slides: [35, 36] }, { page: 'P.36', slides: [37, 38, 39, 40] }, { page: 'P.37', slides: [41, 42, 43, 44] },
  { page: 'P.38', slides: [45, 46, 47, 48] }, { page: 'P.39', slides: [49, 50, 51, 52] }, { page: 'P.40', slides: [53, 54, 55, 56] },
  { page: 'P.41', slides: [57, 58, 59, 60] }, { page: 'P.42', slides: [61, 62, 63, 64] }, { page: 'P.43', slides: [65, 66, 67, 68] },
  { page: 'P.44', slides: [69, 70, 71, 72] }, { page: 'P.45', slides: [73, 74, 75, 76] }, { page: 'P.46', slides: [77, 78, 79, 80] },
  { page: 'P.47', slides: [81, 82, 83, 84] }, { page: 'P.48', slides: [85, 86, 87, 88] }, { page: 'P.49', slides: [89, 90, 91, 92] },
  { page: 'P.50', slides: [93, 94, 95, 96] }, { page: 'P.51', slides: [97, 98, 99, 100] }, { page: 'P.52', slides: [101, 102, 103, 104] },
  { page: 'P.53', slides: [105, 106, 107, 108] },
];

export function groupContaining(groups: SlideGroup[], n: number): SlideGroup {
  return groups.find((g) => g.slides.includes(n)) ?? { page: null, slides: [n] };
}
