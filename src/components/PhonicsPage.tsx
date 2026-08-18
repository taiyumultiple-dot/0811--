import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  Tv,
  Share2,
  Megaphone,
  Music,
  PenTool,
  Sparkles,
  Info,
  Keyboard,
  Type,
  BookMarked,
  Compass,
  ChevronLeft,
  Home
} from 'lucide-react';
import { logoMark, frogDecor, heroFull } from '../assets/images/homepage';
import { HubShell } from './games/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import {
  TONES_DATA, TONE_PRACTICE_WORDS, TONE_NAMES, INITIAL_GROUPS, INITIALS_DATA,
  INITIAL_SYLLABLES, FINAL_GROUPS, type InitialSymbol, type Tone,
  SCHEME_INTRO_LINKS, INPUT_METHODS, CHAR_USAGE_NOTE, DICTIONARIES, LEARNING_RESOURCE_HUB,
  SLIDE_SECTIONS, slideUrl, SLIDE_AUDIO,
} from '../data/phonicsData';
import LessonAudio from './LessonAudio';

/** 拼音練習頁用：依臺羅標調規則把韻母＋聲調組合成正確拼字，不需要每個組合都湊例字 */
function applyTaiLoTone(final: string, tone: Tone): string {
  const TONE_MARKS: Record<number, string> = { 2: '́', 3: '̀', 5: '̂', 7: '̄', 8: '̍' };
  const entering = /[ptkh]$/.test(final);
  if (tone === 1 || (tone === 4 && entering)) return final;
  const mark = TONE_MARKS[tone];
  if (!mark) return final;
  // 獨立鼻音 ng／m 當韻母時，調號標在 n（ng）或 m 本身
  if (final === 'ng') return ('n' + mark).normalize('NFC') + 'g';
  if (final === 'm') return ('m' + mark).normalize('NFC');
  let idx = final.startsWith('oo') ? 0 : -1;
  if (idx === -1) idx = [...final].findIndex((c) => 'aoe'.includes(c));
  if (idx === -1) {
    // 只有 i／u：標在後面那個母音上（如 ui -> uì、iu -> iù）
    const positions = [...final].map((c, i) => ('iu'.includes(c) ? i : -1)).filter((i) => i >= 0);
    idx = positions.length ? positions[positions.length - 1] : -1;
  }
  if (idx === -1) return final;
  const chars = [...final];
  chars[idx] = (chars[idx] + mark).normalize('NFC');
  return chars.join('');
}


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

