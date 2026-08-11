import { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Gamepad2,
  ClipboardList,
  MessageCircle,
  Bell,
  ChevronRight,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  Sparkles,
  Megaphone,
  Music,
  PenTool,
  AudioLines,
  Link,
  Heart,
  Tv,
  Share2
} from 'lucide-react';
import { logoMark, frogDecor, heroFull } from '../assets/images/homepage';
import { HubShell } from './games/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkButton } from './BookmarkButton';

// Speech synthesis and Web Audio API tone generation helper
export function playTonePitch(toneNumber: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    const duration = 0.6;
    const baseFreq = 220; // A3 baseline
    
    osc.type = 'sine';
    
    // Contours based on traditional 5-point scale (1-5, where 5 is high, 1 is low)
    if (toneNumber === 1) {
      // 5 -> 5 (High level)
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.setValueAtTime(baseFreq * 1.5, now + duration);
    } else if (toneNumber === 2) {
      // 5 -> 1 (High falling)
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + duration);
    } else if (toneNumber === 3) {
      // 3 -> 1 (Low falling)
      osc.frequency.setValueAtTime(baseFreq * 1.1, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + duration);
    } else if (toneNumber === 4) {
      // 3 (Short entering)
      osc.frequency.setValueAtTime(baseFreq * 1.0, now);
      osc.frequency.setValueAtTime(baseFreq * 0.95, now + 0.15);
    } else if (toneNumber === 5) {
      // 2 -> 4 (Low rising)
      osc.frequency.setValueAtTime(baseFreq * 0.9, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + duration);
    } else if (toneNumber === 7) {
      // 3 -> 3 (Mid level)
      osc.frequency.setValueAtTime(baseFreq * 1.1, now);
      osc.frequency.setValueAtTime(baseFreq * 1.1, now + duration);
    } else if (toneNumber === 8) {
      // 5 (Short entering)
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.setValueAtTime(baseFreq * 1.4, now + 0.15);
    } else {
      // Default Tone 6 (same as 2)
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + duration);
    }
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    
    const playLen = (toneNumber === 4 || toneNumber === 8) ? 0.18 : duration;
    gain.gain.setValueAtTime(0.25, now + playLen - 0.04);
    gain.gain.linearRampToValueAtTime(0, now + playLen);
    
    osc.start(now);
    osc.stop(now + playLen + 0.05);
  } catch (e) {
    console.error('Audio synthesis failed:', e);
  }
}

import { speakTaiyu, getSandhiTailo, getSandhiTone, detectTonesFromTailo } from '../lib/speech';

export function speakText(text: string, tone?: number, tailo?: string, disableSandhi?: boolean, fluid?: boolean) {
  speakTaiyu(text, tone, tailo, disableSandhi, fluid);
}

// Data structures
const INITIALS_DATA = [
  { symbol: 'b', name: '無', tailo: 'bô', desc: '雙唇濁塞音，發音類似國語的ㄅ，但聲帶要振動。' },
  { symbol: 'p', name: '步', tailo: 'pōo', desc: '雙唇清不送氣塞音，與國語的ㄅ發音相同。' },
  { symbol: 'ph', name: '皮', tailo: 'phuê', desc: '雙唇清送氣塞音，與國語的ㄆ發音相同。' },
  { symbol: 'm', name: '毛', tailo: 'môo', desc: '雙唇濁鼻音，與國語的ㄇ發音相同。' },
  { symbol: 't', name: '肚', tailo: 'tōo', desc: '舌尖清不送氣塞音，與國語的ㄉ發音相同。' },
  { symbol: 'th', name: '鐵', tailo: 'thih', desc: '舌尖清送氣塞音，與國語的ㄊ發音相同。' },
  { symbol: 'n', name: '籃', tailo: 'nâ', desc: '舌尖濁鼻音，與國語的ㄋ發音相同。' },
  { symbol: 'l', name: '柳', tailo: 'liú', desc: '舌尖濁邊音，與國語的ㄌ發音相同。' },
  { symbol: 'k', name: '菇', tailo: 'koo', desc: '舌根清不送氣塞音，與國語的ㄍ發音相同。' },
  { symbol: 'kh', name: '去', tailo: 'khì', desc: '舌根清送氣塞音，與國語的ㄎ發音相同。' },
  { symbol: 'ng', name: '雅', tailo: 'ngá', desc: '舌根濁鼻音，發音時舌後部往上頂，氣流由鼻腔出。' },
  { symbol: 'h', name: '魚', tailo: 'hî', desc: '喉清擦音，與國語的ㄏ發音相同。' },
  { symbol: 'ts', name: '曾', tailo: 'tsan', desc: '舌尖前清不送氣塞擦音，類似國語的ㄗ。' },
  { symbol: 'tsh', name: '出', tailo: 'tshut', desc: '舌尖前清送氣塞擦音，與國語的ㄘ發音相同。' },
  { symbol: 's', name: '沙', tailo: 'sua', desc: '舌尖前清擦音，與國語的ㄙ發音相同。' },
  { symbol: 'j', name: '字', tailo: 'jī', desc: '舌尖前濁擦音，發音時聲帶要振動。類似國語的ㄖ。' },
  { symbol: 'g', name: '語', tailo: 'gí', desc: '舌根濁塞音，與英字 go 的 g 類似，聲帶振動。' }
];

const FINALS_DATA = [
  { group: '單韻母 (Simple Vowels)', items: [
    { symbol: 'a', example: '鴨 (ah)', desc: '發音如國語的「ㄚ」' },
    { symbol: 'i', example: '衣 (i)', desc: '發音如國語的「ㄧ」' },
    { symbol: 'u', example: '有 (ū)', desc: '發音如國語的「ㄨ」' },
    { symbol: 'e', example: '會 (ē)', desc: '國語無此單音，介於 ㄝ 與 ㄟ 之間' },
    { symbol: 'o', example: '蚵 (ô)', desc: '發音如國語的「ㄛ」' },
    { symbol: 'oo', example: '黑 (oo)', desc: '發音位置比 o 更低，唇形更圓' }
  ]},
  { group: '複韻母 (Diphthongs)', items: [
    { symbol: 'ai', example: '愛 (ài)', desc: '發音如國語的「ㄞ」' },
    { symbol: 'au', example: '後 (āu)', desc: '發音如國語的「ㄠ」' },
    { symbol: 'ia', example: '寫 (siá)', desc: '發音如國語的「ㄧㄚ」' },
    { symbol: 'iu', example: '手 (tshiú)', desc: '發音如國語的「ㄧㄡ」' },
    { symbol: 'ua', example: '花 (hua)', desc: '發音如國語的「ㄨㄚ」' },
    { symbol: 'ue', example: '話 (uē)', desc: '由 ㄨ 滑音至 ㄝ' },
    { symbol: 'ui', example: '水 (suí)', desc: '發音如國語的「ㄨㄟ」' }
  ]},
  { group: '鼻化韻母 (Nasalized Vowels)', items: [
    { symbol: 'ann', example: '餡 (ānn)', desc: '發 a 音同時氣流由鼻腔發出' },
    { symbol: 'inn', example: '圓 (înn)', desc: '發 i 音同時氣流由鼻腔發出' },
    { symbol: 'unn', example: '園 (ûnn)', desc: '發 u 音同時氣流由鼻腔發出' },
    { symbol: 'enn', example: '嬰 (ēnn)', desc: '發 e 音同時氣流由鼻腔發出' },
    { symbol: 'onn', example: '惡 (ōnn)', desc: '發 o 音同時氣流由鼻腔發出' }
  ]},
  { group: '聲化韻 (Syllabic Consonants)', items: [
    { symbol: 'm', example: '姆 (ḿ)', desc: '不發母音，直接閉雙唇發鼻音' },
    { symbol: 'ng', example: '黃 (n̂g)', desc: '不發母音，直接以舌根音發鼻音' }
  ]}
];

const TONES_DATA = [
  { tone: 1, name: '第一聲 (高平調)', mark: 'a', pitch: '55', desc: '發音高而平穩，如國語的「第一聲」', example: '君 (kun)', freqDesc: '高音 (55)' },
  { tone: 2, name: '第二聲 (高降調)', mark: 'á', pitch: '51', desc: '從高音往下墜降，如國語的「第四聲」', example: '滾 (kún)', freqDesc: '高降音 (51)' },
  { tone: 3, name: '第三聲 (中降調)', mark: 'à', pitch: '31', desc: '從中音往下輕降，發音低沉', example: '棍 (kùn)', freqDesc: '中降音 (31)' },
  { tone: 4, name: '第四聲 (中入聲)', mark: 'at', pitch: '3', desc: '短促收尾，音平偏低，尾音帶 p, t, k, h', example: '骨 (kut)', freqDesc: '短促音 (3)' },
  { tone: 5, name: '第五聲 (低緩升調)', mark: 'â', pitch: '24', desc: '從低音往上揚升，如國語的「第二聲」', example: '群 (kûn)', freqDesc: '揚升音 (24)' },
  { tone: 7, name: '第七聲 (中平調)', mark: 'ā', pitch: '33', desc: '發音平穩，音高介於一與三之間', example: '郡 (kūn)', freqDesc: '中平音 (33)' },
  { tone: 8, name: '第八聲 (高入聲)', mark: 'a̍t', pitch: '5', desc: '短促收尾，音平偏高，尾音帶 p, t, k, h', example: '滑 (hua̍t)', freqDesc: '短促音 (5)' }
];

const COMBINER_DICT: Record<string, { word: string; desc: string }> = {
  'ba1': { word: '爸', desc: '指父親（如：爸爸 bā-pah）' },
  'bo5': { word: '無', desc: '沒有、無、非（如：無錢 bô-tsînn）' },
  'be2': { word: '馬', desc: '哺乳動物、馬匹（如：騎馬 khiâ-bé）' },
  'bi2': { word: '美', desc: '美麗、好看（如：美麗 bî-lē）' },
  'bi5': { word: '米', desc: '稻米、白米（如：白米 pe̍h-bí）' },
  'sa1': { word: '衫', desc: '衣服、衣衫（如：穿衫 tshīng-sann）' },
  'si1': { word: '獅', desc: '貓科猛獸、獅子（如：獅子 sai-á）' },
  'si4': { word: '四', desc: '數目字四（如：四個 sì-ê）' },
  'si7': { word: '是', desc: '對、正確、是的（如：毋是 m̄-sī）' },
  'lo7': { word: '路', desc: '道路、路途（如：行路 kiânn-lōo）' },
  'tshia1': { word: '車', desc: '交通工具、車輛（如：開車 khui-tshia）' },
  'tshai4': { word: '菜', desc: '蔬菜、菜餚（如：食菜 tsiah-tshài）' },
  'ai3': { word: '愛', desc: '喜愛、需要、熱愛（如：愛你 ài-lí）' },
  'koo1': { word: '姑', desc: '姑姑、父親的姊妹（如：阿姑 a-koo）' },
  'kong2': { word: '講', desc: '說話、談論（如：講話 kóng-uē）' },
  'tsu1': { word: '書', desc: '書籍、書本（如：讀書 tha̍k-tsu）' },
  'kha1': { word: '腳', desc: '人或動物的下肢（如：跤步 kha-pōo）' },
  'khun3': { word: '睏', desc: '睡覺（如：欲睏 jù-khùn）' },
  'png2': { word: '飯', desc: '熟稻穀、米飯（如：食飯 tsiah-pn̄g）' },
  'tsit8': { word: '一', desc: '數目字一（如：一個 tsi̍t-ê）' },
  'nng1': { word: '卵', desc: '蛋、卵（如：雞卵 ke-nn̄g）' },
  'hue1': { word: '花', desc: '植物的花朵（如：開花 khui-hue）' },
  'hi5': { word: '魚', desc: '水生脊椎動物（如：釣魚 tiò-hî）' },
  'tsui2': { word: '水', desc: '液體、水份（如：飲水 lím-tsuí）' },
  'thau5': { word: '頭', desc: '頭部、首領（如：頭腦 thâu-náu）' },
  'gu2': { word: '牛', desc: '草食性哺乳類家畜（如：黃牛 n̂g-gû）' },
  'ke1': { word: '雞', desc: '家禽、雞隻（如：公雞 koong-ke）' },
  'am1': { word: '庵', desc: '尼姑庵、小廟' },
  'an1': { word: '安', desc: '平安、安定（如：平安 pîng-an）' },
  'ang1': { word: '紅', desc: '紅色、赤色（如：紅色 âng-sik）' },
  'ap8': { word: '盒', desc: '盒子、盛器（如：紙盒 tsuá-a̍p）' },
  'at1': { word: '遏', desc: '折斷（如：遏斷 at-tn̄g）' },
  'ak1': { word: '澆', desc: '澆水、灌溉（如：澆花 ak-hue）' },
  'ut1': { word: '熨', desc: '燙、熨斗（如：熨衫 ut-sann）' },
  'o1': { word: '烏', desc: '黑色（如：烏色 oo-sik）' },
  'ok1': { word: '惡', desc: '壞、惡劣（如：惡人 ok-lâng）' }
};

