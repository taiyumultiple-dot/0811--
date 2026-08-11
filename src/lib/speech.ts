// Taiwanese Hokkien (Min Nan) Speech Synthesis Utility with Intelligent Fallbacks
// This provides high-quality speech rendering even on devices without a built-in Minnan voice (like iOS/Safari)

const TAIWANESE_PHONETIC_MAP: Record<string, string> = {
  // Game 1 Food items
  '肉圓': '嘛完',
  '豆花': '島輝',
  '鹹粥': '嫌九',
  '潤餅': '潤比呀',
  '月餅': '尾比呀',
  '串炸': '川雜',
  '碗粿': '碗貴',
  '蔥油餅': '聰遊比呀',
  '全部配對成功！': '龍部配對星功！',
  '麵茶': '米得',
  '牛舌餅': '古幾比呀',
  '圓仔湯': '因呀湯',
  '麻粩': '摸老',
  '芋丸': '歐丸',
  '肉包': '巴包',
  '粉粿': '昏貴',
  '秫米糋': '術米金',
  '李仔攕': '離呀籤',
  '齒抿仔': '企抿呀',
  '齒膏': '企高',
  '糕仔餅': '高呀比呀',
  '葵扇': '葵星',
  '跋桮': '撥杯',
  '鋩角': '迷角',
  '鹿港': '落港',
  '三輪車': '沙聯車',
  '鹿港麵線糊': '落港米線口',
  '麵茶冰': '米得冰',
  '老街': '撈貴',
  '拜拜': '拜拜',
  '旗袍': '奇袍',
  '全家福': '全家服',
  '等路': '膽路',
  '高鐵': '高踢',
  '聽起來真趣味，我想欲食秫米糋佮圓仔湯。': '聽起來金促尾，瓦熊美甲術米金哈因呀湯。',
  '咱會使食李仔攕、坐三輪車踅老街。': '藍誒塞甲離呀籤、賊沙聯車誰老街。',
  '我想欲去拜拜，祈求我考試順利。': '瓦熊北企拜拜，其求瓦考習新利。',
  '恁阿公誠意鹿港的麻粩，咱才買寡等路轉去送伊。': '林阿公賢卡意落港A摸老，藍加美寡膽路顛企勝伊。',
  '足𠢕！': '糾高！',
  '真正厲害！': '金加利害！',
  '閣來！': '閣來！',
  '答著矣！': '答對啊！',
  '台語真輪轉！': '台語金論轉！',
  '任務開始：請收集 ': '莉務開使，請修集 ',
  '任務開始：請收集': '莉務開使，請修集',
  '接下來，請收集 ': '接落來，請修集 ',
  '接下來，請收集': '接落來，請修集',
  '注意看！這是 ': '住意看！幾系 ',
  '注意看！這是': '住意看！幾系',
  '不著矣': '美丟啊',
  '錢無夠': '吉某高',
  '買矣': '尾啊',
  '請買': '請尾',
  '伴手禮買好囉！': '膽路尾賀囉！',

  // Game 2 Night market calls
  '「鹽酥雞，一包三十，卡緊來喔！」聽起來是咧賣啥物？': '鹽酥雞，一包沙雜，卡緊來喔！聽起來是咧賣啥物？',
  '「香腸頭，香腸頭，一支二十喔！」是咧賣啥物？': '香腸頭，香腸頭，幾機幾雜喔！是咧賣啥物？',
  '「珍珠奶茶，真濃真好喝，來一杯喔！」是咧賣啥物？': '珍珠奶茶，金濃金賀利，來一杯喔！是咧賣啥物？',
  '「地瓜球，QQ甜甜，一包二十五！」是咧賣啥物？': '地瓜球，QQ甜甜，一包哩雜高！是咧賣啥物？',
  '「大腸包小腸，澎湃夠味，欲食無？」是咧賣啥物？': '大腸包小腸，澎湃夠味，美甲某？是咧賣啥物？',
  '「臭豆腐，外酥內軟，燒燙燙上桌！」是咧賣啥物？': '臭豆腐，外酥內軟，燒燙燙上桌！是咧賣啥物？',
  '鹽酥雞，一包三十，卡緊來喔！': '鹽酥雞，一包沙雜，卡緊來喔！',
  '香腸頭，香腸頭，一支二十喔！': '香腸頭，香腸頭，幾機幾雜喔！',
  '珍珠奶茶，真濃真好喝，來一杯喔！': '珍珠奶茶，金濃金賀利，來一杯喔！',
  '地瓜球，QQ甜甜，一包二十五！': '地瓜球，QQ甜甜，一包哩雜高！',
  '大腸包小腸，澎湃夠味，欲食無？': '大腸包小腸，澎湃夠味，美甲某？',
  '臭豆腐，外酥內軟，燒燙燙上桌！': '臭豆腐，外酥內軟，燒燙燙上桌！',

  // Game 3 Blue Field Adventure
  '咱對藍田海邊出發，欲去藍田老街，應該向佗位行？': '藍對藍田海邊出發，北企藍田老街，應概向多位行？',
  '離開老街，欲去頂藍田小村，應該向佗位行？': '離魁老街，北企頂藍田小村，應概向多位行？',
  '對小村欲去藍田燈塔，應該向佗位行？': '對小村北企藍田燈塔，應概向多位行？',
  '咱欲去泡溫泉，應該向佗位行較近？': '藍北企泡溫泉，應概向多位行卡近？',
  '上尾一站欲去觀海步道，應該向佗位行？': '匈尾一站北企觀海步道，應概向多位行？',

  // Game 6 Hot Spring Dialogues
  '女伴：「遮 ê 溫泉氣氛真好，你欲袂欲來去泡湯？」': '遮A溫泉氣氛金賀，哩美美來企泡湯？',
  '女伴：「你捌泡過海景溫泉無？」': '哩巴泡貴海景溫泉某？',
  '女伴：「月娘遮爾媠，欲毋欲紮相機來翕相？」': '威娘家尼水，美美砸相機來合相？',
  '女伴：「泡了了後，欲毋欲鬥陣去食寡宵夜？」': '泡利利奧，美美逗頂企甲掛宵夜？',

  // Game 7 Airport
  '你欲去金門出差，愛先去佗位辦理登機手續？': '哩北企金門出差，愛嫌企多位辦理登機手續？',
  '落機了後，欲提行李，應該去佗位？': '落機利奧，北鐵行李，應概企多位？',
  '欲入去管制區進前，愛先過佗位？': '北利企管制區頂尖，愛嫌貴多位？',
  '飛行機欲起飛矣，愛去佗位等待上機？': '北型機北起飛阿，愛企多位等待上機？',

  // Game 8 Story Order
  '我食著真濟好食的點心。': '我甲丟金解厚甲A點心。',
  '我向店家問路，才知影老街的歷史。': '我向店家問路，才甲因老街A歷史。',
  '我參觀老街的風景，拍照做紀念。': '我參觀老街A風景，拍照做紀念。',
  '我佮朋友蹉老街，逐間店仔攏看。': '我嘎朋友車老街，大鋼店阿攏看。',
  '日頭漸斜，我歡喜轉去厝。': '日頭漸斜，我歡喜顛企醋。',

  // Game 9 Deer Vocab
  '鹿仔': '陸阿',
  '草仔': '草阿',
  '山頭': '山頭',
  '花仔': '揮阿',
  '石頭': '九逃',
  '天空': '聽框',
  '海邊': '海冰',
  '樹仔': '秋阿',

  // Game 10 Souvenirs
  '王梨酥': '王來收',
  '鳳梨酥': '王來收',
  '牛角糖': '牛角糖',
  '牛軋糖': '牛角糖',
  '茶葉卵': '得修冷',
  '茶葉蛋': '得修冷',
  '檨仔乾': '酸阿官',
  '芒果乾': '酸阿官',
  '土豆糖': '土豆糖',
  '花生糖': '花星糖',
  '太陽餅': '太擁比呀',
  '牛肉乾': '牛罵官',
  '肉乾': '罵官',
  '綠豆糕': '力豆糕',
  '綠豆椪': '力豆砰',
  '咖啡豆': '咖逼豆',
  '咖啡': '咖逼',
  '手工餅乾': '手工比呀官',

  // Phonics Page examples
  '興': '星',
  '無': '某',
  '步': '波',
  '皮': '輝',
  '毛': '摸',
  '肚': '度',
  '鐵': '踢',
  '籃': '那',
  '柳': '柳',
  '菇': '孤',
  '去': '企',
  '雅': '雅',
  '魚': '黑',
  '曾': '章',
  '出': '促',
  '沙': '沙',
  '字': '力',
  '語': '紀',
  '鴨': '啊',
  '衣': '一',
  '有': '烏',
  '會': '誒',
  '蚵': '喔',
  '黑': '凹',
  '愛': '愛',
  '後': '奧',
  '寫': '寫',
  '手': '修',
  '花': '揮',
  '話': '威',
  '水': '水',
  '餡': '含',
  '圓': '圓',
  '園': '輝',
  '嬰': '應',
  '惡': '喔',
  '姆': '姆',
  '黃': '黃',
  // New Phonics Scheme additions
  '玻璃': '波雷',
  '碎碎': '普普',
  '阿母': '阿姆',
  '媽媽': '媽媽',
  '刀仔': '多阿',
  '桃仔': '逃阿',
  '貓仔': '喵阿',
  '囉唆': '囉唆',
  '哥哥': '郭郭',
  '汽車': '器車',
  '鵝仔': '鵝阿',
  '牙齒': '呀企',
  '書包': '書包',
  '菜頭': '菜頭',
  '雪文': '沙文',
  '日頭': '利頭',
  '魚仔': '黑阿',
  '阿伯': '阿北',
  '醫生': '醫生',
  '溫池': '溫底',
  '鞋仔': '誒阿',
  '蚵仔': '喔阿',
  '烏車': '喔車',
  '愛國': '愛國',
  '後日': '奧利',
  '寫字': '寫力',
  '手指': '秀幾',
  '歡喜': '框黑',
  '畫地': '威得',
  '衛生': '威星',
  '三領': '沙娘',
  '圓仔': '因阿',
  '園仔': '輝阿',
  '嬰仔': '英阿',
  '噢噢': '喔喔',
  '不是': '美系',
  '黃色': '黃學',
  // Extra specific mappings for phonics example words
  '亂嚷': '弄落',
  '人來': '郎來',
  '人情': '任情',
  '代誌': '代吉',
  '十日': '雜母',
  '半仔': '波阿',
  '印色': '因學',
  '味色': '微學',
  '報音': '波因',
  '天地': '填底',
  '姆仔': '姆阿',
  '姑姑': '估估',
  '娃仔': '挖阿',
  '字兒': '利阿',
  '尋找': '切阿',
  '山仔': '沙阿',
  '工作': '康奎',
  '年仔': '尼阿',
  '庄腳': '曾卡',
  '度過': '度估',
  '後面': '奧比呀',
  '手巾': '秀金',
  '手環': '秀寬',
  '拼盤': '辦阿',
  '春管': '寸官',
  '歹人': '拍郎',
  '毛刷': '摸擦',
  '準備': '俊逼',
  '漂亮': '水阿',
  '烏鴉': '喔阿',
  '無閒': '某應',
  '牛兒': '牛阿',
  '生日': '誰力',
  '田園': '纏泥',
  '畫畫': '威阿',
  '病仔': '便阿',
  '皮包': '輝阿',
  '矮子': '誒阿',
  '窗仔': '湯阿',
  '笳苳': '加冬',
  '茄苳': '加冬',
  '箭仔': '金阿',
  '籃仔': '那阿',
  '老師': '老蘇',
  '老爸': '老北',
  '肉粽': '罵髒',
  '色樣': '雅學',
  '花朵': '輝阿',
  '袂窳': '美百',
  '說話': '威喔哈',
  '議論': '義倫',
  '車讚': '車沾',
  '這些': '加誒',
  '這呢': '家尼',
  '這時': '幾嘛',
  '醫院': '一印',
  '開花': '魁輝',
  '間存': '更存',
  '雅子': '雅組',
  '雅量': '雅良',
  '雨水': '厚水',
  '順利': '順力',
  '頭殼': '頭殼',
  '鴨子': '阿姐',
  '麵線': '米線',
  '黃仔': '恩阿',
  '黑色': '喔學'
};

