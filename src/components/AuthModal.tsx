import { useState, lazy, Suspense } from 'react';
import { X, User, Lock, GraduationCap, CheckCircle2, LogOut, Sparkles, BarChart3, Users, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const TeacherDashboard = lazy(() => import('./TeacherDashboard'));
import { registerNewStudentSync, createNewClassSync } from '../lib/classDataStore';

export interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'teacher';
  grade?: string;
  school?: string;
  avatar?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}: AuthModalProps) {
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('國小五年級');
  const [regSchool, setRegSchool] = useState('鹿港國小');

  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      name: loginEmail.includes('@') ? loginEmail.split('@')[0] : loginEmail || (roleTab === 'teacher' ? '林國華 老師' : '台語學習者'),
      email: loginEmail || (roleTab === 'teacher' ? 'lin_teacher@school.edu.tw' : 'user@example.com'),
      role: roleTab,
      grade: roleTab === 'teacher' ? '本土語文專任教師' : '國小五年級',
      school: '鹿港國民小學',
      avatar: roleTab === 'teacher' ? '👨‍🏫' : '🎒'
    };
    onLoginSuccess(user);
    setMessage(`登入成功！已切換為【${roleTab === 'teacher' ? '教師管理員' : '學生'}】權限`);
    setTimeout(() => {
      setMessage('');
      if (roleTab === 'teacher') {
        setIsTeacherDashboardOpen(true);
      } else {
        onClose();
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName || (roleTab === 'teacher' ? '張美麗 老師' : '新台語好手');
    const email = regEmail || 'user@school.edu.tw';
    const school = regSchool || '鹿港國民小學';
    const grade = regGrade || (roleTab === 'teacher' ? '502.台語進階班' : '503.台語實驗班');

    const user: UserProfile = {
      name,
      email,
      role: roleTab,
      grade,
      school,
      avatar: roleTab === 'teacher' ? '👩‍🏫' : '🧒'
    };

    // Auto sync to backend class data store
    if (roleTab === 'student') {
      registerNewStudentSync({
        name,
        email,
        school,
        grade,
        avatar: '🧒'
      });
    } else {
      createNewClassSync({
        className: grade.includes('班') ? grade : `${grade}.台語專修班`,
        gradeLabel: grade,
        teacherName: name,
        schoolName: school
      });
    }

    onLoginSuccess(user);
    setMessage('🎉【註冊與資料連動成功】帳號與新班級數據已自動同步至教學後台！');
    setTimeout(() => {
      setMessage('');
      if (roleTab === 'teacher') {
        setIsTeacherDashboardOpen(true);
      } else {
        onClose();
      }
    }, 1000);
  };

  const handleQuickDemo = (role: 'student' | 'teacher') => {
    const demoUser: UserProfile = role === 'teacher' ? {
      name: '林國華 老師',
      email: 'lin_teacher@school.edu.tw',
      role: 'teacher',
      school: '彰化縣鹿港國民小學',
      grade: '503.台語實驗班',
      avatar: '👨‍🏫'
    } : {
      name: '張小明 (學生體驗帳號)',
      email: 'xiaoming@student.edu.tw',
      role: 'student',
      school: '臺羅拼音方塊研究所',
      grade: '503.台語實驗班',
      avatar: '🎒'
    };

    if (role === 'student') {
      registerNewStudentSync({
        name: demoUser.name,
        email: demoUser.email,
        school: demoUser.school,
        grade: '503',
        avatar: '🎒'
      });
    }

    onLoginSuccess(demoUser);
    setMessage(`🎉 已以【${demoUser.name}】身分快速登入，學習紀錄已自動連動至【503.台語實驗班】教學後台！`);
    setTimeout(() => {
      setMessage('');
      if (role === 'teacher') {
        setIsTeacherDashboardOpen(true);
      } else {
        onClose();
      }
    }, 800);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#071322] border-2 border-cyan-400 rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-[0_0_35px_rgba(2,132,199,0.35)] relative text-white overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-cyan-950 border border-cyan-500/40 hover:border-cyan-300 flex items-center justify-center text-cyan-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logged in view */}
            {currentUser ? (
              <div className="flex flex-col gap-5 text-center items-center py-2">
                <div className="w-20 h-20 rounded-2xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                  {currentUser.avatar || '👤'}
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs font-black inline-block mb-2">
                    {currentUser.role === 'teacher' ? '👨‍🏫 教師 / 管理員權限' : '🎒 學生帳號'}
                  </span>
                  <h2 className="font-black text-2xl text-white">{currentUser.name}</h2>
                  <p className="text-xs font-bold text-cyan-200/70 mt-1">{currentUser.email}</p>
                </div>

                <div className="w-full bg-[#030b17] border border-cyan-500/30 rounded-2xl p-4 text-left flex flex-col gap-2.5 text-xs font-bold text-cyan-100">
                  <div className="flex justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-cyan-200/70">就讀學校/機構</span>
                    <span className="text-white font-black">{currentUser.school || '鹿港國民小學'}</span>
                  </div>
                  <div className="flex justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-cyan-200/70">班級/身分</span>
                    <span className="text-emerald-300 font-black">{currentUser.grade || '五年級'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-200/70">雲端同步狀態</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已自動同步學習紀錄
                    </span>
                  </div>
                </div>

                {/* Special Teacher Portal Button */}
                {currentUser.role === 'teacher' && (
                  <button
                    onClick={() => setIsTeacherDashboardOpen(true)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:brightness-110 cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>開啟【教師教學與班級學習狀況後台】</span>
                  </button>
                )}

                <div className="flex gap-3 w-full mt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-sm hover:bg-cyan-900 cursor-pointer transition-colors"
                  >
                    返回平台
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-black text-sm hover:bg-rose-900 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> 登出帳號
                  </button>
                </div>
              </div>
            ) : (
              /* Not logged in view: Distinct Role Pages (Student vs Teacher) */
              <div className="flex flex-col gap-4">
                {/* 1. Main Role Selection Switcher (Student vs Teacher) */}
                <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#030b17] border-2 border-cyan-400/60 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setRoleTab('student')}
                    className={`py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      roleTab === 'student'
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md scale-[1.02]'
                        : 'text-cyan-300/70 hover:text-white'
                    }`}
                  >
                    <span>🎒 學生專用登入頁</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleTab('teacher')}
                    className={`py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      roleTab === 'teacher'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md scale-[1.02]'
                        : 'text-cyan-300/70 hover:text-white'
                    }`}
                  >
                    <span>👨‍🏫 老師管理員頁面</span>
                  </button>
                </div>

                {/* Role Header Description */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#030b17] border border-cyan-500/30">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-xl shrink-0">
                    {roleTab === 'teacher' ? '👨‍🏫' : '🎒'}
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-white">
                      {roleTab === 'teacher' ? '老師與班級管理者專用登入' : '學生自主學習專用登入'}
                    </h2>
                    <p className="text-xs text-cyan-200/70 font-bold">
                      {roleTab === 'teacher'
                        ? '登入後可查看全班學生遊戲連線狀況、學習進度與常錯字後台'
                        : '登入後可連線同步 10 款台語遊戲積分與關卡紀錄'}
                    </p>
                  </div>
                </div>

                {/* Login / Register Tab Switches */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-[#030b17] border border-cyan-500/30">
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      tab === 'login'
                        ? 'bg-cyan-900 border border-cyan-400 text-cyan-100'
                        : 'text-cyan-300/60 hover:text-white'
                    }`}
                  >
                    會員登入
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      tab === 'register'
                        ? 'bg-cyan-900 border border-cyan-400 text-cyan-100'
                        : 'text-cyan-300/60 hover:text-white'
                    }`}
                  >
                    新帳號註冊
                  </button>
                </div>

                {message && (
                  <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-200 text-xs font-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                {tab === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        {roleTab === 'teacher' ? '教師 Email / 教師代碼' : '學生 Email / 學號'}
                      </label>
                      <input
                        type="text"
                        placeholder={roleTab === 'teacher' ? '請輸入教師 Email (如：lin@school.edu.tw)' : '請輸入 Email 或學號'}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030b17] border border-cyan-500/40 text-white text-sm font-bold placeholder-cyan-500/40 focus:border-cyan-300 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" /> 登入密碼
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030b17] border border-cyan-500/40 text-white text-sm font-bold placeholder-cyan-500/40 focus:border-cyan-300 outline-none"
                        required
                      />
                    </div>

                    {roleTab === 'teacher' && (
                      <div className="bg-amber-950/50 border border-amber-400/40 p-2.5 rounded-xl text-amber-200 text-[11px] font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>登入後將自動引導進入【班級學生即時遊戲連線後台】</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl font-black text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer mt-1 ${
                        roleTab === 'teacher'
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-slate-950'
                          : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950'
                      }`}
                    >
                      {roleTab === 'teacher' ? '以【教師管理員】身分登入' : '以【學生】身分登入'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-bold text-cyan-200 mb-1 block">
                        {roleTab === 'teacher' ? '教師姓名' : '學生姓名 / 暱稱'}
                      </label>
                      <input
                        type="text"
                        placeholder={roleTab === 'teacher' ? '例：林國華 老師' : '例：陳小明'}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#030b17] border border-cyan-500/40 text-white text-sm font-bold placeholder-cyan-500/40 focus:border-cyan-300 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-cyan-200 mb-1 block">電子信箱</label>
                      <input
                        type="email"
                        placeholder={roleTab === 'teacher' ? 'teacher@school.edu.tw' : 'student@school.edu.tw'}
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#030b17] border border-cyan-500/40 text-white text-sm font-bold placeholder-cyan-500/40 focus:border-cyan-300 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-cyan-200 mb-1 block">學校名稱</label>
                        <input
                          type="text"
                          value={regSchool}
                          onChange={(e) => setRegSchool(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#030b17] border border-cyan-500/40 text-white text-xs font-bold focus:border-cyan-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-cyan-200 mb-1 block">
                          {roleTab === 'teacher' ? '教職身分' : '年級班別'}
                        </label>
                        <input
                          type="text"
                          value={regGrade}
                          onChange={(e) => setRegGrade(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#030b17] border border-cyan-500/40 text-white text-xs font-bold focus:border-cyan-300 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl font-black text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer mt-1 ${
                        roleTab === 'teacher'
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-slate-950'
                          : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950'
                      }`}
                    >
                      完成註冊並登入
                    </button>
                  </form>
                )}

                {/* Quick Demo Login Bar */}
                <div className="border-t border-cyan-500/20 pt-3 mt-1 flex flex-col gap-2">
                  <span className="text-[11px] text-cyan-300/70 font-bold text-center flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 免註冊快速體驗試用帳號：
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      onClick={() => handleQuickDemo('student')}
                      className="py-2 px-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 hover:border-cyan-300 transition-colors cursor-pointer text-center"
                    >
                      🎒 學生體驗帳號
                    </button>
                    <button
                      onClick={() => handleQuickDemo('teacher')}
                      className="py-2 px-2 rounded-xl bg-amber-950/80 border border-amber-400/60 text-amber-200 hover:border-amber-300 transition-colors cursor-pointer text-center"
                    >
                      👨‍🏫 教師試用帳號 (含後台)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Teacher Dashboard Backend Component */}
      <Suspense fallback={null}>
        <TeacherDashboard
          isOpen={isTeacherDashboardOpen}
          onClose={() => setIsTeacherDashboardOpen(false)}
          teacherName={currentUser?.name || '林國華 老師'}
          schoolName={currentUser?.school || '彰化縣鹿港國民小學'}
        />
      </Suspense>
    </>
  );
}