// --- Animations Database for the Animation Zone (動畫專區) ---
const ANIMATIONS_DATABASE = [
  {
    id: '08C4F8F4-7AA4-F011-BC9A-005056B2D58D',
    title: '百姓貴族第一季（普遍級）',
    subCaption: '（限臺澎金馬及離島地區觀看）',
    ageGroup: '國、高中階段',
    desc: '描述荒川弘成為漫畫家前，於北海道務農七年種種有趣的親身經歷。動畫透過幽默的口吻，闡述了農業與畜牧業的日常和辛勞，藉此達到「食農教育」的目的。',
    externalUrl: 'https://twbangga.moe.edu.tw/animation/08C4F8F4-7AA4-F011-BC9A-005056B2D58D',
    imageColor: 'from-[#5D4037] to-[#8D6E63]',
    emoji: '🐄',
    episodes: [
      {
        title: '第一集 牛奶',
        youtubeId: 'b1P_w9_38hE',
        subtitles: {
          mandarin: [
            "歡迎收看《百姓貴族》！今天我們就來談談牛奶。",
            "在北海道的農場裡，每天早上都要幫乳牛擠奶喔！",
            "新鮮的牛奶有著濃郁的香氣，是農民們辛苦的結晶。",
            "但是乳牛的照顧可不輕鬆，需要乾淨的草料和舒適的環境。",
            "點擊前往動畫學習專網，可以觀看完整官方影片唷！"
          ],
          taigi_hanzi: [
            "歡迎收看《百姓貴族》！今仔日咱就來開講牛奶。",
            "佇北海道的牧場，逐家透早攏著幫乳牛挵奶喔！",
            "新鮮的牛奶有真香甜的味，是作穡人辛苦的結晶。",
            "毋過乳牛的照顧真無簡單，需要清氣的草料佮好環境。",
            "點擊前往動畫學習專網，會當看完整的官方影片唷！"
          ],
          taigi_roman: [
            "Huan-gîng siu-khuànn 'Peh-sìnn Kuì-tsok'! Kin-á-ji̍t lán tō lâi khai-káng gû-ni-á.",
            "Tī Pak-hái-tō ê bo̍k-tiûnn, ta̍k-ke thàu-tsá lóng tio̍h pang jû-gû lóng-ni oh!",
            "Sin-sian ê gû-ni-á ū tsin phang-tinn ê bī, sī tso̍k-sit-lâng tsin-khóo ê kiat-tsinn.",
            "M̄-koh jû-gû ê tsiàu-kòo tsin bô kān-tan, su-iàu tshing-khì ê tsháu-liāu kah hó khuân-kíng.",
            "Tiám-kik tsîng-óng tōng-uē-o̍h-si̍p-tsuan-bāng, ē-tàng khuànn uân-tsuán ê kuann-hong íng-pinn ioh!"
          ]
        }
      },
      {
        title: '第二集 馬鈴薯',
        youtubeId: 'YOn0pGfL0nQ',
        subtitles: {
          mandarin: [
            "第二集登場！我們來聊聊北海道最出名的馬鈴薯。",
            "這裡的土壤 and 氣候非常適合馬鈴薯的生長。",
            "剛挖出來的馬鈴薯，做成奶油馬鈴薯真是人間美味！",
            "不過採收期非常忙碌，全家人都要下田幫忙。",
            "想看完整精彩內容，歡迎點擊前往動畫學習專網！"
          ],
          taigi_hanzi: [
            "第二集登場！咱來開講北海道上出名的馬鈴薯。",
            "遮的土地佮氣候特別適合馬鈴薯的生長。",
            "拄挖出來的馬鈴薯，做奶油馬鈴薯真正是天上的美味！",
            "毋過收成期非常無閒，全家大細攏著下田鬥相共。",
            "想欲看完整的精彩內容，歡迎點擊前往動畫學習專網！"
          ],
          taigi_roman: [
            "Tē-jī tsi̍p tsing-tiûnn! Lán lâi khai-káng Pak-hái-tō siōng tshut-bîng ê má-lîng-tsî.",
            "Tsiâ ê thôo-tuā kah khì-hāu ti̍k-pia̍t sū-ha̍p má-lîng-tsî ê sing-tióng.",
            "Tú-á-ua̍t tshut-lâi ê má-lîng-tsî, tsò nâi-iû má-lîng-tsî tsin-tsiann sī thian-siōng ê bī!",
            "M̄-koh siu-sîng-kî hui-siông bô-êng, tsuân-ke tuā-sè lóng tio̍h ê-tiân tàu-sann-kāng.",
            "Sinn-beh khuànn uân-tsuán ê tsing-tshái lāi-iông, huan-gîng tiám-kik tsîng-óng tōng-uē-o̍h-si̍p-tsuan-bāng!"
          ]
        }
      },
      {
        title: '第三集 熊',
        youtubeId: '9i6Y1Y6Rj_E',
        subtitles: {
          mandarin: [
            "第三集！北海道的農場偶爾會有熊出沒喔！",
            "野生大自然中，熊是力量非常強大的動物。",
            "如果遇到熊，絕對不能驚慌，要冷靜撤離。",
            "人與自然和諧相處，是北海道農民的智慧。",
            "官方專網有更詳細的爆笑情節，快去看看吧！"
          ],
          taigi_hanzi: [
            "第三集！北海道的牧場不時會有熊出沒喔！",
            "佇天然的大自然中，熊是力氣非常強大的動物。",
            "若遇著熊，絕對毋通驚惶，著愛冷靜離開。",
            "人佮自然和平相處，是北海道作穡人的智慧。",
            "官方專網有閣較詳細的笑詼故事，快捷去看覓咧！"
          ],
          taigi_roman: [
            "Tē-sann tsi̍p! Pak-hái-tō ê bo̍k-tiûnn put-sî ê ū hîng tshut-bōo oh!",
            "Tī thian-jiân ê tāi-tsū-jiân tiong, hîng sī lia̍t-khì hui-siông kiông-tāi ê tōng-bu̍t.",
            "Nā tsuán-tio̍h hîng, tsuân-tuī m̄-thang kiann-hiânn, tio̍h-ài líng-tsīng lî-khui.",
            "Lâng kah tsū-jiân hô-pîng siong-tshú, sī Pak-hái-tō tso̍k-sit-lâng ê tì-huī.",
            "Kuan-hong tsuan-bāng ū koh-khah tsiong-sè ê tshiò-khue kòo-sū, khuài khì khuànn-māi leh!"
          ]
        }
      },
      {
        title: '第四集 菜蔬',
        youtubeId: 'nC91bB24iFE',
        subtitles: {
          mandarin: [
            "第四集！農場裡種植了各式各樣的水鮮蔬菜。",
            "無農藥、天然灌溉的蔬菜，吃起來特別甘甜！",
            "北海道的陽光讓南瓜、高麗菜長得又大又好。",
            "多吃蔬菜身體好，這是土地對我們的恩賜。",
            "精彩情節都在動畫學習專網，點擊前往觀看！"
          ],
          taigi_hanzi: [
            "第四集！牧場裡種植了各式各樣的水鮮菜蔬。",
            "無農藥、天然灌溉的菜蔬，食起來特別甘甜！",
            "北海道的日頭予金瓜、高麗菜生得閣大閣好。",
            "加食菜蔬人健康，這是土地對咱的恩典。",
            "精彩故事攏佇動畫學習專網，點擊前往收看！"
          ],
          taigi_roman: [
            "Tē-sì tsi̍p! Bo̍k-tiûnn lí tsing-tî-liáu koh-sit-koh-iūnn ê tshuí-sin tshài-tshu.",
            "Bô lóng-ia̍h, thian-jiân kuàn-khài ê tshài-tshu, tsia̍h-khí-lâi ti̍k-pia̍t kam-tinn!",
            "Pak-hái-tō ê ji̍t-thâu hōo kim-kue, ko-lē-tshài senn-tit koh tuā koh hó.",
            "Ke tsia̍h tshài-tshu lâng kiān-khong, tse sī thôo-tē tùi lán ê un-tián.",
            "Tsing-tshái kòo-sū lóng tī tōng-uē-o̍h-si̍p-tsuan-bāng, tiám-kik tsîng-óng siu-khuànn!"
          ]
        }
      }
    ]
  },
  {
    id: 'anpanman-movie',
    title: '麵包超人電影版：多洛林與妖怪嘉年華（普遍級）',
    subCaption: '（限臺澎金馬及離島地區觀看）',
    ageGroup: '學齡前(幼兒園)',
    desc: '麵包超人與夥伴們和愛搗蛋的可愛妖怪「多洛林」一起展開一場驚險刺激又溫馨的妖怪嘉年華大冒險！',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#E53935] to-[#FB8C00]',
    emoji: '🦸',
    episodes: [
      {
        title: '第一集 妖怪嘉年華',
        youtubeId: '3tqZg9kFvAw',
        subtitles: {
          mandarin: [
            "麵包超人來囉！今天我們要去好玩的妖怪嘉年華！",
            "那裡有好多可愛又愛搗蛋的小妖怪喔。",
            "但是，細菌人好像又在策劃壞主意了...",
            "別擔心！有麵包超人在，一定能保護大家的安全！",
            "更多精彩的台語配音動畫，快到教育部的專網觀看吧！"
          ],
          taigi_hanzi: [
            "麵包超人來囉！今仔日咱欲來去心適的妖怪嘉年華！",
            "遐有足多可愛閣愛創治人的小妖怪喔。",
            "毋過，細菌人好親像閣佇度衰主意了...",
            "免煩惱！有麵包超人佇遮，一定會當保護大眾的安全！",
            "閣較精彩的台語配音動畫，緊到教育部的專網觀看啦！"
          ],
          taigi_roman: [
            "Bīn-pau-tshia-lâng lâi-lōo! Kin-á-ji̍t lán beh lâi-khì tshin-tshi̍p ê iau-kuāi ka-nî-huâ!",
            "Hia ū tsin tsuē khó-ài koh ài tshòng-tī-lâng ê sió iau-kuāi oh.",
            "M̄-koh, Sè-khun-lâng hó-tshin-tshīnn koh tī tōo-suē tsú-ì liáu...",
            "Bián huân-ló! Ū Bīn-pau-tshia-lâng tī tsia, it-tīng ê-tàng pó-hōo tāi-tsiong ê an-tsuân!",
            "Koh-khah tsing-tshái ê Tâi-gí phuè-îm tōng-uē, kín kàu Kàu-io̍k-pōo ê tsuan-bāng siu-khuànn lah!"
          ]
        }
      }
    ]
  },
  {
    id: 'inventor',
    title: '大發明家（普遍級）',
    subCaption: '（限臺澎金馬及離島地區觀看）',
    ageGroup: '小學階段',
    desc: '跟著充滿好奇心的大發明家一起探索生活中的科學小奧秘與發明歷程，激發無限的創意與想像力！',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#00897B] to-[#4DB6AC]',
    emoji: '⚙️',
    episodes: [
      {
        title: '第一集 飛行器的夢想',
        youtubeId: 'u07uRjT4Nno',
        subtitles: {
          mandarin: [
            "大發明家今天在工坊裡研究如何像小鳥一樣飛翔。",
            "空氣動力學、翅膀的結構，都是飛行的關鍵喔！",
            "雖然失敗了很多次，但他從來沒有氣餒。",
            "終於，紙模型在空中完美地滑翔了起來！",
            "快到動畫專網，看看更豐富的科學小知識吧！"
          ],
          taigi_hanzi: [
            "大發明家今仔日佇工坊研究按怎好親像小鳥咧飛。",
            "空氣動力學、飛行翼的結構，攏是飛行的關鍵喔！",
            "雖然失敗足多次，毋過他從來無失望氣餒。",
            "最後，紙模型佇空中完美地飛起來了！",
            "快到動畫專網，看閣較豐富的科學小知識啦！"
          ],
          taigi_roman: [
            "Tāi-huat-bîng-ka kin-á-ji̍t tī kang-phông jiân-kiù án-tsuánn hó-tshin-tshīnn sió-tsiáu leh pue.",
            "Khong-khì tōng-li̍k-ha̍k, pue-bîng-si̍t ê kiat-kòo, lóng-sī pue-bîng ê kuān-kiān oh!",
            "Sui-jiân sit-pāi tsin tsuē tshù, m̄-koh i tsiông-lâi bô sit-bōng khì-luī.",
            "Tsue-āu, tsuá-bôo-hîng tī khong-tiong uân-bí tē pue-khí-lâi liáu!",
            "Khuài kàu tōng-uē-tsuan-bāng, khuànn koh-khah phong-phài ê kho-ha̍k sió-tì-sik lah!"
          ]
        }
      }
    ]
  },
  {
    id: 'maruko',
    title: '櫻桃小丸子台語版（普遍級）',
    subCaption: '（限臺澎金馬及離島地區觀看）',
    ageGroup: '小學階段',
    desc: '陪伴無數家庭成長的國民級動畫！看活潑可愛的小丸子與爺爺、爸爸媽媽、姐姐以及同學們在日常生活中發生的搞笑點滴。用最親切流利的台語重溫童年最經典的美好回憶！',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#EC407A] to-[#D81B60]',
    emoji: '🌸',
    episodes: [
      {
        title: '第一集 小丸子與爺爺的約定',
        youtubeId: '_8_vYVIdFQA',
        subtitles: {
          mandarin: [
            "爺爺，今天學校發了很好吃的布丁喔！",
            "真的嗎？那等一下我們一起分享吧，小丸子。",
            "太棒了！最喜歡爺爺了！",
            "不過，要留一個給姐姐，不然她又會生氣了。",
            "好，那我們現在就回家看卡通、吃布丁囉！"
          ],
          taigi_hanzi: [
            "阿公，今仔日學校發足好食的布丁喔！",
            "真正無？按呢等一下咱做伙來分食，小丸子。",
            "上讚了！我上愛阿公了！",
            "毋過，著愛留一粒予大姊，無伊等一下閣欲生氣了。",
            "好，按呢咱這馬作伙轉去厝看卡通、食布丁囉！"
          ],
          taigi_roman: [
            "A-kong, kin-á-ji̍t ha̍k-hāu huat tsin hó-tsia̍h ê pòo-ting oh!",
            "Tsin-tsiann bô? Án-ne tán-tsi̍t-ē lán tsò-hué lâi khun-tsia̍h, Sió-uân-tsù.",
            "Siōng tsàn liáu! Guá siōng ài a-kong liáu!",
            "M̄-koh, tio̍h-ài lâu tsi̍t-lia̍p hōo tuā-tsí, bô i tán-tsi̍t-ē koh beh senn-khì liáu.",
            "Hó, án-ne lán tsit-má tsò-hué tńg-khì tshù khuànn kha-thong, tsia̍h pòo-ting lōo!"
          ]
        }
      }
    ]
  },
  {
    id: 'cells-at-work',
    title: '工作細胞台語版（保護級）',
    subCaption: '（限臺澎金馬及離島地區觀看）',
    ageGroup: '國、高中階段',
    desc: '將人體內的細胞擬人化，描述紅血球、白血球、血小板等細胞在人體內努力對抗細菌、維持健康的日常故事。用精彩的台語配音，帶你一窺人體奧秘！',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#E53935] to-[#B71C1C]',
    emoji: '🩸',
    episodes: [
      {
        title: '第一集 肺炎鏈球菌',
        youtubeId: 'W3_96UfFwBw',
        subtitles: {
          mandarin: [
            "不好了！大量的肺炎鏈球菌從血管入侵了！",
            "我是紅血球，要把氧氣送到目的地，千萬不能被抓到！",
            "別怕，白血球參上！消滅所有有害細菌是我的職責！",
            "太帥了，戰鬥細胞們正在守護我們的身體健康呢！",
            "我們也要多喝水、多運動，跟體內的細胞們一起加油！"
          ],
          taigi_hanzi: [
            "無好了！大批的肺炎鏈球菌對血管入侵來了！",
            "我是紅血球，欲共氧氣送到目的地，千萬毋通被掠去！",
            "免驚，白血球參上！消滅所有有害的細菌是我的職責！",
            "真帥，戰鬥細胞們正咧守護咱的身體健康呢！",
            "咱也著加飲水、加運動，佮體內的細胞們做伙加油！"
          ],
          taigi_roman: [
            "Bô hó liáu! Tuā-phiat ê hī-iām-liân-kiû-khun tùi hueh-kún ji̍p-tshun lâi-liáu!",
            "Guá sī hông-hueh-kiû, beh kā ióng-khì sàng-kàu bōo-ti̍k-tē, tshian-bān m̄-thang pī lia̍h-khì!",
            "Bián kiann, pe̍h-hueh-kiû tsham-siōng! Siau-bia̍t sóo-ū iú-hāi ê sè-khun sī guá ê tsit-tsit!",
            "Tsin suāi, tsàn-tòo sè-pau-bûn tsing-leh siú-hōo lán ê sin-thé kiān-khong ne!",
            "Lán iā tio̍h ke lím tshuí, ke tūn-tōng, kah thé-lāi ê sè-pau-bûn tsò-hué ka-iû!"
          ]
        }
      }
    ]
  },
  {
    id: 'again-win',
    title: '再次得勝！',
    ageGroup: '國、高中階段',
    desc: '一部充滿熱血與奮鬥的校園體育動畫，講述主角們在台語配音的氛圍中互相扶持、永不放棄，再次奪下冠軍的感動故事！',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#1E88E5] to-[#1565C0]',
    emoji: '🏆',
    episodes: [
      {
        title: '第一集 新的起點',
        subtitles: {
          mandarin: [
            "今天，體育社的社員們在新的球場上集合了。",
            "雖然去年的決賽輸了，但大家眼裡依然閃耀著鬥志！",
            "學長說：我們一定要在今年的比賽中拿回冠軍！",
            "加油！讓我們跟著隊友一起，再次得勝！",
            "點擊連結前往教育部動畫學習專網，解鎖熱血全篇！"
          ],
          taigi_hanzi: [
            "今仔日，體育社的社員們佇新的球場集合了。",
            "雖然去年的決賽輸去，毋過逐家的眼內依然有鬥志！",
            "學長講：咱一定要佇今年的比賽提回冠軍！",
            "加油！予咱跟著隊友做伙，再次得勝！",
            "點擊連結前往教育部動畫學習專網，看熱血的故事！"
          ],
          taigi_roman: [
            "Kin-á-ji̍t, thé-io̍k-siā ê siā-uân-bûn tī sin ê kiû-tiûnn tsi̍p-ha̍p liáu.",
            "Sui-jiân khù-nî ê kuán-sài su-khì, m̄-koh ta̍k-ke ê gán-lāi i-jiân ū tàu-tsì!",
            "Ha̍k-tióng kóng: lán it-tīng-ài tī kin-nî ê pì-sài the̍h-uê kuân-kun!",
            "Ka-iû! Hōo lán tsin-tshia kò tūi-iú tsò-hué, tsài-tshù tit-sìng!",
            "Tiám-kik liân-kiat tsîng-óng Kàu-io̍k-pōo tōng-uē-o̍h-si̍p-tsuan-bāng, khuànn jia̍t-huih ê kòo-sū!"
          ]
        }
      }
    ]
  },
  {
    id: 'regret-creatures',
    title: '遺憾生物事典',
    ageGroup: '小學階段',
    desc: '介紹地球上各種「遺憾」卻又奇特無比的生物知識！用趣味的台語配音，為你揭開動物們鮮為人知、令人啼笑皆非的生存之道。',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#7CB342] to-[#558B2F]',
    emoji: '🐼',
    episodes: [
      {
        title: '第一集 無尾熊的秘密',
        subtitles: {
          mandarin: [
            "大家好！我是樹上可愛的無尾熊。",
            "雖然大家覺得我很可愛，但我的大腦其實小小的唷。",
            "而且我每天都要花20個小時在睡覺呢！",
            "這就是大自然給我們獨特的「遺憾」恩賜吧！",
            "更多爆笑的生物遺憾知識，請前往教育部官方專網！"
          ],
          taigi_hanzi: [
            "逐家好！我是樹仔頂可愛的無尾熊。",
            "雖然逐家覺得我足可愛，毋過我的腦袋其實小小的唷。",
            "而且我逐天攏著花20個鐘頭咧入睡呢！",
            "這就是大自然予咱特有的「遺憾」恩典吧！",
            "閣較笑詼的生物遺憾知識，請前往教育部官方專網！"
          ],
          taigi_roman: [
            "Ta-ke hó! Guá-sī tshiū-á-tíng khó-ài ê bô-bué-hîng.",
            "Sui-jiân ta̍k-ke tsat-tit guá tsin khó-ài, m̄-koh guá ê lán-tāi kî-si̍t sió-sió-á ioh.",
            "Jî-tshiánn guá ta̍k-thian lóng tio̍h hua 20 ê tsiong-thâu leh ji̍p-suī ne!",
            "Tse tō-sī tāi-tsū-jiân hōo lán ti̍k-iú ê 'uî-hān' un-tián pā!",
            "Koh-khah tshiò-khue ê sing-bu̍t uî-hān tì-sik, tshiann tsîng-óng Kàu-io̍k-pōo kuann-hong tsuan-bāng!"
          ]
        }
      }
    ]
  },
  {
    id: 'insect-land',
    title: 'Insect Land',
    ageGroup: '學齡前(幼兒園)',
    desc: '由香川照之策劃的昆蟲自然科學動畫，主角們是一群可愛的昆蟲夥伴，在昆蟲森林裡展開與大自然共處的奇妙學習旅程。',
    externalUrl: 'https://twbangga.moe.edu.tw/classification',
    imageColor: 'from-[#3949AB] to-[#1E88E5]',
    emoji: '🐞',
    episodes: [
      {
        title: '第一集 亞當的勇氣',
        subtitles: {
          mandarin: [
            "歡迎來到昆蟲森林！今天的小主角是螢火蟲亞當。",
            "亞當是一隻有點膽小的螢火蟲，一害怕屁股就不會發光了。",
            "但是，當夥伴遇到危險時，亞當鼓起了勇氣！",
            "哇！亞當的屁股發出了最溫暖、最明亮的光芒！",
            "精彩、溫馨、有教育意義的昆蟲世界，盡在動畫學習專網！"
          ],
          taigi_hanzi: [
            "歡迎來到昆蟲森林！今仔日的小主角是火金姑亞當。",
            "亞當是一隻有淡薄仔細膽的火金姑，驚惶屁股就袂發光了。",
            "毋過，當夥伴遇著危險時，亞當鼓起了勇氣！",
            "哇！亞當的屁股發出了上溫暖、上明亮的光芒！",
            "精彩、溫馨、有教育意義的昆蟲世界，盡在動畫學習專網！"
          ],
          taigi_roman: [
            "Huan-gîng lâi-kàu khun-thiông sìm-lîm! Kin-á-ji̍t ê sió tsú-kak sī huē-kim-koo A-tong.",
            "A-tong sī tsi̍t-tsiah ū tām-po̍h-á sè-tánn ê huē-kim-koo, kiann-hiânn phū-khóo tō bē huat-kng liáu.",
            "M̄-koh, tng hó-puânn tsat-tio̍h gûi-hiám sî, A-tong kóo-khí-liáu ióng-khì!",
            "Uā! A-tong ê phū-khóo huat-tshut-liáu siōng un-luán, siōng bîng-liāng ê kng-bâng!",
            "Tsing-tshái, un-xin, ū kàu-io̍k ì-gī ê khun-thiông sè-kài, tsìn tsāi tōng-uē-o̍h-si̍p-tsuan-bāng!"
          ]
        }
      }
    ]
  }
];

interface PhonicDetail {
  symbol: string;
  bopomofo: string;
  chant: string;
  exampleWords: { hanzi: string; tailo: string; english: string }[];
  illustration: string;
  mouthType: string;
}

const PHONIC_DETAILS_INITIALS: Record<string, PhonicDetail> = {
  'b': {
    symbol: 'b',
    bopomofo: 'ㄅ (濁)',
    chant: 'b b b 阿母的 b',
    exampleWords: [
      { hanzi: '阿母', tailo: 'a-bó', english: 'Mother' },
      { hanzi: '無閒', tailo: 'bô-iâinn', english: 'Busy' },
      { hanzi: '袂窳', tailo: 'bē-bái', english: 'Not bad' }
    ],
    illustration: 'mother',
    mouthType: 'closed_vibrate'
  },
  'p': {
    symbol: 'p',
    bopomofo: 'ㄅ',
    chant: 'p p p 玻璃的 p',
    exampleWords: [
      { hanzi: '玻璃', tailo: 'po-lê', english: 'Glass' },
      { hanzi: '報音', tailo: 'pòo-im', english: 'Report sound' },
      { hanzi: '老爸', tailo: 'lāu-pē', english: 'Father' }
    ],
    illustration: 'glass',
    mouthType: 'closed_pop'
  },
  'ph': {
    symbol: 'ph',
    bopomofo: 'ㄆ',
    chant: 'ph ph ph 碎碎的 ph',
    exampleWords: [
      { hanzi: '碎碎', tailo: 'phú-phú', english: 'Shattered' },
      { hanzi: '歹人', tailo: 'pháinn-lâng', english: 'Bad guy' },
      { hanzi: '皮包', tailo: 'phuê-á', english: 'Leather bag' }
    ],
    illustration: 'broken',
    mouthType: 'closed_pop_air'
  },
  'm': {
    symbol: 'm',
    bopomofo: 'ㄇ',
    chant: 'm m m 媽媽的 m',
    exampleWords: [
      { hanzi: '媽媽', tailo: 'má-máh', english: 'Mother' },
      { hanzi: '麵線', tailo: 'mî-suann', english: 'Noodles' },
      { hanzi: '毛刷', tailo: 'môo-tshat', english: 'Brush' }
    ],
    illustration: 'mother',
    mouthType: 'closed_nasal'
  },
  't': {
    symbol: 't',
    bopomofo: 'ㄉ',
    chant: 't t t 刀仔的 t',
    exampleWords: [
      { hanzi: '刀仔', tailo: 'to-á', english: 'Knife' },
      { hanzi: '度過', tailo: 'tōo-koo', english: 'Pass time' },
      { hanzi: '代誌', tailo: 'tāi-tsì', english: 'Matter' }
    ],
    illustration: 'knife',
    mouthType: 'tongue_up'
  },
  'th': {
    symbol: 'th',
    bopomofo: 'ㄊ',
    chant: 'th th th 桃仔的 th',
    exampleWords: [
      { hanzi: '桃仔', tailo: 'thô-á', english: 'Peach' },
      { hanzi: '天地', tailo: 'thiân-tē', english: 'Heaven and earth' },
      { hanzi: '窗仔', tailo: 'thang-á', english: 'Window' }
    ],
    illustration: 'peach',
    mouthType: 'tongue_up_air'
  },
  'n': {
    symbol: 'n',
    bopomofo: 'ㄋ',
    chant: 'n n n 貓仔的 n',
    exampleWords: [
      { hanzi: '貓仔', tailo: 'niau-á', english: 'Cat' },
      { hanzi: '籃仔', tailo: 'nâ-á', english: 'Basket' },
      { hanzi: '年仔', tailo: 'nî-á', english: 'Years' }
    ],
    illustration: 'cat',
    mouthType: 'tongue_nasal'
  },
  'l': {
    symbol: 'l',
    bopomofo: 'ㄌ',
    chant: 'l l l 囉唆的 l',
    exampleWords: [
      { hanzi: '囉唆', tailo: 'lo-so', english: 'Chatter' },
      { hanzi: '人來', tailo: 'lâng-lâi', english: 'People come' },
      { hanzi: '老師', tailo: 'lāu-sū', english: 'Teacher' }
    ],
    illustration: 'tongue',
    mouthType: 'tongue_side'
  },
  'k': {
    symbol: 'k',
    bopomofo: 'ㄍ',
    chant: 'k k k 哥哥的 k',
    exampleWords: [
      { hanzi: '哥哥', tailo: 'ko-ko', english: 'Older brother' },
      { hanzi: '姑姑', tailo: 'koo-koo', english: 'Aunt' },
      { hanzi: '笳苳', tailo: 'ka-tiāng', english: 'Bishop wood' }
    ],
    illustration: 'brother',
    mouthType: 'throat'
  },
  'kh': {
    symbol: 'kh',
    bopomofo: 'ㄎ',
    chant: 'kh kh kh 汽車的 kh',
    exampleWords: [
      { hanzi: '汽車', tailo: 'khì-tshia', english: 'Car' },
      { hanzi: '開花', tailo: 'khui-hue', english: 'Blossom' },
      { hanzi: '工作', tailo: 'khang-khuē', english: 'Work' }
    ],
    illustration: 'car',
    mouthType: 'throat_air'
  },
  'g': {
    symbol: 'g',
    bopomofo: 'ㄍ (濁)',
    chant: 'g g g 鵝仔的 g',
    exampleWords: [
      { hanzi: '鵝仔', tailo: 'gô-á', english: 'Goose' },
      { hanzi: '牛兒', tailo: 'gû-á', english: 'Little cow' },
      { hanzi: '議論', tailo: 'gī-lūn', english: 'Discussion' }
    ],
    illustration: 'goose',
    mouthType: 'throat_vibrate'
  },
  'ng': {
    symbol: 'ng',
    bopomofo: '兀',
    chant: 'ng ng ng 牙齒的 ng',
    exampleWords: [
      { hanzi: '牙齒', tailo: 'ngá-khí', english: 'Tooth' },
      { hanzi: '雅量', tailo: 'ngá-suānn', english: 'Tolerance' },
      { hanzi: '雅子', tailo: 'ngá-tsí', english: 'Princess' }
    ],
    illustration: 'tooth',
    mouthType: 'throat_nasal'
  },
  'h': {
    symbol: 'h',
    bopomofo: 'ㄏ',
    chant: 'h h h 魚仔的 h',
    exampleWords: [
      { hanzi: '魚仔', tailo: 'hî-á', english: 'Fish' },
      { hanzi: '花朵', tailo: 'hue-á', english: 'Flower' },
      { hanzi: '雨水', tailo: 'hōo-á', english: 'Rain' }
    ],
    illustration: 'fish',
    mouthType: 'throat_open'
  },
  'ts': {
    symbol: 'ts',
    bopomofo: 'ㄗ / ㄐ',
    chant: 'ts ts ts 書包的 ts',
    exampleWords: [
      { hanzi: '書包', tailo: 'tsu-pau', english: 'School bag' },
      { hanzi: '這時', tailo: 'tsit-má', english: 'Now' },
      { hanzi: '準備', tailo: 'tsiân-pī', english: 'Prepare' }
    ],
    illustration: 'bag',
    mouthType: 'teeth'
  },
  'tsh': {
    symbol: 'tsh',
    bopomofo: 'ㄘ / ㄑ',
    chant: 'tsh tsh tsh 菜頭的 tsh',
    exampleWords: [
      { hanzi: '菜頭', tailo: 'tshai-thâu', english: 'Radish' },
      { hanzi: '車讚', tailo: 'tshia-tsán', english: 'Car praise' },
      { hanzi: '田園', tailo: 'tshân-nî', english: 'Fields' }
    ],
    illustration: 'radish',
    mouthType: 'teeth_air'
  },
  's': {
    symbol: 's',
    bopomofo: 'ㄙ / ㄒ',
    chant: 's s s 雪文的 s',
    exampleWords: [
      { hanzi: '雪文', tailo: 'sa-bûn', english: 'Soap' },
      { hanzi: '寫字', tailo: 'siá-jī', english: 'Write' },
      { hanzi: '生日', tailo: 'senn-li̍t', english: 'Birthday' }
    ],
    illustration: 'soap',
    mouthType: 'teeth_fricative'
  },
  'j': {
    symbol: 'j',
    bopomofo: 'ㄖ',
    chant: 'j j j 日頭的 j',
    exampleWords: [
      { hanzi: '日頭', tailo: 'ji̍t-thâu', english: 'Sun' },
      { hanzi: '字兒', tailo: 'jī-á', english: 'Character' },
      { hanzi: '人情', tailo: 'jîn-tsîng', english: 'Favor' }
    ],
    illustration: 'sun',
    mouthType: 'teeth_vibrate'
  }
};