// Helper to detect tones from Taiwanese Romanization (Tailo) syllables
export function detectTonesFromTailo(tailo: string): number[] {
  // Split by hyphens, spaces, or slashes to get individual syllables
  const syllables = tailo.toLowerCase().split(/[- \/]+/);
  return syllables.map(syllable => {
    // Check if it ends in p, t, k, h (which could be Tone 4 or Tone 8)
    const isEntering = /[ptkh]$/.test(syllable);
    
    // Check for Tone 8 (vertical line above vowel or tone 8 indicator)
    if (syllable.includes('̍') || syllable.includes('8')) {
      return 8;
    }
    // Check for Tone 2 (acute accent or tone 2 indicator)
    if (/[áíúéóńḿ]/.test(syllable) || syllable.includes('́') || syllable.includes('2')) {
      return 2;
    }
    // Check for Tone 3 (grave accent or tone 3 indicator)
    if (/[àìùèòǹm̀]/.test(syllable) || syllable.includes('̀') || syllable.includes('3')) {
      return 3;
    }
    // Check for Tone 5 (circumflex or tone 5 indicator)
    if (/[âîûêôn̂m̂]/.test(syllable) || syllable.includes('̂') || syllable.includes('5')) {
      return 5;
    }
    // Check for Tone 7 (macron or tone 7 indicator)
    if (/[āīūēōn̄m̄]/.test(syllable) || syllable.includes('̄') || syllable.includes('7')) {
      return 7;
    }
    // If it ends in p, t, k, h and has no vertical line, it's Tone 4
    if (isEntering) {
      return 4;
    }
    
    // Default is Tone 1
    return 1;
  });
}

