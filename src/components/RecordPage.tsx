import { useState, useEffect, lazy, Suspense } from 'react';
import {
  Trash2,
  Award,
  TrendingUp,
  Clock,
  Flame,
  Calendar,
  BarChart2,
  PlusCircle,
  RefreshCw,
  Zap,
  CheckCircle2,
  GraduationCap,
  Bookmark,
  Volume2,
  Search,
  BookOpen,
  Sparkles,
  Play
} from 'lucide-react';
import { HubShell } from './games/GameShell';
import { motion } from 'motion/react';
const TeacherDashboard = lazy(() => import('./TeacherDashboard'));
import { getUserProgress, BADGES } from '../lib/progressStore';
import { GAMES } from './games/gamesData';
import { getFavorites, removeFavorite, FavoriteWord } from '../lib/favoriteStore';
import { speakTaiyu } from '../lib/speech';

interface GameRecord {
  id?: string;
  date: string;
  gameName: string;
  score: number;
  stars: number;
  category?: string;
}

export default function RecordPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState<'stats' | 'vocab'>('stats');
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [vocabSearch, setVocabSearch] = useState<string>('');
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string>('全部');
  const [playingVocabId, setPlayingVocabId] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const [records, setRecords] = useState<GameRecord[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);

  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('tai_lo_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();
  const isTeacher = currentUser?.role === 'teacher';

  // 真實遊戲進度（progressStore：連續天數、徽章、關卡完成度）
  const [progress] = useState(() => getUserProgress());
  const earnedBadges = BADGES.filter((b) => b.check(progress));
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));
  const gamesPlayedCount = Object.keys(progress.games).length;

  // New record form state
  const [newGameName, setNewGameName] = useState<string>('聲母/韻母聽力綜合測驗');
  const [newScore, setNewScore] = useState<number>(95);

  const DEFAULT_RECORDS: GameRecord[] = [
    { id: '1', date: '2026/07/15', gameName: '恆春半島海灘尋寶', score: 100, stars: 5, category: '遊戲闖關' },
    { id: '2', date: '2026/07/18', gameName: '聽力練習拼音挑戰', score: 80, stars: 4, category: '拼音練習' },
    { id: '3', date: '2026/07/19', gameName: '台南夜市美食對對碰', score: 90, stars: 5, category: '遊戲闖關' },
    { id: '4', date: '2026/07/20', gameName: '瑞穗溫泉詞彙配對', score: 85, stars: 4, category: '遊戲闖關' },
    { id: '5', date: '2026/07/21', gameName: '聲調八音聽力隨堂測驗', score: 95, stars: 5, category: '聽力測驗' }
  ];

  const loadRecords = () => {
    setIsSyncing(true);
    const stored = localStorage.getItem('tai_lo_records');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecords(parsed);
      } catch (e) {
        setRecords(DEFAULT_RECORDS);
      }
    } else {
      setRecords(DEFAULT_RECORDS);
      localStorage.setItem('tai_lo_records', JSON.stringify(DEFAULT_RECORDS));
    }
    const now = new Date();
    setLastSyncTime(now.toLocaleTimeString('zh-TW', { hour12: false }));
    setTimeout(() => setIsSyncing(false), 300);
  };

  const loadFavoritesList = () => {
    setFavorites(getFavorites());
  };

  const handlePlayVocab = (item: FavoriteWord) => {
    setPlayingVocabId(item.id);
    speakTaiyu(item.hanzi, undefined, item.tailo);
    setTimeout(() => setPlayingVocabId(null), 1200);
  };

  const handleRemoveVocab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(id);
    loadFavoritesList();
  };

  const handleClearAllVocab = () => {
    if (window.confirm('確定要清空單字本中的所有收藏嗎？')) {
      const list = getFavorites();
      list.forEach((item) => removeFavorite(item.id));
      loadFavoritesList();
    }
  };

  const availableCategories = ['全部', ...Array.from(new Set(favorites.map((f) => f.category || '未分類')))];

  const filteredFavorites = favorites.filter((item) => {
    const q = vocabSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.hanzi.toLowerCase().includes(q) ||
      item.tailo.toLowerCase().includes(q) ||
      (item.mandarin && item.mandarin.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));

    const matchesCat =
      selectedVocabCategory === '全部' || (item.category || '未分類') === selectedVocabCategory;

    return matchesSearch && matchesCat;
  });

  const handleAutoPlayAll = async () => {
    if (filteredFavorites.length === 0 || isAutoPlaying) return;
    setIsAutoPlaying(true);
    for (let i = 0; i < filteredFavorites.length; i++) {
      const item = filteredFavorites[i];
      setPlayingVocabId(item.id);
      speakTaiyu(item.hanzi, undefined, item.tailo);
      await new Promise((r) => setTimeout(r, 1400));
    }
    setPlayingVocabId(null);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    loadRecords();
    loadFavoritesList();

    // Listen to localStorage changes across tabs or custom dispatch
    const handleStorageChange = () => {
      loadRecords();
      loadFavoritesList();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tai_lo_record_updated', handleStorageChange);
    window.addEventListener('tai_lo_favorites_updated', handleStorageChange);

    // Auto refresh tick every 10s to simulate live telemetry
    const interval = setInterval(() => {
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString('zh-TW', { hour12: false }));
    }, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tai_lo_record_updated', handleStorageChange);
      window.removeEventListener('tai_lo_favorites_updated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleClearRecords = () => {
    if (window.confirm('確定要清除所有的學習紀錄嗎？')) {
      localStorage.removeItem('tai_lo_records');
      setRecords([]);
      window.dispatchEvent(new Event('tai_lo_record_updated'));
    }
  };

  const handleAddSampleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
    const computedStars = newScore >= 90 ? 5 : newScore >= 75 ? 4 : newScore >= 60 ? 3 : 2;
    const newEntry: GameRecord = {
      id: String(Date.now()),
      date: todayStr,
      gameName: newGameName,
      score: newScore,
      stars: computedStars,
      category: '實時測驗'
    };

    const updated = [...records, newEntry];
    setRecords(updated);
    localStorage.setItem('tai_lo_records', JSON.stringify(updated));
    window.dispatchEvent(new Event('tai_lo_record_updated'));
    setShowAddModal(false);
  };

  const totalStars = records.reduce((sum, r) => sum + r.stars, 0);
  const averageScore = records.length > 0 ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length) : 0;
  const maxScore = records.length > 0 ? Math.max(...records.map(r => r.score)) : 0;

  // Chart data calculations
  const chartHeight = 140;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  const points = records.map((r, i) => {
    const x = records.length > 1 ? paddingX + (i * (chartWidth - paddingX * 2)) / (records.length - 1) : chartWidth / 2;
    const y = chartHeight - paddingY - (r.score / 100) * (chartHeight - paddingY * 2);
    return { x, y, score: r.score, date: r.date, name: r.gameName };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${chartHeight - 10} L ${points[0].x},${chartHeight - 10} Z`
    : '';

  if (isTeacher) {
    return (
      <HubShell activeKey="record" onHome={() => onNavigate('home')}>
        <div className="w-full flex flex-col gap-4">
          <Suspense fallback={<div className="text-center text-[#8A8378] py-10 font-black">載入教學後台中…</div>}>
            <TeacherDashboard embedded={true} teacherName={currentUser?.name || '林國華 老師'} />
          </Suspense>
        </div>
      </HubShell>
    );
  }

  return (
    <HubShell activeKey="record" onHome={() => onNavigate('home')}>
      {/* ---------------- Main Column Layout ---------------- */}
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 p-2 flex-1">
        
        {/* Banner Headers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7DFCF] pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-black text-[#3E2723] text-2xl md:text-3xl flex items-center gap-2">
                <span>{isTeacher ? '👨‍🏫' : '📊'}</span> {isTeacher ? '教學後台 (全班學習狀況概覽)' : '我的台語學習紀錄'}
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-[#4E9B5D] text-xs font-black animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                實時同步中 {lastSyncTime}
              </span>
            </div>
            <p className="text-[#8A8378]/80 text-sm md:text-base font-bold mt-1">
              {isTeacher
                ? '即時分析班級學生學習狀況、通關答對率與成績報表數據'
                : '即時統計您的作答成效、遊戲通關成績與學習趨勢圖表'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
            {isTeacher && (
              <button
                onClick={() => setIsTeacherDashboardOpen(true)}
                className="px-4 py-2 rounded-xl text-xs md:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-amber-300"
              >
                <span>👨‍🏫</span> 開啟教師管理系統
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs md:text-sm font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:bg-[#3E8552] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> 新增測驗紀錄
            </button>

            <button
              onClick={loadRecords}
              className={`p-2 rounded-xl text-[#8A8378] border border-[#E7DFCF] bg-[#F5F0E4]/60 hover:bg-[#F1ECE0]/80 cursor-pointer transition-all ${isSyncing ? 'animate-spin' : ''}`}
              title="重新載入"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {records.length > 0 && (
              <button
                onClick={handleClearRecords}
                className="px-3.5 py-2 rounded-xl text-xs md:text-sm font-black text-rose-400 border border-rose-500/50 bg-rose-950/40 hover:bg-rose-900/60 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> 清除
              </button>
            )}
          </div>
        </div>

        {/* --- 分頁切換列 (Tab Bar) --- */}
        <div className="flex items-center gap-3 border-b border-[#E7DFCF] pb-3">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm md:text-base transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md scale-102'
                : 'bg-[#FFFDF9] border border-[#E7DFCF] text-[#8A8378] hover:bg-[#F1ECE0]/50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>📊 學習戰績與統計</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm md:text-base transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md scale-102'
                : 'bg-[#FFFDF9] border border-amber-500/30 text-[#8A8378] hover:bg-amber-900/50'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-amber-300" />
            <span>📖 我的單字本</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === 'vocab' ? 'bg-slate-950 text-[#E4772E]' : 'bg-amber-500/20 text-[#E4772E]'
              }`}
            >
              {favorites.length}
            </span>
          </button>
        </div>

        {activeTab === 'vocab' ? (
          <div className="flex flex-col gap-6">
            {/* 頂部功能與搜尋區域 */}
            <div className="bg-[#FFFDF9] border-2 border-amber-400/50 rounded-3xl p-5 md:p-6 shadow-[0_0_20px_rgba(217,119,6,0.15)] flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-black text-[#3E2723] text-xl md:text-2xl flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                    我的台語詞彙單字本
                  </h2>
                  <p className="text-[#8A8378]/80 text-xs md:text-sm font-bold mt-1">
                    這裡自動同步您在「拼音學習」與「互動遊戲」中點選『收藏』的單字，點擊卡片可即時朗讀台語發音。
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {favorites.length > 0 && (
                    <>
                      <button
                        onClick={handleAutoPlayAll}
                        disabled={isAutoPlaying || filteredFavorites.length === 0}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:bg-[#3E8552] transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                          isAutoPlaying ? 'animate-pulse opacity-80' : ''
                        }`}
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>{isAutoPlaying ? '朗讀中...' : '連續播放所有發音'}</span>
                      </button>

                      <button
                        onClick={handleClearAllVocab}
                        className="px-3 py-2 rounded-xl text-xs md:text-sm font-black text-rose-400 border border-rose-500/50 bg-rose-950/40 hover:bg-rose-900/60 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>清空</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 搜尋列與分類標籤 */}
              {favorites.length > 0 && (
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-3 border-t border-[#EFE8D8]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#8A8378] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={vocabSearch}
                      onChange={(e) => setVocabSearch(e.target.value)}
                      placeholder="搜尋漢字、台羅拼音或華語釋義..."
                      className="w-full bg-[#FFFDF9] border border-[#E7DFCF] rounded-xl pl-10 pr-8 py-2 text-sm font-bold text-[#3E2723] placeholder-cyan-500/50 focus:outline-none focus:border-amber-400"
                    />
                    {vocabSearch && (
                      <button
                        onClick={() => setVocabSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8378] text-xs font-black hover:text-[#3E2723]"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedVocabCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 transition-all cursor-pointer ${
                          selectedVocabCategory === cat
                            ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                            : 'bg-[#F5F0E4] text-[#8A8378] border border-[#E7DFCF] hover:bg-[#F1ECE0]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 收藏單字卡片列表 */}
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFavorites.map((item) => {
                  const isPlaying = playingVocabId === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handlePlayVocab(item)}
                      className={`relative p-5 rounded-3xl bg-[#08182B] border-2 transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 ${
                        isPlaying
                          ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-[#0C223C]'
                          : 'border-[#E7DFCF] hover:border-amber-400/70 hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F5F0E4] border border-[#E7DFCF] text-[#8A8378] text-[11px] font-black">
                            {item.category || '拼音單字'}
                          </span>
                          <button
                            onClick={(e) => handleRemoveVocab(item.id, e)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                            title="從單字本移除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-3xl font-black text-[#3E2723] mb-1 tracking-wide flex items-center gap-2">
                          <span>{item.hanzi}</span>
                          {isPlaying && (
                            <span className="text-amber-400 text-xs font-bold animate-bounce">🔊 發音中</span>
                          )}
                        </div>

                        <div className="text-sm font-mono font-black text-[#E4772E] bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-xl w-fit mb-2">
                          {item.tailo}
                        </div>

                        {item.mandarin && (
                          <div className="text-xs font-bold text-[#8A8378]/80">
                            華語釋義：{item.mandarin}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EFE8D8] flex items-center justify-between text-xs text-[#8A8378]/60 font-bold">
                        <span>點擊卡片聽發音</span>
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 group-hover:bg-amber-400 text-[#E4772E] group-hover:text-slate-950 flex items-center justify-center transition-all">
                          <Volume2 className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : favorites.length > 0 ? (
              <div className="text-center py-12 bg-[#FFFDF9] rounded-3xl border border-[#E7DFCF] text-[#8A8378]">
                <p className="text-base font-bold mb-2">找不到符合「{vocabSearch}」的收藏單字</p>
                <button
                  onClick={() => {
                    setVocabSearch('');
                    setSelectedVocabCategory('全部');
                  }}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-300 cursor-pointer"
                >
                  重設搜尋條件
                </button>
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-[#FFFDF9] rounded-3xl border-2 border-dashed border-[#E7DFCF] flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-4xl">
                  📖
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#3E2723] mb-2">單字本目前是空的唷！</h3>
                  <p className="text-[#8A8378]/80 text-sm font-bold max-w-md mx-auto">
                    前往『拼音學習』課程或各個『台語遊戲關卡』，點擊語詞旁邊的『收藏』按鈕，就能將喜歡或想要加強練習的單字收納在我的單字本！
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => onNavigate('phonics')}
                    className="px-5 py-2.5 rounded-xl font-black text-xs md:text-sm bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:bg-[#3E8552] transition-all cursor-pointer shadow-md"
                  >
                    前往『拼音學習』課程
                  </button>
                  <button
                    onClick={() => onNavigate('games')}
                    className="px-5 py-2.5 rounded-xl font-black text-xs md:text-sm bg-[#F5F0E4] text-[#8A8378] border border-[#E7DFCF] hover:bg-[#F1ECE0] transition-all cursor-pointer"
                  >
                    前往『台語遊戲集』
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* --- 真實遊戲進度（progressStore，依實際遊玩紀錄自動更新） --- */}
            <div className="bg-[#FFFDF9] border-2 border-amber-400/50 rounded-3xl p-5 md:p-6 shadow-[0_0_20px_rgba(217,119,6,0.15)] flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-black text-[#3E2723] text-base md:text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              我的真實學習進度
            </h2>
            <span className="text-xs font-bold text-[#8A8378]/70">遊戲關卡打完會自動更新，不用手動填寫</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-amber-400/40 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-[#E4772E] shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#8A8378] font-extrabold">連續學習天數</div>
                <div className="text-2xl font-black text-[#3E2723]">{progress.streak.current} 天</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#D9CFB8]/40 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F0E4] border border-[#D9CFB8] flex items-center justify-center text-[#8A8378] shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#8A8378] font-extrabold">歷史最長連續</div>
                <div className="text-2xl font-black text-[#3E2723]">{progress.streak.longest} 天</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-emerald-400/40 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-[#4E9B5D] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#8A8378] font-extrabold">關卡完成度</div>
                <div className="text-2xl font-black text-[#3E2723]">{gamesPlayedCount} / {GAMES.length}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-purple-400/40 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-400 flex items-center justify-center text-purple-300 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#8A8378] font-extrabold">已獲得徽章</div>
                <div className="text-2xl font-black text-[#3E2723]">{earnedBadges.length} / {BADGES.length}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {BADGES.map((b) => {
              const earned = earnedBadgeIds.has(b.id);
              return (
                <div
                  key={b.id}
                  title={b.desc}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-opacity ${
                    earned
                      ? 'bg-amber-950/60 border-amber-400 text-[#E4772E]'
                      : 'bg-slate-900/60 border-slate-700 text-slate-500 opacity-50'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span>{b.title}</span>
                </div>
              );
            })}
          </div>

          {gamesPlayedCount === 0 && (
            <div className="text-xs md:text-sm text-[#8A8378]/70 font-bold bg-[#F5F0E4] border border-[#E7DFCF] rounded-xl px-4 py-3">
              💡 還沒有遊玩紀錄，去「互動遊戲」關卡打完一關試試看，這裡的數字會馬上更新！
            </div>
          )}
        </div>

        {/* --- Stats Dashboard --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <div className="p-4 md:p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#E7DFCF] shadow-md flex items-center gap-4 hover:border-emerald-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-[#4E9B5D] shrink-0 shadow-sm">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs md:text-sm text-[#8A8378] font-extrabold">獲得總星星</div>
              <div className="text-2xl md:text-3xl font-black text-[#3E2723] mt-1">{totalStars} ★</div>
            </div>
          </div>

          <div className="p-4 md:p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#E7DFCF] shadow-md flex items-center gap-4 hover:border-[#D9CFB8] transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0E4] border-2 border-[#D9CFB8] flex items-center justify-center text-[#8A8378] shrink-0 shadow-sm">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs md:text-sm text-[#8A8378] font-extrabold">平均答對率</div>
              <div className="text-2xl md:text-3xl font-black text-[#3E2723] mt-1">{averageScore}%</div>
            </div>
          </div>

          <div className="p-4 md:p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#E7DFCF] shadow-md flex items-center gap-4 hover:border-amber-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-[#E4772E] shrink-0 shadow-sm">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs md:text-sm text-[#8A8378] font-extrabold">最高分紀錄</div>
              <div className="text-2xl md:text-3xl font-black text-[#E4772E] mt-1">{maxScore} 分</div>
            </div>
          </div>

          <div className="p-4 md:p-6 rounded-2xl bg-[#FFFDF9] border-2 border-[#E7DFCF] shadow-md flex items-center gap-4 hover:border-purple-400 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-purple-300 shrink-0 shadow-sm">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs md:text-sm text-[#8A8378] font-extrabold">累計挑戰次數</div>
              <div className="text-2xl md:text-3xl font-black text-[#3E2723] mt-1">{records.length} 次</div>
            </div>
          </div>
        </div>

        {/* --- Dynamic Visual Statistics Chart (新增統計圖) --- */}
        <div className="bg-[#FFFDF9] border-2 border-[#E7DFCF] rounded-3xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-black text-[#3E2723] text-base md:text-lg flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              學習成績表現與趨勢分析圖
            </h2>
            <div className="flex items-center gap-3 text-xs font-bold text-[#8A8378]/70">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>得分趨勢 (0-100)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>歷次測驗</span>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="py-8 text-center text-[#8A8378]/60 text-sm font-bold">
              尚無足夠數據繪製圖表，請進行幾次測驗或遊戲！
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* SVG Line / Area Trend Chart */}
              <div className="relative w-full bg-[#FFFDF9] border border-[#E7DFCF] rounded-2xl p-4 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 min-w-[500px]">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Gridlines */}
                    {[20, 50, 80, 110].map((gridY, idx) => (
                      <line
                        key={idx}
                        x1="20"
                        y1={gridY}
                        x2={chartWidth - 20}
                        y2={gridY}
                        stroke="#0e2a47"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Area fill under curve */}
                    {areaD && <path d={areaD} fill="url(#chartGradient)" />}

                    {/* Main trend line */}
                    {pathD && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                    )}

                    {/* Data Points & Bars */}
                    {points.map((p, idx) => {
                      const isHovered = hoveredPoint === idx;
                      return (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)}>
                          {/* Vertical indicator line */}
                          <line
                            x1={p.x}
                            y1={chartHeight - 10}
                            x2={p.x}
                            y2={p.y}
                            stroke={isHovered ? '#38bdf8' : '#0369a1'}
                            strokeWidth={isHovered ? '2' : '1'}
                            strokeDasharray="2 2"
                          />

                          {/* Outer glow ring */}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? '8' : '5'}
                            fill="#030b17"
                            stroke={isHovered ? '#38bdf8' : '#34d399'}
                            strokeWidth="2.5"
                            className="transition-all duration-200"
                          />

                          {/* Inner dot */}
                          <circle cx={p.x} cy={p.y} r="2.5" fill={isHovered ? '#38bdf8' : '#34d399'} />

                          {/* Label below point */}
                          <text
                            x={p.x}
                            y={chartHeight - 2}
                            textAnchor="middle"
                            fill="#7dd3fc"
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {p.date.slice(5)}
                          </text>

                          {/* Hover score bubble */}
                          {isHovered && (
                            <g>
                              <rect
                                x={p.x - 30}
                                y={p.y - 32}
                                width="60"
                                height="22"
                                rx="6"
                                fill="#071322"
                                stroke="#38bdf8"
                                strokeWidth="1.5"
                              />
                              <text
                                x={p.x}
                                y={p.y - 17}
                                textAnchor="middle"
                                fill="#a7f3d0"
                                fontSize="11"
                                fontWeight="900"
                              >
                                {p.score} 分
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FFFDF9] border border-[#EFE8D8] rounded-2xl p-3.5">
                  <div className="flex justify-between items-center text-xs font-black mb-1.5">
                    <span className="text-[#8A8378]">🎮 遊戲闖關勝率</span>
                    <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="w-full bg-[#F5F0E4] rounded-full h-2.5 overflow-hidden border border-[#E7DFCF]">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[92%]"></div>
                  </div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#EFE8D8] rounded-2xl p-3.5">
                  <div className="flex justify-between items-center text-xs font-black mb-1.5">
                    <span className="text-[#8A8378]">🗣️ 拼音辨識準確率</span>
                    <span className="text-[#8A8378]">88%</span>
                  </div>
                  <div className="w-full bg-[#F5F0E4] rounded-full h-2.5 overflow-hidden border border-[#E7DFCF]">
                    <div className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full w-[88%]"></div>
                  </div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#EFE8D8] rounded-2xl p-3.5">
                  <div className="flex justify-between items-center text-xs font-black mb-1.5">
                    <span className="text-[#8A8378]">👂 聲調聽力達成度</span>
                    <span className="text-[#E4772E]">95%</span>
                  </div>
                  <div className="w-full bg-[#F5F0E4] rounded-full h-2.5 overflow-hidden border border-[#E7DFCF]">
                    <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- History Records Log --- */}
        <div className="bg-[#FFFDF9] border-2 border-[#E7DFCF] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-[#3E2723] text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8A8378]" /> 歷史通關紀錄明細
            </h2>
            <span className="text-xs text-[#8A8378]/70 font-bold">共 {records.length} 筆紀錄</span>
          </div>

          {records.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-center gap-3 border-2 border-dashed border-[#EFE8D8] rounded-2xl bg-[#FFFDF9]">
              <span className="text-4xl">📭</span>
              <div className="font-black text-[#3E2723] text-base">目前尚無挑戰與通關紀錄</div>
              <p className="text-xs md:text-sm text-[#8A8378]/70 max-w-xs font-bold">快去「互動遊戲」或是「拼音學習」中挑戰聽力測試吧！</p>
              <button
                onClick={() => onNavigate('phonics')}
                className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm hover:bg-[#3E8552] active:scale-95 transition-all cursor-pointer shadow-md"
              >
                前往拼音學習 ❯
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7DFCF] text-xs md:text-sm font-black text-[#8A8378]">
                    <th className="py-3 px-4">挑戰日期</th>
                    <th className="py-3 px-4">學習單元/遊戲名稱</th>
                    <th className="py-3 px-4 text-center">單次得分</th>
                    <th className="py-3 px-4 text-center">星級表現</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/20">
                  {records.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-[#FFFDF9] transition-colors text-xs md:text-sm text-[#5C5548] font-bold">
                      <td className="py-3 px-4 font-mono">{record.date}</td>
                      <td className="py-3 px-4 font-black text-[#3E2723] text-sm md:text-base flex items-center gap-2">
                        {record.gameName}
                        {record.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F0E4] text-[#8A8378] border border-[#E7DFCF]">
                            {record.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-black font-mono text-emerald-400 text-sm md:text-base">{record.score} 分</td>
                      <td className="py-3 px-4 text-center text-[#E4772E] text-sm md:text-base">
                        {'★'.repeat(record.stars)}
                        {'☆'.repeat(5 - record.stars)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        )}

      </div>

      {/* --- Add New Test Record Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80  p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFDF9] border-2 border-[#D9CFB8] rounded-3xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(2,132,199,0.3)] relative text-[#3E2723]"
          >
            <h3 className="font-black text-lg text-[#3E2723] mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              新增實時學習與測驗紀錄
            </h3>
            <p className="text-xs text-[#8A8378]/70 font-bold mb-4">輸入您的練習成績，系統將同步更新動態圖表</p>

            <form onSubmit={handleAddSampleRecord} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-extrabold text-[#8A8378] mb-1 block">單元/測驗名稱</label>
                <input
                  type="text"
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E7DFCF] text-[#3E2723] font-bold text-sm focus:border-cyan-300 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#8A8378] mb-1 flex justify-between">
                  <span>獲得分數 (0-100)</span>
                  <span className="text-emerald-400 font-mono font-black">{newScore} 分</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F0E4] text-[#8A8378] font-bold text-xs border border-[#E7DFCF] hover:bg-[#F1ECE0] cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs hover:bg-[#3E8552] active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> 儲存紀錄
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Teacher Dashboard Modal */}
      <Suspense fallback={null}>
        <TeacherDashboard
          isOpen={isTeacherDashboardOpen}
          onClose={() => setIsTeacherDashboardOpen(false)}
        />
      </Suspense>
    </HubShell>
  );
}