const PHONIC_DETAILS_FINALS: Record<string, PhonicDetail> = {
  'a': {
    symbol: 'a',
    bopomofo: 'ㄚ',
    chant: 'a a a 阿伯的 a',
    exampleWords: [
      { hanzi: '阿伯', tailo: 'a-peh', english: 'Uncle' },
      { hanzi: '阿母', tailo: 'a-bó', english: 'Mother' },
      { hanzi: '茄苳', tailo: 'ka-tiāng', english: 'Wood' }
    ],
    illustration: 'uncle',
    mouthType: 'open_large'
  },
  'i': {
    symbol: 'i',
    bopomofo: 'ㄧ',
    chant: 'i i i 醫生的 i',
    exampleWords: [
      { hanzi: '醫生', tailo: 'i-sing', english: 'Doctor' },
      { hanzi: '醫院', tailo: 'i-īnn', english: 'Hospital' },
      { hanzi: '這呢', tailo: 'tsiah-nî', english: 'So' }
    ],
    illustration: 'doctor',
    mouthType: 'open_wide'
  },
  'u': {
    symbol: 'u',
    bopomofo: 'ㄨ',
    chant: 'u u u 溫池的 u',
    exampleWords: [
      { hanzi: '溫池', tailo: 'u-tî', english: 'Hot spring' },
      { hanzi: '鴨子', tailo: 'u-tsí', english: 'Duckling' },
      { hanzi: '麵線', tailo: 'mû-suann', english: 'Noodles' }
    ],
    illustration: 'bath',
    mouthType: 'open_pursed'
  },
  'e': {
    symbol: 'e',
    bopomofo: 'ㄝ',
    chant: 'e e e 鞋仔的 e',
    exampleWords: [
      { hanzi: '鞋仔', tailo: 'ê-á', english: 'Shoe' },
      { hanzi: '矮子', tailo: 'kê-á', english: 'Shorty' },
      { hanzi: '尋找', tailo: 'tshē-á', english: 'Search' }
    ],
    illustration: 'shoe',
    mouthType: 'open_medium'
  },
  'o': {
    symbol: 'o',
    bopomofo: 'ㄛ',
    chant: 'o o o 蚵仔的 o',
    exampleWords: [
      { hanzi: '蚵仔', tailo: 'ô-á', english: 'Oyster' },
      { hanzi: '刀仔', tailo: 'to-á', english: 'Knife' },
      { hanzi: '囉唆', tailo: 'lo-so', english: 'Chatter' }
    ],
    illustration: 'oyster',
    mouthType: 'open_rounded'
  },
  'oo': {
    symbol: 'oo',
    bopomofo: 'ㄛ(圓)',
    chant: 'oo oo oo 烏車的 oo',
    exampleWords: [
      { hanzi: '烏車', tailo: 'oo-tshia', english: 'Black car' },
      { hanzi: '黑色', tailo: 'oo-sek', english: 'Black color' },
      { hanzi: '烏鴉', tailo: 'oo-á', english: 'Crow' }
    ],
    illustration: 'car_black',
    mouthType: 'open_rounded_deep'
  },
  'ai': {
    symbol: 'ai',
    bopomofo: 'ㄞ',
    chant: 'ai ai ai 愛國的 ai',
    exampleWords: [
      { hanzi: '愛國', tailo: 'ài-kok', english: 'Patriotic' },
      { hanzi: '歹人', tailo: 'pháinn-lâng', english: 'Bad guy' },
      { hanzi: '袂窳', tailo: 'bē-bái', english: 'Not bad' }
    ],
    illustration: 'heart',
    mouthType: 'open_large'
  },
  'au': {
    symbol: 'au',
    bopomofo: 'ㄠ',
    chant: 'au au au 後日的 au',
    exampleWords: [
      { hanzi: '後日', tailo: 'āu-ji̍t', english: 'Day after tomorrow' },
      { hanzi: '後面', tailo: 'āu-piah', english: 'Behind' },
      { hanzi: '頭殼', tailo: 'thâu-khak', english: 'Head' }
    ],
    illustration: 'calendar',
    mouthType: 'open_rounded'
  },
  'ia': {
    symbol: 'ia',
    bopomofo: 'ㄧㄚ',
    chant: 'ia ia ia 寫字的 ia',
    exampleWords: [
      { hanzi: '寫字', tailo: 'siá-jī', english: 'Writing' },
      { hanzi: '色樣', tailo: 'ia-sek', english: 'Color style' },
      { hanzi: '這些', tailo: 'tsia-ê', english: 'These' }
    ],
    illustration: 'pencil',
    mouthType: 'open_wide'
  },
  'iu': {
    symbol: 'iu',
    bopomofo: 'ㄧㄡ',
    chant: 'iu iu iu 手指的 iu',
    exampleWords: [
      { hanzi: '手指', tailo: 'tshiú-tsí', english: 'Ring finger' },
      { hanzi: '手環', tailo: 'tshiú-khuân', english: 'Bracelet' },
      { hanzi: '手巾', tailo: 'tshiú-kin', english: 'Handkerchief' }
    ],
    illustration: 'finger',
    mouthType: 'open_pursed'
  },
  'ua': {
    symbol: 'ua',
    bopomofo: 'ㄨㄚ',
    chant: 'ua ua ua 歡喜的 ua',
    exampleWords: [
      { hanzi: '歡喜', tailo: 'huann-hí', english: 'Happy' },
      { hanzi: '娃仔', tailo: 'ua-á', english: 'Baby doll' },
      { hanzi: '山仔', tailo: 'suann-á', english: 'Hill' }
    ],
    illustration: 'happy',
    mouthType: 'open_large'
  },
  'ue': {
    symbol: 'ue',
    bopomofo: 'ㄨㄝ',
    chant: 'ue ue ue 畫地的 ue',
    exampleWords: [
      { hanzi: '畫地', tailo: 'uē-tē', english: 'Draw on ground' },
      { hanzi: '畫畫', tailo: 'uē-á', english: 'Drawing' },
      { hanzi: '說話', tailo: 'uē-ho-ha', english: 'Conversation' }
    ],
    illustration: 'palette',
    mouthType: 'open_medium'
  },
  'ui': {
    symbol: 'ui',
    bopomofo: 'ㄨㄟ',
    chant: 'ui ui ui 衛生的 ui',
    exampleWords: [
      { hanzi: '衛生', tailo: 'uī-sing', english: 'Hygiene' },
      { hanzi: '漂亮', tailo: 'suí-á', english: 'Pretty' },
      { hanzi: '味色', tailo: 'būi-sek', english: 'Flavor and look' }
    ],
    illustration: 'shield',
    mouthType: 'open_pursed'
  },
  'ann': {
    symbol: 'ann',
    bopomofo: 'ㄚ (鼻化)',
    chant: 'ann ann ann 三領的 ann',
    exampleWords: [
      { hanzi: '三領', tailo: 'sa-niáun', english: 'Three clothes' },
      { hanzi: '肉粽', tailo: 'bá-tsàng', english: 'Rice dumpling' },
      { hanzi: '拼盤', tailo: 'pàn-á', english: 'Platter' }
    ],
    illustration: 'clothes',
    mouthType: 'open_nasal'
  },
  'inn': {
    symbol: 'inn',
    bopomofo: 'ㄧ (鼻化)',
    chant: 'inn inn inn 圓仔的 inn',
    exampleWords: [
      { hanzi: '圓仔', tailo: 'înn-á', english: 'Tangyuan' },
      { hanzi: '印色', tailo: 'inn-sek', english: 'Inked color' },
      { hanzi: '箭仔', tailo: 'tsinn-á', english: 'Arrow' }
    ],
    illustration: 'bowl',
    mouthType: 'open_nasal'
  },
  'unn': {
    symbol: 'unn',
    bopomofo: 'ㄨ (鼻化)',
    chant: 'unn unn unn 園仔的 unn',
    exampleWords: [
      { hanzi: '園仔', tailo: 'ûnn-á', english: 'Garden' },
      { hanzi: '春管', tailo: 'tshun-kuann', english: 'Spring pipe' },
      { hanzi: '順利', tailo: 'sūn-lī', english: 'Smooth' }
    ],
    illustration: 'garden',
    mouthType: 'open_nasal'
  },
  'enn': {
    symbol: 'enn',
    bopomofo: 'ㄝ (鼻化)',
    chant: 'enn enn enn 嬰仔的 enn',
    exampleWords: [
      { hanzi: '嬰仔', tailo: 'ēnn-á', english: 'Baby' },
      { hanzi: '間存', tailo: 'kēnn-tshun', english: 'Preserve' },
      { hanzi: '病仔', tailo: 'pēnn-á', english: 'Patient' }
    ],
    illustration: 'baby',
    mouthType: 'open_nasal'
  },
  'onn': {
    symbol: 'onn',
    bopomofo: 'ㄛ (鼻化)',
    chant: 'onn onn onn 噢噢的 onn',
    exampleWords: [
      { hanzi: '噢噢', tailo: 'ōnn-ōnn', english: 'Chant sound' },
      { hanzi: '半仔', tailo: 'pōnn-á', english: 'Companion' },
      { hanzi: '亂嚷', tailo: 'lōnn-lo', english: 'Clamor' }
    ],
    illustration: 'drum',
    mouthType: 'open_nasal'
  },
  'm': {
    symbol: 'm',
    bopomofo: 'ㄇ (聲化)',
    chant: 'm m m 不是的 m',
    exampleWords: [
      { hanzi: '不是', tailo: 'ḿ-sī', english: 'Is not' },
      { hanzi: '姆仔', tailo: 'm-á', english: 'Aunt' },
      { hanzi: '十日', tailo: 'tsáp-m', english: 'Ten days' }
    ],
    illustration: 'cross',
    mouthType: 'closed_nasal'
  },
  'ng': {
    symbol: 'ng',
    bopomofo: '兀 (聲化)',
    chant: 'ng ng ng 黃色的 ng',
    exampleWords: [
      { hanzi: '黃色', tailo: 'n̂g-sek', english: 'Yellow' },
      { hanzi: '黃仔', tailo: 'ng-á', english: 'Little Yellow' },
      { hanzi: '庄腳', tailo: 'tsn̂g-kha', english: 'Countryside' }
    ],
    illustration: 'banana',
    mouthType: 'throat_nasal'
  }
};