export default function PhonicsPage({
  onNavigate,
  initialTab = 'tone_practice'
}: {
  onNavigate: (view: string) => void;
  initialTab?: string;
}) {
  const [activeSidebar, setActiveSidebar] = useState<string>(initialTab);

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


  // --- 拼音方案總覽頁（跟入門篇 pptx 壹～柒節一致，單張投影片播放的感覺） ---
  const [schemeTab, setSchemeTab] = useState<
    'intro' | 'tones' | 'scheme' | 'input' | 'chars' | 'dict' | 'resources'
  >('intro');
  const tabSlideRange = (tab: string): [number, number] => {
    const secs = SLIDE_SECTIONS.filter((s) => s.tab === tab);
    return [Math.min(...secs.map((s) => s.range[0])), Math.max(...secs.map((s) => s.range[1]))];
  };
  const [slideNum, setSlideNum] = useState<number>(1);
  const goToScheme = (tab: typeof schemeTab) => {
    setSchemeTab(tab);
    setSlideNum(tabSlideRange(tab)[0]);
  };

  // 左右鍵翻頁，像真的在放 PPT 一樣
  useEffect(() => {
    if (activeSidebar !== 'phonics_scheme') return;
    const [lo, hi] = tabSlideRange(schemeTab);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSlideNum((n) => Math.min(hi, n + 1));
      else if (e.key === 'ArrowLeft') setSlideNum((n) => Math.max(lo, n - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSidebar, schemeTab]);

  // --- 聲母學習 ---
  const [selectedInitial, setSelectedInitial] = useState<InitialSymbol | null>(null);

  // --- 韻母學習 ---
  const [expandedFinalGroup, setExpandedFinalGroup] = useState<string | null>(FINAL_GROUPS[0].group);

  // --- 拼音練習：聲母＋韻母＋聲調組合器 ---
  const [comboInitial, setComboInitial] = useState<InitialSymbol>('p');
  const [comboFinal, setComboFinal] = useState('a');
  const [comboTone, setComboTone] = useState<Tone>(1);

  // --- 連讀變調頁 ---
  const [sandhiTone, setSandhiTone] = useState<Tone>(1);

  // 側欄拿掉了（跟頂部導覽列的「拼音學習」「動畫專區」重複），改由 initialTab
  // 這個 prop 直接決定要顯示哪個分頁；頂部導覽列換頁時 initialTab 會變，
  // 這裡要跟著同步，不然使用者從動畫專區點回拼音學習會沒反應。
  useEffect(() => {
    setActiveSidebar(initialTab);
  }, [initialTab]);

  return (
    <HubShell activeKey={activeSidebar} onHome={() => onNavigate('home')}>
      {/* ---------------- Main Content Body ---------------- */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 bg-white rounded-3xl p-5 md:p-7 shadow-sm flex flex-col">
          <AnimatePresence mode="wait">
            {activeSidebar === 'phonics_scheme' && (
              <motion.div
                key="phonics_scheme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="pb-2">
                  <h1 className="font-black text-[#2D2A26] text-2xl mb-1 flex items-center gap-2">
                    <span className="text-3xl">📖</span> 臺灣台語羅馬字拼音方案
                  </h1>
                  <p className="text-[#8A8378] text-base">
                    教育部民國 95 年公布的官方拼音系統，簡稱「臺羅」。分成壹～柒節，照課本順序一頁一頁學。
                  </p>
                </div>

                <div className="flex gap-2 bg-[#FAF8F2] p-1.5 rounded-2xl w-fit flex-wrap">
                  {([
                    ['intro', '壹．認識方案', Info],
                    ['tones', '貳．聲調與變調', Sparkles],
                    ['scheme', '參．聲母與韻母', Megaphone],
                    ['input', '肆．常用輸入法', Keyboard],
                    ['chars', '伍．漢字使用規範', Type],
                    ['dict', '陸．辭典使用指南', BookMarked],
                    ['resources', '柒．學習資源綜合包', Compass],
                  ] as const).map(([tab, label, TabIcon]) => (
                    <button
                      key={tab}
                      onClick={() => goToScheme(tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all active:scale-95 ${
                        schemeTab === tab
                          ? 'bg-[#4E9B5D] text-white shadow-md scale-105'
                          : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                      }`}
                    >
                      <TabIcon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex flex-col gap-8">
                  {(() => {
                    const [lo, hi] = tabSlideRange(schemeTab);
                    const n = Math.min(Math.max(slideNum, lo), hi);
                    const sec = SLIDE_SECTIONS.filter((s) => s.tab === schemeTab).find((s) => n >= s.range[0] && n <= s.range[1]);
                    const audio = SLIDE_AUDIO.find((a) => a.afterSlide === n);
                    return (
                      <div className="flex flex-col gap-3">
                        {sec?.title && <h3 className="font-black text-[#3E2723] text-lg">{sec.title}</h3>}
                        <div className="rounded-2xl overflow-hidden border border-[#EFE8D8] shadow-md bg-[#1a1a1a]">
                          <img
                            src={`${import.meta.env.BASE_URL}${slideUrl(n)}`}
                            alt={`課本入門篇第 ${n} 頁`}
                            className="w-full h-auto"
                          />
                        </div>

                        {audio && <LessonAudio trackKey={audio.trackKey} />}

                        <div className="flex items-center justify-between bg-[#FAF8F2] rounded-2xl px-4 py-3">
                          <button
                            onClick={() => setSlideNum(Math.max(lo, n - 1))}
                            disabled={n <= lo}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#EFE8D8] font-black text-sm text-[#5C5548] hover:border-[#4E9B5D] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" /> 上一頁
                          </button>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSlideNum(lo)}
                              className="w-10 h-10 rounded-full bg-white border border-[#EFE8D8] flex items-center justify-center hover:border-[#4E9B5D] active:scale-95 transition-all shadow-sm"
                              aria-label="回到本節第一頁"
                            >
                              <Home className="w-4 h-4 text-[#5C5548]" />
                            </button>
                            <span className="font-mono font-black text-[#8A8378] text-sm">{n - lo + 1} / {hi - lo + 1}</span>
                          </div>

                          <button
                            onClick={() => setSlideNum(Math.min(hi, n + 1))}
                            disabled={n >= hi}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4E9B5D] text-white font-black text-sm hover:bg-[#3E8552] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            下一頁 <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {schemeTab === 'intro' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SCHEME_INTRO_LINKS.map((l) => (
                        <a
                          key={l.title}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-5 rounded-2xl border border-[#EFE8D8] shadow-sm hover:border-[#4E9B5D] hover:shadow-md transition-all flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[#2D2A26] text-base">{l.title}</span>
                            <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                          </div>
                          <p className="text-sm text-[#8A8378]">{l.desc}</p>
                        </a>
                      ))}
                    </div>
                  )}

                  {schemeTab === 'tones' && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-black text-[#3E2723] text-lg">連讀變調練習：AA 型重疊詞</h3>
                      <p className="text-sm text-[#8A8378]">前字變調、後字本調，選一個聲調體會前後差別。</p>
                      <div className="flex flex-wrap gap-2">
                        {TONES_DATA.map((t) => (
                          <button
                            key={t.tone}
                            onClick={() => setSandhiTone(t.tone)}
                            className={`px-5 py-2.5 rounded-xl font-black text-base transition-all active:scale-95 ${
                              sandhiTone === t.tone
                                ? 'bg-[#4E9B5D] text-white shadow-md'
                                : 'bg-white border-2 border-[#EFE8D8] text-[#5C5548] hover:border-[#4E9B5D]'
                            }`}
                          >
                            第 {t.tone} 聲
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TONE_PRACTICE_WORDS[sandhiTone].map((w) => (
                          <div key={w.hanzi} className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-sm flex items-center justify-between">
                            <span className="text-xl font-black text-[#2D2A26]">{w.hanzi}</span>
                            <span className="font-mono font-black text-[#E4772E]">{w.tailo}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-50/40 flex items-start gap-2.5">
                        <AlertCircle className="w-4.5 h-4.5 text-[#4E9B5D] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#3E7D4C] leading-relaxed">
                          💡 AA 型重疊詞的第一個字要變調、第二個字讀本調——例如「{TONE_PRACTICE_WORDS[sandhiTone][0]?.hanzi}」的前字聲調，跟{TONE_NAMES[sandhiTone]}的字典本調聽起來不一樣，這就是連讀變調。
                        </p>
                      </div>
                    </div>
                  )}

                  {schemeTab === 'scheme' && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="font-black text-[#3E2723] text-lg mb-3">延伸練習：逐聲母例字（課本練習篇 P.36-53）</h3>
                        {!selectedInitial ? (
                          <div className="flex flex-col gap-5">
                            {INITIAL_GROUPS.map((g) => (
                              <div key={g.group}>
                                <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">{g.group}</div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                  {g.symbols.map((sym) => (
                                    <button
                                      key={sym}
                                      onClick={() => setSelectedInitial(sym)}
                                      className="aspect-square rounded-2xl bg-white border-2 border-[#EFE8D8] hover:border-[#4E9B5D] active:scale-95 transition-all flex items-center justify-center font-mono font-black text-2xl text-[#4E9B5D] shadow-sm"
                                    >
                                      {INITIALS_DATA[sym].label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-6 bg-[#FCFAF5] p-5 rounded-3xl border border-[#EFE8D8]">
                            <div className="flex justify-between items-center border-b border-[#EFE8D8] pb-4">
                              <button
                                onClick={() => setSelectedInitial(null)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#EFE8D8] rounded-xl font-bold text-sm text-[#5C5548] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                              >
                                ← 返回聲母列表
                              </button>
                            </div>
                            <div className="flex items-center gap-5">
                              <div className="w-24 h-24 rounded-2xl bg-[#4E9B5D]/5 border-2 border-[#4E9B5D] flex items-center justify-center shrink-0">
                                <span className="text-5xl font-black text-[#4E9B5D]">{INITIALS_DATA[selectedInitial].label}</span>
                              </div>
                              <div>
                                <h2 className="text-2xl font-black text-[#2D2A26] mb-1">{INITIALS_DATA[selectedInitial].label} 聲母</h2>
                                <p className="text-base text-[#5C5548] font-bold">{INITIALS_DATA[selectedInitial].desc}</p>
                                {INITIALS_DATA[selectedInitial].example && (
                                  <p className="text-base text-[#E4772E] font-black mt-1">
                                    例：{INITIALS_DATA[selectedInitial].example!.hanzi}（{INITIALS_DATA[selectedInitial].example!.tailo}）
                                  </p>
                                )}
                              </div>
                            </div>
                            <LessonAudio
                              trackKey={`initial-${selectedInitial}`}
                              title={`課本錄音：聲母 ${INITIALS_DATA[selectedInitial].label}`}
                            />
                            <div className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-sm">
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-3">課本「10 分鐘練武功」例字（P.36-53）</div>
                              <div className="flex flex-wrap gap-2.5">
                                {INITIAL_SYLLABLES[selectedInitial].map((s) => (
                                  <div key={s.tone} className="px-4 py-2.5 rounded-xl bg-[#FFF7EE] border-2 border-[#E4772E]/40 flex items-baseline gap-2">
                                    <span className="text-sm font-black text-[#E4772E] bg-[#E4772E]/10 rounded-full w-5 h-5 inline-flex items-center justify-center">{s.tone}</span>
                                    <span className="text-lg font-black text-[#2D2A26] font-mono">{s.syllable}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-black text-[#3E2723] text-lg mb-3">延伸練習：韻母查詢（課本官方對照表）</h3>
                        <div className="flex flex-col gap-3">
                          {FINAL_GROUPS.map((g) => {
                            const isOpen = expandedFinalGroup === g.group;
                            return (
                              <div key={g.group} className="bg-white rounded-2xl border border-[#EFE8D8] shadow-sm overflow-hidden">
                                <button
                                  onClick={() => setExpandedFinalGroup(isOpen ? null : g.group)}
                                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAF8F2] transition-colors"
                                >
                                  <span className="font-black text-[#3E2723]">{g.group}</span>
                                  <span className="flex items-center gap-2 text-sm text-[#8A8378] font-bold">
                                    共 {g.items.length} 個
                                    <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                  </span>
                                </button>
                                {isOpen && (
                                  <div className="px-5 pb-5 flex flex-wrap gap-2">
                                    {g.items.map((it) => (
                                      <div key={it.symbol} className="px-3.5 py-2.5 rounded-xl bg-[#FFF9EC] border border-[#EFE8D8] flex items-baseline gap-2">
                                        <span className="font-mono font-black text-[#2D2A26] text-base">{it.symbol}</span>
                                        <span className="text-sm text-[#8A8378] font-bold">{it.desc}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-[#3E2723] text-lg mb-3">延伸練習：拼音組合器</h3>
                        <div className="max-w-2xl bg-[#FCFAF5] rounded-3xl border border-[#EFE8D8] p-6 flex flex-col gap-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">聲母</div>
                              <select
                                value={comboInitial}
                                onChange={(e) => setComboInitial(e.target.value as InitialSymbol)}
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EFE8D8] font-mono font-black text-[#2D2A26] bg-white"
                              >
                                {INITIAL_GROUPS.flatMap((g) => g.symbols).map((sym) => (
                                  <option key={sym} value={sym}>{INITIALS_DATA[sym].label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">韻母</div>
                              <select
                                value={comboFinal}
                                onChange={(e) => setComboFinal(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EFE8D8] font-mono font-black text-[#2D2A26] bg-white"
                              >
                                {FINAL_GROUPS.flatMap((g) => g.items).map((it) => (
                                  <option key={it.symbol} value={it.symbol}>{it.symbol}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#8A8378] tracking-widest mb-2">聲調</div>
                              <select
                                value={comboTone}
                                onChange={(e) => setComboTone(Number(e.target.value) as Tone)}
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EFE8D8] font-mono font-black text-[#2D2A26] bg-white"
                              >
                                {TONES_DATA.map((t) => (
                                  <option key={t.tone} value={t.tone}>第 {t.tone} 聲</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl border-2 border-[#4E9B5D]/30 p-6 flex flex-col items-center gap-2">
                            <div className="text-sm font-black text-[#8A8378] tracking-widest">拼字結果</div>
                            <div className="text-5xl font-black text-[#4E9B5D] font-mono">
                              {comboInitial === 'zero' ? '' : INITIALS_DATA[comboInitial].label}
                              {applyTaiLoTone(comboFinal, comboTone)}
                            </div>
                            <div className="text-sm text-[#8A8378]">
                              {(comboInitial === 'zero' ? '' : INITIALS_DATA[comboInitial].label)} + {comboFinal} + 第{comboTone}聲
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {schemeTab === 'input' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {INPUT_METHODS.map((m) => (
                          <a
                            key={m.name}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-4 rounded-2xl border border-[#EFE8D8] shadow-sm hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-black text-[#2D2A26] text-sm">{m.name}</div>
                              <div className="text-xs text-[#8A8378] mt-0.5">{m.platform}</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {schemeTab === 'chars' && (
                    <div className="flex flex-col gap-2.5">
                      {CHAR_USAGE_NOTE.resources.map((r) => (
                        <a
                          key={r.title}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-4 rounded-2xl border border-[#EFE8D8] hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-black text-[#2D2A26] text-sm">{r.title}</div>
                            <div className="text-sm text-[#8A8378] mt-0.5">{r.desc}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {schemeTab === 'dict' && (
                    <div className="flex flex-col gap-2.5">
                      {DICTIONARIES.map((d) => (
                        <a
                          key={d.name}
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-4 rounded-2xl border border-[#EFE8D8] hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                        >
                          <div className="font-black text-[#2D2A26] text-sm">{d.name}</div>
                          <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {schemeTab === 'resources' && (
                    <a
                      href={LEARNING_RESOURCE_HUB.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-4 rounded-2xl border border-[#EFE8D8] hover:border-[#4E9B5D] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="font-black text-[#2D2A26] text-sm">{LEARNING_RESOURCE_HUB.title}</div>
                      <ExternalLink className="w-4 h-4 text-[#4E9B5D] shrink-0" />
                    </a>
                  )}
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

          </AnimatePresence>
        </div>
      </div>
    </HubShell>
  );
}
