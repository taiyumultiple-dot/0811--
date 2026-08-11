import { ClassData, StudentItem, GameStatItem, HomeworkItem } from '../components/TeacherDashboard';

const STORAGE_KEY = 'taiyu_classes_data_v2';

export const DEFAULT_CLASSES_DATA: Record<string, ClassData> = {
  '503': {
    id: '503',
    className: '503.台語實驗班',
    gradeLabel: '5年3班',
    teacherName: '林國華 老師',
    schoolName: '臺羅拼音方塊研究所',
    totalStudents: 28,
    boysCount: 14,
    girlsCount: 14,
    onlineCount: 18,
    avgHoursThisWeek: '3 小時 47 分',
    hoursTrend: '較上週 ↑12%',
    avgAccuracy: 78.6,
    accuracyTrend: '較上週 ↑6.3%',
    topScore: 12850,
    topScorePlayer: '張小明 (打磚王 Lv.7)',
    attentionNeededCount: 4,
    attentionReason: '連續 3 天未通關',
    totalPlays: 342,
    topGame: 'Game 2 聲調打磚王',
    radarScores: {
      initials: 82,
      finals: 76,
      tones: 63,
      listening: 71,
      reading: 85
    },
    radarAdvice: '全班能力發展建議：聲調 / 變調掌握度相對較弱，建議加強第 4、8 調及變調規則練習。',
    topWrongQuestions: [
      { rank: 1, point: '第 8 調 (高短調)', errorRate: 68.2, errorType: '聲調聽辨錯誤' },
      { rank: 2, point: 'tsi / tsih 混淆', errorRate: 57.4, errorType: '聲母 / 拼音混淆' },
      { rank: 3, point: 'an / ang 混淆', errorRate: 49.1, errorType: '韻母辨識錯誤' },
      { rank: 4, point: 'l / n 混淆', errorRate: 41.7, errorType: '聲母混淆' },
      { rank: 5, point: '變調規則 (兒化變調)', errorRate: 39.3, errorType: '變調判斷錯誤' }
    ],
    weeklyHours: [
      { day: '週一', hours: 3.2 },
      { day: '週二', hours: 3.8 },
      { day: '週三', hours: 4.1 },
      { day: '週四', hours: 3.5 },
      { day: '週五', hours: 4.6 },
      { day: '週六', hours: 4.0 },
      { day: '週日', hours: 3.7 }
    ],
    animationCompletion: [
      { name: '台語拼音介紹', rate: 96 },
      { name: '聲母動畫', rate: 88 },
      { name: '韻母動畫', rate: 76 },
      { name: '聲調動畫', rate: 92 },
      { name: '變調動畫', rate: 68 }
    ],
    recentActivities: [
      { icon: '🚀', text: '在「聲調打磚王」達成 Lv.7，獲得新勳章！', highlight: '張小明', time: '今天 10:15' },
      { icon: '⭐', text: '完成「韻母學習」全部單元！', highlight: '李小華', time: '今天 09:48' },
      { icon: '🎯', text: '在「拼音練習」第 12 回答對率 90%', highlight: '王大同', time: '昨天 16:30' },
      { icon: '🏆', text: '全班完成「太空台語生存戰」平均得分提升 15%！', highlight: '全班學生', time: '昨天 14:22' }
    ],
    students: [
      { id: 's1', studentNo: '112001', name: '張小明', avatar: '🎒', gender: 'boy', status: 'online', currentGame: '🟢 遊玩：《02 聲調打磚王》', score: 12850, stars: 22, accuracy: 94, lastActive: '剛剛', joinedGamesCount: 9, weakWord: '第8聲高短調', hoursThisWeek: 4.8, daysActive: 5 },
      { id: 's2', studentNo: '112002', name: '李美玲', avatar: '👧', gender: 'girl', status: 'online', currentGame: '🟢 遊玩：《01 太空台語生存戰》', score: 11200, stars: 20, accuracy: 98, lastActive: '剛剛', joinedGamesCount: 9, weakWord: '圓仔湯 inn-á-thng', hoursThisWeek: 4.2, daysActive: 5 },
      { id: 's3', studentNo: '112003', name: '李家豪', avatar: '👦', gender: 'boy', status: 'online', currentGame: '🟢 進行：《06 拼音研究所》', score: 9890, stars: 18, accuracy: 88, lastActive: '2分鐘前', joinedGamesCount: 7, weakWord: '秫米糋 tsu̍t-bí-tsìnn', hoursThisWeek: 3.5, daysActive: 4 },
      { id: 's4', studentNo: '112004', name: '王大同', avatar: '🧢', gender: 'boy', status: 'online', currentGame: '🟢 遊玩：《07 方塊研究所》', score: 8500, stars: 16, accuracy: 91, lastActive: '剛剛', joinedGamesCount: 8, weakWord: '葵扇 khuê-sìnn', hoursThisWeek: 3.9, daysActive: 4 },
      { id: 's5', studentNo: '112005', name: '黃雅婷', avatar: '👧', gender: 'girl', status: 'idle', currentGame: '🟡 暫停：《03 太空礦場》', score: 6980, stars: 12, accuracy: 82, lastActive: '8分鐘前', joinedGamesCount: 5, weakWord: 'tsi / tsih 混淆', hoursThisWeek: 2.1, daysActive: 2 },
      { id: 's6', studentNo: '112006', name: '林志強', avatar: '👟', gender: 'boy', status: 'online', currentGame: '🟢 進行：《聲調八音聽力隨堂測驗》', score: 7450, stars: 14, accuracy: 86, lastActive: '1分鐘前', joinedGamesCount: 6, weakWord: 'an / ang 混淆', hoursThisWeek: 3.1, daysActive: 3 },
      { id: 's7', studentNo: '112007', name: '蔡佩真', avatar: '🌸', gender: 'girl', status: 'offline', currentGame: '⚪ 離線（最後：鹿港伴手禮採購）', score: 10890, stars: 19, accuracy: 95, lastActive: '20分鐘前', joinedGamesCount: 9, weakWord: '全家福 tsuân-ka-hok', hoursThisWeek: 4.1, daysActive: 4 },
      { id: 's8', studentNo: '112008', name: '許宇軒', avatar: '🚀', gender: 'boy', status: 'offline', currentGame: '⚪ 離線（最後：故事繪本排序）', score: 4750, stars: 10, accuracy: 62, lastActive: '3天前', joinedGamesCount: 4, weakWord: 'l / n 聲母混淆', hoursThisWeek: 1.0, daysActive: 1 }
    ],
    gameStats: [
      { key: 'game1', name: '01 太空台語生存戰', players: 28, avgScore: 92, passRate: 92, topPlayer: '張小明 (12,850分)', hardWord: '芋丸 ōo-uân' },
      { key: 'game2', name: '02 聲調打磚王', players: 28, avgScore: 89, passRate: 78, topPlayer: '張小明 (Lv.7)', hardWord: '第8聲高短調' },
      { key: 'game3', name: '03 太空礦場', players: 25, avgScore: 84, passRate: 65, topPlayer: '蔡佩真 (9,500分)', hardWord: 'tsi / tsih 聲母' },
      { key: 'game4', name: '04 大挑戰', players: 27, avgScore: 78, passRate: 58, topPlayer: '李美玲 (10,000分)', hardWord: '變調規則' },
      { key: 'game5', name: '05 防衛戰', players: 28, avgScore: 87, passRate: 72, topPlayer: '張小明 (3,450分)', hardWord: '秫米糋 tsu̍t-bí-tsìnn' },
      { key: 'game6', name: '06 拼音研究所', players: 24, avgScore: 83, passRate: 81, topPlayer: '李家豪 (2,890分)', hardWord: '麵茶冰 mī-tê-ping' },
      { key: 'game7', name: '07 方塊研究所', players: 26, avgScore: 88, passRate: 68, topPlayer: '王大同 (3,100分)', hardWord: 'an / ang 韻母' }
    ],
    homeworks: [
      { id: 'hw-1', title: '單元三：聲調打磚王 - 挑戰第 8 調發音音調', gameName: '02 聲調打磚王', targetScore: 1000, dueDate: '2026/07/24', completedCount: 22, totalCount: 28 },
      { id: 'hw-2', title: '單元四：拼音方塊練習 - tsi/tsih 與 an/ang 聽音辨字', gameName: '06 拼音研究所', targetScore: 850, dueDate: '2026/07/26', completedCount: 15, totalCount: 28 }
    ],
    analysisDomains: [
      { domain: '聲母發音辨識', rate: 82, status: '良好', color: 'text-cyan-400' },
      { domain: '韻母與鼻音熟練度', rate: 76, status: '良好', color: 'text-cyan-300' },
      { domain: '聲調/變調掌握度', rate: 63, status: '需補強', color: 'text-amber-400' },
      { domain: '聽力拼寫能力', rate: 71, status: '良好', color: 'text-cyan-300' },
      { domain: '閱讀理解能力', rate: 85, status: '極優', color: 'text-emerald-400' }
    ]
  },

  '501': {
    id: '501',
    className: '501.台語先鋒班',
    gradeLabel: '5年1班',
    teacherName: '林國華 老師',
    schoolName: '臺羅拼音方塊研究所',
    totalStudents: 26,
    boysCount: 13,
    girlsCount: 13,
    onlineCount: 21,
    avgHoursThisWeek: '4 小時 15 分',
    hoursTrend: '較上週 ↑18%',
    avgAccuracy: 84.2,
    accuracyTrend: '較上週 ↑8.1%',
    topScore: 14500,
    topScorePlayer: '趙子龍 (打磚王 Lv.9)',
    attentionNeededCount: 2,
    attentionReason: '作業尚未繳交',
    totalPlays: 410,
    topGame: 'Game 6 拼音研究所',
    radarScores: { initials: 90, finals: 85, tones: 78, listening: 82, reading: 88 },
    radarAdvice: '先鋒班整體表現極佳，聲聲調調掌握度高，可挑戰進階變調與多音節詞彙。',
    topWrongQuestions: [
      { rank: 1, point: '變調規則 (輕聲變調)', errorRate: 42.1, errorType: '變調判斷錯誤' },
      { rank: 2, point: 'p / ph 聲母氣音', errorRate: 38.5, errorType: '發音聽辨錯誤' },
      { rank: 3, point: 'in / ing 韻母辨識', errorRate: 31.0, errorType: '韻母混淆' }
    ],
    weeklyHours: [
      { day: '週一', hours: 3.8 }, { day: '週二', hours: 4.2 }, { day: '週三', hours: 4.5 },
      { day: '週四', hours: 4.0 }, { day: '週五', hours: 5.1 }, { day: '週六', hours: 4.8 }, { day: '週日', hours: 4.2 }
    ],
    animationCompletion: [
      { name: '台語拼音介紹', rate: 100 }, { name: '聲母動畫', rate: 94 },
      { name: '韻母動畫', rate: 88 }, { name: '聲調動畫', rate: 96 }, { name: '變調動畫', rate: 80 }
    ],
    recentActivities: [
      { icon: '🚀', text: '在「聲調打磚王」達成 Lv.9！', highlight: '趙子龍', time: '今天 11:02' },
      { icon: '⭐', text: '完成「聲母學習」滿分突破！', highlight: '郭靜怡', time: '今天 10:18' }
    ],
    students: [
      { id: 's501_1', studentNo: '111001', name: '趙子龍', avatar: '🛡️', gender: 'boy', status: 'online', currentGame: '🟢 遊玩：《06 拼音研究所》', score: 14500, stars: 25, accuracy: 97, lastActive: '剛剛', joinedGamesCount: 10, weakWord: '輕聲變調', hoursThisWeek: 5.2, daysActive: 5 },
      { id: 's501_2', studentNo: '111002', name: '郭靜怡', avatar: '🌸', gender: 'girl', status: 'online', currentGame: '🟢 遊玩：《01 太空台語生存戰》', score: 12300, stars: 22, accuracy: 96, lastActive: '剛剛', joinedGamesCount: 9, weakWord: 'p/ph 气音', hoursThisWeek: 4.6, daysActive: 5 }
    ],
    gameStats: [
      { key: 'game1', name: '01 太空台語生存戰', players: 26, avgScore: 95, passRate: 95, topPlayer: '趙子龍 (14,500分)', hardWord: '肉包 bah-pau' },
      { key: 'game2', name: '02 聲調打磚王', players: 26, avgScore: 92, passRate: 88, topPlayer: '郭靜怡 (Lv.8)', hardWord: '變調規則' }
    ],
    homeworks: [
      { id: 'hw-501-1', title: '先鋒班專屬：進階聲調與輕聲變調綜合測驗', gameName: '06 拼音研究所', targetScore: 1200, dueDate: '2026/07/25', completedCount: 21, totalCount: 26 }
    ],
    analysisDomains: [
      { domain: '聲母發音辨識', rate: 90, status: '極優', color: 'text-emerald-400' },
      { domain: '韻母與鼻音熟練度', rate: 85, status: '極優', color: 'text-emerald-400' },
      { domain: '聲調/變調掌握度', rate: 78, status: '良好', color: 'text-cyan-300' },
      { domain: '聽力拼寫能力', rate: 82, status: '良好', color: 'text-cyan-300' },
      { domain: '閱讀理解能力', rate: 88, status: '極優', color: 'text-emerald-400' }
    ]
  }
};