function renderIllustration(type: string) {
  switch (type) {
    case 'glass':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M18 10 L46 10 L40 54 L24 54 Z" fill="#E0F7FA" stroke="#00ACC1" strokeWidth="3" strokeLinejoin="round" />
          <path d="M22 30 L42 30 L39 52 L25 52 Z" fill="#4DD0E1" opacity="0.6" />
          <ellipse cx="32" cy="10" rx="14" ry="3.5" fill="#B2EBF2" stroke="#00ACC1" strokeWidth="2" />
          <circle cx="28" cy="40" r="2" fill="#FFFFFF" />
          <circle cx="36" cy="44" r="1.5" fill="#FFFFFF" />
          <circle cx="32" cy="36" r="1" fill="#FFFFFF" />
        </svg>
      );
    case 'broken':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M10 32 L25 15 L40 25 L54 10 L45 45 L20 48 Z" fill="#E0F2F1" stroke="#009688" strokeWidth="2" />
          <path d="M10 32 L30 35 L40 25 M30 35 L20 48" stroke="#009688" strokeWidth="2.5" />
          <circle cx="45" cy="20" r="1.5" fill="#009688" />
          <circle cx="15" cy="40" r="1" fill="#009688" />
        </svg>
      );
    case 'mother':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="32" r="24" fill="#FFE0B2" stroke="#FF9800" strokeWidth="3" />
          <path d="M12 24 C12 10, 52 10, 52 24 C52 16, 12 16, 12 24 Z" fill="#5D4037" />
          <circle cx="20" cy="36" r="4" fill="#FF8A80" opacity="0.6" />
          <circle cx="44" cy="36" r="4" fill="#FF8A80" opacity="0.6" />
          <circle cx="24" cy="30" r="2.5" fill="#3E2723" />
          <circle cx="40" cy="30" r="2.5" fill="#3E2723" />
          <path d="M28 38 Q32 42 36 38" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'knife':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M15 48 L45 18 C47 16, 50 19, 48 21 L18 51 Z" fill="#CFD8DC" stroke="#78909C" strokeWidth="2" />
          <path d="M10 54 L18 51 L15 48 Z" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
          <line x1="25" y1="38" x2="35" y2="28" stroke="#90A4AE" strokeWidth="1.5" />
        </svg>
      );
    case 'peach':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M32 16 C16 16, 12 36, 32 54 C52 36, 48 16, 32 16 Z" fill="#FFAB91" stroke="#FF5722" strokeWidth="3" />
          <path d="M32 16 C25 24, 25 40, 32 54" fill="none" stroke="#FF5722" strokeWidth="1.5" opacity="0.5" />
          <path d="M32 16 Q40 8 45 14 Q38 20 32 16" fill="#81C784" stroke="#388E3C" strokeWidth="1.5" />
        </svg>
      );
    case 'cat':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="34" r="20" fill="#FFB74D" stroke="#E65100" strokeWidth="2.5" />
          <path d="M15 20 L22 30 L12 28 Z" fill="#FF9800" stroke="#E65100" strokeWidth="2" />
          <path d="M49 20 L42 30 L52 28 Z" fill="#FF9800" stroke="#E65100" strokeWidth="2" />
          <ellipse cx="24" cy="32" rx="2" ry="3.5" fill="#3E2723" />
          <ellipse cx="40" cy="32" rx="2" ry="3.5" fill="#3E2723" />
          <polygon points="32,36 30,34 34,34" fill="#E65100" />
          <line x1="16" y1="36" x2="26" y2="36" stroke="#E65100" strokeWidth="1.5" />
          <line x1="48" y1="36" x2="38" y2="36" stroke="#E65100" strokeWidth="1.5" />
        </svg>
      );
    case 'tongue':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M10 24 C10 12, 54 12, 54 24 C54 44, 10 44, 10 24 Z" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="2" />
          <path d="M22 32 Q32 40 42 32" fill="none" stroke="#F57F17" strokeWidth="2" />
          <circle cx="22" cy="24" r="2" fill="#F57F17" />
          <circle cx="42" cy="24" r="2" fill="#F57F17" />
          <path d="M48 20 L56 16 M48 24 L56 24" stroke="#F57F17" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'brother':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="34" r="20" fill="#FFE0B2" stroke="#FF9800" strokeWidth="2.5" />
          <path d="M14 26 C14 14, 50 14, 50 26 Z" fill="#0288D1" />
          <path d="M12 26 L52 26 L48 30 L16 30 Z" fill="#03A9F4" />
          <circle cx="24" cy="34" r="2.5" fill="#3E2723" />
          <circle cx="40" cy="34" r="2.5" fill="#3E2723" />
          <path d="M28 42 Q32 45 36 42" fill="none" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'car':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 36 L12 28 C12 24, 20 20, 32 20 C44 20, 52 24, 52 28 L52 36 Z" fill="#E53935" stroke="#B71C1C" strokeWidth="2.5" />
          <path d="M8 34 L56 34 C58 34, 58 44, 56 44 L8 44 C6 44, 6 34, 8 34 Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="2" />
          <path d="M16 28 L28 24 L28 28 Z" fill="#E0F7FA" />
          <path d="M48 28 L36 24 L36 28 Z" fill="#E0F7FA" />
          <circle cx="18" cy="44" r="7" fill="#424242" stroke="#212121" strokeWidth="2" />
          <circle cx="46" cy="44" r="7" fill="#424242" stroke="#212121" strokeWidth="2" />
          <circle cx="18" cy="44" r="2" fill="#FFFFFF" />
          <circle cx="46" cy="44" r="2" fill="#FFFFFF" />
        </svg>
      );
    case 'goose':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M16 48 C16 36, 28 32, 28 24 C28 16, 20 16, 20 10 C20 4, 32 4, 32 10 C32 18, 24 24, 24 34 C24 44, 48 44, 48 48 Z" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2.5" />
          <path d="M16 48 L48 48 C52 48, 52 52, 48 52 L16 52 C12 52, 12 48, 16 48 Z" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1.5" />
          <path d="M18 10 L12 12 L18 14 Z" fill="#FF9800" />
          <circle cx="25" cy="8" r="1.5" fill="#37474F" />
        </svg>
      );
    case 'tooth':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M20 12 C20 8, 44 8, 44 12 C44 24, 48 28, 40 48 C36 40, 32 40, 28 48 C20 28, 20 24, 20 12 Z" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="3" strokeLinejoin="round" />
          <path d="M26 12 Q32 16 38 12" fill="none" stroke="#CFD8DC" strokeWidth="2" />
          <path d="M46 16 L50 20 M50 16 L46 20" stroke="#00BCD4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'bag':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <rect x="16" y="18" width="32" height="34" rx="6" fill="#4CAF50" stroke="#2E7D32" strokeWidth="3" />
          <path d="M22 18 L22 12 Q32 8 42 12 L42 18" fill="none" stroke="#2E7D32" strokeWidth="3" />
          <rect x="22" y="32" width="20" height="14" rx="2" fill="#81C784" stroke="#2E7D32" strokeWidth="2" />
          <line x1="16" y1="26" x2="48" y2="26" stroke="#2E7D32" strokeWidth="2.5" />
        </svg>
      );
    case 'radish':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M32 20 C42 20, 48 30, 44 48 C40 54, 32 58, 32 58 C32 58, 24 54, 20 48 C16 30, 22 20, 32 20 Z" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="3" />
          <path d="M32 20 Q24 8 26 6 Q32 14 32 20" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          <path d="M32 20 Q40 8 38 6 Q32 14 32 20" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
          <path d="M32 20 Q32 4 34 2 Q34 12 32 20" fill="#81C784" stroke="#2E7D32" strokeWidth="2" />
        </svg>
      );
    case 'soap':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <rect x="14" y="20" width="36" height="24" rx="5" fill="#4FC3F7" stroke="#0288D1" strokeWidth="3" />
          <ellipse cx="32" cy="32" rx="12" ry="6" fill="#81D4FA" opacity="0.6" />
          <circle cx="16" cy="14" r="3" fill="none" stroke="#0288D1" strokeWidth="1.5" />
          <circle cx="48" cy="16" r="4.5" fill="none" stroke="#0288D1" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="2" fill="none" stroke="#0288D1" strokeWidth="1" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="32" r="16" fill="#FFCA28" stroke="#F57F17" strokeWidth="3" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="32"
              y1="10"
              x2="32"
              y2="2"
              stroke="#F57F17"
              strokeWidth="3.5"
              strokeLinecap="round"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
          <circle cx="27" cy="29" r="1.5" fill="#5D4037" />
          <circle cx="37" cy="29" r="1.5" fill="#5D4037" />
          <path d="M29 36 Q32 39 35 36" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 32 C12 24, 36 12, 48 24 L54 18 L54 46 L48 40 C36 52, 12 40, 12 32 Z" fill="#FF7043" stroke="#D84315" strokeWidth="2.5" />
          <path d="M48 24 L52 28 M48 40 L52 36" stroke="#D84315" strokeWidth="1.5" />
          <circle cx="22" cy="28" r="2.5" fill="#3E2723" />
          <path d="M28 24 Q32 32 28 40" fill="none" stroke="#D84315" strokeWidth="2" />
          <circle cx="10" cy="20" r="1.5" fill="none" stroke="#FF7043" strokeWidth="1" />
        </svg>
      );
    case 'uncle':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="34" r="20" fill="#FFE0B2" stroke="#FF9800" strokeWidth="2.5" />
          <path d="M12 28 C12 16, 52 16, 52 28" stroke="#B0BEC5" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="32" r="5" fill="none" stroke="#3E2723" strokeWidth="2" />
          <circle cx="40" cy="32" r="5" fill="none" stroke="#3E2723" strokeWidth="2" />
          <line x1="29" y1="32" x2="35" y2="32" stroke="#3E2723" strokeWidth="2" />
          <path d="M28 44 Q32 47 36 44" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'doctor':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="24" r="14" fill="#FFE0B2" stroke="#FF9800" strokeWidth="2" />
          <path d="M22 38 C22 46, 42 46, 42 38" fill="none" stroke="#78909C" strokeWidth="3" />
          <circle cx="32" cy="46" r="3" fill="#37474F" />
          <path d="M14 54 L18 36 L46 36 L50 54 Z" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="2.5" />
          <path d="M24 36 L32 44 L40 36" fill="none" stroke="#90A4AE" strokeWidth="2" />
        </svg>
      );
    case 'bath':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M10 28 L54 28 C54 28, 54 48, 32 48 C10 48, 10 28, 10 28 Z" fill="#E0F7FA" stroke="#00ACC1" strokeWidth="3" />
          <rect x="6" y="24" width="52" height="4" rx="2" fill="#B2EBF2" stroke="#00ACC1" strokeWidth="2" />
          <path d="M20 18 Q22 14 20 10" fill="none" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 18 Q34 14 32 10" fill="none" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round" />
          <path d="M44 18 Q46 14 44 10" fill="none" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'shoe':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M10 44 L20 28 Q32 20 46 36 L54 36 C56 36, 56 44, 52 44 Z" fill="#FF7043" stroke="#D84315" strokeWidth="2.5" />
          <rect x="12" y="44" width="40" height="4" rx="2" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1.5" />
          <line x1="28" y1="28" x2="34" y2="34" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="32" y1="26" x2="38" y2="32" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );
    case 'oyster':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M14 36 C14 20, 50 20, 50 36 C50 48, 14 48, 14 36 Z" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="2.5" />
          <path d="M14 36 C16 42, 48 42, 50 36" fill="#CFD8DC" opacity="0.6" />
          <circle cx="32" cy="36" r="5" fill="#FFFFFF" stroke="#FFD54F" strokeWidth="1.5" />
          <circle cx="34" cy="34" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );
    case 'car_black':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 36 L12 28 C12 24, 20 20, 32 20 C44 20, 52 24, 52 28 L52 36 Z" fill="#37474F" stroke="#212121" strokeWidth="2.5" />
          <path d="M8 34 L56 34 C58 34, 58 44, 56 44 L8 44 C6 44, 6 34, 8 34 Z" fill="#455A64" stroke="#212121" strokeWidth="2" />
          <path d="M16 28 L28 24 L28 28 Z" fill="#E0F7FA" />
          <path d="M48 28 L36 24 L36 28 Z" fill="#E0F7FA" />
          <circle cx="18" cy="44" r="7" fill="#212121" />
          <circle cx="46" cy="44" r="7" fill="#212121" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 24 C12 12, 32 12, 32 28 C32 12, 52 12, 52 24 C52 42, 32 54, 32 54 C32 54, 12 42, 12 24 Z" fill="#EF5350" stroke="#C62828" strokeWidth="3" />
          <circle cx="22" cy="20" r="3" fill="#FFFFFF" opacity="0.4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <rect x="14" y="16" width="36" height="36" rx="4" fill="#FFFFFF" stroke="#0288D1" strokeWidth="3" />
          <rect x="14" y="16" width="36" height="10" fill="#0288D1" />
          <circle cx="22" cy="34" r="2" fill="#B0BEC5" />
          <circle cx="32" cy="34" r="2" fill="#B0BEC5" />
          <circle cx="42" cy="34" r="2" fill="#B0BEC5" />
          <circle cx="22" cy="42" r="2" fill="#0288D1" />
          <circle cx="32" cy="42" r="2" fill="#B0BEC5" />
          <circle cx="42" cy="42" r="2" fill="#B0BEC5" />
        </svg>
      );
    case 'pencil':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M46 12 L52 18 L24 46 L14 48 L16 38 Z" fill="#FFD54F" stroke="#F57C00" strokeWidth="2" />
          <path d="M14 48 L18 44 L16 38 Z" fill="#FFE082" />
          <path d="M14 48 L15 45 L17 47 Z" fill="#212121" />
          <path d="M46 12 L41 17 L47 23 L52 18 Z" fill="#EF9A9A" />
        </svg>
      );
    case 'finger':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M24 50 L24 24 C24 20, 28 20, 28 24 L28 44 M28 44 L28 14 C28 10, 32 10, 32 14 L32 44 M32 44 L32 18 C32 14, 36 14, 36 18 L36 44" fill="none" stroke="#FFD54F" strokeWidth="5" strokeLinecap="round" />
          <path d="M16 54 Q32 58 48 54 L44 38 M20 38 L16 54" stroke="#FF9800" strokeWidth="2.5" />
        </svg>
      );
    case 'happy':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="32" r="24" fill="#FFF176" stroke="#F57F17" strokeWidth="3" />
          <path d="M20 28 L24 32 L20 36 L24 32 L20 28 Z" fill="#F57F17" stroke="#F57F17" strokeWidth="2" />
          <path d="M44 28 L40 32 L44 36 L40 32 L44 28 Z" fill="#F57F17" stroke="#F57F17" strokeWidth="2" />
          <path d="M24 40 Q32 48 40 40" fill="none" stroke="#F57F17" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'palette':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 36 C12 18, 48 12, 52 28 C54 36, 44 48, 32 48 C20 48, 12 48, 12 36 Z" fill="#D7CCC8" stroke="#5D4037" strokeWidth="3" />
          <circle cx="22" cy="28" r="4" fill="#EF5350" />
          <circle cx="34" cy="24" r="4" fill="#4CAF50" />
          <circle cx="44" cy="32" r="4" fill="#0288D1" />
          <ellipse cx="22" cy="40" rx="3" ry="2" fill="#FFFFFF" stroke="#5D4037" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M32 10 L52 16 L48 44 C44 52, 32 56, 32 56 C32 56, 20 52, 16 44 L12 16 Z" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="3" />
          <path d="M32 20 L42 24 L40 42 C38 46, 32 48, 32 48 C32 48, 26 46, 24 42 L22 24 Z" fill="#90CAF9" opacity="0.6" />
        </svg>
      );
    case 'clothes':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 24 L24 16 L32 20 L40 16 L52 24 L48 48 L16 48 Z" fill="#E1BEE7" stroke="#8E24AA" strokeWidth="3" />
          <circle cx="32" cy="30" r="2.5" fill="#8E24AA" />
          <circle cx="32" cy="38" r="2.5" fill="#8E24AA" />
        </svg>
      );
    case 'bowl':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M12 32 C12 32, 12 50, 32 50 C52 50, 52 32, 52 32 Z" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="3" />
          <rect x="8" y="28" width="48" height="4" rx="2" fill="#FFF59D" stroke="#FBC02D" strokeWidth="2" />
          <circle cx="24" cy="24" r="5" fill="#EF9A9A" stroke="#E53935" strokeWidth="1" />
          <circle cx="34" cy="22" r="4.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
          <circle cx="42" cy="25" r="4" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
        </svg>
      );
    case 'garden':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M10 44 L10 48 Q32 54 54 48 L54 44 Z" fill="#8D6E63" />
          <circle cx="20" cy="32" r="6" fill="#F8BBD0" />
          <circle cx="20" cy="32" r="2" fill="#FFEB3B" />
          <path d="M20 38 L20 48" stroke="#4CAF50" strokeWidth="2.5" />
          <circle cx="44" cy="28" r="5" fill="#E1BEE7" />
          <circle cx="44" cy="28" r="1.5" fill="#FFEB3B" />
          <path d="M44 33 L44 48" stroke="#4CAF50" strokeWidth="2" />
        </svg>
      );
    case 'baby':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M16 28 L48 28 L44 50 L20 50 Z" fill="#F0F4C3" stroke="#9E9D24" strokeWidth="2.5" />
          <circle cx="32" cy="24" r="8" fill="#FFE0B2" stroke="#FF9800" strokeWidth="1.5" />
          <path d="M28 24 Q32 27 36 24" fill="none" stroke="#FF9800" strokeWidth="1" />
        </svg>
      );
    case 'drum':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <rect x="14" y="24" width="36" height="24" rx="3" fill="#E53935" stroke="#B71C1C" strokeWidth="3" />
          <ellipse cx="32" cy="24" rx="18" ry="4" fill="#ECEFF1" stroke="#B71C1C" strokeWidth="2" />
          <line x1="16" y1="12" x2="26" y2="22" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
          <circle cx="26" cy="22" r="2" fill="#E53935" />
        </svg>
      );
    case 'cross':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <circle cx="32" cy="32" r="24" fill="#FFEBEE" stroke="#E53935" strokeWidth="3" />
          <line x1="22" y1="22" x2="42" y2="42" stroke="#E53935" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="42" y1="22" x2="22" y2="42" stroke="#E53935" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 'banana':
      return (
        <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
          <path d="M16 16 C30 16, 48 24, 48 42 C48 48, 44 48, 44 42 C44 28, 28 24, 16 24 Z" fill="#FFEB3B" stroke="#F57F17" strokeWidth="3" />
          <path d="M16 16 L14 14" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function renderMouthShape(mouthType: string) {
  switch (mouthType) {
    case 'closed':
    case 'closed_pop':
    case 'closed_pop_air':
    case 'closed_vibrate':
    case 'closed_nasal':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <path d="M 20 30 Q 50 15 80 30 Q 50 45 20 30" fill="#FF9E80" stroke="#FF5722" strokeWidth="3" />
          <path d="M 20 30 Q 50 30 80 30" fill="none" stroke="#E64A19" strokeWidth="2.5" />
          <circle cx="10" cy="30" r="5" fill="#FFAB91" opacity="0.6" />
          <circle cx="90" cy="30" r="5" fill="#FFAB91" opacity="0.6" />
        </svg>
      );
    case 'open_large':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <ellipse cx="50" cy="30" rx="30" ry="18" fill="#3E2723" stroke="#FF5722" strokeWidth="4" />
          <path d="M 30 38 Q 50 28 70 38 Q 50 48 30 38" fill="#FF8A80" />
          <path d="M 32 18 Q 50 22 68 18" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      );
    case 'open_wide':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <path d="M 15 30 Q 50 20 85 30 Q 50 48 15 30" fill="#FF9E80" stroke="#FF5722" strokeWidth="3" />
          <path d="M 22 30 Q 50 38 78 30" fill="none" stroke="#E64A19" strokeWidth="2" />
          <rect x="35" y="25" width="30" height="4" fill="#FFFFFF" rx="1" />
        </svg>
      );
    case 'open_pursed':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <circle cx="50" cy="30" r="14" fill="#FF9E80" stroke="#FF5722" strokeWidth="4" />
          <circle cx="50" cy="30" r="7" fill="#3E2723" />
        </svg>
      );
    case 'open_rounded':
    case 'open_rounded_deep':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <ellipse cx="50" cy="30" rx="20" ry="16" fill="#FF9E80" stroke="#FF5722" strokeWidth="4.5" />
          <ellipse cx="50" cy="30" rx="12" ry="9" fill="#3E2723" />
        </svg>
      );
    case 'open_medium':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <path d="M 20 30 Q 50 12 80 30 Q 50 48 20 30" fill="#FF9E80" stroke="#FF5722" strokeWidth="3.5" />
          <ellipse cx="50" cy="30" rx="20" ry="7" fill="#3E2723" />
        </svg>
      );
    case 'teeth_showing':
    case 'teeth_fricative':
    case 'teeth':
    case 'teeth_air':
    case 'teeth_vibrate':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <path d="M 18 30 Q 50 16 82 30 Q 50 44 18 30" fill="#FF9E80" stroke="#FF5722" strokeWidth="3" />
          <rect x="28" y="24" width="44" height="12" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1.5" rx="1" />
          <line x1="50" y1="24" x2="50" y2="36" stroke="#CFD8DC" strokeWidth="1" />
          <line x1="39" y1="24" x2="39" y2="36" stroke="#CFD8DC" strokeWidth="1" />
          <line x1="61" y1="24" x2="61" y2="36" stroke="#CFD8DC" strokeWidth="1" />
          <line x1="28" y1="30" x2="72" y2="30" stroke="#CFD8DC" strokeWidth="1" />
        </svg>
      );
    case 'tongue_up':
    case 'tongue_up_air':
    case 'tongue_nasal':
    case 'tongue_side':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <ellipse cx="50" cy="30" rx="28" ry="16" fill="#3E2723" stroke="#FF5722" strokeWidth="3" />
          <path d="M 36 34 C 36 24, 46 16, 50 16 C 54 16, 64 24, 64 34 Z" fill="#FF8A80" stroke="#FF5252" strokeWidth="1.5" />
        </svg>
      );
    case 'throat':
    case 'throat_air':
    case 'throat_vibrate':
    case 'throat_nasal':
    case 'throat_open':
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <ellipse cx="50" cy="30" rx="30" ry="18" fill="#3E2723" stroke="#FF5722" strokeWidth="3.5" />
          <path d="M 46 12 Q 50 22 54 12" fill="#FF8A80" />
          <ellipse cx="50" cy="44" rx="20" ry="8" fill="#FF8A80" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 60" className="w-full max-w-[150px] aspect-[5/3] mx-auto">
          <ellipse cx="50" cy="30" rx="24" ry="12" fill="#FF9E80" stroke="#FF5722" strokeWidth="3" />
        </svg>
      );
  }
}

