import { useState, useEffect } from 'react';
import {
  BookOpen,
  Gamepad2,
  ChevronRight,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  Link,
  Heart,
  Tv,
  Share2
} from 'lucide-react';
import { logoMark, frogDecor, heroFull } from '../assets/images/homepage';
import { HubShell } from './games/GameShell';
import { motion, AnimatePresence } from 'motion/react';

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

import { speakTaiyu } from '../lib/speech';

export function speakText(text: string, tone?: number, tailo?: string, disableSandhi?: boolean, fluid?: boolean) {
  speakTaiyu(text, tone, tailo, disableSandhi, fluid);
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

  const SIDEBAR_ITEMS = [
    { id: 'tone_practice', label: '動畫專區', subtitle: '台語精彩動畫影片' },
    { id: 'phonics_games', label: '拼音遊戲', subtitle: '遊戲中學拼音' },
    { id: 'related_links', label: '相關連結', subtitle: '更多學習資源' },
  ];

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