export function getSandhiTone(tone: number, syllable: string = ''): number {
  const cleanSyllable = syllable.toLowerCase().trim();
  const endsWithH = /h$/.test(cleanSyllable);

  switch (tone) {
    case 1: return 7; // 1 -> 7
    case 2: return 1; // 2 -> 1
    case 3: return 2; // 3 -> 2
    case 4: 
      return endsWithH ? 2 : 8; // 4 -> 2 (ending in h) or 8 (ending in p, t, k)
    case 5: return 7; // 5 -> 7
    case 7: return 3; // 7 -> 3
    case 8: 
      return endsWithH ? 3 : 4; // 8 -> 3 (ending in h) or 4 (ending in p, t, k)
    default: return tone;
  }
}

export function getSandhiTailo(tailo: string): string {
  if (!tailo) return '';
  // Split by hyphens, spaces, slashes but keep delimiters
  const syllables = tailo.toLowerCase().split(/([- \/]+)/);
  const syllableTokens = tailo.toLowerCase().split(/[- \/]+/);
  const originalTones = detectTonesFromTailo(tailo);
  
  const sandhiTones = originalTones.map((tone, idx) => {
    if (idx === originalTones.length - 1) {
      return tone; // last syllable keeps citation tone
    }
    return getSandhiTone(tone, syllableTokens[idx]);
  });

  let syllableCounter = 0;
  const parts = syllables.map(part => {
    if (!part || /[- \/]/.test(part)) {
      return part; // delimiter
    }
    // Strip diacritics/accents and any existing digits
    let base = part.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritical marks
      .replace(/\d/g, ''); // remove any numbers
    
    base = base.normalize('NFC');
    
    if (syllableCounter < sandhiTones.length) {
      const targetTone = sandhiTones[syllableCounter++];
      return `${base}${targetTone}`;
    }
    return part;
  });

  return parts.join('');
}