export default function PhonicsPage({
  onNavigate,
  initialTab = 'phonics_scheme'
}: {
  onNavigate: (view: string) => void;
  initialTab?: string;
}) {
  const [activeSidebar, setActiveSidebar] = useState<string>(initialTab);
  const [schemeTab, setSchemeTab] = useState<'initials' | 'finals' | 'tones'>('initials');

  // --- 3-Level Initials & Finals Interactive Board States ---
  const [initialsTab, setInitialsTab] = useState<string>('唇音');
  const [selectedInitialsSymbol, setSelectedInitialsSymbol] = useState<string | null>(null);
  const [initialsViewMode, setInitialsViewMode] = useState<'list' | 'detail' | 'practice'>('list');

  const [finalsTab, setFinalsTab] = useState<string>('單韻母 (Simple Vowels)');
  const [selectedFinalsSymbol, setSelectedFinalsSymbol] = useState<string | null>(null);
  const [finalsViewMode, setFinalsViewMode] = useState<'list' | 'detail' | 'practice'>('list');

  // --- Animation Zone States ---
  const [animationFilter, setAnimationFilter] = useState<string>('全部');
  const [selectedAnimSeries, setSelectedAnimSeries] = useState<any | null>(null);
  const [selectedAnimEpisode, setSelectedAnimEpisode] = useState<number | null>(null);
  const [animSubtitleMode, setAnimSubtitleMode] = useState<'mandarin' | 'taigi_hanzi' | 'taigi_roman'>('taigi_hanzi');
  const [animIsPlaying, setAnimIsPlaying] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (animIsPlaying) {
      interval = setInterval(() => {
        setAnimProgress(prev => {
          if (prev >= 100) {
            setAnimIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [animIsPlaying]);

  // --- Simulated voice recorder hooks ---
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);
  const [playbackActive, setPlaybackActive] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      setRecordProgress(0);
      interval = setInterval(() => {
        setRecordProgress(prev => {
          if (prev >= 100) {
            setIsRecording(false);
            setHasRecorded(true);
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    let interval: any;
    if (playbackActive) {
      setPlaybackProgress(0);
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setPlaybackActive(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [playbackActive]);

  const startSimulatedRecord = () => {
    setIsRecording(true);
    setHasRecorded(false);
    setPlaybackActive(false);
  };

  const playSimulatedRecording = () => {
    if (!hasRecorded) return;
    setPlaybackActive(true);
  };

  const SIDEBAR_ITEMS = [
    { id: 'phonics_scheme', label: '拼音方案', subtitle: '認識聲母、韻母' },
    { id: 'initials_learn', label: '聲母學習', subtitle: '掌握聲母發音' },
    { id: 'finals_learn', label: '韻母學習', subtitle: '單元韻母練習' },
    { id: 'phonics_practice', label: '拼音練習', subtitle: '綜合拼音練習' },
    { id: 'sandhi_tool', label: '連讀變調', subtitle: '台語語音與變調工具' },
    { id: 'tone_practice', label: '動畫專區', subtitle: '台語精彩動畫影片' },
    { id: 'phonics_games', label: '拼音遊戲', subtitle: '遊戲中學拼音' },
    { id: 'related_links', label: '相關連結', subtitle: '更多學習資源' },
  ];

  // --- Sandhi Tool State ---
  const [sandhiInput, setSandhiInput] = useState<string>('a-pe̍h');
  const [sandhiHanzi, setSandhiHanzi] = useState<string>('阿伯');

  // --- Combiner State ---
  const [selectedInitial, setSelectedInitial] = useState<string>('b');
  const [selectedFinal, setSelectedFinal] = useState<string>('a');
  const [selectedTone, setSelectedTone] = useState<number>(2);
  const [combinedSyllable, setCombinedSyllable] = useState<string>('bá');

  useEffect(() => {
    // Generate syllable visual representations
    // Realistically update combining markings
    let vowelMark = selectedFinal;
    if (selectedTone === 2) {
      vowelMark = selectedFinal.replace('a', 'á').replace('i', 'í').replace('u', 'ú').replace('e', 'é').replace('o', 'ó');
    } else if (selectedTone === 3) {
      vowelMark = selectedFinal.replace('a', 'à').replace('i', 'ì').replace('u', 'ù').replace('e', 'è').replace('o', 'ò');
    } else if (selectedTone === 5) {
      vowelMark = selectedFinal.replace('a', 'â').replace('i', 'î').replace('u', 'û').replace('e', 'ê').replace('o', 'ô');
    } else if (selectedTone === 7) {
      vowelMark = selectedFinal.replace('a', 'ā').replace('i', 'ī').replace('u', 'ū').replace('e', 'ē').replace('o', 'ō');
    } else if (selectedTone === 8) {
      vowelMark = selectedFinal.replace('a', 'a̍').replace('i', 'i̍').replace('u', 'u̍').replace('e', 'e̍').replace('o', 'o̍');
    }
    const merged = (selectedInitial === 'none' ? '' : selectedInitial) + vowelMark;
    setCombinedSyllable(merged);
  }, [selectedInitial, selectedFinal, selectedTone]);

  const handlePlayCombinerSound = () => {
    // Speak combining result
    const lookupKey = `${selectedInitial === 'none' ? '' : selectedInitial}${selectedFinal}${selectedTone}`;
    const wordInfo = COMBINER_DICT[lookupKey];
    if (wordInfo) {
      speakText(wordInfo.word);
    } else {
      speakText(combinedSyllable);
    }
    // Also play the corresponding tone contour synthetically
    playTonePitch(selectedTone);
  };

  // --- Game State ---
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean; msg: string } | null>(null);

  // Audio game bank
  const GAME_QUESTIONS = [
    { textToPronounce: '爸', syllable: 'bá', correctOption: 'b', type: 'initial', options: ['b', 'p', 'ph', 'm'], instruction: '聽發音，選出正確的聲母！' },
    { textToPronounce: '手', syllable: 'tshiú', correctOption: 'iu', type: 'final', options: ['ia', 'iu', 'ua', 'ui'], instruction: '聽發音，選出正確的韻母！' },
    { textToPronounce: '魚', syllable: 'hî', correctOption: '5', type: 'tone', options: ['1', '2', '5', '7'], instruction: '聽發音，選出正確的聲調！' },
    { textToPronounce: '去', syllable: 'khì', correctOption: 'kh', type: 'initial', options: ['k', 'kh', 'h', 'tsh'], instruction: '聽發音，選出正確的聲母！' },
    { textToPronounce: '水', syllable: 'suí', correctOption: '2', type: 'tone', options: ['1', '2', '3', '5'], instruction: '聽發音，選出正確的聲調！' }
  ];

  const playQuestionAudio = () => {
    const q = GAME_QUESTIONS[currentQuestionIdx];
    speakText(q.textToPronounce);
    if (q.type === 'tone') {
      playTonePitch(parseInt(q.correctOption));
    }
  };

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentQuestionIdx(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setTimeout(() => {
      speakText(GAME_QUESTIONS[0].textToPronounce);
    }, 400);
  };

  const handleAnswerSubmit = (option: string) => {
    if (feedback?.show) return;
    const q = GAME_QUESTIONS[currentQuestionIdx];
    const isCorrect = option === q.correctOption;

    if (isCorrect) {
      setScore(prev => prev + 20);
      setStreak(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        show: true,
        msg: `答對了！ 發音就是「${q.syllable}」的 ${q.type === 'initial' ? '聲母' : q.type === 'final' ? '韻母' : '聲調'}`
      });
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        show: true,
        msg: `答錯了！正確答案是「${q.correctOption}」，拼音為 ${q.syllable}`
      });
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    if (currentQuestionIdx < GAME_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        speakText(GAME_QUESTIONS[nextIdx].textToPronounce);
      }, 300);
    } else {
      setGameState('ended');
      // Save progress to localStorage
      const prevRecords = JSON.parse(localStorage.getItem('tai_lo_records') || '[]');
      const newRecord = {
        date: new Date().toLocaleDateString('zh-TW'),
        gameName: '聽力練習拼音挑戰',
        score: score,
        stars: Math.ceil(score / 20)
      };
      localStorage.setItem('tai_lo_records', JSON.stringify([newRecord, ...prevRecords]));
    }
  };

  return (
    <HubShell activeKey="phonics" onHome={() => onNavigate('home')}>
      {/* ---------------- Main Content Body ---------------- */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {/* Left Column: Sidebar Selection */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-4">
          <aside className="bg-[#071322] border-2 border-cyan-500/40 rounded-3xl p-4 md:p-5 shadow-[0_0_20px_rgba(2,132,199,0.15)]">
            <ul className="flex flex-col gap-3">
              {SIDEBAR_ITEMS.map((item) => {
                const sidebarIcons: Record<string, any> = {
                  phonics_scheme: BookOpen,
                  initials_learn: Megaphone,
                  finals_learn: Music,
                  phonics_practice: PenTool,
                  tone_practice: Tv,
                  phonics_games: Gamepad2,
                  related_links: Link,
                };
                const IconComponent = sidebarIcons[item.id] || BookOpen;
                const isActive = activeSidebar === item.id;
                return (
                  <li
                    key={item.id}
                    onClick={() => setActiveSidebar(item.id)}
                    className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 cursor-pointer transition-all border-2 active:scale-98 ${
                      isActive
                        ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                        : 'bg-[#030b17] hover:bg-[#0c1f38] text-white border-cyan-500/40 hover:border-cyan-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-cyan-400 text-slate-950' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'}`}>
                      <IconComponent
                        className="w-6 h-6 shrink-0"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-black text-base md:text-lg leading-snug ${isActive ? 'text-cyan-300' : 'text-white'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs md:text-sm text-cyan-200 font-extrabold mt-0.5 leading-snug">
                        {item.subtitle}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-amber-300' : 'text-cyan-400'
                      }`}
                      strokeWidth={2.5}
                    />
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Useful Taigi Bottom Card */}
          <div className="p-4 rounded-3xl bg-[#071322] border-2 border-cyan-500/40 flex items-center gap-3 shadow-md text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12 object-contain shrink-0">
              {/* Flower 1 */}
              <circle cx="20" cy="14" r="3" fill="#F2C94C" />
              <circle cx="16" cy="14" r="2.5" fill="#F2994A" />
              <circle cx="24" cy="14" r="2.5" fill="#F2994A" />
              <circle cx="20" cy="10" r="2.5" fill="#F2994A" />
              <circle cx="20" cy="18" r="2.5" fill="#F2994A" />
              {/* Flower 2 */}
              <circle cx="30" cy="20" r="2.5" fill="#F2C94C" />
              <circle cx="27" cy="20" r="2" fill="#F2994A" />
              <circle cx="33" cy="20" r="2" fill="#F2994A" />
              <circle cx="30" cy="17" r="2" fill="#F2994A" />
              <circle cx="30" cy="23" r="2" fill="#F2994A" />
              {/* Stems */}
              <path d="M20,18 Q19,28 21,34" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" />
              <path d="M30,23 Q28,29 23,34" fill="none" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" />
              {/* Leaves */}
              <path d="M19,25 C15,24 15,28 19,28 Z" fill="#219653" />
              <path d="M24,28 C28,27 28,31 24,31 Z" fill="#219653" />
              {/* Pot */}
              <path d="M16,34 L32,34 L29,44 L19,44 Z" fill="#D35400" />
              <rect x="14" y="32" width="20" height="3" rx="1.5" fill="#E67E22" />
            </svg>
            <div className="flex-1">
              <div className="font-black text-amber-300 text-base leading-tight">用心學台語</div>
              <div className="font-black text-cyan-100 text-sm leading-tight flex items-center gap-1.5 mt-1">
                生活更有趣 <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Displaying current tab content with high visual fidelity */}
        <div className="flex-1 bg-white rounded-3xl p-5 md:p-7 shadow-sm flex flex-col">
          <AnimatePresence mode="wait">
            {activeSidebar === 'phonics_scheme' && (
              <motion.div
                key="phonics_scheme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5"
              >
                {/* Banner Section matching the design */}
                <div className="relative rounded-3xl overflow-hidden border border-[#F1ECE0] shadow-sm">
                  <img src={heroFull} alt="拼音方案｜台語羅馬字拼音教學" className="w-full h-auto object-cover max-h-56" />
                </div>

                {/* Sub-tabs Selection */}
                <div className="flex flex-wrap gap-3 bg-[#FAF7F0] p-2 rounded-2xl border border-[#F1ECE0] w-fit">
                  <button
                    onClick={() => setSchemeTab('initials')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-base transition-all active:scale-95 ${
                      schemeTab === 'initials'
                        ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                        : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                    }`}
                  >
                    <Megaphone className="w-5 h-5" /> 聲母 (Initials)
                  </button>
                  <button
                    onClick={() => setSchemeTab('finals')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-base transition-all active:scale-95 ${
                      schemeTab === 'finals'
                        ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                        : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                    }`}
                  >
                    <Music className="w-5 h-5" /> 韻母 (Finals)
                  </button>
                  <button
                    onClick={() => setSchemeTab('tones')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-base transition-all active:scale-95 ${
                      schemeTab === 'tones'
                        ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                        : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                    }`}
                  >
                    <AudioLines className="w-5 h-5" /> 聲調 (Tones)
                  </button>
                </div>

                {/* Sub-tab Table Render */}
                <div className="flex-1 overflow-x-auto rounded-2xl border border-[#F1ECE0] shadow-inner bg-[#FCFAF5] p-2">
                  {schemeTab === 'initials' && (
                    <table className="w-full border-collapse rounded-xl overflow-hidden text-base md:text-lg">
                      <thead>
                        <tr className="bg-[#5C8A5A] text-white font-extrabold text-left">
                          <th className="py-4.5 px-5 text-center font-black w-32 border-r border-[#ffffff30] text-base md:text-lg">聲母類型</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">羅馬拼音</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">語詞（羅馬字）</th>
                          <th className="py-4.5 px-5 text-center font-black text-base md:text-lg">語詞（漢字）</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFE8D8]">
                        {[
                          {
                            group: '唇音',
                            items: [
                              { symbol: 'p', tailo: 'po-lê', hanzi: '玻璃' },
                              { symbol: 'ph', tailo: 'phú-phú', hanzi: '碎碎' },
                              { symbol: 'b', tailo: 'a-bó', hanzi: '阿母' },
                              { symbol: 'm', tailo: 'má-máh', hanzi: '媽媽' }
                            ]
                          },
                          {
                            group: '舌尖音',
                            items: [
                              { symbol: 't', tailo: 'to-á', hanzi: '刀仔' },
                              { symbol: 'th', tailo: 'thô-á', hanzi: '桃仔' },
                              { symbol: 'n', tailo: 'niau-á', hanzi: '貓仔' },
                              { symbol: 'l', tailo: 'lo-so', hanzi: '囉唆' }
                            ]
                          },
                          {
                            group: '舌根音',
                            items: [
                              { symbol: 'k', tailo: 'ko-ko', hanzi: '哥哥' },
                              { symbol: 'kh', tailo: 'khì-tshia', hanzi: '汽車' },
                              { symbol: 'g', tailo: 'gô-á', hanzi: '鵝仔' },
                              { symbol: 'ng', tailo: 'ngá-khí', hanzi: '牙齒' }
                            ]
                          },
                          {
                            group: '齒齦音',
                            items: [
                              { symbol: 'ts', tailo: 'tsu-pau', hanzi: '書包' },
                              { symbol: 'tsh', tailo: 'tshai-thâu', hanzi: '菜頭' },
                              { symbol: 's', tailo: 'sa-bûn', hanzi: '雪文' },
                              { symbol: 'j', tailo: 'ji̍t-thâu', hanzi: '日頭' }
                            ]
                          },
                          {
                            group: '喉音',
                            items: [
                              { symbol: 'h', tailo: 'hî-á', hanzi: '魚仔' }
                            ]
                          }
                        ].map((groupObj) => (
                          groupObj.items.map((item, idx) => {
                            const initialSoundMap: Record<string, string> = {
                              'p': '步', 'ph': '皮', 'b': '無', 'm': '毛',
                              't': '肚', 'th': '鐵', 'n': '籃', 'l': '柳',
                              'k': '菇', 'kh': '去', 'g': '語', 'ng': '雅',
                              'ts': '曾', 'tsh': '出', 's': '沙', 'j': '字', 'h': '魚'
                            };
                            return (
                              <tr key={item.symbol} className="hover:bg-[#F5F1E5] transition-colors">
                                {idx === 0 && (
                                  <td
                                    rowSpan={groupObj.items.length}
                                    className="bg-[#FAF4E5] py-5 px-4 text-center border-r border-[#EFE8D8] align-middle"
                                  >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl shadow-inner ${
                                        groupObj.group === '唇音' ? 'bg-[#FFF0EE] border-[#FFCDD2]' :
                                        groupObj.group === '舌尖音' ? 'bg-[#FFF3E0] border-[#FFE0B2]' :
                                        groupObj.group === '舌根音' ? 'bg-[#E8F5E9] border-[#C8E6C9]' :
                                        groupObj.group === '齒齦音' ? 'bg-[#E3F2FD] border-[#BBDEFB]' :
                                        'bg-[#F3E5F5] border-[#E1BEE7]'
                                      }`}>
                                        {groupObj.group === '唇音' ? '👄' :
                                         groupObj.group === '舌尖音' ? '👅' :
                                         groupObj.group === '舌根音' ? '🗣️' :
                                         groupObj.group === '齒齦音' ? '🦷' : '🎙️'}
                                      </div>
                                      <span className="text-xs md:text-sm font-black text-[#5C5548]">{groupObj.group}</span>
                                    </div>
                                  </td>
                                )}
                                <td className="py-4 px-6 text-center border-r border-[#EFE8D8]">
                                  <div className="inline-flex items-center gap-3 justify-center">
                                    <Volume2
                                      onClick={() => speakText(initialSoundMap[item.symbol] || item.symbol)}
                                      className="w-5.5 h-5.5 text-[#4E9B5D] hover:scale-125 cursor-pointer transition-transform"
                                    />
                                    <span className="font-mono font-black text-lg md:text-xl text-[#2D2A26]">{item.symbol}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-center border-r border-[#EFE8D8]">
                                  <div className="inline-flex items-center gap-3 justify-center">
                                    <Volume2
                                      onClick={() => speakText(item.hanzi, undefined, item.tailo)}
                                      className="w-5.5 h-5.5 text-[#4E9B5D] hover:scale-125 cursor-pointer transition-transform"
                                    />
                                    <span className="font-mono font-black text-base md:text-lg text-[#5C5548]">{item.tailo}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-center font-black text-[#2D2A26] text-lg md:text-2xl">
                                  {item.hanzi}
                                </td>
                              </tr>
                            );
                          })
                        ))}
                      </tbody>
                    </table>
                  )}

                  {schemeTab === 'finals' && (
                    <table className="w-full border-collapse rounded-xl overflow-hidden text-base md:text-lg">
                      <thead>
                        <tr className="bg-[#5C8A5A] text-white font-extrabold text-left">
                          <th className="py-4.5 px-5 text-center font-black w-32 border-r border-[#ffffff30] text-base md:text-lg">韻母類別</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">羅馬拼音</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">語詞（羅馬字）</th>
                          <th className="py-4.5 px-5 text-center font-black text-base md:text-lg">語詞（漢字）</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFE8D8]">
                        {[
                          {
                            group: '單韻母',
                            items: [
                              { symbol: 'a', tailo: 'a-pe̍h', hanzi: '阿伯' },
                              { symbol: 'i', tailo: 'i-sing', hanzi: '醫生' },
                              { symbol: 'u', tailo: 'u-tî', hanzi: '溫池' },
                              { symbol: 'e', tailo: 'ê-á', hanzi: '鞋仔' },
                              { symbol: 'o', tailo: 'ô-á', hanzi: '蚵仔' },
                              { symbol: 'oo', tailo: 'oo-tshia', hanzi: '烏車' }
                            ]
                          },
                          {
                            group: '複韻母',
                            items: [
                              { symbol: 'ai', tailo: 'ai-kok', hanzi: '愛國' },
                              { symbol: 'au', tailo: 'au-ji̍t', hanzi: '後日' },
                              { symbol: 'ia', tailo: 'siá-jī', hanzi: '寫字' },
                              { symbol: 'iu', tailo: 'tshiú-tsí', hanzi: '手指' },
                              { symbol: 'ua', tailo: 'hua-hí', hanzi: '歡喜' },
                              { symbol: 'ue', tailo: 'uē-tē', hanzi: '畫地' },
                              { symbol: 'ui', tailo: 'ui-sing', hanzi: '衛生' }
                            ]
                          },
                          {
                            group: '鼻化韻母',
                            items: [
                              { symbol: 'ann', tailo: 'sann-niá', hanzi: '三領' },
                              { symbol: 'inn', tailo: 'inn-á', hanzi: '圓仔' },
                              { symbol: 'unn', tailo: 'unn-á', hanzi: '園仔' },
                              { symbol: 'enn', tailo: 'enn-á', hanzi: '嬰仔' },
                              { symbol: 'onn', tailo: 'onn-onn', hanzi: '噢噢' }
                            ]
                          },
                          {
                            group: '聲化韻',
                            items: [
                              { symbol: 'm', tailo: 'm-sī', hanzi: '不是' },
                              { symbol: 'ng', tailo: 'n̂g-sek', hanzi: '黃色' }
                            ]
                          }
                        ].map((groupObj) => (
                          groupObj.items.map((item, idx) => (
                            <tr key={item.symbol} className="hover:bg-[#F5F1E5] transition-colors">
                              {idx === 0 && (
                                <td
                                  rowSpan={groupObj.items.length}
                                  className="bg-[#FAF4E5] py-5 px-4 text-center border-r border-[#EFE8D8] align-middle"
                                >
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl shadow-inner ${
                                      groupObj.group === '單韻母' ? 'bg-[#E3F2FD] border-[#BBDEFB]' :
                                      groupObj.group === '複韻母' ? 'bg-[#FFF3E0] border-[#FFE0B2]' :
                                      groupObj.group === '鼻化韻母' ? 'bg-[#FFF0EE] border-[#FFCDD2]' :
                                      'bg-[#E8F5E9] border-[#C8E6C9]'
                                    }`}>
                                      {groupObj.group === '單韻母' ? '🔤' :
                                       groupObj.group === '複韻母' ? '🔗' :
                                       groupObj.group === '鼻化韻母' ? '👃' : '🎵'}
                                    </div>
                                    <span className="text-xs md:text-sm font-black text-[#5C5548]">{groupObj.group}</span>
                                  </div>
                                </td>
                              )}
                              <td className="py-4 px-6 text-center border-r border-[#EFE8D8]">
                                <div className="inline-flex items-center gap-3 justify-center">
                                  <Volume2
                                    onClick={() => speakText(item.symbol === 'oo' ? '黑' : item.symbol)}
                                    className="w-5.5 h-5.5 text-[#4E9B5D] hover:scale-125 cursor-pointer transition-transform"
                                  />
                                  <span className="font-mono font-black text-lg md:text-xl text-[#2D2A26]">{item.symbol}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center border-r border-[#EFE8D8]">
                                <div className="inline-flex items-center gap-3 justify-center">
                                  <Volume2
                                    onClick={() => speakText(item.hanzi, undefined, item.tailo)}
                                    className="w-5.5 h-5.5 text-[#4E9B5D] hover:scale-125 cursor-pointer transition-transform"
                                  />
                                  <span className="font-mono font-black text-base md:text-lg text-[#5C5548]">{item.tailo}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center font-black text-[#2D2A26] text-lg md:text-2xl">
                                {item.hanzi}
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  )}

                  {schemeTab === 'tones' && (
                    <table className="w-full border-collapse rounded-xl overflow-hidden text-base md:text-lg">
                      <thead>
                        <tr className="bg-[#5C8A5A] text-white font-extrabold text-left">
                          <th className="py-4.5 px-5 text-center font-black w-28 border-r border-[#ffffff30] text-base md:text-lg">聲調</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">調號/調符</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">拼音例字</th>
                          <th className="py-4.5 px-5 text-center font-black border-r border-[#ffffff30] text-base md:text-lg">例字（漢字）</th>
                          <th className="py-4.5 px-5 text-center font-black text-base md:text-lg">調值與調性</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFE8D8] bg-[#FFFDF9]">
                        {[
                          { tone: 1, mark: 'a (無調號)', tailo: 'kun', hanzi: '君', value: '55', desc: '高平調 (高平音)' },
                          { tone: 2, mark: 'á (右上往左下)', tailo: 'kún', hanzi: '滾', value: '51', desc: '高降調 (高降音)' },
                          { tone: 3, mark: 'à (左上往右下)', tailo: 'kùn', hanzi: '棍', value: '31', desc: '中降調 (中降音)' },
                          { tone: 4, mark: 'ap / at / ak / ah (短促)', tailo: 'kut', hanzi: '骨', value: '3', desc: '中入聲 (短促音)' },
                          { tone: 5, mark: 'â (尖角向上)', tailo: 'kûn', hanzi: '群', value: '24', desc: '低緩升調 (揚升音)' },
                          { tone: 7, mark: 'ā (橫線)', tailo: 'kūn', hanzi: '郡', value: '33', desc: '中平調 (中平音)' },
                          { tone: 8, mark: 'a̍p / a̍t / a̍k / a̍h (短促直符)', tailo: 'ku̍t', hanzi: '滑', value: '5', desc: '高入聲 (高短促音)' }
                        ].map((t) => (
                          <tr key={t.tone} className="hover:bg-[#F5F1E5] transition-colors">
                            <td className="py-4.5 px-4 text-center border-r border-[#EFE8D8] font-bold">
                              <div className="flex items-center gap-2 justify-center">
                                <div className="w-10 h-10 rounded-full bg-[#E14D2A] text-white font-black text-base flex items-center justify-center shadow-md">
                                  {t.tone}
                                </div>
                              </div>
                            </td>
                            <td className="py-4.5 px-4 text-center border-r border-[#EFE8D8] font-mono font-black text-base md:text-lg text-gray-700">
                              {t.mark}
                            </td>
                            <td className="py-4.5 px-4 text-center border-r border-[#EFE8D8]">
                              <div className="inline-flex items-center gap-3.5 justify-center">
                                <Volume2
                                  onClick={() => {
                                    speakText(t.hanzi, t.tone, t.tailo);
                                    playTonePitch(t.tone);
                                  }}
                                  className="w-5.5 h-5.5 text-[#4E9B5D] hover:scale-125 cursor-pointer transition-transform"
                                />
                                <span className="font-mono font-black text-base md:text-lg text-[#5C5548]">{t.tailo}</span>
                              </div>
                            </td>
                            <td className="py-4.5 px-4 text-center border-r border-[#EFE8D8] font-black text-[#2D2A26] text-lg md:text-2xl">
                              {t.hanzi}
                            </td>
                            <td className="py-4.5 px-4 text-center text-[#5C5548] font-black text-sm md:text-base">
                              <span className="px-3.5 py-1.5 bg-[#F1ECE0] rounded-full text-gray-800 border border-[#E7E0D0] font-black">
                                {t.desc} ({t.value})
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Bottom Tip Bar matching the design */}
                <div className="flex items-center justify-between p-4 bg-[#E8F5E9] border-l-4 border-[#4E9B5D] rounded-r-2xl shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🔊</span>
                    <p className="text-sm font-extrabold text-[#2E7D32]">
                      點擊喇叭可聆聽發音，搭配語詞更容易記住拼音。
                    </p>
                  </div>
                  <div className="hidden md:flex items-center">
                    <svg className="w-10 h-10 text-[#4E9B5D]/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9zm0 16.2A7.2 7.2 0 1 1 12 4.8a7.2 7.2 0 0 1 0 14.4z"/>
                      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.4a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8z"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSidebar === 'initials_learn' && (
              <motion.div
                key="initials_learn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="border-b border-[#F1ECE0] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                  <div>
                    <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                      <span>📢</span> 聲母互動學習 (3-Level Board)
                    </h1>
                    <p className="text-[#8A8378] text-sm">點選聲母分類，點擊聲母展開詳細發音口形與互動練習</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="text-xs font-bold px-3 py-1 bg-[#4E9B5D]/10 text-[#4E9B5D] rounded-full">
                      口形圖解 👄
                    </span>
                    <span className="text-xs font-bold px-3 py-1 bg-[#E4772E]/10 text-[#E4772E] rounded-full">
                      錄音比對 🎙️
                    </span>
                  </div>
                </div>

                {initialsViewMode === 'list' && (
                  <div className="flex flex-col gap-6">
                    {/* Level 1: Category Selection Tabs */}
                    <div className="flex flex-wrap gap-3 p-2 bg-[#FAF7F0] rounded-2xl border border-[#F1ECE0] w-fit">
                      {['唇音', '舌尖音', '舌根音', '齒齦音'].map((cat) => {
                        const count = cat === '唇音' ? 4 : cat === '舌尖音' ? 4 : cat === '舌根音' ? 5 : 4;
                        return (
                          <button
                            key={cat}
                            onClick={() => setInitialsTab(cat)}
                            className={`px-6 py-3 rounded-xl font-black text-base md:text-lg transition-all active:scale-95 ${
                              initialsTab === cat
                                ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                                : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                            }`}
                          >
                            {cat} <span className="text-xs md:text-sm font-bold opacity-85">({count})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Level 2: Item Selection Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {INITIALS_DATA.filter((item) => {
                        if (initialsTab === '唇音') return ['b', 'p', 'ph', 'm'].includes(item.symbol);
                        if (initialsTab === '舌尖音') return ['t', 'th', 'n', 'l'].includes(item.symbol);
                        if (initialsTab === '舌根音') return ['k', 'kh', 'g', 'ng', 'h'].includes(item.symbol);
                        if (initialsTab === '齒齦音') return ['ts', 'tsh', 's', 'j'].includes(item.symbol);
                        return true;
                      }).map((initial) => {
                        const detail = PHONIC_DETAILS_INITIALS[initial.symbol];
                        return (
                          <div
                            key={initial.symbol}
                            onClick={() => {
                              setSelectedInitialsSymbol(initial.symbol);
                              setInitialsViewMode('detail');
                              speakText(initial.symbol === 'oo' ? '黑' : initial.symbol);
                            }}
                            className="group relative p-6 rounded-3xl bg-[#FFFDF9] border-2 border-[#F1ECE0] hover:border-[#4E9B5D] hover:shadow-xl cursor-pointer transition-all flex flex-col justify-between min-h-[180px] active:scale-[0.98]"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-5xl md:text-6xl font-black text-[#4E9B5D] group-hover:scale-110 transition-transform">
                                {initial.symbol}
                              </span>
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-[#A0988A] font-black tracking-wider">注音</span>
                                <span className="text-base md:text-lg font-black text-[#E4772E] bg-[#E4772E]/5 px-2.5 py-1 rounded-lg mt-1 border border-[#E4772E]/20">
                                  {detail?.bopomofo || 'ㄅ'}
                                </span>
                              </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-[#F5F0E4]">
                              <div className="text-sm md:text-base font-black text-[#3E2723] flex flex-wrap items-center gap-1.5 mb-1">
                                <span>例字：</span>
                                <span className="text-[#E14D2A] text-xl font-black">{initial.name}</span>
                                <span className="text-[#8A8378] font-bold text-xs md:text-sm">({initial.tailo})</span>
                              </div>
                              <p className="text-xs md:text-sm text-[#8A8378] leading-normal truncate group-hover:text-[#5C5548] font-semibold">
                                {initial.desc}
                              </p>
                            </div>
                            <div className="absolute right-4 bottom-4 w-7 h-7 rounded-full bg-[#4E9B5D]/5 group-hover:bg-[#4E9B5D] flex items-center justify-center transition-colors">
                              <ChevronRight className="w-4 h-4 text-[#4E9B5D] group-hover:text-white" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Level 3: Detail & Practice Board */}
                {initialsViewMode !== 'list' && selectedInitialsSymbol && (
                  (() => {
                    const detail = PHONIC_DETAILS_INITIALS[selectedInitialsSymbol];
                    if (!detail) return null;
                    return (
                      <div className="flex flex-col gap-6 bg-[#FCFAF5] p-5 md:p-6 rounded-3xl border border-[#EFE8D8]">
                        {/* Detail Head Nav */}
                        <div className="flex justify-between items-center border-b border-[#EFE8D8] pb-4">
                          <button
                            onClick={() => {
                              setInitialsViewMode('list');
                              setSelectedInitialsSymbol(null);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#EFE8D8] rounded-xl font-bold text-xs text-[#5C5548] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                          >
                            ← 返回聲母列表
                          </button>

                          {/* Quick tabs inside Detail View */}
                          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#EFE8D8]">
                            <button
                              onClick={() => setInitialsViewMode('detail')}
                              className={`px-4 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                                initialsViewMode === 'detail'
                                  ? 'bg-[#4E9B5D] text-white shadow-sm'
                                  : 'text-[#5C5548] hover:bg-[#FFF9EC]'
                              }`}
                            >
                              語音口形
                            </button>
                            <button
                              onClick={() => {
                                setInitialsViewMode('practice');
                                setHasRecorded(false);
                                setIsRecording(false);
                                setPlaybackActive(false);
                              }}
                              className={`px-4 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                                initialsViewMode === 'practice'
                                  ? 'bg-[#4E9B5D] text-white shadow-sm'
                                  : 'text-[#5C5548] hover:bg-[#FFF9EC]'
                              }`}
                            >
                              進入發音練習 🎙️
                            </button>
                          </div>
                        </div>

                        {initialsViewMode === 'detail' ? (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Mouth & Diagram Column */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                              <div className="bg-white p-5 rounded-2xl border border-[#EFE8D8] shadow-sm text-center">
                                <div className="text-xs font-black text-[#8A8378] tracking-widest uppercase mb-3">語音口形剖面圖</div>
                                <div className="py-4 bg-[#FFFDFC] rounded-xl border border-[#F8F5EE] mb-4">
                                  {renderMouthShape(detail.mouthType)}
                                </div>
                                <div className="text-left bg-[#FFF9EC] p-3 rounded-xl border border-[#EFE8D8] text-[13px] text-[#3E2723] font-bold leading-relaxed">
                                  <span className="text-[#E4772E] font-black">💡 發音技巧：</span>
                                  {INITIALS_DATA.find(i => i.symbol === selectedInitialsSymbol)?.desc}
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-sm text-center">
                                <div className="text-xs font-black text-[#8A8378] tracking-widest uppercase mb-3">生活聯想插圖</div>
                                <div className="py-2 flex justify-center items-center">
                                  {renderIllustration(detail.illustration)}
                                </div>
                                <span className="inline-block mt-2 text-xs font-bold text-[#8A8378] bg-[#FAF8F2] px-2.5 py-1 rounded-full border border-[#EFE8D8]">
                                  口訣：{detail.chant}
                                </span>
                              </div>
                            </div>

                            {/* Actions & Examples Column */}
                            <div className="lg:col-span-7 flex flex-col gap-5">
                              {/* Giant Symbol Panel */}
                              <div className="bg-white p-7 rounded-3xl border border-[#EFE8D8] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-5">
                                  <div className="w-24 h-24 rounded-2xl bg-[#4E9B5D]/5 border-2 border-[#4E9B5D] flex items-center justify-center shrink-0">
                                    <span className="text-6xl font-black text-[#4E9B5D]">{selectedInitialsSymbol}</span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-3">
                                      <h2 className="text-3xl font-black text-[#2D2A26]">{selectedInitialsSymbol} 聲母</h2>
                                      <span className="text-sm md:text-base font-black bg-[#E4772E]/10 text-[#E4772E] px-3.5 py-1 rounded-full border border-[#E4772E]/20">
                                        {detail.bopomofo}
                                      </span>
                                    </div>
                                    <p className="text-sm text-[#8A8378] mt-1.5 font-bold">點擊右側按鈕，聆聽真人發音口訣謠！</p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                                  <button
                                    onClick={() => speakText(selectedInitialsSymbol)}
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4E9B5D] text-white font-black text-base hover:bg-[#3D8552] active:scale-95 transition-all shadow-md flex-1 md:flex-none"
                                  >
                                    <Volume2 className="w-5 h-5" /> 聽符號發音
                                  </button>
                                  <button
                                    onClick={() => {
                                      const sentence = detail.chant.replace(/[a-zA-Z]/g, '').trim();
                                      speakText(sentence);
                                    }}
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E4772E] text-white font-black text-base hover:bg-[#C9601E] active:scale-95 transition-all shadow-md flex-1 md:flex-none"
                                  >
                                    <Music className="w-5 h-5" /> 唸歌謠唱誦
                                  </button>
                                </div>
                              </div>

                              {/* Example Words Section */}
                              <div className="bg-white p-6 rounded-3xl border border-[#EFE8D8] shadow-sm">
                                <h3 className="font-black text-[#2D2A26] text-lg mb-5 flex items-center gap-2">
                                  <span className="w-2 h-5 bg-[#4E9B5D] rounded-full" />
                                  日常語詞與拼寫實踐
                                </h3>

                                <div className="flex flex-col gap-4">
                                  {detail.exampleWords.map((word, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between p-5 rounded-2xl bg-[#FFFDF9] border border-[#F1ECE0] hover:border-[#4E9B5D] transition-colors"
                                    >
                                      <div className="flex items-center gap-4.5">
                                        <div className="w-10 h-10 rounded-full bg-[#E4772E]/10 flex items-center justify-center text-base font-black text-[#E4772E] shrink-0 border border-[#E4772E]/20">
                                          {i + 1}
                                        </div>
                                        <div>
                                          <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="font-black text-[#2D2A26] text-xl md:text-2xl">{word.hanzi}</span>
                                            <span className="font-mono text-base md:text-lg text-[#4E9B5D] font-black bg-[#4E9B5D]/5 px-2.5 py-1 rounded-lg border border-[#4E9B5D]/15">
                                              {word.tailo}
                                            </span>
                                          </div>
                                          <p className="text-xs md:text-sm text-[#8A8378] font-black mt-1">{word.english}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <BookmarkButton
                                          word={{
                                            hanzi: word.hanzi,
                                            tailo: word.tailo,
                                            mandarin: word.english,
                                            category: '拼音學習',
                                          }}
                                          variant="badge"
                                        />
                                        <button
                                          onClick={() => speakText(word.hanzi, undefined, word.tailo)}
                                          className="w-12 h-12 rounded-full bg-[#4E9B5D]/10 hover:bg-[#4E9B5D] text-[#4E9B5D] hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-md shrink-0"
                                        >
                                          <Volume2 className="w-5.5 h-5.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Interactive Voice Practice Section */
                          <div className="flex flex-col items-center justify-center py-6 text-center max-w-xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-[#E4772E]/10 flex items-center justify-center text-[#E4772E] text-2xl mb-4">
                              🎙️
                            </div>
                            <h2 className="text-xl font-black text-[#3E2723] mb-1">【聲母 {selectedInitialsSymbol}】真人發音比對</h2>
                            <p className="text-xs text-[#8A8378] font-bold mb-6">聽老師的標準發音，然後錄製你自己的發音，點擊「聆聽錄音」進行雙向比對！</p>

                            <div className="w-full bg-white rounded-3xl p-6 border border-[#EFE8D8] shadow-sm mb-6 flex flex-col items-center">
                              {/* Audio standard player */}
                              <div className="flex items-center gap-4 w-full bg-[#FAF8F2] p-4 rounded-2xl border border-[#EFE8D8] mb-6">
                                <button
                                  onClick={() => speakText(selectedInitialsSymbol)}
                                  className="w-12 h-12 rounded-full bg-[#4E9B5D] hover:bg-[#3D8552] text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
                                >
                                  <Volume2 className="w-5 h-5" />
                                </button>
                                <div className="text-left">
                                  <div className="font-extrabold text-sm text-[#3E2723]">1. 聽標準發音</div>
                                  <div className="text-xs font-bold text-[#8A8378]">老師標準台語聲母：{selectedInitialsSymbol}</div>
                                </div>
                              </div>

                              {/* Recorder Trigger */}
                              <div className="relative flex flex-col items-center gap-3">
                                <button
                                  onClick={startSimulatedRecord}
                                  disabled={isRecording}
                                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 relative z-10 ${
                                    isRecording
                                      ? 'bg-red-500 text-white cursor-not-allowed scale-105'
                                      : 'bg-white hover:bg-gray-50 border-2 border-[#EFE8D8] text-red-500'
                                  }`}
                                >
                                  {isRecording ? (
                                    <div className="relative w-7 h-7 flex items-center justify-center">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                                      <div className="w-3.5 h-3.5 bg-white rounded-sm" />
                                    </div>
                                  ) : (
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                    </svg>
                                  )}
                                </button>

                                {isRecording && (
                                  <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-red-500 animate-ping opacity-30" />
                                )}

                                <div className="text-center">
                                  {isRecording ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-xs font-black text-red-500 animate-pulse">錄音中 ({Math.floor(recordProgress / 20)}s)...</span>
                                      {/* Simulated wave animation */}
                                      <div className="flex gap-1 items-center h-4 mt-1">
                                        {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                                          <div
                                            key={i}
                                            className="w-1 bg-red-400 rounded-full animate-bounce"
                                            style={{
                                              height: `${h * 4}px`,
                                              animationDelay: `${i * 0.08}s`
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ) : hasRecorded ? (
                                    <span className="text-xs font-black text-[#2E7D32]">錄音完成！快聽聽比對成果</span>
                                  ) : (
                                    <span className="text-xs font-black text-[#8A8378]">2. 點擊麥克風，開始自主錄音</span>
                                  )}
                                </div>
                              </div>

                              {/* Recorded playback section */}
                              {hasRecorded && (
                                <div className="w-full flex items-center gap-4 bg-[#EDF7ED] p-4 rounded-2xl border border-[#C8E6C9] mt-6 animate-fadeIn">
                                  <button
                                    onClick={playSimulatedRecording}
                                    disabled={playbackActive}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                                      playbackActive
                                        ? 'bg-[#388E3C] text-white cursor-wait'
                                        : 'bg-[#4CAF50] hover:bg-[#43A047] text-white active:scale-95'
                                    }`}
                                  >
                                    <Play className="w-5 h-5 ml-0.5" />
                                  </button>
                                  <div className="text-left flex-1">
                                    <div className="font-extrabold text-sm text-[#2E7D32]">3. 播放我的發音錄音</div>
                                    <div className="text-xs font-bold text-[#4E9B5D]">
                                      {playbackActive ? '正播放我的聲音...' : '錄音檔準備就緒'}
                                    </div>
                                  </div>

                                  {/* Fun simulated rating badge */}
                                  <div className="flex flex-col items-end shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#C8E6C9]">
                                    <span className="text-[10px] font-extrabold text-[#E4772E]">評等等級</span>
                                    <span className="text-xs font-black text-[#2E7D32] flex items-center gap-0.5 mt-0.5">
                                      👑 優秀 (5★)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </motion.div>
            )}

            {activeSidebar === 'finals_learn' && (
              <motion.div
                key="finals_learn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="border-b border-[#F1ECE0] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                  <div>
                    <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                      <span>🔠</span> 韻母互動學習 (3-Level Board)
                    </h1>
                    <p className="text-[#8A8378] text-sm">單音與複音分組學習，點擊卡片解鎖口形配圖與互動錄音</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="text-xs font-bold px-3 py-1 bg-[#4E9B5D]/10 text-[#4E9B5D] rounded-full">
                      口形圖解 👄
                    </span>
                    <span className="text-xs font-bold px-3 py-1 bg-[#E4772E]/10 text-[#E4772E] rounded-full">
                      發音測試 🎙️
                    </span>
                  </div>
                </div>

                {finalsViewMode === 'list' && (
                  <div className="flex flex-col gap-6">
                    {/* Level 1: Category Selection Tabs */}
                    <div className="flex flex-wrap gap-3 p-2 bg-[#FAF7F0] rounded-2xl border border-[#F1ECE0] w-fit">
                      {[
                        '單韻母 (Simple Vowels)',
                        '複韻母 (Diphthongs)',
                        '鼻化韻母 (Nasalized Vowels)',
                        '聲化韻 (Syllabic Consonants)'
                      ].map((cat) => {
                        const count = cat.includes('單') ? 6 : cat.includes('複') ? 7 : cat.includes('鼻') ? 5 : 2;
                        return (
                          <button
                            key={cat}
                            onClick={() => setFinalsTab(cat)}
                            className={`px-6 py-3 rounded-xl font-black text-base md:text-lg transition-all active:scale-95 ${
                              finalsTab === cat
                                ? 'bg-[#E4772E] text-white shadow-md scale-105'
                                : 'text-[#5C5548] hover:bg-white hover:text-[#E4772E]'
                            }`}
                          >
                            {cat.split(' ')[0]} <span className="text-xs md:text-sm font-bold opacity-85">({count})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Level 2: Item Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {FINALS_DATA.find((g) => g.group === finalsTab)?.items.map((item) => {
                        const detail = PHONIC_DETAILS_FINALS[item.symbol];
                        return (
                          <div
                            key={item.symbol}
                            onClick={() => {
                              setSelectedFinalsSymbol(item.symbol);
                              setFinalsViewMode('detail');
                              speakText(item.symbol === 'oo' ? '黑' : item.symbol);
                            }}
                            className="group relative p-6 rounded-3xl bg-[#FFFDF9] border-2 border-[#F1ECE0] hover:border-[#E4772E] hover:shadow-xl cursor-pointer transition-all flex items-center gap-5 active:scale-[0.98]"
                          >
                            <span className="text-4xl md:text-5xl font-black text-[#E4772E] w-16 text-center group-hover:scale-110 transition-transform shrink-0">
                              {item.symbol}
                            </span>
                            <div className="flex-1 min-w-0 pr-6 border-l border-[#F5F0E4] pl-5">
                              <div className="text-sm md:text-base font-black text-[#2D2A26] flex items-center gap-1.5 truncate mb-1.5">
                                <span>例字：</span>
                                <span className="text-[#4E9B5D] text-lg font-black">{item.example}</span>
                              </div>
                              <p className="text-xs md:text-sm text-[#8A8378] leading-normal truncate group-hover:text-[#5C5548] font-semibold">
                                {item.desc}
                              </p>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#E4772E]/5 group-hover:bg-[#E4772E] flex items-center justify-center transition-all">
                              <ChevronRight className="w-4 h-4 text-[#E4772E] group-hover:text-white" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Level 3: Detail & Practice Board */}
                {finalsViewMode !== 'list' && selectedFinalsSymbol && (
                  (() => {
                    const detail = PHONIC_DETAILS_FINALS[selectedFinalsSymbol];
                    if (!detail) return null;
                    return (
                      <div className="flex flex-col gap-6 bg-[#FCFAF5] p-5 md:p-6 rounded-3xl border border-[#EFE8D8]">
                        {/* Detail Head Nav */}
                        <div className="flex justify-between items-center border-b border-[#EFE8D8] pb-4">
                          <button
                            onClick={() => {
                              setFinalsViewMode('list');
                              setSelectedFinalsSymbol(null);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#EFE8D8] rounded-xl font-bold text-xs text-[#5C5548] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                          >
                            ← 返回韻母列表
                          </button>

                          {/* Quick tabs inside Detail View */}
                          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#EFE8D8]">
                            <button
                              onClick={() => setFinalsViewMode('detail')}
                              className={`px-4 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                                finalsViewMode === 'detail'
                                  ? 'bg-[#E4772E] text-white shadow-sm'
                                  : 'text-[#5C5548] hover:bg-[#FFF9EC]'
                              }`}
                            >
                              語音口形
                            </button>
                            <button
                              onClick={() => {
                                setFinalsViewMode('practice');
                                setHasRecorded(false);
                                setIsRecording(false);
                                setPlaybackActive(false);
                              }}
                              className={`px-4 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                                finalsViewMode === 'practice'
                                  ? 'bg-[#E4772E] text-white shadow-sm'
                                  : 'text-[#5C5548] hover:bg-[#FFF9EC]'
                              }`}
                            >
                              進入發音練習 🎙️
                            </button>
                          </div>
                        </div>

                        {finalsViewMode === 'detail' ? (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Mouth & Diagram Column */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                              <div className="bg-white p-5 rounded-2xl border border-[#EFE8D8] shadow-sm text-center">
                                <div className="text-xs font-black text-[#8A8378] tracking-widest uppercase mb-3">母音開合口形剖面圖</div>
                                <div className="py-4 bg-[#FFFDFC] rounded-xl border border-[#F8F5EE] mb-4">
                                  {renderMouthShape(detail.mouthType)}
                                </div>
                                <div className="text-left bg-[#FFF9EC] p-3 rounded-xl border border-[#EFE8D8] text-[13px] text-[#3E2723] font-bold leading-relaxed">
                                  <span className="text-[#E4772E] font-black">💡 發音要點：</span>
                                  {FINALS_DATA.flatMap(g => g.items).find(i => i.symbol === selectedFinalsSymbol)?.desc}
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-sm text-center">
                                <div className="text-xs font-black text-[#8A8378] tracking-widest uppercase mb-3">趣味唸謠童畫</div>
                                <div className="py-2 flex justify-center items-center">
                                  {renderIllustration(detail.illustration)}
                                </div>
                                <span className="inline-block mt-2 text-xs font-bold text-[#8A8378] bg-[#FAF8F2] px-2.5 py-1 rounded-full border border-[#EFE8D8]">
                                  韻謠口訣：{detail.chant}
                                </span>
                              </div>
                            </div>

                            {/* Actions & Examples Column */}
                            <div className="lg:col-span-7 flex flex-col gap-5">
                              {/* Giant Symbol Panel */}
                              <div className="bg-white p-6 rounded-3xl border border-[#EFE8D8] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-20 h-20 rounded-2xl bg-[#E4772E]/5 border-2 border-[#E4772E] flex items-center justify-center">
                                    <span className="text-5xl font-black text-[#E4772E]">{selectedFinalsSymbol}</span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h2 className="text-2xl font-black text-[#3E2723]">{selectedFinalsSymbol} 韻母</h2>
                                      <span className="text-xs font-black bg-[#4E9B5D]/10 text-[#4E9B5D] px-2.5 py-0.5 rounded-full">
                                        {detail.bopomofo}
                                      </span>
                                    </div>
                                    <p className="text-xs text-[#8A8378] mt-1 font-bold">點擊右側發音喇叭，即刻聆聽發音童謠！</p>
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-auto">
                                  <button
                                    onClick={() => speakText(selectedFinalsSymbol)}
                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E4772E] text-white font-extrabold text-sm hover:bg-[#C9601E] active:scale-95 transition-all shadow-sm flex-1 md:flex-none"
                                  >
                                    <Volume2 className="w-4 h-4" /> 聽符號發音
                                  </button>
                                  <button
                                    onClick={() => {
                                      const sentence = detail.chant.replace(/[a-zA-Z]/g, '').trim();
                                      speakText(sentence);
                                    }}
                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4E9B5D] text-white font-extrabold text-sm hover:bg-[#3D8552] active:scale-95 transition-all shadow-sm flex-1 md:flex-none"
                                  >
                                    <Music className="w-4 h-4" /> 聽童韻唸謠
                                  </button>
                                </div>
                              </div>

                              {/* Example Words Section */}
                              <div className="bg-white p-5 rounded-3xl border border-[#EFE8D8] shadow-sm">
                                <h3 className="font-black text-[#3E2723] text-sm mb-4 flex items-center gap-1.5">
                                  <span className="w-1.5 h-4 bg-[#E4772E] rounded-full" />
                                  日常語詞與拼寫實踐
                                </h3>

                                <div className="flex flex-col gap-3">
                                  {detail.exampleWords.map((word, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFDF9] border border-[#F1ECE0] hover:border-[#E4772E] transition-colors"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#4E9B5D]/10 flex items-center justify-center text-sm font-black text-[#4E9B5D]">
                                          {i + 1}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-[#3E2723] text-lg">{word.hanzi}</span>
                                            <span className="font-mono text-sm text-[#E4772E] font-bold bg-[#E4772E]/5 px-2 py-0.5 rounded-lg border border-[#E4772E]/10">
                                              {word.tailo}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-[#8A8378] font-bold mt-0.5">{word.english}</p>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => speakText(word.hanzi, undefined, word.tailo)}
                                        className="w-10 h-10 rounded-full bg-[#E4772E]/10 hover:bg-[#E4772E] text-[#E4772E] hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
                                      >
                                        <Volume2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Interactive Voice Practice Section */
                          <div className="flex flex-col items-center justify-center py-6 text-center max-w-xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-[#4E9B5D]/10 flex items-center justify-center text-[#4E9B5D] text-2xl mb-4">
                              🎙️
                            </div>
                            <h2 className="text-xl font-black text-[#3E2723] mb-1">【韻母 {selectedFinalsSymbol}】自學發音比對</h2>
                            <p className="text-xs text-[#8A8378] font-bold mb-6">先聆聽老師在耳邊發音，再按下紅色按鈕進行自我錄製！</p>

                            <div className="w-full bg-white rounded-3xl p-6 border border-[#EFE8D8] shadow-sm mb-6 flex flex-col items-center">
                              {/* Audio standard player */}
                              <div className="flex items-center gap-4 w-full bg-[#FAF8F2] p-4 rounded-2xl border border-[#EFE8D8] mb-6">
                                <button
                                  onClick={() => speakText(selectedFinalsSymbol)}
                                  className="w-12 h-12 rounded-full bg-[#E4772E] hover:bg-[#C9601E] text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
                                >
                                  <Volume2 className="w-5 h-5" />
                                </button>
                                <div className="text-left">
                                  <div className="font-extrabold text-sm text-[#3E2723]">1. 聽標準發音</div>
                                  <div className="text-xs font-bold text-[#8A8378]">老師標準台語韻母：{selectedFinalsSymbol}</div>
                                </div>
                              </div>

                              {/* Recorder Trigger */}
                              <div className="relative flex flex-col items-center gap-3">
                                <button
                                  onClick={startSimulatedRecord}
                                  disabled={isRecording}
                                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 relative z-10 ${
                                    isRecording
                                      ? 'bg-red-500 text-white cursor-not-allowed scale-105'
                                      : 'bg-white hover:bg-gray-50 border-2 border-[#EFE8D8] text-red-500'
                                  }`}
                                >
                                  {isRecording ? (
                                    <div className="relative w-7 h-7 flex items-center justify-center">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                                      <div className="w-3.5 h-3.5 bg-white rounded-sm" />
                                    </div>
                                  ) : (
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                    </svg>
                                  )}
                                </button>

                                {isRecording && (
                                  <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-red-500 animate-ping opacity-30" />
                                )}

                                <div className="text-center">
                                  {isRecording ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-xs font-black text-red-500 animate-pulse">正在錄音中 ({Math.floor(recordProgress / 20)}s)...</span>
                                      {/* Simulated wave animation */}
                                      <div className="flex gap-1 items-center h-4 mt-1">
                                        {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                                          <div
                                            key={i}
                                            className="w-1 bg-red-400 rounded-full animate-bounce"
                                            style={{
                                              height: `${h * 4}px`,
                                              animationDelay: `${i * 0.08}s`
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ) : hasRecorded ? (
                                    <span className="text-xs font-black text-[#2E7D32]">錄製圓滿結束！雙向聽寫開啟</span>
                                  ) : (
                                    <span className="text-xs font-black text-[#8A8378]">2. 點擊麥克風，開始自主錄音</span>
                                  )}
                                </div>
                              </div>

                              {/* Recorded playback section */}
                              {hasRecorded && (
                                <div className="w-full flex items-center gap-4 bg-[#EDF7ED] p-4 rounded-2xl border border-[#C8E6C9] mt-6 animate-fadeIn">
                                  <button
                                    onClick={playSimulatedRecording}
                                    disabled={playbackActive}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                                      playbackActive
                                        ? 'bg-[#388E3C] text-white cursor-wait'
                                        : 'bg-[#4CAF50] hover:bg-[#43A047] text-white active:scale-95'
                                    }`}
                                  >
                                    <Play className="w-5 h-5 ml-0.5" />
                                  </button>
                                  <div className="text-left flex-1">
                                    <div className="font-extrabold text-sm text-[#2E7D32]">3. 播放我的發音錄音</div>
                                    <div className="text-xs font-bold text-[#4E9B5D]">
                                      {playbackActive ? '正播放我的聲音...' : '錄音檔準備就緒'}
                                    </div>
                                  </div>

                                  {/* Fun simulated rating badge */}
                                  <div className="flex flex-col items-end shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#C8E6C9]">
                                    <span className="text-[10px] font-extrabold text-[#E4772E]">評等等級</span>
                                    <span className="text-xs font-black text-[#2E7D32] flex items-center gap-0.5 mt-0.5">
                                      👑 優秀 (5★)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </motion.div>
            )}

            {activeSidebar === 'phonics_practice' && (
              <motion.div
                key="phonics_practice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="border-b border-[#F1ECE0] pb-4">
                  <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                    <span>🔬</span> 互動拼音合成器 (拼音練習)
                  </h1>
                  <p className="text-[#8A8378] text-sm">自選聲母、韻母與聲調，合成發音，即時聽寫與比對台語漢字</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Selectors Column */}
                  <div className="lg:col-span-2 grid grid-cols-3 gap-3 bg-[#FBF8F2] p-4 rounded-3xl border border-[#F1ECE0]">
                    {/* Initials Selector */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-[#3E2723] text-center bg-[#4E9B5D]/10 text-[#4E9B5D] py-1 rounded-full">聲母 Initial</span>
                      <div className="h-64 overflow-y-auto scrollbar-thin flex flex-col gap-1.5 p-1 bg-white rounded-2xl border border-[#EFE8D8]">
                        <button
                          onClick={() => setSelectedInitial('none')}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                            selectedInitial === 'none' ? 'bg-[#4E9B5D] text-white' : 'hover:bg-[#FFF9EC]'
                          }`}
                        >
                          (無聲母)
                        </button>
                        {['b', 'p', 'ph', 'm', 't', 'th', 'n', 'l', 'k', 'kh', 'ng', 'h', 'ts', 'tsh', 's', 'j', 'g'].map(symbol => (
                          <button
                            key={symbol}
                            onClick={() => setSelectedInitial(symbol)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                              selectedInitial === symbol ? 'bg-[#4E9B5D] text-white' : 'hover:bg-[#FFF9EC]'
                            }`}
                          >
                            {symbol}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Finals Selector */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-[#3E2723] text-center bg-[#F2A93B]/10 text-[#F2A93B] py-1 rounded-full">韻母 Final</span>
                      <div className="h-64 overflow-y-auto scrollbar-thin flex flex-col gap-1.5 p-1 bg-white rounded-2xl border border-[#EFE8D8]">
                        {['a', 'i', 'u', 'e', 'o', 'oo', 'ai', 'au', 'ia', 'iu', 'ua', 'ue', 'ui', 'ann', 'inn', 'unn', 'm', 'ng'].map(symbol => (
                          <button
                            key={symbol}
                            onClick={() => setSelectedFinal(symbol)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                              selectedFinal === symbol ? 'bg-[#F2A93B] text-white' : 'hover:bg-[#FFF9EC]'
                            }`}
                          >
                            {symbol}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tones Selector */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-[#3E2723] text-center bg-[#E14D2A]/10 text-[#E14D2A] py-1 rounded-full">聲調 Tone</span>
                      <div className="h-64 overflow-y-auto scrollbar-thin flex flex-col gap-1.5 p-1 bg-white rounded-2xl border border-[#EFE8D8]">
                        {[1, 2, 3, 4, 5, 7, 8].map(toneNum => (
                          <button
                            key={toneNum}
                            onClick={() => setSelectedTone(toneNum)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                              selectedTone === toneNum ? 'bg-[#E14D2A] text-white' : 'hover:bg-[#FFF9EC]'
                            }`}
                          >
                            第 {toneNum} 聲
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Combined Preview Panel */}
                  <div className="flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#FFFDF6] to-[#FDFBF6] rounded-3xl border border-[#F1ECE0] shadow-sm text-center">
                    <span className="text-xs font-bold text-[#8A8378] tracking-wider uppercase">拼音合成預覽</span>

                    <div className="my-4 flex flex-col items-center">
                      <span className="text-5xl font-black text-[#2D2A26] bg-white px-8 py-4 rounded-3xl shadow-sm border border-[#F1ECE0] tracking-wide relative">
                        {combinedSyllable}
                        <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#E14D2A] text-white font-black text-xs flex items-center justify-center">
                          {selectedTone}
                        </span>
                      </span>
                    </div>

                    {/* Word check */}
                    <div className="bg-white rounded-2xl border border-[#F1ECE0] p-4 w-full">
                      {COMBINER_DICT[`${selectedInitial === 'none' ? '' : selectedInitial}${selectedFinal}${selectedTone}`] ? (
                        <div>
                          <span className="text-xs text-[#4E9B5D] font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 成功比對出台語常用字：
                          </span>
                          <div className="text-3xl font-black text-[#3E2723] my-1">
                            {COMBINER_DICT[`${selectedInitial === 'none' ? '' : selectedInitial}${selectedFinal}${selectedTone}`]?.word}
                          </div>
                          <p className="text-[10px] text-[#8A8378]">
                            意指：{COMBINER_DICT[`${selectedInitial === 'none' ? '' : selectedInitial}${selectedFinal}${selectedTone}`]?.desc}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-[#8A8378] flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> 暫無對應的常用字
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handlePlayCombinerSound}
                      className="mt-4 w-full py-3.5 rounded-full bg-[#4E9B5D] hover:bg-[#3E8552] active:scale-95 transition-all text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Volume2 className="w-5 h-5" /> 播放合成發音
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSidebar === 'tone_practice' && (
              <motion.div
                key="tone_practice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* 1. Gallery List View */}
                {selectedAnimSeries === null && (
                  <div className="flex flex-col gap-6">
                    <div className="border-b border-[#F1ECE0] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                          <Tv className="w-7 h-7 text-[#E14D2A]" />
                          <span>動畫專區</span>
                          <span className="text-xs px-2.5 py-0.5 bg-[#E14D2A]/10 text-[#E14D2A] rounded-full font-black">教育部推薦</span>
                        </h1>
                        <p className="text-[#8A8378] text-sm">點選適合您的動畫年齡，一起看卡通、輕鬆學台語！</p>
                      </div>

                      {/* Age group filter tabs */}
                      <div className="flex flex-wrap gap-2">
                        {['全部', '學齡前(幼兒園)', '小學階段', '國、高中階段'].map((group) => (
                          <button
                            key={group}
                            onClick={() => setAnimationFilter(group)}
                            className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
                              animationFilter === group
                                ? 'bg-[#E14D2A] text-white shadow-sm scale-105'
                                : 'bg-[#FAF4E8] text-[#8A8378] border border-[#F1ECE0] hover:bg-[#FFFDF9] hover:text-[#E14D2A]'
                            }`}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Series Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ANIMATIONS_DATABASE.filter(
                        (item) => animationFilter === '全部' || item.ageGroup === animationFilter
                      ).map((series) => (
                        <div
                          key={series.id}
                          className="bg-white rounded-3xl border border-[#F1ECE0] overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col"
                        >
                          {/* Banner gradient / thumbnail preview */}
                          <div className={`p-6 bg-gradient-to-br ${series.imageColor} text-white flex flex-col justify-between h-40 relative`}>
                            <div className="absolute right-4 top-4 text-5xl opacity-40 select-none">
                              {series.emoji}
                            </div>
                            <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full w-max font-bold">
                              {series.ageGroup}
                            </span>
                            <div>
                              <h2 className="font-black text-lg leading-snug drop-shadow-sm">{series.title}</h2>
                              {series.subCaption && (
                                <p className="text-[10px] text-red-200 font-bold mt-1 bg-black/20 px-2 py-0.5 rounded w-max">
                                  {series.subCaption}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Details and Description */}
                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <p className="text-xs text-[#8A8378] leading-relaxed line-clamp-3">
                              {series.desc}
                            </p>

                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  setSelectedAnimSeries(series);
                                  setSelectedAnimEpisode(null);
                                  setAnimIsPlaying(false);
                                  setAnimProgress(0);
                                }}
                                className="w-full py-2.5 rounded-xl bg-[#4E9B5D] hover:bg-[#3E8552] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                              >
                                🎬 進入學習劇集 ({series.episodes.length} 集)
                              </button>
                              
                              <a
                                href={series.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2 rounded-xl bg-[#FAF4E8] text-[#8A8378] hover:text-[#E14D2A] border border-[#F1ECE0] font-bold text-[11px] text-center transition-colors flex items-center justify-center gap-1"
                              >
                                🔗 前往閩南語動畫學習網 <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Series Detail / Episode Selection View */}
                {selectedAnimSeries !== null && selectedAnimEpisode === null && (
                  <div className="flex flex-col gap-6">
                    {/* Back Toolbar */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F1ECE0]">
                      <button
                        onClick={() => setSelectedAnimSeries(null)}
                        className="px-5 py-2.5 rounded-full bg-[#F2A93B] hover:bg-[#E29729] text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        ← 返回動畫專區
                      </button>

                      <a
                        href={selectedAnimSeries.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-full bg-[#E14D2A] hover:bg-[#C83E1E] text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        ➡️ 前往教育部動畫學習官網 <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Series Header Banner card */}
                    <div className={`p-6 md:p-8 rounded-3xl bg-gradient-to-br ${selectedAnimSeries.imageColor} text-white relative shadow-sm`}>
                      <div className="absolute right-6 top-6 text-7xl opacity-20 select-none">
                        {selectedAnimSeries.emoji}
                      </div>
                      <div className="max-w-2xl flex flex-col gap-3">
                        <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-black w-max">
                          {selectedAnimSeries.ageGroup}
                        </span>
                        <h1 className="font-black text-2xl md:text-3xl leading-tight">{selectedAnimSeries.title}</h1>
                        <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                          {selectedAnimSeries.desc}
                        </p>
                      </div>
                    </div>

                    {/* Episode Grid Title */}
                    <div>
                      <h2 className="font-extrabold text-[#2D2A26] text-base mb-3 flex items-center gap-1.5">
                        <span className="text-[#E14D2A]">🍿</span> 選擇精彩集數開始學習
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedAnimSeries.episodes.map((ep: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedAnimEpisode(index);
                              setAnimIsPlaying(true);
                              setAnimProgress(0);
                            }}
                            className="bg-white border border-[#F1ECE0] p-4 rounded-2xl hover:border-[#4E9B5D] hover:shadow-md transition-all text-left flex flex-col justify-between h-32 group"
                          >
                            <span className="text-[11px] text-[#8A8378] group-hover:text-[#4E9B5D] font-bold">EP. {index + 1}</span>
                            <div className="font-extrabold text-sm text-[#2D2A26] line-clamp-2 mt-1">
                              {ep.title}
                            </div>
                            <div className="mt-2 text-[11px] text-[#4E9B5D] font-black flex items-center gap-1">
                              ▶ 點擊觀看學習
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Interactive Video Player View */}
                {selectedAnimSeries !== null && selectedAnimEpisode !== null && (() => {
                  const currentEp = selectedAnimSeries.episodes[selectedAnimEpisode];
                  const currentSubtitles = currentEp.subtitles[animSubtitleMode];
                  
                  // Map elapsed progress to corresponding subtitle segment
                  const subIndex = Math.min(
                    Math.floor(animProgress / (100 / currentSubtitles.length)),
                    currentSubtitles.length - 1
                  );
                  const activeSubtitleText = currentSubtitles[subIndex];

                  return (
                    <div className="flex flex-col gap-6">
                      {/* Back Toolbar */}
                      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F1ECE0]">
                        <button
                          onClick={() => {
                            setSelectedAnimEpisode(null);
                            setAnimIsPlaying(false);
                            setAnimProgress(0);
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#F2A93B] hover:bg-[#E29729] text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5"
                        >
                          ← 返回劇集列表
                        </button>
                        
                        <div className="text-sm font-black text-[#2D2A26] flex items-center gap-2 bg-[#FAF4E8] px-4 py-2 rounded-full border border-[#F1ECE0]">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                          <span>正在觀看：{selectedAnimSeries.title} - {currentEp.title}</span>
                        </div>
                      </div>

                      {/* Interactive Video Player screen */}
                      <div className="bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-[#3E2723] flex flex-col relative aspect-video w-full max-w-4xl mx-auto group">
                        {/* Player background simulator */}
                        <div className="flex-1 bg-gradient-to-b from-[#111] to-[#222] flex flex-col items-center justify-center relative p-6">
                          
                          {/* Pulsing floating music note/star visual elements based on play state */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
                            <span className={`text-9xl transition-transform duration-1000 ${animIsPlaying ? 'scale-110 rotate-12 animate-pulse' : ''}`}>
                              {selectedAnimSeries.emoji}
                            </span>
                          </div>

                          {/* Visual feedback box inside player */}
                          <div className="text-center z-10 flex flex-col items-center gap-3">
                            {/* Animated vector / emoji display */}
                            <div className={`w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl relative ${
                              animIsPlaying ? 'animate-bounce' : 'scale-95'
                            }`}>
                              {selectedAnimSeries.emoji}
                              {animIsPlaying && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                </span>
                              )}
                            </div>
                            
                            <h2 className="text-white/80 font-bold text-sm tracking-wide bg-black/40 px-3 py-1 rounded-full">
                              {animIsPlaying ? '台語發音配音播放中...' : '已暫停 點擊下方播放鈕開始學習'}
                            </h2>
                          </div>

                          {/* DYNAMIC SUBTITLES DISPLAY BLOCK (Overlayed inside video frame) */}
                          <div className="absolute bottom-6 left-4 right-4 text-center z-20 px-4 py-3 bg-black/75 backdrop-blur-sm rounded-2xl border border-white/10 min-h-[50px] flex items-center justify-center transition-all">
                            <p className="text-white text-base md:text-lg font-extrabold tracking-wide drop-shadow-md">
                              {activeSubtitleText}
                            </p>
                          </div>
                        </div>

                        {/* Player Controls Bar */}
                        <div className="bg-[#1A1A1A] px-4 py-3.5 border-t border-white/10 flex flex-col gap-2 z-30">
                          {/* Timeline slider */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-white/55">
                              {Math.floor((animProgress * 300) / 100 / 60)}:
                              {String(Math.floor(((animProgress * 300) / 100) % 60)).padStart(2, '0')}
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={animProgress}
                              onChange={(e) => setAnimProgress(Number(e.target.value))}
                              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#E14D2A] hover:h-1.5 transition-all"
                            />
                            <span className="text-[10px] font-mono text-white/55">05:00</span>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setAnimIsPlaying(!animIsPlaying)}
                                className="w-10 h-10 rounded-full bg-white text-black hover:bg-[#E14D2A] hover:text-white transition-all flex items-center justify-center active:scale-90"
                              >
                                {animIsPlaying ? (
                                  <span className="text-xs font-black">❚❚</span>
                                ) : (
                                  <Play className="w-5 h-5 fill-current" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => setAnimProgress(0)}
                                className="text-xs font-bold text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                              >
                                🔄 重頭播
                              </button>
                            </div>

                            {/* Subtitle toggle track controls (Matches Ministry of Education UI design!) */}
                            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 gap-1">
                              {[
                                { mode: 'mandarin', label: '華語字幕' },
                                { mode: 'taigi_hanzi', label: '臺灣台語漢字' },
                                { mode: 'taigi_roman', label: '臺灣台語羅馬字' },
                              ].map((opt) => (
                                <button
                                  key={opt.mode}
                                  onClick={() => setAnimSubtitleMode(opt.mode as any)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                    animSubtitleMode === opt.mode
                                      ? 'bg-[#E14D2A] text-white scale-105'
                                      : 'text-white/60 hover:text-white hover:bg-white/10'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions / Social Share / Video Disclaimer */}
                      <div className="bg-[#FAF4E8] rounded-3xl p-5 border border-[#F1ECE0] flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col gap-1.5 text-center md:text-left">
                          <p className="text-xs font-black text-red-600 flex items-center gap-1.5 justify-center md:justify-start">
                            <span>⚠️</span> 影音版權提示
                          </p>
                          <p className="text-[11px] text-[#8A8378] font-bold">
                            【本影片僅供瀏覽學習之用，不得有轉載及商業販售行為】
                          </p>
                        </div>

                        {/* Social Share mock buttons */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#8A8378] flex items-center gap-1">
                            <Share2 className="w-3.5 h-3.5" /> 分享到：
                          </span>
                          <button
                            onClick={() => alert('已複製分享連結，歡迎分享！')}
                            className="px-3.5 py-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-[11px] font-black rounded-lg transition-colors shadow-sm"
                          >
                            Facebook
                          </button>
                          <button
                            onClick={() => alert('已複製 LINE 分享連結！')}
                            className="px-3.5 py-1.5 bg-[#06C755] hover:bg-[#05B34C] text-white text-[11px] font-black rounded-lg transition-colors shadow-sm"
                          >
                            LINE
                          </button>
                        </div>
                      </div>

                      {/* Series quick select links */}
                      <div className="bg-white rounded-3xl p-5 border border-[#F1ECE0]">
                        <h3 className="font-extrabold text-[#2D2A26] text-xs mb-3 flex items-center gap-1">
                          <span>🎥</span> 切換集數 ({selectedAnimSeries.episodes.length} 集)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAnimSeries.episodes.map((ep: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedAnimEpisode(index);
                                setAnimIsPlaying(true);
                                setAnimProgress(0);
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                selectedAnimEpisode === index
                                  ? 'bg-[#4E9B5D] text-white border-[#4E9B5D] scale-105'
                                  : 'bg-white text-[#8A8378] border-[#F1ECE0] hover:bg-[#FFFDF9]'
                              }`}
                            >
                              EP {index + 1}. {ep.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {activeSidebar === 'phonics_games' && (
              <motion.div
                key="phonics_games"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="border-b border-[#F1ECE0] pb-4">
                  <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                    <span>🎮</span> 聽力音感大挑戰！(拼音闖關)
                  </h1>
                  <p className="text-[#8A8378] text-sm">聽發音並做出選擇，累計積分以獲得台語拼音成就獎章</p>
                </div>

                <div className="max-w-xl mx-auto w-full bg-[#FFFDF6] rounded-3xl p-6 border-2 border-[#FAF4E8] shadow-sm">
                  {gameState === 'start' && (
                    <div className="flex flex-col items-center text-center p-6 gap-5">
                      <div className="w-16 h-16 rounded-full bg-[#FAF4E8] flex items-center justify-center text-3xl">
                        🏆
                      </div>
                      <h2 className="font-black text-xl text-[#2D2A26]">台語拼音闖關賽</h2>
                      <p className="text-xs text-[#8A8378] max-w-sm">
                        本挑戰共有 5 道台語發音聽力題。每答對一題可獲得 20 分。順利完成後會將挑戰成績自動登載到您的「學習紀錄」中！
                      </p>
                      <button
                        onClick={handleStartGame}
                        className="px-8 py-3.5 rounded-full bg-[#4E9B5D] text-white font-bold text-sm hover:bg-[#3E8552] transition-colors active:scale-95 shadow-sm flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" /> 開始挑戰
                      </button>
                    </div>
                  )}

                  {gameState === 'playing' && (
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center text-xs text-[#8A8378] font-bold pb-3 border-b border-[#F1ECE0]">
                        <span>題數: {currentQuestionIdx + 1} / {GAME_QUESTIONS.length}</span>
                        <span className="text-[#E14D2A]">當前連擊: {streak} 🔥</span>
                        <span className="text-[#4E9B5D]">得分: {score}</span>
                      </div>

                      <div className="flex flex-col items-center py-4 bg-[#FAF6EC] rounded-2xl border border-[#F1ECE0] relative">
                        <span className="text-xs font-bold text-[#8A8378] mb-2">
                          {GAME_QUESTIONS[currentQuestionIdx].instruction}
                        </span>

                        <button
                          onClick={playQuestionAudio}
                          className="w-16 h-16 rounded-full bg-[#4E9B5D] text-white flex items-center justify-center hover:bg-[#3E8552] transition-colors shadow-md active:scale-95 group"
                        >
                          <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        </button>

                        <span className="text-[11px] text-[#8A8378] mt-3">點擊喇叭可重複聆聽</span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-2 gap-3.5">
                        {GAME_QUESTIONS[currentQuestionIdx].options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswerSubmit(option)}
                            disabled={feedback?.show}
                            className={`p-4 rounded-2xl text-center font-black text-lg border-2 transition-all ${
                              feedback?.show
                                ? option === GAME_QUESTIONS[currentQuestionIdx].correctOption
                                  ? 'bg-[#4E9B5D]/10 border-[#4E9B5D] text-[#4E9B5D]'
                                  : 'bg-white border-[#F1ECE0] text-[#8A8378]'
                                : 'bg-white hover:bg-[#FFF9EC] border-[#F1ECE0] hover:border-[#F2A93B] text-[#3E2723]'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      {/* Answer Feedback Banner */}
                      {feedback?.show && (
                        <div
                          className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
                            feedback.isCorrect
                              ? 'bg-[#4E9B5D]/10 border-[#4E9B5D] text-[#4E9B5D]'
                              : 'bg-[#E14D2A]/10 border-[#E14D2A] text-[#E14D2A]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {feedback.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )}
                            <span className="text-xs font-bold">{feedback.msg}</span>
                          </div>

                          <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2 rounded-full bg-[#3E2723] hover:bg-black text-white font-bold text-xs"
                          >
                            下一題 ▶
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {gameState === 'ended' && (
                    <div className="flex flex-col items-center text-center p-6 gap-4">
                      <Award className="w-16 h-16 text-[#F2A93B]" />
                      <h2 className="font-black text-xl text-[#2D2A26]">挑戰圓滿成功！</h2>
                      <div className="text-sm text-[#5C5548]">
                        您的最終得分：<span className="text-2xl font-black text-[#4E9B5D]">{score}</span> / 100
                      </div>
                      <p className="text-xs text-[#8A8378]">
                        好極了！成績已成功記錄到您的「學習紀錄」中，歡迎隨時回來重溫或精進語音辨識度！
                      </p>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={handleStartGame}
                          className="px-6 py-2.5 rounded-full border-2 border-[#4E9B5D] text-[#4E9B5D] font-bold text-xs flex items-center gap-1.5 hover:bg-[#4E9B5D]/5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> 再戰一次
                        </button>
                        <button
                          onClick={() => onNavigate('record')}
                          className="px-6 py-2.5 rounded-full bg-[#4E9B5D] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#3E8552] transition-colors"
                        >
                          查看學習紀錄 ▶
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeSidebar === 'sandhi_tool' && (
              <motion.div
                key="sandhi_tool"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* 1. Header */}
                <div className="pb-4">
                  <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                    <span className="text-3xl">🗣️</span> 台語連讀變調與語音工具 (Tone Sandhi)
                  </h1>
                  <p className="text-[#8A8378] text-sm">
                    台語在連讀時會進行自動聲調轉換（變調）。除了句尾或特定結構的最後一個字，前面的字都必須變調！
                  </p>
                </div>

                {/* 2. Sandhi Cycle Rules Diagram */}
                <div className="p-5 rounded-2xl bg-[#FDFBF6] shadow-sm">
                  <h3 className="font-bold text-[#2D2A26] mb-4 flex items-center gap-1.5 text-[15px]">
                    <Sparkles className="w-4 h-4 text-[#B8791A]" /> 變調規律大公開（優勢腔非入聲口訣）
                  </h3>
                  
                  {/* Circle Chain */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    {[
                      { from: '5 聲', to: '7 聲', label: '低緩升 ➔ 中平', bg: 'bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]' },
                      { from: '7 聲', to: '3 聲', label: '中平 ➔ 中降', bg: 'bg-[#EDE7F6] text-[#4A148C] border-[#D1C4E9]' },
                      { from: '3 聲', to: '2 聲', label: '中降 ➔ 高降', bg: 'bg-[#FBE9E7] text-[#D84315] border-[#FFCCBC]' },
                      { from: '2 聲', to: '1 聲', label: '高降 ➔ 高平', bg: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]' },
                      { from: '1 聲', to: '7 聲', label: '高平 ➔ 中平', bg: 'bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]' }
                    ].map((step, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${step.bg}`}>
                        <span className="font-black text-lg">{step.from} ➔ {step.to}</span>
                        <span className="text-[10px] opacity-80 font-medium mt-1">{step.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Secondary entering tones rule */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100/80 text-[11px] text-[#8A6D3B] leading-relaxed">
                    <strong>📦 入聲（p/t/k/h 結尾）變調規則：</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5">
                      <li><strong>p, t, k 結尾：</strong> 4 聲（中入） ➔ 8 聲（高入）； 8 聲 ➔ 4 聲。</li>
                      <li><strong>h 結尾：</strong> 4 聲（喉塞） ➔ 2 聲； 8 聲（喉塞） ➔ 3 聲。（變調後喉塞音脫落，發音變長）</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Interactive Sandbox */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Preset & Input */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <div className="p-5 rounded-2xl bg-white shadow-sm">
                      <h3 className="font-bold text-[#2D2A26] mb-3 text-sm">✍️ 語音變調沙盒（可自行輸入）</h3>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#5C5548] mb-1">台語漢字</label>
                          <input
                            type="text"
                            value={sandhiHanzi}
                            onChange={(e) => setSandhiHanzi(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#FDFBF6] border border-[#F1ECE0] text-sm text-[#2D2A26] focus:outline-none focus:border-[#4E9B5D]"
                            placeholder="例如：阿伯"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#5C5548] mb-1">台羅拼音（用連字符 - 連接音節）</label>
                          <input
                            type="text"
                            value={sandhiInput}
                            onChange={(e) => setSandhiInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#FDFBF6] border border-[#F1ECE0] text-sm font-mono text-[#2D2A26] focus:outline-none focus:border-[#4E9B5D]"
                            placeholder="例如：a-pe̍h"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preconfigured Presets */}
                    <div className="p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-4">
                      <h3 className="font-bold text-[#2D2A26] text-sm flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-[#4E9B5D]" /> 推薦生活變調練習詞彙
                      </h3>

                      {[
                        {
                          category: '親屬人物 👨‍👩‍👧',
                          items: [
                            { hanzi: '阿伯', tailo: 'a-pe̍h' },
                            { hanzi: '阿母', tailo: 'a-bó' },
                            { hanzi: '老爸', tailo: 'lāu-pē' },
                            { hanzi: '老師', tailo: 'lāu-sū' },
                            { hanzi: '媽媽', tailo: 'má-máh' },
                            { hanzi: '嬰仔', tailo: 'enn-á' }
                          ]
                        },
                        {
                          category: '日常生活 🍎',
                          items: [
                            { hanzi: '無閒', tailo: 'bô-iâinn' },
                            { hanzi: '代誌', tailo: 'tāi-tsì' },
                            { hanzi: '媠仔', tailo: 'suí-á' },
                            { hanzi: '玻璃', tailo: 'po-lê' },
                            { hanzi: '菜頭', tailo: 'tshai-thâu' },
                            { hanzi: '雪文', tailo: 'sa-bûn' }
                          ]
                        },
                        {
                          category: '常用對話 💬',
                          items: [
                            { hanzi: '食飽未', tailo: 'tsia̍h-pá-buē' },
                            { hanzi: '汝欲去佗位', tailo: 'lí beh khì toh-uī' },
                            { hanzi: '多謝你', tailo: 'to-siā lí' },
                            { hanzi: '真好食', tailo: 'tsin hó-tsia̍h' }
                          ]
                        }
                      ].map((cat, catIdx) => (
                        <div key={catIdx} className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-[#8A8378]">{cat.category}</span>
                          <div className="flex flex-wrap gap-2">
                            {cat.items.map((item, itemIdx) => (
                              <button
                                key={itemIdx}
                                onClick={() => {
                                  setSandhiHanzi(item.hanzi);
                                  setSandhiInput(item.tailo);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                  sandhiInput === item.tailo
                                    ? 'bg-[#EAF4EC] border-[#4E9B5D] text-[#4E9B5D] font-bold shadow-sm'
                                    : 'bg-[#FDFBF6] border-[#F1ECE0] text-[#5C5548] hover:bg-stone-100 hover:border-stone-300'
                                }`}
                              >
                                {item.hanzi} ({item.tailo})
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Visual Analysis & Player */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <div className="p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-5 h-full justify-between">
                      <div>
                        <h3 className="font-bold text-[#2D2A26] mb-3 text-sm">📊 變調前後聲調對比分析</h3>

                        {/* Comparative Tailo result */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100 flex flex-col">
                            <span className="text-[10px] font-bold text-orange-700/80 uppercase tracking-wider">原始本調拼音</span>
                            <span className="font-black text-[#2D2A26] text-lg font-mono mt-0.5">{sandhiInput || 'N/A'}</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-700/80 uppercase tracking-wider">連讀變調後拼音</span>
                            <span className="font-black text-emerald-800 text-lg font-mono mt-0.5">
                              {getSandhiTailo(sandhiInput) || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Syllable-by-syllable analysis cards */}
                        <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                          {(() => {
                            const syllables = sandhiInput.toLowerCase().split(/[- \/]+/);
                            const origTones = detectTonesFromTailo(sandhiInput);
                            return syllables.map((syll, idx) => {
                              if (!syll.trim()) return null;
                              const origTone = origTones[idx];
                              const isLast = idx === syllables.length - 1;
                              const sandhiTone = isLast ? origTone : getSandhiTone(origTone, syll);
                              const hasChanged = origTone !== sandhiTone;

                              return (
                                <div key={idx} className="p-3 rounded-xl bg-[#FDFBF6] flex items-center justify-between text-xs shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="font-black text-[#2D2A26] font-mono text-sm">{syll}</span>
                                    <span className="text-[10px] text-[#8A8378] mt-0.5">第 {idx + 1} 個字</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-[#F1ECE0] text-[#5C5548] font-bold">
                                      本調 {origTone} 聲
                                    </span>
                                    <span className="text-[#8A8378]">➔</span>
                                    <span className={`px-2 py-1 rounded font-bold ${
                                      isLast 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                        : hasChanged 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                          : 'bg-stone-50 text-stone-600 border border-stone-200'
                                    }`}>
                                      {isLast ? `末字本調 ${sandhiTone} 聲` : `變調 ${sandhiTone} 聲`}
                                    </span>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Play buttons */}
                      <div className="flex flex-col gap-3.5 pt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => speakText(sandhiHanzi, undefined, sandhiInput, true, false)}
                            className="py-3.5 px-4 rounded-xl bg-white text-[#5C5548] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-95 transition-all shadow-sm group"
                          >
                            <Play className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                            <span>機械本調 (未變調)</span>
                          </button>
                          
                          <button
                            onClick={() => speakText(sandhiHanzi, undefined, sandhiInput, false, true)}
                            className="py-3.5 px-4 rounded-xl bg-[#4E9B5D] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#3E8552] active:scale-95 transition-all shadow-md group"
                          >
                            <Volume2 className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                            <span>流利變調 (道地台語)</span>
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/40 flex items-start gap-2.5">
                          <AlertCircle className="w-4.5 h-4.5 text-[#4E9B5D] shrink-0 mt-0.5" />
                          <p className="text-[11px] text-[#3E7D4C] leading-relaxed">
                            <strong>💡 互動大發現：</strong> 試著對比點擊兩個播放按鈕！「機械本調」是 AI 死板地讀出每個字的字典音（本調），聽起來像外國人；而「流利變調」則會自動融入台語的變調音（例如「阿」音頻提升），發音就像土生土長的台灣阿嬤一樣自然！
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSidebar === 'related_links' && (
              <motion.div
                key="related_links"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="border-b-2 border-[#EADFCB] pb-5">
                  <h1 className="font-black text-[#1a1816] text-2xl md:text-3xl mb-2 flex items-center gap-2.5">
                    <span className="text-3xl">🔗</span> 推薦台語線上延伸學習資源
                  </h1>
                  <p className="text-[#3d3831] font-bold text-base md:text-lg">
                    提供教育部、文藝團體及泰宇出版精選的最新台語數位教學工具與檢定資源
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { title: '教育部臺灣閩南語常用詞辭典', url: 'https://twblg.dict.edu.tw/', desc: '最權威的線上台語字詞、片語查詢工具，附帶標準真人發音與典故說明。', tag: '權威字典' },
                    { title: '台語羅馬字輸入法工具', url: 'https://chiahpa.github.io/taigi-keyman/', desc: '幫助您輕鬆在電腦與手機端流暢地打出標準台語台羅拼音與特殊聲調符號。', tag: '數位工具' },
                    { title: '泰宇教育出版 - 台語互動資源網', url: 'https://taiyu.com.tw/', desc: '泰宇專為中小學師生打造的全新台語課本、互動多媒體教材與隨堂學習單。', tag: '泰宇官方' },
                    { title: '閩南語語言能力認證專區', url: 'https://blg.moe.edu.tw/', desc: '教育部舉辦之閩南語認證考試官方資訊，提供歷屆試題與線上模擬考。', tag: '認證檢定' },
                    { title: '臺灣閩南語羅馬字拼音方案使用手冊', url: 'https://language.moe.gov.tw/', desc: '教育部官方頒布之台羅拼音規則詳細教學電子書，完整收錄聲母韻母法則。', tag: '官方指南' },
                    { title: '公視台語台 - 數位學習影音館', url: 'https://www.taigitv.org.tw/', desc: '精選在地台語動畫、卡通、童謠與節目，讓學童透過趣味影音自然學台語。', tag: '影音動畫' }
                  ].map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 md:p-6 rounded-2xl bg-[#FFFDF7] border-2 border-[#EADFCB] hover:border-[#D9A328] hover:shadow-lg transition-all flex flex-col justify-between group gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#f2e6cb] text-[#7a4802] border border-[#dfc691]">
                            {link.tag}
                          </span>
                          <ExternalLink className="w-5 h-5 text-[#8c6519] group-hover:text-[#d97706] transition-colors" />
                        </div>
                        <h3 className="font-black text-[#1a1816] text-lg md:text-xl group-hover:text-[#b36b00] transition-colors leading-snug">
                          {link.title}
                        </h3>
                        <p className="text-sm md:text-base text-[#2e2a24] font-bold mt-2.5 leading-relaxed">
                          {link.desc}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#F1ECE0] flex items-center justify-between">
                        <span className="text-xs md:text-sm text-[#186e2e] font-black inline-flex items-center gap-1.5 bg-[#eaf5eb] px-3 py-1.5 rounded-xl border border-[#b2e0b9]">
                          立即前往網頁 ↗
                        </span>
                        <span className="text-xs text-[#8c6519] font-bold">點擊跳轉外部網站</span>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </HubShell>
  );
}