export function getClassesData(): Record<string, ClassData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load classes data:', e);
  }
  return DEFAULT_CLASSES_DATA;
}

export function saveClassesData(data: Record<string, ClassData>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('class_data_updated', { detail: data }));
  } catch (e) {
    console.error('Failed to save classes data:', e);
  }
}

/**
 * Register a new student and automatically bind to class data
 */
export function registerNewStudentSync(params: {
  name: string;
  email?: string;
  school?: string;
  grade?: string;
  avatar?: string;
  gender?: 'boy' | 'girl';
}): { classId: string; student: StudentItem } {
  const current = getClassesData();
  
  // Find matching class or default to '503'
  let targetClassId = '503';
  const gradeInput = params.grade || '503';
  
  // Match key by string
  const existingKey = Object.keys(current).find(k => 
    current[k].className.includes(gradeInput) || k.includes(gradeInput) || gradeInput.includes(k)
  );
  
  if (existingKey) {
    targetClassId = existingKey;
  } else {
    // If grade specifies a new class like '502' or '504', auto create it!
    const cleanId = gradeInput.replace(/[^0-9a-zA-Z]/g, '') || `cls_${Date.now()}`;
    const newClassName = gradeInput.includes('班') ? gradeInput : `${gradeInput}.台語新星班`;
    
    current[cleanId] = {
      id: cleanId,
      className: newClassName,
      gradeLabel: gradeInput,
      teacherName: '專任指導老師',
      schoolName: params.school || '臺羅拼音方塊研究所',
      totalStudents: 1,
      boysCount: params.gender === 'girl' ? 0 : 1,
      girlsCount: params.gender === 'girl' ? 1 : 0,
      onlineCount: 1,
      avgHoursThisWeek: '1 小時 00 分',
      hoursTrend: '新建立班級 ↑100%',
      avgAccuracy: 90.0,
      accuracyTrend: '新建立 ↑100%',
      topScore: 12000,
      topScorePlayer: `${params.name} (新星登場)`,
      attentionNeededCount: 0,
      attentionReason: '全員學習狀態良好',
      totalPlays: 12,
      topGame: 'Game 1 太空台語生存戰',
      radarScores: { initials: 85, finals: 80, tones: 75, listening: 80, reading: 85 },
      radarAdvice: `新班級【${newClassName}】已成功連動註冊！全班指標建立中。`,
      topWrongQuestions: [
        { rank: 1, point: '第 8 調 (高短調)', errorRate: 40.0, errorType: '聲調聽辨錯誤' },
        { rank: 2, point: 'tsi / tsih 混淆', errorRate: 35.0, errorType: '聲母混淆' }
      ],
      weeklyHours: [
        { day: '週一', hours: 2.0 }, { day: '週二', hours: 2.5 }, { day: '週三', hours: 3.0 },
        { day: '週四', hours: 2.8 }, { day: '週五', hours: 3.5 }, { day: '週六', hours: 3.0 }, { day: '週日', hours: 2.5 }
      ],
      animationCompletion: [
        { name: '台語拼音介紹', rate: 90 }, { name: '聲母動畫', rate: 85 },
        { name: '韻母動畫', rate: 80 }, { name: '聲調動畫', rate: 85 }, { name: '變調動畫', rate: 70 }
      ],
      recentActivities: [],
      students: [],
      gameStats: [
        { key: 'game1', name: '01 太空台語生存戰', players: 1, avgScore: 90, passRate: 90, topPlayer: `${params.name} (1,200分)`, hardWord: '芋丸 ōo-uân' }
      ],
      homeworks: [],
      analysisDomains: [
        { domain: '聲母發音辨識', rate: 85, status: '極優', color: 'text-emerald-400' },
        { domain: '韻母與鼻音熟練度', rate: 80, status: '良好', color: 'text-cyan-300' },
        { domain: '聲調/變調掌握度', rate: 75, status: '良好', color: 'text-cyan-300' },
        { domain: '聽力拼寫能力', rate: 80, status: '良好', color: 'text-cyan-300' },
        { domain: '閱讀理解能力', rate: 85, status: '極優', color: 'text-emerald-400' }
      ]
    };
    targetClassId = cleanId;
  }

  const cls = current[targetClassId];
  const newStudentId = `std_${Date.now()}`;
  const studentNum = `1120${(cls.students.length + 1).toString().padStart(2, '0')}`;
  
  const newStudent: StudentItem = {
    id: newStudentId,
    studentNo: studentNum,
    name: params.name,
    avatar: params.avatar || (params.gender === 'girl' ? '👧' : '🎒'),
    gender: params.gender || 'boy',
    status: 'online',
    currentGame: '🟢 剛完成《新帳號註冊與連動》',
    score: 8800,
    stars: 15,
    accuracy: 92,
    lastActive: '剛剛註冊',
    joinedGamesCount: 5,
    weakWord: '聲調第8調練習',
    hoursThisWeek: 2.5,
    daysActive: 1
  };

  cls.students.unshift(newStudent);
  cls.totalStudents = cls.students.length;
  if (params.gender === 'girl') {
    cls.girlsCount += 1;
  } else {
    cls.boysCount += 1;
  }
  cls.onlineCount += 1;

  // Append recent activity
  cls.recentActivities.unshift({
    icon: '🎉',
    text: `註冊新帳號並自動連動連線至【${cls.className}】！`,
    highlight: params.name,
    time: '剛剛'
  });

  saveClassesData(current);
  return { classId: targetClassId, student: newStudent };
}

