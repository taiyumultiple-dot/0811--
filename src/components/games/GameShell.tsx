import { ReactNode, useState, useEffect } from 'react';
import { Home, BookOpen, Gamepad2, ClipboardList, MessageCircle, Music, VolumeX, Sliders, GraduationCap, Wrench } from 'lucide-react';
import PaperBackground from './PaperBackground';
import AuthModal, { UserProfile } from '../AuthModal';
import VolumeControlModal from '../VolumeControlModal';
import { toggleBGM, isBGMActive, cycleBGMTrack, getCurrentBGMTrackName } from '../../utils/soundEffects';

export const NAV_ITEMS = [
  { label: '首頁', icon: Home, key: 'home' },
  { label: '拼音學習', icon: BookOpen, key: 'phonics', tabId: 'phonics_scheme' },
  { label: '互動遊戲', icon: Gamepad2, key: 'games' },
  { label: '學習紀錄', icon: ClipboardList, key: 'record' },
  { label: '最新消息', icon: MessageCircle, key: 'news' },
  { label: '課堂小工具', icon: Wrench, key: 'classroom' },
];

// Global navigation helper
export const triggerGlobalNavigate = (key: string, tabId?: string) => {
  if (typeof (window as any).globalNavigate === 'function') {
    const targetView = key === 'games' ? 'gamesHub' : key;
    (window as any).globalNavigate(targetView, tabId);
  }
};

export function TopNav({ activeKey = 'games', onHome }: { activeKey?: string; onHome?: () => void }) {
  const [bgmOn, setBgmOn] = useState<boolean>(() => isBGMActive());
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleBgmChange = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail && customEvt.detail.playing !== undefined) {
        setBgmOn(customEvt.detail.playing);
      }
    };
    window.addEventListener('bgm-state-changed', handleBgmChange);
    return () => window.removeEventListener('bgm-state-changed', handleBgmChange);
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('tai_lo_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('tai_lo_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tai_lo_user');
  };

  const handleNavClick = (key: string, tabId?: string) => {
    if (key === 'home' && !((window as any).globalNavigate)) {
      onHome?.();
    } else {
      triggerGlobalNavigate(key, tabId);
    }
  };

  return (
    <>
      <header className="flex flex-wrap lg:flex-nowrap items-center justify-between px-4 md:px-6 py-3 md:py-3.5 bg-[#FDFAF4] border-2 border-[#E7DFCF] rounded-2xl md:rounded-3xl shadow-md z-30 select-none gap-3">
        {/* Left side: Beaker Icon + Title + Subtitle */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          onClick={() => handleNavClick('home')}
        >
          <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-[#F1ECE0] border-2 border-[#E4772E]/50 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <h1 className="font-black text-base md:text-xl lg:text-2xl tracking-wide leading-tight drop-shadow-sm">
              <span className="text-[#3E2723]">泰宇出版 <span className="text-[#E4772E]">X</span> 閩南語互動學習遊戲</span>
            </h1>
          </div>
        </div>

        {/* Middle side: Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#F5F0E4] p-1.5 rounded-2xl border border-[#E7DFCF]">
          {NAV_ITEMS.map(({ label: defaultLabel, icon: DefaultIcon, key, tabId }) => {
            const isTeacher = currentUser?.role === 'teacher';
            const label = (key === 'record' && isTeacher) ? '教學後台' : defaultLabel;
            const Icon = (key === 'record' && isTeacher) ? GraduationCap : DefaultIcon;
            // 「拼音學習」跟「動畫專區」同屬 phonics 這個 view，只差在分頁，
            // 所以有 tabId 的項目要拿 tabId 去比，不然兩顆按鈕會一起亮。
            const active = activeKey === (tabId || key);
            return (
              <button
                key={key + (tabId || '')}
                data-sound="tab"
                onClick={() => handleNavClick(key, tabId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base font-black transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#4E9B5D] text-white shadow-sm'
                    : 'text-[#5C5548] hover:bg-white hover:text-[#4E9B5D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#8A8378]'}`} strokeWidth={2.5} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsVolumeModalOpen(true)}
            data-sound="pop"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all active:scale-95 cursor-pointer shadow-md font-black text-xs md:text-sm ${
              bgmOn
                ? 'border-[#E4772E] bg-[#F5B041] text-[#3E2723] hover:brightness-105'
                : 'border-[#E7DFCF] bg-[#F5F0E4] text-[#5C5548] hover:bg-white'
            }`}
            title="點擊開啟音量與音樂設定面板"
          >
            {bgmOn ? (
              <Music className="w-4 h-4 text-[#3E2723] animate-bounce" strokeWidth={2.5} />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8A8378]" strokeWidth={2.5} />
            )}
            <span>{bgmOn ? '音樂音量 🎵' : '靜音中 🔇'}</span>
            <Sliders className="w-3.5 h-3.5 opacity-80 ml-0.5" />
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            data-sound="pop"
            className="px-4 py-2 rounded-xl bg-[#4E9B5D] hover:bg-[#3E8552] text-white font-black text-sm md:text-base shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {currentUser ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                <span className="text-base">{currentUser.avatar || '👤'}</span>
                <span>{currentUser.name}</span>
              </>
            ) : (
              <span>登入 / 註冊</span>
            )}
          </button>
        </div>
      </header>

      {/* Volume & Music Control Interactive Modal */}
      <VolumeControlModal
        isOpen={isVolumeModalOpen}
        onClose={() => setIsVolumeModalOpen(false)}
      />

      {/* Login & Registration Interactive Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </>
  );
}

/** Full layout used by every game sub-page: nav + content area. */
export function GameShell({
  children,
  onHome,
  sidebarExtension,
  activeKey = 'games',
}: {
  children: ReactNode;
  onHome?: () => void;
  sidebarExtension?: ReactNode;
  activeKey?: string;
}) {
  return (
    <div className="relative min-h-screen p-3 md:p-4 flex flex-col gap-3 md:gap-4 overflow-hidden bg-[#F7F2E7]">
      <PaperBackground />
      <div className="relative z-10 flex flex-col gap-3 md:gap-4 flex-1">
        <TopNav activeKey={activeKey} onHome={onHome} />
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 flex-1">
          {sidebarExtension && (
            <div className="flex flex-col gap-3 md:gap-4 w-full lg:w-56 shrink-0 hidden lg:block">
              {sidebarExtension}
            </div>
          )}
          <div className="flex-1 min-w-0 flex flex-col gap-3 md:gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Layout used only by the hub page: nav, full width, no sidebar. */
export function HubShell({
  children,
  onHome,
  activeKey = 'games',
  fitScreen = false,
}: {
  children: ReactNode;
  onHome?: () => void;
  activeKey?: string;
  /** 首頁用：整頁鎖在一個視窗高度內，內容自己縮，不要捲動 */
  fitScreen?: boolean;
}) {
  return (
    <div
      className={`relative p-3 md:p-4 flex flex-col gap-3 md:gap-4 overflow-hidden bg-[#F7F2E7] ${
        fitScreen ? 'lg:h-screen min-h-screen' : 'min-h-screen'
      }`}
    >
      <PaperBackground />
      <div className="relative z-10 flex flex-col gap-3 md:gap-4 flex-1 min-h-0">
        <TopNav activeKey={activeKey} onHome={onHome} />
        {children}
      </div>
    </div>
  );
}
