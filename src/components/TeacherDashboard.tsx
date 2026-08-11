import { useState, useEffect } from 'react';
import {
  getClassesData,
  createNewClassSync,
  registerNewStudentSync
} from '../lib/classDataStore';
import {
  X,
  Users,
  BarChart3,
  Award,
  Send,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Plus,
  FlaskConical,
  Bell,
  Mail,
  Settings,
  LogOut,
  ChevronDown,
  Rocket,
  FileText,
  Target,
  Trophy,
  BarChart2,
  PieChart,
  HelpCircle,
  Eye,
  Sliders,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OldStreetBackground, { BgStyle } from './games/OldStreetBackground';

interface TeacherDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  embedded?: boolean;
  teacherName?: string;
  schoolName?: string;
}

export interface StudentItem {
  id: string;
  studentNo: string;
  name: string;
  avatar: string;
  gender: 'boy' | 'girl';
  status: 'online' | 'idle' | 'offline';
  currentGame: string;
  score: number;
  stars: number;
  accuracy: number;
  lastActive: string;
  joinedGamesCount: number;
  weakWord?: string;
  hoursThisWeek: number;
  daysActive: number;
}

export interface HomeworkItem {
  id: string;
  title: string;
  gameName: string;
  targetScore: number;
  dueDate: string;
  completedCount: number;
  totalCount: number;
}

export interface GameStatItem {
  key: string;
  name: string;
  players: number;
  avgScore: number;
  passRate: number;
  topPlayer: string;
  hardWord: string;
}

export interface ClassData {
  id: string;
  className: string;
  gradeLabel: string;
  teacherName: string;
  schoolName: string;
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
  onlineCount: number;
  avgHoursThisWeek: string;
  hoursTrend: string;
  avgAccuracy: number;
  accuracyTrend: string;
  topScore: number;
  topScorePlayer: string;
  attentionNeededCount: number;
  attentionReason: string;
  totalPlays: number;
  topGame: string;
  radarScores: {
    initials: number; // 聲母辨識力
    finals: number;   // 韻母與鼻音熟練度
    tones: number;    // 聲調/變調掌握度
    listening: number;// 聽力拼寫能力
    reading: number;  // 閱讀理解能力
  };
  radarAdvice: string;
  topWrongQuestions: Array<{
    rank: number;
    point: string;
    errorRate: number;
    errorType: string;
  }>;
  weeklyHours: Array<{ day: string; hours: number }>;
  animationCompletion: Array<{ name: string; rate: number }>;
  recentActivities: Array<{
    icon: string;
    text: string;
    highlight: string;
    time: string;
  }>;
  students: StudentItem[];
  gameStats: GameStatItem[];
  homeworks: HomeworkItem[];
  analysisDomains: Array<{ domain: string; rate: number; status: string; color: string }>;
}