/**
 * Register a new class directly (e.g. from Teacher Dashboard or Teacher registration)
 */
export function createNewClassSync(params: {
  className: string;
  gradeLabel: string;
  teacherName: string;
  schoolName: string;
  initialStudentNames?: string[];
}): ClassData {
  const current = getClassesData();
  const classId = `cls_${Date.now().toString().slice(-4)}`;
  
  const defaultStudents: StudentItem[] = (params.initialStudentNames || ['陳大山', '林佩佩', '黃建國']).map((name, i) => ({
    id: `std_init_${i}_${Date.now()}`,
    studentNo: `1120${(i + 1).toString().padStart(2, '0')}`,
    name,
    avatar: i % 2 === 0 ? '👦' : '👧',
    gender: i % 2 === 0 ? 'boy' : 'girl',
    status: 'online',
    currentGame: '🟢 在線進行：《01 太空台語生存戰》',
    score: 9500 - i * 400,
    stars: 18 - i,
    accuracy: 90 - i * 2,
    lastActive: '剛剛',
    joinedGamesCount: 6,
    weakWord: '聲調聽辨',
    hoursThisWeek: 3.2,
    daysActive: 3
  }));

  const newClass: ClassData = {
    id: classId,
    className: params.className,
    gradeLabel: params.gradeLabel,
    teacherName: params.teacherName,
    schoolName: params.schoolName,
    totalStudents: defaultStudents.length,
    boysCount: defaultStudents.filter(s => s.gender === 'boy').length,
    girlsCount: defaultStudents.filter(s => s.gender === 'girl').length,
    onlineCount: defaultStudents.length,
    avgHoursThisWeek: '3 小時 30 分',
    hoursTrend: '最新建立班級 ↑100%',
    avgAccuracy: 88.5,
    accuracyTrend: '最新建立 ↑100%',
    topScore: 9500,
    topScorePlayer: `${defaultStudents[0]?.name || '學生'} (冠軍星影)`,
    attentionNeededCount: 0,
    attentionReason: '全班無落後紀錄',
    totalPlays: 120,
    topGame: 'Game 2 聲調打磚王',
    radarScores: { initials: 86, finals: 82, tones: 75, listening: 80, reading: 88 },
    radarAdvice: `【${params.className}】已完成註冊連動！系統已自動建立班級能力與錯題分析大數據。`,
    topWrongQuestions: [
      { rank: 1, point: '第 8 調 (高短調)', errorRate: 45.0, errorType: '聲調聽辨錯誤' },
      { rank: 2, point: 'tsi / tsih 混淆', errorRate: 38.0, errorType: '聲母混淆' },
      { rank: 3, point: 'an / ang 混淆', errorRate: 32.0, errorType: '韻母辨識錯誤' }
    ],
    weeklyHours: [
      { day: '週一', hours: 3.0 }, { day: '週二', hours: 3.5 }, { day: '週三', hours: 3.8 },
      { day: '週四', hours: 3.2 }, { day: '週五', hours: 4.1 }, { day: '週六', hours: 3.6 }, { day: '週日', hours: 3.0 }
    ],
    animationCompletion: [
      { name: '台語拼音介紹', rate: 95 }, { name: '聲母動畫', rate: 88 },
      { name: '韻母動畫', rate: 82 }, { name: '聲調動畫', rate: 90 }, { name: '變調動畫', rate: 72 }
    ],
    recentActivities: [
      { icon: '🏫', text: `系統已自動新增【${params.className}】並連動同步所有學生學習數據！`, highlight: params.teacherName, time: '剛剛' }
    ],
    students: defaultStudents,
    gameStats: [
      { key: 'game1', name: '01 太空台語生存戰', players: defaultStudents.length, avgScore: 92, passRate: 92, topPlayer: `${defaultStudents[0]?.name} (9,500分)`, hardWord: '芋丸 ōo-uân' },
      { key: 'game2', name: '02 聲調打磚王', players: defaultStudents.length, avgScore: 88, passRate: 85, topPlayer: `${defaultStudents[0]?.name} (Lv.6)`, hardWord: '第8聲高短調' }
    ],
    homeworks: [
      { id: `hw-${Date.now()}`, title: '班級入門作業：聲調打磚王基礎測驗', gameName: '02 聲調打磚王', targetScore: 800, dueDate: '2026/07/30', completedCount: defaultStudents.length, totalCount: defaultStudents.length }
    ],
    analysisDomains: [
      { domain: '聲母發音辨識', rate: 86, status: '極優', color: 'text-emerald-400' },
      { domain: '韻母與鼻音熟練度', rate: 82, status: '良好', color: 'text-cyan-300' },
      { domain: '聲調/變調掌握度', rate: 75, status: '良好', color: 'text-cyan-300' },
      { domain: '聽力拼寫能力', rate: 80, status: '良好', color: 'text-cyan-300' },
      { domain: '閱讀理解能力', rate: 88, status: '極優', color: 'text-emerald-400' }
    ]
  };

  current[classId] = newClass;
  saveClassesData(current);
  return newClass;
}

