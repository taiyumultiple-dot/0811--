import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initGlobalSoundEffects, setBGMTheme } from './utils/soundEffects';
import BackgroundYouTubeAudio from './components/BackgroundYouTubeAudio';
import HomePage from './components/HomePage';
import { getNextGameKey } from './components/games/gamesData';

// 除了首頁以外的頁面／遊戲都改成 lazy load：
// 使用者一次只會看到其中一個畫面，沒必要把全部 10 款遊戲、教學頁、
// 教師後台都塞進第一次載入的 JS 裡，這樣可以明顯縮小首屏的下載體積。
const GamesHub = lazy(() => import('./components/games/GamesHub'));
const Game1FoodMatch = lazy(() => import('./components/games/Game1FoodMatch'));
const Game2NightMarket = lazy(() => import('./components/games/Game2NightMarket'));
const Game3BlueField = lazy(() => import('./components/games/Game3BlueField'));
const Game4BeachHunt = lazy(() => import('./components/games/Game4BeachHunt'));
const Game5FoodShooter = lazy(() => import('./components/games/Game5FoodShooter'));
const Game6FoodLab = lazy(() => import('./components/games/Game6FoodLab'));
const Game7Airport = lazy(() => import('./components/games/Game7Airport'));
const Game8StoryOrder = lazy(() => import('./components/games/Game8StoryOrder'));
const Game9DeerVocab = lazy(() => import('./components/games/Game9DeerVocab'));
const Game10Souvenirs = lazy(() => import('./components/games/Game10Souvenirs'));
const PhonicsPage = lazy(() => import('./components/PhonicsPage'));
const RecordPage = lazy(() => import('./components/RecordPage'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const ToolboxPage = lazy(() => import('./components/ToolboxPage'));

function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#030b17]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        <div className="text-cyan-300 text-sm font-black tracking-widest">載入中…</div>
      </div>
    </div>
  );
}

type View = 'home' | 'gamesHub' | 'phonics' | 'record' | 'news' | 'toolbox' | `game${number}`;

function App() {
  const [view, setView] = useState<View>('home');
  const [phonicsTab, setPhonicsTab] = useState<string>('phonics_scheme');

  useEffect(() => {
    // Initialize global Web Audio API interactive click sounds
    const cleanupSound = initGlobalSoundEffects();
    return () => {
      if (cleanupSound) cleanupSound();
    };
  }, []);

  useEffect(() => {
    // 只換曲目，不自動播放；音樂由使用者自己從「音樂音量」開
    if (view === 'home') {
      setBGMTheme('home');
    } else if (view === 'gamesHub') {
      setBGMTheme('hub');
    } else if (view === 'phonics') {
      setBGMTheme('phonics');
    } else if (view === 'news' || view === 'record' || view === 'toolbox') {
      setBGMTheme('relax');
    } else if (view.startsWith('game')) {
      setBGMTheme('game');
    }
  }, [view]);

  const goToGame = (key: string) => setView(key as View);
  const goHome = () => setView('home');
  const goNext = (fromKey: string) => {
    const next = getNextGameKey(fromKey);
    setView(next ? (next as View) : 'gamesHub');
  };

  const handleNavigate = (targetView: string, tabId?: string) => {
    if (tabId) {
      setPhonicsTab(tabId);
    }
    setView(targetView as View);
  };

  // Expose global navigation handler
  useEffect(() => {
    (window as any).globalNavigate = (targetView: string, tabId?: string) => {
      handleNavigate(targetView, tabId);
    };
    return () => {
      delete (window as any).globalNavigate;
    };
  }, []);

  const renderView = () => {
    if (view === 'gamesHub') return <GamesHub onSelectGame={goToGame} onHome={goHome} />;
    
    if (view === 'phonics') {
      return <PhonicsPage onNavigate={(target) => handleNavigate(target)} initialTab={phonicsTab} />;
    }
    
    if (view === 'record') {
      return <RecordPage onNavigate={(target) => handleNavigate(target)} />;
    }

    if (view === 'news') {
      return <NewsPage onNavigate={(target) => handleNavigate(target)} />;
    }

    if (view === 'toolbox') {
      return <ToolboxPage onNavigate={(target) => handleNavigate(target)} />;
    }

    if (view === 'game1') return <Game1FoodMatch onHome={goHome} onNext={() => goNext('game1')} />;
    if (view === 'game2') return <Game2NightMarket onHome={goHome} onNext={() => goNext('game2')} />;
    if (view === 'game3') return <Game3BlueField onHome={goHome} onNext={() => goNext('game3')} />;
    if (view === 'game4') return <Game4BeachHunt onHome={goHome} onNext={() => goNext('game4')} />;
    if (view === 'game5') return <Game5FoodShooter onHome={goHome} onNext={() => goNext('game5')} />;
    if (view === 'game6') return <Game6FoodLab onHome={goHome} onNext={() => goNext('game6')} />;
    if (view === 'game7') return <Game7Airport onHome={goHome} onNext={() => goNext('game7')} />;
    if (view === 'game8') return <Game8StoryOrder onHome={goHome} onNext={() => goNext('game8')} />;
    if (view === 'game9') return <Game9DeerVocab onHome={goHome} onNext={() => goNext('game9')} />;
    if (view === 'game10') return <Game10Souvenirs onHome={goHome} onNext={() => goNext('game10')} />;

    return (
      <HomePage
        onNavigate={(target, tabId) => handleNavigate(target, tabId)}
      />
    );
  };

  return (
    <>
      <BackgroundYouTubeAudio videoId="24Yv0M8T53c" />
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full min-h-screen"
        >
          <Suspense fallback={<LoadingFallback />}>
            {renderView()}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