// Central voice retrieval function
export function getTaiyuVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  
  // 1. Match precise Southern Min (Hokkien) voice tags
  let voice = voices.find(v => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return lang.includes('nan') || 
           lang.includes('min') || 
           name.includes('taiwanese') || 
           name.includes('hokkien') || 
           name.includes('taiyu') || 
           name.includes('閩南') || 
           name.includes('台語') ||
           name.includes('xiaorui') ||
           name.includes('yunxi') && lang.includes('min');
  });
  
  // 2. Fallback to Taiwanese Mandarin
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().includes('zh-tw'));
  }
  
  // 3. General Chinese fallback
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().startsWith('zh'));
  }
  
  return voice || null;
}

// Main speech engine with tone and syllable-aware pitch variation
export function speakTaiyu(text: string, tone?: number, tailo?: string, disableSandhi: boolean = false, fluid: boolean = true) {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  
  // Cancel any ongoing speech first
  synth.cancel();
  
  // Get active voice
  const voice = getTaiyuVoice(synth);
  const isTrueMinnan = voice && (
    voice.lang.toLowerCase().includes('nan') || 
    voice.lang.toLowerCase().includes('min') || 
    voice.name.toLowerCase().includes('taiwanese') || 
    voice.name.toLowerCase().includes('hokkien') || 
    voice.name.toLowerCase().includes('taiyu') || 
    voice.name.toLowerCase().includes('閩南') || 
    voice.name.toLowerCase().includes('台語')
  );

  // Parse tone sequence
  let detectedTones: number[] = [];
  if (tone) {
    detectedTones = [tone];
  } else if (tailo) {
    const rawTones = detectTonesFromTailo(tailo);
    const syllables = tailo.toLowerCase().split(/[- \/]+/);
    detectedTones = rawTones.map((t, idx) => {
      if (idx === rawTones.length - 1 || disableSandhi) {
        return t; // last syllable keeps citation tone, or sandhi is disabled
      }
      return getSandhiTone(t, syllables[idx] || '');
    });
  }

  // Helper to map traditional Taiwanese tones to SpeechSynthesis pitch and rate
  const getToneSettings = (t: number) => {
    let pitch = 1.0;
    let rate = isTrueMinnan ? 0.85 : 0.75;
    
    switch (t) {
      case 1: // 高平調 (55) - High flat
        pitch = 1.35;
        rate = isTrueMinnan ? 0.9 : 0.85;
        break;
      case 2: // 高降調 (51) - High falling
        pitch = 1.25;
        rate = isTrueMinnan ? 0.85 : 0.75;
        break;
      case 3: // 中降調 (31) - Mid/Low falling
        pitch = 0.75;
        rate = isTrueMinnan ? 0.8 : 0.7;
        break;
      case 4: // 中入聲 (3) - Mid entering (Short & flat)
        pitch = 0.85;
        rate = isTrueMinnan ? 1.3 : 1.2;
        break;
      case 5: // 低緩升調 (24) - Low rising
        pitch = 1.05;
        rate = isTrueMinnan ? 0.85 : 0.75;
        break;
      case 7: // 中平調 (33) - Mid flat
        pitch = 1.0;
        rate = isTrueMinnan ? 0.9 : 0.8;
        break;
      case 8: // 高入聲 (5) - High entering (Short & high)
        pitch = 1.45;
        rate = isTrueMinnan ? 1.35 : 1.25;
        break;
    }
    return { pitch, rate };
  };

  const cleanText = text.replace(/[「」：「」]/g, ' ').trim();

  // Determine phonetic base string for non-Minnan fallback
  let speechTextBase = cleanText;
  if (!isTrueMinnan) {
    if (TAIWANESE_PHONETIC_MAP[cleanText]) {
      speechTextBase = TAIWANESE_PHONETIC_MAP[cleanText];
    } else {
      // Sort keys from longest to shortest to ensure larger compounds/sentences match before individual words
      const sortedKeys = Object.keys(TAIWANESE_PHONETIC_MAP).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (speechTextBase.includes(key)) {
          const value = TAIWANESE_PHONETIC_MAP[key];
          speechTextBase = speechTextBase.split(key).join(value);
        }
      }
    }
  }

  // If we have multi-syllable Tailo and phonetic characters of equal length, play syllable by syllable to demonstrate exact tones (only if mechanical non-fluid mode is explicitly requested)
  const characters = Array.from(speechTextBase);
  const shouldSyllableBySyllable = !fluid && (detectedTones.length > 0 && characters.length === detectedTones.length && characters.length > 1);

  if (shouldSyllableBySyllable) {
    characters.forEach((char, idx) => {
      const charTone = detectedTones[idx];
      const settings = getToneSettings(charTone);
      
      let speechText = char;
      if (!isTrueMinnan) {
        if (TAIWANESE_PHONETIC_MAP[char]) {
          speechText = TAIWANESE_PHONETIC_MAP[char];
        }
      }
      
      const utterance = new SpeechSynthesisUtterance(speechText);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = isTrueMinnan ? 'zh-min-nan' : 'zh-TW';
      utterance.pitch = settings.pitch;
      
      // Control rate: slightly faster in fluid mode to blend smoothly, slower in mechanical mode
      if (fluid) {
        utterance.rate = isTrueMinnan ? 0.95 : 1.15;
      } else {
        utterance.rate = settings.rate;
      }
      
      synth.speak(utterance);
    });
    return;
  }

  // Fallback to single tone detection if not explicit
  let singleTone = detectedTones[0] || undefined;
  if (!singleTone && TAIWANESE_PHONETIC_MAP[cleanText]) {
    const knownSingleCharacterTones: Record<string, number> = {
      '君': 1, '滾': 2, '棍': 3, '骨': 4, '群': 5, '郡': 7, '滑': 8,
      '步': 2, '皮': 5, '無': 5, '毛': 5, '肚': 7, '鐵': 4, '籃': 5, '柳': 2,
      '菇': 1, '去': 3, '語': 2, '雅': 2, '魚': 5, '曾': 1, '出': 4, '沙': 1, '字': 7,
      '阿': 1, '姆': 2, '黃': 5, '興': 7
    };
    if (knownSingleCharacterTones[cleanText]) {
      singleTone = knownSingleCharacterTones[cleanText];
    }
  }

  const settings = singleTone ? getToneSettings(singleTone) : { pitch: 1.0, rate: isTrueMinnan ? 0.85 : 0.75 };

  const utterance = new SpeechSynthesisUtterance(speechTextBase);
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.lang = isTrueMinnan ? 'zh-min-nan' : 'zh-TW';
  utterance.pitch = settings.pitch;
  utterance.rate = settings.rate;
  
  synth.speak(utterance);
}
