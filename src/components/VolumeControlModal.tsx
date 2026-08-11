import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1, Music, X, Sparkles, Check, Bell, BellOff, Play, Pause } from 'lucide-react';
import {
  toggleBGM,
  isBGMActive,
  getBGMVolume,
  setBGMVolume,
  isSoundEnabled,
  setSoundEnabled,
  playCorrectSound,
  playWrongSound,
  playClickSound,
} from '../utils/soundEffects';

interface VolumeControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VolumeControlModal({ isOpen, onClose }: VolumeControlModalProps) {
  const [bgmOn, setBgmOn] = useState<boolean>(() => isBGMActive());
  const [volume, setVolumeState] = useState<number>(() => getBGMVolume());
  const [sfxOn, setSfxOnState] = useState<boolean>(() => isSoundEnabled());

  useEffect(() => {
    const handleBgmChange = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        if (customEvt.detail.playing !== undefined) setBgmOn(customEvt.detail.playing);
        if (customEvt.detail.volume !== undefined) setVolumeState(customEvt.detail.volume);
      }
    };

    window.addEventListener('bgm-state-changed', handleBgmChange);
    return () => window.removeEventListener('bgm-state-changed', handleBgmChange);
  }, []);

  if (!isOpen) return null;

  const handleToggleBgm = () => {
    const newState = toggleBGM();
    setBgmOn(newState);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolumeState(newVol);
    setBGMVolume(newVol);
    if (newVol > 0 && !bgmOn) {
      toggleBGM();
      setBgmOn(true);
    } else if (newVol === 0 && bgmOn) {
      toggleBGM();
      setBgmOn(false);
    }
  };

  const handleToggleSfx = () => {
    const next = !sfxOn;
    setSfxOnState(next);
    setSoundEnabled(next);
    if (next) {
      playClickSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div 
        className="w-full max-w-md bg-[#071322] border-2 border-cyan-400 rounded-3xl p-5 md:p-6 shadow-[0_0_35px_rgba(2,132,199,0.4)] text-white relative flex flex-col gap-5 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-900 transition-colors cursor-pointer"
          title="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <span>音量與音樂設定</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </h3>
            <p className="text-xs text-cyan-200 font-bold">調節背景音樂音量與互動答題音效</p>
          </div>
        </div>

        {/* Section 1: Background Music (YouTube BGM) */}
        <div className="bg-[#030a16] border border-cyan-500/40 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className={`w-5 h-5 ${bgmOn ? 'text-amber-300 animate-spin' : 'text-slate-500'}`} />
              <div>
                <span className="font-black text-sm text-white">背景音樂 (YouTube 主題曲)</span>
                <span className="block text-[11px] text-cyan-300 font-bold">已同步 YouTube 24Yv0M8T53c 音軌</span>
              </div>
            </div>

            <button
              onClick={handleToggleBgm}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                bgmOn
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
              }`}
            >
              {bgmOn ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{bgmOn ? '播放中' : '已關閉'}</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-200">
              <span className="flex items-center gap-1">
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 50 ? (
                  <Volume1 className="w-4 h-4 text-amber-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>音樂音量大小</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/50 text-amber-300 font-mono text-xs font-black">
                {volume}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-cyan-500/30"
            />

            {/* Quick Volume Presets */}
            <div className="grid grid-cols-5 gap-1 mt-1">
              {[
                { label: '0% 靜音', val: 0 },
                { label: '5% 輕柔', val: 5 },
                { label: '30% 適中', val: 30 },
                { label: '70% 標準', val: 70 },
                { label: '100% 大聲', val: 100 },
              ].map((preset) => {
                const isActive = volume === preset.val;
                return (
                  <button
                    key={preset.val}
                    onClick={() => handleVolumeChange(preset.val)}
                    className={`py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                        : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-200 hover:border-cyan-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Sound Effects (SFX) */}
        <div className="bg-[#030a16] border border-cyan-500/40 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sfxOn ? <Bell className="w-5 h-5 text-emerald-400 animate-pulse" /> : <BellOff className="w-5 h-5 text-rose-400" />}
              <div>
                <span className="font-black text-sm text-white">答題與按鈕音效</span>
                <span className="block text-[11px] text-cyan-300 font-bold">按鈕點擊、答對與答錯提示音</span>
              </div>
            </div>

            <button
              onClick={handleToggleSfx}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                sfxOn
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                  : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/50'
              }`}
            >
              {sfxOn ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>{sfxOn ? '音效開啟' : '音效關閉'}</span>
            </button>
          </div>

          {/* Test Sound Feedback Buttons */}
          {sfxOn && (
            <div className="flex items-center gap-2 mt-1 pt-2 border-t border-cyan-500/20">
              <span className="text-xs text-cyan-200 font-bold">試聽反饋音：</span>
              <button
                onClick={() => playCorrectSound()}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>🎉 答對音效</span>
              </button>
              <button
                onClick={() => playWrongSound()}
                className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-500/60 text-rose-300 hover:bg-rose-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>❌ 答錯音效</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-sm md:text-base shadow-lg transition-all active:scale-98 cursor-pointer text-center"
        >
          完成設定
        </button>
      </div>
    </div>
  );
}
