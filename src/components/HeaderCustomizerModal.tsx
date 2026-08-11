import { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sliders,
  Square,
  Eye,
  RotateCcw,
  Check,
  Sparkles,
  Volume2
} from 'lucide-react';
import {
  getHeaderTheme,
  saveHeaderTheme,
  resetHeaderTheme,
  HeaderThemeSettings,
  DEFAULT_HEADER_THEME
} from '../lib/headerThemeStore';
import { deerLandscape, oceanScene } from '../assets/images/games';

interface HeaderCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHeaderTitle?: string;
  currentHeaderSubtitle?: string;
  stageNumber?: number;
}

const PRESET_IMAGES = [
  { name: '鹿野風光 (目前範例)', url: deerLandscape },
  { name: '東海岸海景', url: oceanScene },
  { name: '熱氣球天空', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80' },
  { name: '翠綠森林景色', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80' },
  { name: '復古木紋材質', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80' },
  { name: '夕陽晚霞景色', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&q=80' },
];

const PRESET_COLORS = [
  '#000000',
  '#4A2810',
  '#0F172A',
  '#1E3A8A',
  '#065F46',
  '#831843',
  '#FFE7C4',
  '#E4772E',
  '#38BDF8',
  'transparent',
];

export function HeaderCustomizerModal({
  isOpen,
  onClose,
  currentHeaderTitle = '鹿野觀察詞彙配對',
  currentHeaderSubtitle = '聽台語語音，點選正確的景點圖片圖卡！',
  stageNumber = 9,
}: HeaderCustomizerModalProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'layer' | 'frame' | 'preview'>('image');
  const [settings, setSettings] = useState<HeaderThemeSettings>(getHeaderTheme());
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getHeaderTheme());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplySetting = (key: keyof HeaderThemeSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveHeaderTheme(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        if (result) {
          handleApplySetting('headerImage', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('確定要恢復預設的背景與圖層外框樣式嗎？')) {
      const defaultState = resetHeaderTheme();
      setSettings(defaultState);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D1B2A] border-2 border-amber-400/60 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_30px_rgba(251,191,36,0.2)] overflow-hidden text-white">
        {/* Header Bar */}
        <div className="p-4 md:p-5 border-b border-cyan-500/30 flex items-center justify-between bg-[#071322]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg md:text-xl text-white flex items-center gap-2">
                背景圖片與圖層外框自訂編輯器
              </h2>
              <p className="text-cyan-200/70 text-xs font-bold">
                更換橫幅圖片、調校圖層濾鏡與外框細節，支援即時預覽
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar (即時網頁預覽框) */}
        <div className="p-4 bg-[#030B17] border-b border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              即時網頁樣式預覽 (Live Header Preview)
            </span>
            <button
              onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
              className="text-xs font-black text-cyan-300 hover:text-white bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-500/30 hover:bg-cyan-900 transition-all cursor-pointer"
            >
              {isFullscreenPreview ? '退出全螢幕預覽' : '🔍 滿版放大預覽'}
            </button>
          </div>

          {/* Render target header under current customized settings */}
          <div
            className={`transition-all duration-300 overflow-hidden flex items-center justify-between px-6 py-4 relative ${
              isFullscreenPreview ? 'p-8 min-h-[140px]' : ''
            }`}
            style={{
              backgroundColor: settings.overlayColor || '#8B5A2B',
              borderRadius: `${settings.borderRadiusPx}px`,
              borderWidth: settings.showOuterBorder ? `${settings.borderWidthPx}px` : '0px',
              borderColor: settings.borderColor,
              boxShadow:
                settings.shadowType === 'none'
                  ? 'none'
                  : settings.shadowType === 'glow'
                  ? '0 0 20px rgba(251,191,36,0.4)'
                  : settings.shadowType === 'lg'
                  ? '0 10px 25px -5px rgba(0,0,0,0.5)'
                  : '0 4px 6px -1px rgba(0,0,0,0.3)',
            }}
          >
            {/* Background Image Layer */}
            {settings.headerImage && (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={settings.headerImage}
                  alt="Custom Header BG"
                  className="w-full h-full object-cover object-center pointer-events-none transition-all"
                  style={{
                    opacity: settings.imageOpacity / 100,
                    mixBlendMode: settings.blendMode,
                    filter: `blur(${settings.blurPx}px)`,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: settings.overlayColor,
                    opacity: settings.overlayOpacity / 100,
                  }}
                />
              </div>
            )}

            {/* Content Box */}
            {settings.showCenterText ? (
              <div className="flex-1 max-w-2xl mx-auto flex flex-col items-center justify-center relative z-10 w-full md:px-12">
                <div
                  className="w-full rounded-2xl py-3 px-5 flex flex-col md:flex-row items-center justify-between gap-3 relative transition-all"
                  style={{
                    backgroundColor: settings.innerBgColor,
                    borderWidth: settings.showInnerBorder && settings.innerBgColor !== 'transparent' ? '1px' : '0px',
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E4772E] border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0">
                      第{stageNumber}關
                    </div>
                    <div>
                      <h3 className="font-black text-[#F4D03F] text-lg md:text-xl tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                        {currentHeaderTitle}
                      </h3>
                      <p className="text-[#FFFDF6] text-[11px] font-bold mt-0.5">
                        {currentHeaderSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4772E] text-white font-black text-xs border border-white shrink-0">
                    <Volume2 className="w-3.5 h-3.5" /> 聽題目
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[90px] w-full" />
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-cyan-500/30 bg-[#071322] px-4 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2.5 rounded-t-xl font-black text-xs md:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'image'
                ? 'bg-[#0D1B2A] text-amber-300 border-t-2 border-x border-amber-400'
                : 'text-cyan-200/70 hover:text-white hover:bg-cyan-950/40'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. 更換背景圖片</span>
          </button>

          <button
            onClick={() => setActiveTab('layer')}
            className={`px-4 py-2.5 rounded-t-xl font-black text-xs md:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'layer'
                ? 'bg-[#0D1B2A] text-amber-300 border-t-2 border-x border-amber-400'
                : 'text-cyan-200/70 hover:text-white hover:bg-cyan-950/40'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. 圖層遮罩與濾鏡</span>
          </button>

          <button
            onClick={() => setActiveTab('frame')}
            className={`px-4 py-2.5 rounded-t-xl font-black text-xs md:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'frame'
                ? 'bg-[#0D1B2A] text-amber-300 border-t-2 border-x border-amber-400'
                : 'text-cyan-200/70 hover:text-white hover:bg-cyan-950/40'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>3. 外框與邊框樣式</span>
          </button>
        </div>

        {/* Body Panel */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: IMAGE REPLACEMENT */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              {/* Local File Upload */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30">
                <label className="block text-sm font-black text-amber-300 mb-2">
                  從本機電腦／手機上傳新圖片
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer hover:brightness-110 transition-all shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>選擇照片檔案...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-cyan-200/60 font-bold">
                    支援 JPG, PNG, WEBP 等常見格式
                  </span>
                </div>
              </div>

              {/* Paste URL */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30">
                <label className="block text-sm font-black text-amber-300 mb-2">
                  或輸入網路圖片網址 (Image URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="貼上圖片連結 https://..."
                    className="flex-1 bg-[#030B17] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-cyan-500/50 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => {
                      if (imageUrlInput.trim()) {
                        handleApplySetting('headerImage', imageUrlInput.trim());
                        setImageUrlInput('');
                      }
                    }}
                    className="px-4 py-2 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 text-xs font-black rounded-xl cursor-pointer"
                  >
                    套用網址
                  </button>
                </div>
              </div>

              {/* Built-in Presets */}
              <div>
                <label className="block text-sm font-black text-amber-300 mb-3">
                  精選預設背景圖庫 (點擊即可更換)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = settings.headerImage === preset.url;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleApplySetting('headerImage', preset.url)}
                        className={`relative rounded-xl overflow-hidden h-24 border-2 transition-all cursor-pointer group text-left ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102'
                            : 'border-cyan-500/30 hover:border-amber-400/60'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-between">
                          <div className="flex justify-end">
                            {isSelected && (
                              <span className="bg-amber-400 text-slate-950 p-1 rounded-full text-xs font-black">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-black text-white drop-shadow-md">
                            {preset.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAYER CONTROLS */}
          {activeTab === 'layer' && (
            <div className="space-y-6">
              {/* Image Opacity */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-amber-300">圖片透明度 (Image Opacity)</span>
                  <span className="text-cyan-300">{settings.imageOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.imageOpacity}
                  onChange={(e) => handleApplySetting('imageOpacity', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Overlay Tint Color */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-3">
                <label className="block text-xs font-black text-amber-300">
                  圖層遮罩顏色 (Overlay Color)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleApplySetting('overlayColor', c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        settings.overlayColor === c
                          ? 'border-amber-400 scale-110 shadow-md ring-2 ring-amber-400/50'
                          : 'border-white/30 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c === 'transparent' ? '#333' : c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Overlay Opacity */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-amber-300">遮罩濃淡程度 (Overlay Opacity)</span>
                  <span className="text-cyan-300">{settings.overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.overlayOpacity}
                  onChange={(e) => handleApplySetting('overlayOpacity', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Blend Mode */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <label className="block text-xs font-black text-amber-300">
                  混合模式 (Blend Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['overlay', 'multiply', 'normal', 'screen', 'darken'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleApplySetting('blendMode', mode)}
                      className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer capitalize ${
                        settings.blendMode === mode
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-cyan-950 text-cyan-200 border-cyan-500/30 hover:bg-cyan-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blur filter */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-amber-300">背景模糊 (Background Blur)</span>
                  <span className="text-cyan-300">{settings.blurPx} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={settings.blurPx}
                  onChange={(e) => handleApplySetting('blurPx', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FRAME & BORDER */}
          {activeTab === 'frame' && (
            <div className="space-y-6">
              {/* Toggle Center Text Overlay */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-amber-300">顯示中間關卡標題與文字 (Center Title Text)</div>
                  <div className="text-xs text-cyan-200/60 font-bold">開啟或關閉橫幅中間的標題文字與聽題目按鈕</div>
                </div>
                <button
                  onClick={() => handleApplySetting('showCenterText', !settings.showCenterText)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.showCenterText ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      settings.showCenterText ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle Outer Border */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-amber-300">顯示外框 (Show Outer Border)</div>
                  <div className="text-xs text-cyan-200/60 font-bold">開啟或關閉橫幅外層輪廓線</div>
                </div>
                <button
                  onClick={() => handleApplySetting('showOuterBorder', !settings.showOuterBorder)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.showOuterBorder ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      settings.showOuterBorder ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Border Color */}
              {settings.showOuterBorder && (
                <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-3">
                  <label className="block text-xs font-black text-amber-300">
                    外框顏色 (Border Color)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleApplySetting('borderColor', c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          settings.borderColor === c
                            ? 'border-amber-400 scale-110 shadow-md ring-2 ring-amber-400/50'
                            : 'border-white/30 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c === 'transparent' ? '#333' : c }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Border Thickness */}
              {settings.showOuterBorder && (
                <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-amber-300">外框粗細 (Border Thickness)</span>
                    <span className="text-cyan-300">{settings.borderWidthPx} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={settings.borderWidthPx}
                    onChange={(e) => handleApplySetting('borderWidthPx', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              )}

              {/* Rounded Corner Radius */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-amber-300">圓角大小 (Border Radius)</span>
                  <span className="text-cyan-300">{settings.borderRadiusPx} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={settings.borderRadiusPx}
                  onChange={(e) => handleApplySetting('borderRadiusPx', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Shadow Style */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                <label className="block text-xs font-black text-amber-300">
                  外框立體陰影 (Outer Shadow)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['none', 'sm', 'md', 'lg', 'glow'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleApplySetting('shadowType', s)}
                      className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer uppercase ${
                        settings.shadowType === s
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-cyan-950 text-cyan-200 border-cyan-500/30 hover:bg-cyan-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inner Title Box Customization */}
              <div className="bg-[#071322] p-4 rounded-2xl border border-amber-400/30 space-y-3">
                <div className="text-sm font-black text-amber-300 flex items-center justify-between">
                  <span>標題字卡內底框 (Inner Card Box)</span>
                  <button
                    onClick={() =>
                      handleApplySetting(
                        'innerBgColor',
                        settings.innerBgColor === 'transparent' ? 'rgba(74, 40, 16, 0.85)' : 'transparent'
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                      settings.innerBgColor !== 'transparent'
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-600'
                    }`}
                  >
                    {settings.innerBgColor !== 'transparent' ? '已啟用內底框' : '無底框 (透明無遮擋)'}
                  </button>
                </div>

                {settings.innerBgColor !== 'transparent' && (
                  <div className="space-y-3 pt-2 border-t border-cyan-500/20">
                    <label className="block text-xs font-black text-cyan-200">內底框顏色</label>
                    <div className="flex flex-wrap gap-2">
                      {['rgba(74, 40, 16, 0.85)', 'rgba(0, 0, 0, 0.75)', 'rgba(15, 23, 42, 0.85)', 'rgba(255, 255, 255, 0.15)', 'transparent'].map((c) => (
                        <button
                          key={c}
                          onClick={() => handleApplySetting('innerBgColor', c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                            settings.innerBgColor === c
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-cyan-950 text-cyan-200 border-cyan-500/30 hover:bg-cyan-900'
                          }`}
                        >
                          {c === 'transparent' ? '透明' : c.startsWith('rgba(74') ? '復古木色' : c.startsWith('rgba(0') ? '深黑半透' : '藍灰色'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cyan-500/30 bg-[#071322] flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>恢復預設樣式</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs md:text-sm hover:brightness-110 shadow-md transition-all cursor-pointer"
          >
            完成並儲存 (Save & Apply)
          </button>
        </div>
      </div>
    </div>
  );
}