/**
 * Record gameplay or practice activity for a student in class data
 */
export function recordStudentActivity(params: {
  studentName: string;
  gameName: string;
  scoreAdded: number;
  accuracy?: number;
  classId?: string;
}): void {
  const current = getClassesData();
  const classId = params.classId || '503';
  const cls = current[classId] || current['503'];
  if (!cls) return;

  // Find or create student
  let std = cls.students.find(s => s.name === params.studentName || s.name.includes(params.studentName));
  if (!std) {
    const newStudentId = `std_demo_${Date.now()}`;
    const studentNum = `1120${(cls.students.length + 1).toString().padStart(2, '0')}`;
    std = {
      id: newStudentId,
      studentNo: studentNum,
      name: params.studentName,
      avatar: '🎒',
      gender: 'boy',
      status: 'online',
      currentGame: `🟢 遊玩：《${params.gameName}》`,
      score: 8000,
      stars: 12,
      accuracy: params.accuracy || 90,
      lastActive: '剛剛',
      joinedGamesCount: 4,
      weakWord: '聲調聽辨',
      hoursThisWeek: 2.0,
      daysActive: 2
    };
    cls.students.unshift(std);
    cls.totalStudents = cls.students.length;
    cls.boysCount += 1;
    cls.onlineCount += 1;
  }

  // Update student stats
  std.score += params.scoreAdded;
  std.stars += Math.floor(params.scoreAdded / 500) || 1;
  std.status = 'online';
  std.currentGame = `🟢 遊玩：《${params.gameName}》`;
  std.lastActive = '剛剛';
  if (params.accuracy) {
    std.accuracy = Math.round((std.accuracy + params.accuracy) / 2);
  }

  // Update top score if needed
  if (std.score > cls.topScore) {
    cls.topScore = std.score;
    cls.topScorePlayer = `${std.name} (${params.gameName})`;
  }

  // Add recent activity
  cls.recentActivities.unshift({
    icon: '🎯',
    text: `在「${params.gameName}」取得 ${params.scoreAdded} 分，成績即時連動至教學後台！`,
    highlight: std.name,
    time: '剛剛'
  });
  if (cls.recentActivities.length > 8) {
    cls.recentActivities = cls.recentActivities.slice(0, 8);
  }

  saveClassesData(current);
}