const CLASSES_DATA: Record<string, ClassData> = {
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
      { id: 's501_2', studentNo: '111002', name: '郭靜怡', avatar: '🌸', gender: 'girl', status: 'online', currentGame: '🟢 遊玩：《01 太空台語生存戰》', score: 12300, stars: 22, accuracy: 96, lastActive: '剛剛', joinedGamesCount: 9, weakWord: 'p/ph 氣音', hoursThisWeek: 4.6, daysActive: 5 }
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

export default function TeacherDashboard({
  isOpen = true,
  onClose,
  embedded = true,
  teacherName = '林國華老師'
}: TeacherDashboardProps) {
  const [classesDataMap, setClassesDataMap] = useState<Record<string, ClassData>>(() => getClassesData());
  const [selectedClassId, setSelectedClassId] = useState<string>('503');
  const [activeTopTab, setActiveTopTab] = useState<'overview' | 'students' | 'export'>('overview');
  const [activeSidebarKey, setActiveSidebarKey] = useState<string>('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state with classDataStore & Auto-update data in real-time
  useEffect(() => {
    const handleUpdate = () => {
      const latest = getClassesData();
      setClassesDataMap(latest);
    };

    window.addEventListener('class_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // 定期同步 classDataStore（真實學生遊玩後會透過 progressStore → recordStudentActivity 寫入）
    const syncInterval = setInterval(() => {
      const latest = getClassesData();
      setClassesDataMap(latest);
    }, 1500);

    // 注意：先前這裡有一個 simulateLivePulse() 的假資料心跳模擬（每 6 秒隨機幫某個
    // demo 學生加分、捏造「剛完成關卡」的動態），在串接 progressStore 讓真實遊玩會
    // 自動回寫資料之後，這個模擬器已經移除 —— 避免真實學生的分數被隨機雜訊蓋過，
    // 造成老師看到不準確的數字。

    return () => {
      window.removeEventListener('class_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(syncInterval);
    };
  }, [selectedClassId]);

  // Add Class modal
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassNameInput, setNewClassNameInput] = useState('');
  const [newGradeLabelInput, setNewGradeLabelInput] = useState('5年2班');

  // Add Student modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentNameInput, setNewStudentNameInput] = useState('');
  const [newStudentGenderInput, setNewStudentGenderInput] = useState<'boy' | 'girl'>('boy');

  // Homework modal
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('本週作業：完成台語拼音方塊測驗與聲調練習');
  const [hwGame, setHwGame] = useState('02 聲調打磚王');
  const [hwTargetScore, setHwTargetScore] = useState(1000);
  const [hwDueDate, setHwDueDate] = useState('2026/07/28');
  const [customHomeworks, setCustomHomeworks] = useState<Record<string, HomeworkItem[]>>({});

  if (!embedded && !isOpen) return null;

  const ALL_CLASSES = { ...CLASSES_DATA, ...classesDataMap };
  const currentClass = ALL_CLASSES[selectedClassId] || Object.values(ALL_CLASSES)[0] || CLASSES_DATA['503'];
  const activeHomeworks = customHomeworks[selectedClassId] || currentClass.homeworks;
  const STUDENTS = currentClass.students || [];

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const updated = getClassesData();
    setClassesDataMap(updated);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(`🔄 已成功同步全站【${currentClass.className}】及新註冊帳號最新數據！`);
    }, 600);
  };

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassNameInput.trim()) return;
    const created = createNewClassSync({
      className: newClassNameInput.trim(),
      gradeLabel: newGradeLabelInput.trim() || '新成班',
      teacherName: teacherName || '林國華老師',
      schoolName: '臺羅拼音方塊研究所'
    });
    setClassesDataMap(getClassesData());
    setSelectedClassId(created.id);
    setShowAddClassModal(false);
    setNewClassNameInput('');
    showToast(`🏫 已成功新增並連動【${created.className}】教學數據！`);
  };

  const handleAddStudentToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentNameInput.trim()) return;
    registerNewStudentSync({
      name: newStudentNameInput.trim(),
      grade: currentClass.gradeLabel || currentClass.className,
      school: currentClass.schoolName,
      gender: newStudentGenderInput
    });
    setClassesDataMap(getClassesData());
    setShowAddStudentModal(false);
    setNewStudentNameInput('');
    showToast(`🎒 已成功新增學生【${newStudentNameInput.trim()}】至【${currentClass.className}】！`);
  };

  const handleExportReport = () => {
    // Generate CSV content with UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
    let csv = '\uFEFF';

    // Title & Metadata
    csv += `【${currentClass.className}】台語學習數據總覽成績單\n`;
    csv += `學校名稱,${currentClass.schoolName}\n`;
    csv += `指導老師,${currentClass.teacherName || teacherName}\n`;
    csv += `匯出日期,${new Date().toLocaleDateString('zh-TW')}\n\n`;

    // Section 1: Class Overview Stats
    csv += `=== 班級概況指標 ===\n`;
    csv += `班級總人數,本週平均學習時長,全班平均正確率,本週最高分紀錄,待關注人數\n`;
    csv += `${currentClass.totalStudents}人,${currentClass.avgHoursThisWeek},${currentClass.avgAccuracy}%,${currentClass.topScore}分 (${currentClass.topScorePlayer}),${currentClass.attentionNeededCount}人\n\n`;

    // Section 2: Student Grade Details
    csv += `=== 全班學生成績單明細 ===\n`;
    csv += `學號,學生姓名,性別,當前狀態,目前進行/最後遊玩遊戲,累積總分,星星數,平均答對率,學習時長(小時),活躍天數,待加強弱點音標\n`;
    (currentClass.students || []).forEach((s) => {
      const genderText = s.gender === 'girl' ? '女' : '男';
      const statusText = s.status === 'online' ? '在線' : s.status === 'idle' ? '暫停' : '離線';
      const cleanGame = (s.currentGame || '').replace(/"/g, '""');
      const cleanWeak = (s.weakWord || '').replace(/"/g, '""');
      csv += `="${s.studentNo}",${s.name},${genderText},${statusText},"${cleanGame}",${s.score},${s.stars},${s.accuracy}%,${s.hoursThisWeek},${s.daysActive},"${cleanWeak}"\n`;
    });

    // Section 3: Game Performance Stats
    csv += `\n=== 遊戲關卡通過率統計 ===\n`;
    csv += `遊戲名稱,遊玩人數,全班平均分數,關卡通關率,最高分玩家,難點詞彙\n`;
    (currentClass.gameStats || []).forEach((g) => {
      csv += `"${g.name}",${g.players}人,${g.avgScore}分,${g.passRate}%,"${g.topPlayer}","${g.hardWord}"\n`;
    });

    // Section 4: Homework Status
    csv += `\n=== 班級作業繳交紀錄 ===\n`;
    csv += `作業名稱,對應遊戲,目標分數,截止日期,繳交狀況,完成率\n`;
    activeHomeworks.forEach((hw) => {
      const rate = Math.round((hw.completedCount / hw.totalCount) * 100);
      csv += `"${hw.title}","${hw.gameName}",${hw.targetScore},${hw.dueDate},${hw.completedCount}/${hw.totalCount}人,${rate}%\n`;
    });

    // Create file download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${currentClass.className}_台語學習成績單與數據報表.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`📥 已成功下載 Excel 成績單《${currentClass.className}_台語學習成績單與數據報表.csv》！`);
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const newHw: HomeworkItem = {
      id: `hw-${Date.now()}`,
      title: hwTitle,
      gameName: hwGame,
      targetScore: hwTargetScore,
      dueDate: hwDueDate,
      completedCount: 0,
      totalCount: currentClass.totalStudents
    };
    setCustomHomeworks((prev) => ({
      ...prev,
      [selectedClassId]: [newHw, ...(prev[selectedClassId] || currentClass.homeworks)]
    }));
    setShowHomeworkModal(false);
    showToast(`✅ 已向【${currentClass.className}】全班派發作業：【${hwTitle}】`);
  };

  const filteredStudents = STUDENTS.filter((s) => {
    const matchesSearch = s.name.includes(searchTerm) || s.studentNo.includes(searchTerm);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'online'
        ? s.status === 'online' || s.status === 'idle'
        : s.status === 'offline';
    return matchesSearch && matchesStatus;
  });

  // Calculate SVG Points for Radar Chart (5 axes)
  const radarData = currentClass.radarScores;
  const radarScoresList = [
    { label: '聲母辨識力', val: radarData.initials },
    { label: '韻母與鼻音熟練度', val: radarData.finals },
    { label: '聲調 / 變調掌握度', val: radarData.tones },
    { label: '聽力拼寫能力', val: radarData.listening },
    { label: '閱讀理解能力', val: radarData.reading }
  ];

  const radarCx = 190;
  const radarCy = 142;
  const radarRadius = 88;

  const getRadarCoords = (index: number, valuePercent: number) => {
    const angle = (-90 + index * 72) * (Math.PI / 180);
    const r = (radarRadius * valuePercent) / 100;
    return {
      x: radarCx + r * Math.cos(angle),
      y: radarCy + r * Math.sin(angle)
    };
  };

  const polygonPoints = radarScoresList
    .map((item, idx) => {
      const { x, y } = getRadarCoords(idx, item.val);
      return `${x},${y}`;
    })
    .join(' ');

  // Outer web polygon points (100% boundary)
  const outerWebPoints = [0, 1, 2, 3, 4]
    .map((idx) => {
      const { x, y } = getRadarCoords(idx, 100);
      return `${x},${y}`;
    })
    .join(' ');

  // Mid web polygon points (60% boundary)
  const midWebPoints = [0, 1, 2, 3, 4]
    .map((idx) => {
      const { x, y } = getRadarCoords(idx, 60);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full bg-[#060f1c] text-slate-100 rounded-2xl border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(2,132,199,0.35)] flex flex-col overflow-hidden text-sm">
      {/* ---------------- Navigation Bar with Tabs & Class Selector ---------------- */}
      <div className="bg-[#081628] border-b-2 border-cyan-500/40 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Sub Navigation Tabs */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTopTab('overview');
              setActiveSidebarKey('overview');
            }}
            className={`px-4 md:px-5 py-2 rounded-xl font-black text-sm md:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTopTab === 'overview'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                : 'bg-cyan-950/60 text-cyan-200 hover:bg-cyan-900 hover:text-white border border-cyan-500/30'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>全班總覽</span>
          </button>

          <button
            onClick={() => {
              setActiveTopTab('students');
              setActiveSidebarKey('student_list');
            }}
            className={`px-4 md:px-5 py-2 rounded-xl font-black text-sm md:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTopTab === 'students'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                : 'bg-cyan-950/60 text-cyan-200 hover:bg-cyan-900 hover:text-white border border-cyan-500/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>個別學生紀錄</span>
          </button>

          <button
            onClick={() => {
              setActiveTopTab('export');
              setActiveSidebarKey('wrong_questions');
            }}
            className={`px-4 md:px-5 py-2 rounded-xl font-black text-sm md:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTopTab === 'export'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                : 'bg-cyan-950/60 text-cyan-200 hover:bg-cyan-900 hover:text-white border border-cyan-500/30'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>遊戲數據導出</span>
          </button>
        </div>

        {/* Right: Class Selector & Add Class Button (Moved from Top Header) */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-black shadow-[0_0_12px_rgba(52,211,153,0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>數據即時自動連動中</span>
          </div>

          {toastMsg && (
            <div className="bg-emerald-950 border-2 border-emerald-400 px-3 py-1.5 rounded-xl text-emerald-200 text-xs font-black flex items-center gap-1.5 animate-fade-in shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-[#030a16] border-2 border-cyan-400/60 px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-cyan-200 font-black text-xs md:text-sm whitespace-nowrap">班級選擇：</span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedClassId(nextId);
                showToast(`🔄 已成功切換至【${ALL_CLASSES[nextId]?.className || '班級'}】！`);
              }}
              className="bg-transparent text-emerald-300 font-black text-xs md:text-sm outline-none cursor-pointer pr-1"
            >
              {Object.values(ALL_CLASSES).map((cls) => (
                <option key={cls.id} value={cls.id} className="bg-[#081628] text-white">
                  {cls.className} ({cls.totalStudents}人)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-cyan-300 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowAddClassModal(true)}
            className="px-3 py-1.5 bg-emerald-500/20 border-2 border-emerald-400/80 hover:bg-emerald-500/30 text-emerald-300 hover:text-white rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.3)] whitespace-nowrap"
            title="手動新增並連動新班級"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>新增班級</span>
          </button>

          {!embedded && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-rose-950/80 border border-rose-500/70 hover:bg-rose-900 text-rose-200 transition-colors cursor-pointer ml-1"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ---------------- Main Body Layout (Sidebar + Content Grid) ---------------- */}
      <div className="flex flex-1 overflow-hidden min-h-[700px]">
        {/* Left Sidebar Menu - Expanded Width & Large High-Contrast Font */}
        <aside className="w-60 md:w-64 bg-[#040a14] border-r-2 border-cyan-500/30 p-3.5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Group 0: Dashboard Header */}
            <div>
              <button
                onClick={() => {
                  setActiveSidebarKey('overview');
                  setActiveTopTab('overview');
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeSidebarKey === 'overview'
                    ? 'bg-cyan-900/90 text-cyan-200 border-l-4 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-cyan-200/80 hover:bg-cyan-950 hover:text-white'
                }`}
              >
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span>總覽儀表板</span>
              </button>
            </div>

            {/* Group 1: 學習模組管理 */}
            <div>
              <div className="text-xs font-black text-cyan-300 tracking-wider mb-1.5 px-2 uppercase border-b border-cyan-500/20 pb-1">
                學習模組管理
              </div>
              <div className="flex flex-col gap-1 font-bold text-slate-200">
                {[
                  { key: 'pinyin_table', label: '拼音方案總表', icon: '🔤' },
                  { key: 'initials', label: '聲母學習', icon: '🗣️' },
                  { key: 'finals', label: '韻母學習', icon: '🎵' },
                  { key: 'pinyin_practice', label: '拼音練習', icon: '✍️' },
                  { key: 'animations', label: '動畫專區', icon: '🎬' },
                  { key: 'games', label: '拼音遊戲', icon: '🎮' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSidebarKey(item.key);
                      showToast(`🔍 已載入【${item.label}】模組詳情`);
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs md:text-sm ${
                      activeSidebarKey === item.key
                        ? 'bg-cyan-900/80 text-amber-300 font-black border border-cyan-500/50'
                        : 'hover:bg-cyan-950 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: 學習紀錄分析 */}
            <div>
              <div className="text-xs font-black text-cyan-300 tracking-wider mb-1.5 px-2 uppercase border-b border-cyan-500/20 pb-1">
                學習紀錄分析
              </div>
              <div className="flex flex-col gap-1 font-bold text-slate-200">
                {[
                  { key: 'ability_overview', label: '能力分析總覽', icon: '📈' },
                  { key: 'game_performance', label: '遊戲表現分析', icon: '🎯' },
                  { key: 'wrong_questions', label: '錯題分析報表', icon: '❌' },
                  { key: 'learning_history', label: '學習歷程追蹤', icon: '📜' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSidebarKey(item.key);
                      if (item.key === 'wrong_questions' || item.key === 'game_performance') {
                        setActiveTopTab('export');
                      }
                      showToast(`📊 切換至【${item.label}】`);
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs md:text-sm ${
                      activeSidebarKey === item.key
                        ? 'bg-cyan-900/80 text-amber-300 font-black border border-cyan-500/50'
                        : 'hover:bg-cyan-950 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group 3: 班級與學生管理 */}
            <div>
              <div className="text-xs font-black text-cyan-300 tracking-wider mb-1.5 px-2 uppercase border-b border-cyan-500/20 pb-1">
                班級與學生管理
              </div>
              <div className="flex flex-col gap-1 font-bold text-slate-200">
                {[
                  { key: 'class_mgmt', label: '班級管理', icon: '🏫' },
                  { key: 'student_list', label: '學生名單', icon: '👥' },
                  { key: 'badges', label: '獎章與獎勵', icon: '🏆' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSidebarKey(item.key);
                      if (item.key === 'student_list') {
                        setActiveTopTab('students');
                      }
                      showToast(`🏫 切換至【${item.label}】`);
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer text-left text-xs md:text-sm ${
                      activeSidebarKey === item.key
                        ? 'bg-cyan-900/80 text-amber-300 font-black border border-cyan-500/50'
                        : 'hover:bg-cyan-950 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-500/30 pt-3 text-xs text-cyan-300 font-bold text-center font-mono">
            臺羅拼音方塊研究所<br />
            © 2025 All Rights Reserved.
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#030914] flex flex-col gap-5">
          {/* VIEW 1: Overview Dashboard (全班總覽) */}
          {(activeTopTab === 'overview' || activeSidebarKey === 'overview') && (
            <div className="flex flex-col gap-5">
              {/* Row 1: Top 5 Metric Cards - Larger Font & Clear Contrast */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* Metric 1 */}
                <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-2xl shrink-0">
                    👥
                  </div>
                  <div>
                    <span className="text-xs font-black text-cyan-200 block">班級總人數</span>
                    <div className="text-2xl md:text-3xl font-black text-white my-0.5">
                      {currentClass.totalStudents} 人
                    </div>
                    <span className="text-xs text-emerald-300 font-bold block">
                      男 {currentClass.boysCount} · 女 {currentClass.girlsCount}
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center text-2xl shrink-0">
                    ⏱️
                  </div>
                  <div>
                    <span className="text-xs font-black text-cyan-200 block">本週平均學習時長</span>
                    <div className="text-2xl md:text-3xl font-black text-cyan-200 my-0.5">
                      {currentClass.avgHoursThisWeek}
                    </div>
                    <span className="text-xs text-emerald-400 font-black block">
                      {currentClass.hoursTrend}
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-2xl shrink-0">
                    🎯
                  </div>
                  <div>
                    <span className="text-xs font-black text-cyan-200 block">全班平均正確率</span>
                    <div className="text-2xl md:text-3xl font-black text-emerald-300 my-0.5">
                      {currentClass.avgAccuracy} %
                    </div>
                    <span className="text-xs text-emerald-400 font-black block">
                      {currentClass.accuracyTrend}
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-[#081628] border-2 border-amber-500/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center text-2xl shrink-0">
                    🏆
                  </div>
                  <div>
                    <span className="text-xs font-black text-cyan-200 block">本週最高分</span>
                    <div className="text-2xl md:text-3xl font-black text-amber-300 my-0.5">
                      {currentClass.topScore.toLocaleString()} 分
                    </div>
                    <span className="text-xs text-amber-200 font-extrabold truncate block max-w-[130px]">
                      {currentClass.topScorePlayer}
                    </span>
                  </div>
                </div>

                {/* Metric 5 */}
                <div className="bg-[#081628] border-2 border-rose-500/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-400 text-rose-300 flex items-center justify-center text-2xl shrink-0">
                    ⚠️
                  </div>
                  <div>
                    <span className="text-xs font-black text-rose-200 block">待關注學生數</span>
                    <div className="text-2xl md:text-3xl font-black text-rose-300 my-0.5">
                      {currentClass.attentionNeededCount} 人
                    </div>
                    <span className="text-xs text-rose-300 font-extrabold block">
                      {currentClass.attentionReason}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: 3-Column Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* COLUMN 1: Radar Chart & Advice - Expanded SVG Canvas */}
                <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 flex flex-col justify-between gap-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
                    <h3 className="font-black text-base text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <span>核心語言能力雷達圖 (全班平均)</span>
                    </h3>
                  </div>

                  {/* SVG Radar Chart */}
                  <div className="relative w-full flex items-center justify-center my-2">
                    <svg width="100%" height="290" viewBox="0 0 380 280" className="overflow-visible">
                      <polygon points={outerWebPoints} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                      <polygon points={midWebPoints} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />

                      {[0, 1, 2, 3, 4].map((idx) => {
                        const { x, y } = getRadarCoords(idx, 100);
                        return <line key={idx} x1={radarCx} y1={radarCy} x2={x} y2={y} stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />;
                      })}

                      <polygon points={polygonPoints} fill="#22c55e" fillOpacity="0.3" stroke="#4ade80" strokeWidth="3" />

                      {radarScoresList.map((item, idx) => {
                        const { x, y } = getRadarCoords(idx, item.val);
                        const outerPos = getRadarCoords(idx, 128);
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="5.5" fill="#a3e635" stroke="#081628" strokeWidth="2" />
                            <text
                              x={outerPos.x}
                              y={outerPos.y}
                              fill="#ffffff"
                              fontSize="14"
                              fontWeight="900"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {item.label}
                            </text>
                            <text
                              x={outerPos.x}
                              y={outerPos.y + 17}
                              fill="#38bdf8"
                              fontSize="15"
                              fontWeight="900"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {item.val}%
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Advice Box */}
                  <div className="bg-[#030d1a] border-2 border-amber-500/50 rounded-xl p-3.5 text-xs md:text-sm flex gap-3 items-start">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-amber-300 text-sm block mb-1">💡 全班能力發展建議</span>
                      <p className="text-cyan-100 text-xs md:text-sm leading-relaxed font-bold">
                        {currentClass.radarAdvice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Bar Chart + Top Wrong Questions Table */}
                <div className="flex flex-col gap-5">
                  <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
                      <h3 className="font-black text-base text-white flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-cyan-400" />
                        <span>各遊戲關卡通關率 (全班)</span>
                      </h3>
                      <button
                        onClick={() => setActiveSidebarKey('game_performance')}
                        className="text-xs font-black text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>查看詳情</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between gap-2.5 h-32 pt-5 pb-2 px-1 border-b border-cyan-500/30">
                      {currentClass.gameStats.map((game, idx) => {
                        const isHigh = game.passRate >= 75;
                        return (
                          <div key={game.key} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                            <span className="text-xs font-black text-amber-300">{game.passRate}%</span>
                            <div className="w-full max-w-[26px] bg-cyan-950/90 rounded-t h-24 flex items-end overflow-hidden border border-cyan-500/20">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${game.passRate}%` }}
                                transition={{ duration: 0.8 }}
                                className={`w-full rounded-t ${
                                  isHigh
                                    ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                                    : 'bg-gradient-to-t from-amber-600 to-amber-400'
                                }`}
                              />
                            </div>
                            <span className="text-xs font-black text-cyan-200 truncate w-full text-center">
                              0{idx + 1}
                            </span>
                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 border border-cyan-400 text-white text-xs p-2 rounded-lg shadow-xl whitespace-nowrap z-20 font-bold">
                              {game.name}: {game.passRate}% 通關率
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-lg flex-1">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
                      <h3 className="font-black text-base text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span>最常答錯 TOP 5 (全班)</span>
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs md:text-sm">
                        <thead>
                          <tr className="border-b border-cyan-500/30 text-cyan-200 font-black text-xs">
                            <th className="pb-2 pl-1">排名</th>
                            <th className="pb-2">拼音 / 知識點</th>
                            <th className="pb-2">錯誤率</th>
                            <th className="pb-2">主要錯誤類型</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-500/20 font-bold text-white">
                          {currentClass.topWrongQuestions.map((row) => (
                            <tr key={row.rank} className="hover:bg-cyan-950/60 transition-colors">
                              <td className="py-2 pl-1">
                                <span
                                  className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-xs font-black ${
                                    row.rank === 1
                                      ? 'bg-rose-500 text-slate-950'
                                      : row.rank === 2
                                      ? 'bg-amber-500 text-slate-950'
                                      : 'bg-cyan-900 text-cyan-200'
                                  }`}
                                >
                                  {row.rank}
                                </span>
                              </td>
                              <td className="py-2 font-mono text-white text-xs md:text-sm">{row.point}</td>
                              <td className="py-2 text-rose-300 font-mono font-black text-xs md:text-sm">{row.errorRate}%</td>
                              <td className="py-2 text-cyan-200 text-xs md:text-sm">{row.errorType}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={() => setActiveSidebarKey('wrong_questions')}
                      className="w-full mt-1 py-2 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 font-black text-xs md:text-sm hover:bg-cyan-900 hover:text-white transition-colors cursor-pointer text-center"
                    >
                      查看完整錯題分析報表 &gt;
                    </button>
                  </div>
                </div>

                {/* COLUMN 3: Hours Line Chart + Animation Donut + Activity Feed */}
                <div className="flex flex-col gap-5">
                  <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
                      <h3 className="font-black text-base text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-cyan-400" />
                        <span>本週學習時長趨勢 (全班)</span>
                      </h3>
                    </div>

                    <div className="relative w-full h-28 pt-2">
                      <svg width="100%" height="95" viewBox="0 0 280 95" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="20" x2="280" y2="20" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
                        <line x1="0" y1="50" x2="280" y2="50" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
                        <line x1="0" y1="80" x2="280" y2="80" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />

                        <polygon
                          points="0,80 0,42 46,32 93,26 140,36 186,18 233,28 280,33 280,80"
                          fill="url(#areaGrad)"
                        />
                        <polyline
                          points="0,42 46,32 93,26 140,36 186,18 233,28 280,33"
                          fill="none"
                          stroke="#a3e635"
                          strokeWidth="3"
                        />
                        {[
                          { x: 0, y: 42, h: '3.2h' },
                          { x: 46, y: 32, h: '3.8h' },
                          { x: 93, y: 26, h: '4.1h' },
                          { x: 140, y: 36, h: '3.5h' },
                          { x: 186, y: 18, h: '4.6h' },
                          { x: 233, y: 28, h: '4.0h' },
                          { x: 280, y: 33, h: '3.7h' }
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r="4.5" fill="#a3e635" stroke="#081628" strokeWidth="2" />
                            <text x={pt.x} y={pt.y - 8} fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">
                              {pt.h}
                            </text>
                          </g>
                        ))}
                      </svg>

                      <div className="flex justify-between text-xs font-black text-cyan-200 pt-1">
                        {currentClass.weeklyHours.map((wh) => (
                          <span key={wh.day}>{wh.day}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-lg">
                    <h3 className="font-black text-base text-white flex items-center gap-2 border-b border-cyan-500/30 pb-2.5">
                      <Eye className="w-5 h-5 text-emerald-400" />
                      <span>動畫觀看完成度 (全班)</span>
                    </h3>

                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {currentClass.animationCompletion.map((anim) => {
                        const circleR = 20;
                        const circum = 2 * Math.PI * circleR;
                        const dashOffset = circum * (1 - anim.rate / 100);
                        return (
                          <div key={anim.name} className="flex flex-col items-center gap-1.5">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                              <svg className="w-14 h-14 rotate-[-90deg]">
                                <circle cx="28" cy="28" r={circleR} fill="none" stroke="#0f2942" strokeWidth="5" />
                                <circle
                                  cx="28"
                                  cy="28"
                                  r={circleR}
                                  fill="none"
                                  stroke={anim.rate >= 80 ? '#4ade80' : '#f59e0b'}
                                  strokeWidth="5"
                                  strokeDasharray={circum}
                                  strokeDashoffset={dashOffset}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute font-black text-xs text-white">
                                {anim.rate}%
                              </span>
                            </div>
                            <span className="text-xs font-black text-cyan-100 text-center truncate w-full">
                              {anim.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 md:p-5 flex flex-col gap-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
                      <h3 className="font-black text-base text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <span>近期學習動態 (即時自動連動)</span>
                      </h3>
                      <button
                        onClick={() => setActiveSidebarKey('learning_history')}
                        className="text-xs font-black text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>查看歷史歷程</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 font-bold pt-1">
                      {currentClass.recentActivities.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-[#030d1a] p-2.5 rounded-xl border border-cyan-500/20">
                          <span className="text-base shrink-0">{act.icon}</span>
                          <div className="flex-1">
                            <span className="text-amber-300 font-black text-xs md:text-sm mr-1.5">{act.highlight}</span>
                            <span className="text-slate-100 text-xs md:text-sm">{act.text}</span>
                          </div>
                          <span className="text-xs text-cyan-300 font-mono shrink-0">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Tip */}
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5 text-sm text-cyan-100">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                  <span className="font-bold">
                    小提醒：系統數據已啟用即時自動連動，學生在任何遊戲與模組的練習成績均即時顯示！
                  </span>
                </div>

                <button
                  onClick={handleExportReport}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-sm md:text-base shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>一鍵匯出本週學習報表</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW: Pinyin Scheme Table (拼音方案總表) */}
          {activeSidebarKey === 'pinyin_table' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-amber-300 flex items-center gap-2">
                      🔤 臺灣閩南語羅馬字拼音方案 (TL) 班級總掌握度
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">即時統計全班在聲母、韻母及聲調的聽讀熟練度與答對率</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs font-black">
                    全班總熟練度 86.4%
                  </span>
                </div>

                {/* Grid 1: Consonants */}
                <div>
                  <h4 className="font-black text-sm text-cyan-300 mb-2">1. 聲母音素掌握度 (Consonants)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {[
                      { symbol: 'b (𠣔)', name: '無氣雙唇', rate: 95 },
                      { symbol: 'p (𠤎)', name: '有氣雙唇', rate: 88 },
                      { symbol: 'm (𠥓)', name: '雙唇鼻音', rate: 92 },
                      { symbol: 'd (𠥔)', name: '無氣舌尖', rate: 90 },
                      { symbol: 't', name: '有氣舌尖', rate: 84 },
                      { symbol: 'n', name: '舌尖鼻音', rate: 89 },
                      { symbol: 'l', name: '舌尖邊音', rate: 91 },
                      { symbol: 'g', name: '無氣舌根', rate: 82 },
                      { symbol: 'k', name: '有氣舌根', rate: 85 },
                      { symbol: 'h', name: '舌根擦音', rate: 94 },
                      { symbol: 'ts', name: '無氣齒齦', rate: 76 },
                      { symbol: 'tsh', name: '有氣齒齦', rate: 71 }
                    ].map((item) => (
                      <div key={item.symbol} className="bg-[#030d1a] border border-cyan-500/30 p-2.5 rounded-xl flex flex-col items-center">
                        <span className="font-mono font-black text-amber-300 text-base">{item.symbol}</span>
                        <span className="text-[10px] text-cyan-200/70 font-bold">{item.name}</span>
                        <span className="text-xs font-black text-emerald-300 mt-1">{item.rate}% 掌握</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid 2: Tone Marks */}
                <div className="mt-2">
                  <h4 className="font-black text-sm text-amber-300 mb-2">2. 八個聲調變調掌握度 (8 Tones)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {[
                      { tone: '第1調 (君)', mark: 'a', rate: 92 },
                      { tone: '第2調 (滾)', mark: 'á', rate: 88 },
                      { tone: '第3調 (棍)', mark: 'à', rate: 82 },
                      { tone: '第4調 (骨)', mark: 'ah', rate: 79 },
                      { tone: '第5調 (裙)', mark: 'â', rate: 85 },
                      { tone: '第7調 (郡)', mark: 'ā', rate: 78 },
                      { tone: '第8調 (滑)', mark: 'a̍h', rate: 70 }
                    ].map((t) => (
                      <div key={t.tone} className="bg-[#030d1a] border border-amber-500/30 p-2.5 rounded-xl flex flex-col items-center">
                        <span className="font-mono font-black text-cyan-300 text-base">{t.mark}</span>
                        <span className="text-[10px] text-amber-200 font-bold">{t.tone}</span>
                        <span className="text-xs font-black text-emerald-300 mt-1">{t.rate}% 掌握</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Initials (聲母學習) */}
          {activeSidebarKey === 'initials' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-emerald-300 flex items-center gap-2">
                      🗣️ 台語 17 個聲母 (Consonants) 學習歷程與答對率
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">針對送氣、不送氣與濁音（b, g, j）進行全班聽力辨識分析</p>
                  </div>
                  <button
                    onClick={() => showToast('📢 已傳送聲母聽力測驗至全班學生端！')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:brightness-110 cursor-pointer"
                  >
                    發送聲母強化隨堂測驗
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: '雙唇音 (b, p, m)', mastery: '91%', status: '極優', detail: 'b 與 p 發音區別掌握度佳' },
                    { label: '齒齦音 (ts, tsh, s)', mastery: '74%', status: '需加強', detail: 'ts 與 tsh 送氣強弱容易混淆' },
                    { label: '舌根音 (g, k, h, ng)', mastery: '83%', status: '良好', detail: 'ng 鼻音發音精準' }
                  ].map((block, i) => (
                    <div key={i} className="bg-[#030d1a] border border-cyan-500/30 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-white text-sm">{block.label}</span>
                        <span className="text-xs font-black text-emerald-300">{block.mastery}</span>
                      </div>
                      <p className="text-xs text-cyan-200/80 font-bold">{block.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Finals (韻母學習) */}
          {activeSidebarKey === 'finals' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-cyan-300 flex items-center gap-2">
                      🎵 台語韻母與鼻音 (Vowels & Nasals) 學習追蹤
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">單韻母、複韻母、鼻化韻 (nn) 與入聲韻 (-p, -t, -k, -h) 分析</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { title: '單韻母 (a, i, u, e, o, oo)', rate: '92%', count: '24人已精通' },
                    { title: '鼻化韻 (ann, inn, unn)', rate: '78%', count: '6人待練習' },
                    { title: '陽入聲韻 (-m, -n, -ng)', rate: '85%', count: '22人已精通' },
                    { title: '陰入聲韻 (-p, -t, -k, -h)', rate: '71%', count: '10人待練習' }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-[#030d1a] border border-cyan-500/30 p-4 rounded-xl text-center">
                      <span className="font-black text-xs text-amber-300 block mb-1">{card.title}</span>
                      <div className="text-2xl font-black text-emerald-300 my-1">{card.rate}</div>
                      <span className="text-[11px] text-cyan-200 font-bold">{card.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Pinyin Practice (拼音練習) */}
          {activeSidebarKey === 'pinyin_practice' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-amber-300 flex items-center gap-2">
                      ✍️ 全班拼音聽寫與調號標記即時連動
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">即時接收學生端聽寫測驗提交紀錄與調號位置標記正確率</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs font-black">
                    即時連動中
                  </span>
                </div>

                <div className="bg-[#030d1a] border border-cyan-500/30 p-4 rounded-xl flex flex-col gap-3">
                  <h4 className="font-black text-sm text-cyan-300">最新學生提交紀錄</h4>
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    {currentClass.students.slice(0, 5).map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-[#081628] p-2.5 rounded-lg border border-cyan-500/20">
                        <span className="text-amber-300 font-bold">{s.name} ({s.studentNo})</span>
                        <span className="text-emerald-300">完成《拼音聽寫練習》得分 +{100 + idx * 20}</span>
                        <span className="text-cyan-200">{s.lastActive}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Animations (動畫專區) */}
          {activeSidebarKey === 'animations' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-cyan-300 flex items-center gap-2">
                      🎬 臺羅拼音動畫影片觀看進度與課後問答
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">追蹤 5 集動畫短片的全班觀看人數與觀後測驗通過率</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { ep: 'EP01', title: '聲調飛行號 - 8 個聲調變身記', rate: 92, duration: '08:30', passed: '26/28人' },
                    { ep: 'EP02', title: '鹿港夜市美食篇 - 聲母大探險', rate: 88, duration: '09:15', passed: '25/28人' },
                    { ep: 'EP03', title: '歡樂海灘 - 韻母鼻音篇', rate: 81, duration: '07:45', passed: '23/28人' },
                    { ep: 'EP04', title: '鹿港老街 - 聲調變調規則', rate: 75, duration: '10:20', passed: '21/28人' },
                    { ep: 'EP05', title: '台語文化方塊綜合體驗', rate: 68, duration: '12:00', passed: '19/28人' }
                  ].map((anim) => (
                    <div key={anim.ep} className="bg-[#030d1a] border border-cyan-500/30 p-4 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-black text-xs">
                          {anim.ep}
                        </span>
                        <h4 className="font-black text-sm text-white mt-1">{anim.title}</h4>
                        <span className="text-xs text-cyan-200/70 block mt-0.5">時長 {anim.duration} · 通過測驗 {anim.passed}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-emerald-300 block">{anim.rate}%</span>
                        <span className="text-[10px] text-cyan-300 font-bold">觀看完成率</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Games (拼音遊戲) */}
          {activeSidebarKey === 'games' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-amber-300 flex items-center gap-2">
                      🎮 10 款台語拼音遊戲全班挑戰戰績
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">連動學生遊玩資料，即時顯示遊玩次數、最高分與關卡通關率</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentClass.gameStats.map((game, idx) => (
                    <div key={game.key} className="bg-[#030d1a] border border-cyan-500/30 p-4 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-black text-amber-300">0{idx + 1}. {game.name}</span>
                        <div className="text-xs text-cyan-200/80 font-bold mt-1">
                          遊玩人數: {game.players} 人 · 全班高頻錯詞: <span className="text-rose-300 font-mono">{game.hardWord}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-emerald-300 block">{game.passRate}% 通關</span>
                        <span className="text-[10px] text-amber-300 font-extrabold">最高分: {game.topPlayer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Ability Overview (能力分析總覽) */}
          {activeSidebarKey === 'ability_overview' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-emerald-300 flex items-center gap-2">
                      📈 核心語言五大能力詳細等級分佈
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">聽力理解、口說發音、拼音讀寫、聲調變調、詞彙運用層級診斷</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { domain: '聽力辨音能力', level: '精通 (92%)', desc: '全班多數能精準聽辨第 1 調至第 7 調' },
                    { domain: '口說發音標準度', level: '良好 (85%)', desc: '聲母與單韻母發音極佳，需注意變調' },
                    { domain: '拼音書寫正確率', level: '良好 (80%)', desc: '鼻音符號 (nn) 標記熟練' },
                    { domain: '聲調與變調規則', level: '基礎 (74%)', desc: '第 8 調入聲變調建議多加練習' }
                  ].map((ab, idx) => (
                    <div key={idx} className="bg-[#030d1a] border border-cyan-500/30 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-white text-sm">{ab.domain}</span>
                        <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-400">{ab.level}</span>
                      </div>
                      <p className="text-xs text-cyan-200/80 font-bold">{ab.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Learning History (學習歷程追蹤) */}
          {activeSidebarKey === 'learning_history' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-cyan-300 flex items-center gap-2">
                      📜 全班學習歷程事件時間軸
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">紀錄全體學生在各遊戲、練習區與測驗的即時動作與獲得獎章</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {currentClass.recentActivities.map((act, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#030d1a] p-3 rounded-xl border border-cyan-500/20 text-xs md:text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{act.icon}</span>
                        <div>
                          <span className="text-amber-300 font-black mr-2">{act.highlight}</span>
                          <span className="text-white font-bold">{act.text}</span>
                        </div>
                      </div>
                      <span className="text-cyan-300 font-mono text-xs">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Class Management (班級管理) */}
          {activeSidebarKey === 'class_mgmt' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-amber-300 flex items-center gap-2">
                      🏫 班級設定與全班數據連動中心
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">當前連動班級：{currentClass.className} ({currentClass.id})</p>
                  </div>
                  <button
                    onClick={() => setShowAddClassModal(true)}
                    className="px-4 py-2 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 rounded-xl font-black text-xs hover:bg-emerald-500/30 cursor-pointer"
                  >
                    + 新增連動班級
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.values(classesDataMap).map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        cls.id === selectedClassId
                          ? 'bg-cyan-900/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-[#030d1a] border-cyan-500/30 hover:border-cyan-400'
                      }`}
                    >
                      <h4 className="font-black text-base text-white">{cls.className}</h4>
                      <p className="text-xs text-cyan-200 mt-1">學生數：{cls.totalStudents} 人 · 在線：{cls.onlineCount} 人</p>
                      <span className="text-[11px] text-amber-300 font-bold block mt-2">平均正確率 {cls.avgAccuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Badges & Rewards (獎章與獎勵) */}
          {activeSidebarKey === 'badges' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="bg-[#081628] border-2 border-cyan-500/40 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <div>
                    <h3 className="font-black text-xl text-amber-300 flex items-center gap-2">
                      🏆 學生成就獎章與台語學習獎勵系統
                    </h3>
                    <p className="text-xs text-cyan-200 mt-1">點擊可直接頒發台語學習獎章或獎勵星星至學生帳號</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: '🏆', title: '聲調達人', desc: '8 個聲調聽辨全對', unlocked: '22 人已獲得' },
                    { icon: '🎯', title: '連勝王', desc: '遊戲答對 10 題連勝', unlocked: '18 人已獲得' },
                    { icon: '📚', title: '勤奮能手', desc: '累積時長突破 5 小時', unlocked: '25 人已獲得' },
                    { icon: '🚀', title: '太空冒險家', desc: '完成太空生存戰所有關卡', unlocked: '15 人已獲得' }
                  ].map((badge, idx) => (
                    <div key={idx} className="bg-[#030d1a] border border-amber-500/30 p-4 rounded-xl flex flex-col items-center text-center">
                      <span className="text-3xl mb-1">{badge.icon}</span>
                      <h4 className="font-black text-sm text-amber-300">{badge.title}</h4>
                      <p className="text-[11px] text-cyan-200/80 font-bold mt-0.5">{badge.desc}</p>
                      <span className="text-xs font-black text-emerald-300 mt-2">{badge.unlocked}</span>
                      <button
                        onClick={() => showToast(`📢 已向全班頒發【${badge.title}】成就榮譽！`)}
                        className="mt-2 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg cursor-pointer"
                      >
                        一鍵全班頒發
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Individual Student Roster (個別學生紀錄) */}
          {(activeTopTab === 'students' || activeSidebarKey === 'student_list') && (
            <div className="flex flex-col gap-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#081628] border border-cyan-500/30 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 bg-[#030d1a] border border-cyan-500/40 px-3 py-1.5 rounded-xl flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="搜尋學生姓名或學號..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-xs font-bold text-white outline-none w-full placeholder-cyan-500/50"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-black">
                  <span className="text-cyan-300/70">狀態篩選：</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-cyan-950 text-cyan-300 hover:bg-cyan-900'
                    }`}
                  >
                    全部 ({STUDENTS.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('online')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'online'
                        ? 'bg-emerald-400 text-slate-950 font-black'
                        : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                    }`}
                  >
                    🟢 在線 ({currentClass.onlineCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('offline')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === 'offline'
                        ? 'bg-slate-700 text-white font-black'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    ⚪ 離線 ({STUDENTS.length - currentClass.onlineCount})
                  </button>

                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="ml-auto px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border-2 border-cyan-400/80 hover:bg-cyan-500/30 text-cyan-200 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-300" />
                    <span>新增學生與數據連動</span>
                  </button>
                </div>
              </div>

              {/* Student Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-[#081628] border border-cyan-500/30 hover:border-cyan-300 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-white">{student.name}</h3>
                            <span className="text-xs font-mono text-cyan-300/70">({student.studentNo})</span>
                          </div>
                          <p className="text-xs font-bold text-emerald-300 mt-0.5">{student.currentGame}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                          student.status === 'online'
                            ? 'bg-emerald-950 border border-emerald-400 text-emerald-300'
                            : student.status === 'idle'
                            ? 'bg-amber-950 border border-amber-400 text-amber-300'
                            : 'bg-slate-900 border border-slate-700 text-slate-400'
                        }`}
                      >
                        {student.status === 'online' ? '🟢 正在線上' : student.status === 'idle' ? '🟡 閒置中' : '⚪ 離線'}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 bg-[#030d1a] p-2.5 rounded-xl text-center border border-cyan-500/20 text-xs">
                      <div>
                        <span className="text-[10px] text-cyan-300/60 block">遊戲積分</span>
                        <span className="font-black text-amber-300 text-sm">{student.score.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-300/60 block">答對率</span>
                        <span className="font-black text-emerald-300 text-sm">{student.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-300/60 block">本週時長</span>
                        <span className="font-black text-cyan-200 text-sm">{student.hoursThisWeek}h</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-300/60 block">學習天數</span>
                        <span className="font-black text-cyan-200 text-sm">{student.daysActive}天</span>
                      </div>
                    </div>

                    {/* Weakness & Actions */}
                    <div className="flex items-center justify-between gap-2 border-t border-cyan-500/20 pt-2 text-xs">
                      <span className="text-cyan-200/70 font-bold truncate max-w-[200px]">
                        ⚠️ 待加強弱點：<span className="text-rose-300 font-mono">{student.weakWord}</span>
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          能力診斷
                        </button>
                        <button
                          onClick={() => showToast(`📢 已向【${student.name}】發送台語鼓勵：「真讚！表現特別出色！」`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] cursor-pointer transition-colors"
                        >
                          發送獎勵
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: Export & Data / Homework View (遊戲數據導出 & 錯題分析) */}
          {(activeTopTab === 'export' || activeSidebarKey === 'wrong_questions' || activeSidebarKey === 'game_performance') && (
            <div className="flex flex-col gap-4">
              {/* Header Box */}
              <div className="flex items-center justify-between bg-[#081628] border border-cyan-500/30 p-4 rounded-2xl">
                <div>
                  <h3 className="font-black text-lg text-white">班級遊戲成績與作業數據中心</h3>
                  <p className="text-xs text-cyan-200/70 font-bold">查看 10 款遊戲戰績、全班錯題排行與派發遊戲作業</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHomeworkModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs md:text-sm shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>派發新作業</span>
                  </button>

                  <button
                    onClick={handleExportReport}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 hover:bg-cyan-900 font-black text-xs md:text-sm shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>匯出成績單</span>
                  </button>
                </div>
              </div>

              {/* Homework List */}
              <div className="bg-[#081628] border border-cyan-500/30 p-4 rounded-2xl flex flex-col gap-3">
                <h4 className="font-black text-sm text-amber-300 flex items-center gap-2 border-b border-cyan-500/20 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>全班派發作業進度 ({activeHomeworks.length})</span>
                </h4>

                <div className="flex flex-col gap-2.5">
                  {activeHomeworks.map((hw) => (
                    <div key={hw.id} className="bg-[#030d1a] border border-cyan-500/20 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-200 text-[10px] font-black">
                            {hw.gameName}
                          </span>
                          <span className="text-xs font-bold text-amber-300">目標分數：{hw.targetScore} 分</span>
                        </div>
                        <h4 className="font-black text-sm text-white">{hw.title}</h4>
                        <p className="text-[11px] text-cyan-200/60 font-bold mt-0.5">截止日期：{hw.dueDate}</p>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 border-cyan-500/20 pt-2 md:pt-0">
                        <div className="text-right">
                          <span className="text-[10px] text-cyan-300/70 block font-bold">繳交進度</span>
                          <span className="text-base font-black text-emerald-300">
                            {hw.completedCount} / {hw.totalCount} 人 ({Math.round((hw.completedCount / hw.totalCount) * 100)}%)
                          </span>
                        </div>
                        <button
                          onClick={() => showToast(`📢 已向未繳交的 ${hw.totalCount - hw.completedCount} 位學生重發作業提醒！`)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-bold text-xs cursor-pointer transition-colors"
                        >
                          一鍵催繳作業
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentClass.gameStats.map((game, idx) => (
                  <div key={game.key} className="bg-[#081628] border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between gap-2.5">
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                      <h3 className="font-black text-sm text-amber-300 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-amber-950 border border-amber-400 text-amber-300 flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        {game.name}
                      </h3>
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-400">
                        通關率 {game.passRate}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs my-1">
                      <div className="bg-[#030d1a] p-2 rounded-xl border border-cyan-500/20">
                        <span className="text-[10px] text-cyan-300/60 block">完成人數</span>
                        <span className="font-black text-white text-sm">{game.players}/{currentClass.totalStudents} 人</span>
                      </div>
                      <div className="bg-[#030d1a] p-2 rounded-xl border border-cyan-500/20">
                        <span className="text-[10px] text-cyan-300/60 block">最高分紀錄</span>
                        <span className="font-black text-amber-300 text-xs truncate block">{game.topPlayer}</span>
                      </div>
                      <div className="bg-[#030d1a] p-2 rounded-xl border border-cyan-500/20">
                        <span className="text-[10px] text-cyan-300/60 block">全班高頻錯詞</span>
                        <span className="font-black text-rose-300 text-xs truncate block">{game.hardWord}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ---------------- Modal: Student Capacity Report ---------------- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#081628] border-2 border-cyan-400 rounded-3xl max-w-lg w-full p-6 text-white relative shadow-[0_0_50px_rgba(2,132,199,0.5)]">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-3xl">
                {selectedStudent.avatar}
              </div>
              <div>
                <h3 className="font-black text-xl text-white">{selectedStudent.name} 的台語能力分析</h3>
                <p className="text-xs text-cyan-200/70 font-bold">學號：{selectedStudent.studentNo} | 班級：{currentClass.className}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs bg-[#030d1a] border border-cyan-500/30 p-4 rounded-2xl font-bold">
              <div className="flex justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-cyan-300/70">總遊戲積分：</span>
                <span className="text-amber-300 font-black">{selectedStudent.score.toLocaleString()} 分</span>
              </div>
              <div className="flex justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-cyan-300/70">全班答對率：</span>
                <span className="text-emerald-300 font-black">{selectedStudent.accuracy}%</span>
              </div>
              <div className="flex justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-cyan-300/70">本週學習時長：</span>
                <span className="text-cyan-200 font-black">{selectedStudent.hoursThisWeek} 小時</span>
              </div>
              <div className="flex justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-cyan-300/70">待加強弱點詞彙：</span>
                <span className="text-rose-300 font-black font-mono">{selectedStudent.weakWord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300/70">導師特別建議：</span>
                <span className="text-cyan-100 font-bold">聲母發音表現優異，建議加強第 8 調聽力與變調辨識！</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full mt-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 font-black text-sm hover:bg-cyan-900 cursor-pointer transition-colors"
            >
              關閉診斷報告
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Modal: Create Homework ---------------- */}
      {showHomeworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateHomework} className="bg-[#081628] border-2 border-cyan-400 rounded-3xl max-w-md w-full p-6 text-white relative flex flex-col gap-4 shadow-[0_0_50px_rgba(2,132,199,0.5)]">
            <button
              type="button"
              onClick={() => setShowHomeworkModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-lg text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> 派發全班台語遊戲作業
            </h3>

            <div>
              <label className="text-xs font-bold text-cyan-200 mb-1 block">作業名稱</label>
              <input
                type="text"
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030d1a] border border-cyan-500/40 text-white text-xs font-bold outline-none focus:border-cyan-300"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-cyan-200 mb-1 block">指定挑戰遊戲</label>
              <select
                value={hwGame}
                onChange={(e) => setHwGame(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030d1a] border border-cyan-500/40 text-white text-xs font-bold outline-none focus:border-cyan-300"
              >
                <option value="01 太空台語生存戰">01 太空台語生存戰</option>
                <option value="02 聲調打磚王">02 聲調打磚王</option>
                <option value="03 太空礦場">03 太空礦場</option>
                <option value="06 拼音研究所">06 拼音研究所</option>
                <option value="07 方塊研究所">07 方塊研究所</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-cyan-200 mb-1 block">目標得分</label>
                <input
                  type="number"
                  value={hwTargetScore}
                  onChange={(e) => setHwTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#030d1a] border border-cyan-500/40 text-white text-xs font-bold outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cyan-200 mb-1 block">繳交截止日</label>
                <input
                  type="text"
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#030d1a] border border-cyan-500/40 text-white text-xs font-bold outline-none focus:border-cyan-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-sm shadow-md hover:brightness-110 cursor-pointer transition-all mt-2"
            >
              確認派發至學生端
            </button>
          </form>
        </div>
      )}

      {/* ---------------- Modal: Add New Class ---------------- */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateNewClass} className="bg-[#081628] border-2 border-emerald-400 rounded-3xl max-w-md w-full p-6 text-white relative flex flex-col gap-4 shadow-[0_0_50px_rgba(52,211,153,0.5)]">
            <button
              type="button"
              onClick={() => setShowAddClassModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-lg text-emerald-300 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" /> 手動新增註冊班級與數據連動
            </h3>

            <div>
              <label className="text-xs font-bold text-cyan-200 mb-1 block">班級名稱 (例如: 502.台語進階班)</label>
              <input
                type="text"
                value={newClassNameInput}
                onChange={(e) => setNewClassNameInput(e.target.value)}
                placeholder="例如：502.台語進階班 或 鹿港實驗甲班"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d1a] border border-emerald-500/50 text-white text-sm font-bold outline-none focus:border-emerald-300"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-cyan-200 mb-1 block">年級標籤</label>
              <input
                type="text"
                value={newGradeLabelInput}
                onChange={(e) => setNewGradeLabelInput(e.target.value)}
                placeholder="例如：5年2班"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d1a] border border-cyan-500/40 text-white text-sm font-bold outline-none focus:border-cyan-300"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs font-bold leading-relaxed">
              💡 說明：新增後系統將自動初始化全班數據大數據，包含 5 軸能力雷達圖、遊戲通關率及學生學習動態。
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-sm shadow-md hover:brightness-110 cursor-pointer transition-all mt-1"
            >
              🚀 立即建立並同步連動班級
            </button>
          </form>
        </div>
      )}

      {/* ---------------- Modal: Add New Student ---------------- */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddStudentToClass} className="bg-[#081628] border-2 border-cyan-400 rounded-3xl max-w-md w-full p-6 text-white relative flex flex-col gap-4 shadow-[0_0_50px_rgba(56,189,248,0.5)]">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-lg text-cyan-300 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> 新增學生至【{currentClass.className}】
            </h3>

            <div>
              <label className="text-xs font-bold text-cyan-200 mb-1 block">學生姓名</label>
              <input
                type="text"
                value={newStudentNameInput}
                onChange={(e) => setNewStudentNameInput(e.target.value)}
                placeholder="例如：張家豪"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d1a] border border-cyan-500/50 text-white text-sm font-bold outline-none focus:border-cyan-300"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-cyan-200 mb-1 block">性別</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewStudentGenderInput('boy')}
                  className={`flex-1 py-2 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    newStudentGenderInput === 'boy'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  👦 男生
                </button>
                <button
                  type="button"
                  onClick={() => setNewStudentGenderInput('girl')}
                  className={`flex-1 py-2 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    newStudentGenderInput === 'girl'
                      ? 'bg-pink-500 text-slate-950 border-pink-300'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  👧 女生
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-sm shadow-md hover:brightness-110 cursor-pointer transition-all mt-2"
            >
              🎒 確定加入並連動數據
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