/**
 * Simulate live heartbeat pulse for real-time automatic data updating
 */
export function simulateLivePulse(classId: string = '503'): void {
  const current = getClassesData();
  const cls = current[classId] || current['503'];
  if (!cls || !cls.students || cls.students.length === 0) return;

  // Pick a random online student
  const onlineStudents = cls.students.filter(s => s.status === 'online');
  const targetStudent = onlineStudents[Math.floor(Math.random() * onlineStudents.length)] || cls.students[0];

  const gamesList = [
    '01 太空台語生存戰',
    '02 聲調打磚王',
    '03 太空礦場',
    '05 防衛戰',
    '06 拼音研究所',
    '07 方塊研究所'
  ];
  const randomGame = gamesList[Math.floor(Math.random() * gamesList.length)];
  const addedScore = Math.floor(Math.random() * 80) + 20;

  targetStudent.score += addedScore;
  targetStudent.currentGame = `🟢 遊玩：《${randomGame}》`;
  targetStudent.lastActive = '剛剛';
  cls.totalPlays += 1;

  // Small random pulse to accuracy or radar
  if (Math.random() > 0.5) {
    cls.avgAccuracy = Number(Math.min(99.5, Math.max(70.0, cls.avgAccuracy + (Math.random() * 0.4 - 0.2))).toFixed(1));
  }

  // Update recent activity
  const icons = ['🔥', '⚡', '🎯', '✨', '🏆'];
  const icon = icons[Math.floor(Math.random() * icons.length)];
  cls.recentActivities.unshift({
    icon,
    text: `剛完成「${randomGame}」關卡題庫，得 +${addedScore} 分 (自動即時同步)`,
    highlight: targetStudent.name,
    time: '剛剛'
  });

  if (cls.recentActivities.length > 8) {
    cls.recentActivities = cls.recentActivities.slice(0, 8);
  }

  saveClassesData(current);
}

