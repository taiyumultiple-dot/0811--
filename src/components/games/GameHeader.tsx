import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { getHeaderTheme, HeaderThemeSettings } from '../../lib/headerThemeStore';

interface GameHeaderProps {
  stageNumber: number;
  title: string;
  subtitle: string;
  onSpeakQuestion?: () => void;
  headerImage?: string;
}

export function GameHeader({
  stageNumber,
  title,
  subtitle,
  onSpeakQuestion,
  headerImage: defaultHeaderImage,
}: GameHeaderProps) {
  const [theme, setTheme] = useState<HeaderThemeSettings>(getHeaderTheme());

  useEffect(() => {
    const handleUpdate = () => {
      setTheme(getHeaderTheme());
    };
    window.addEventListener('tai_lo_header_theme_updated', handleUpdate);
    return () => window.removeEventListener('tai_lo_header_theme_updated', handleUpdate);
  }, []);

  const activeImage = theme.headerImage || defaultHeaderImage;

  return (
    <div
      className="relative overflow-hidden flex items-center justify-between select-none mb-4 transition-all duration-300 min-h-[140px] md:min-h-[180px] rounded-3xl shadow-lg border-2 border-amber-300/60 bg-[#3D1E0A]"
      style={{
        borderRadius: `${theme.borderRadiusPx || 24}px`,
        borderWidth: theme.showOuterBorder ? `${theme.borderWidthPx}px` : '2px',
        borderColor: theme.borderColor || '#F59E0B',
      }}
    >
      {/* Background Image Layer (Clean, Full Banner) */}
      {activeImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={activeImage}
            alt={title}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-300"
            style={{
              opacity: (theme.imageOpacity ?? 100) / 100,
              mixBlendMode: theme.blendMode || 'normal',
              filter: `blur(${theme.blurPx || 0}px)`,
            }}
          />
        </div>
      )}

      {/* Floating Listen Question Button if present */}
      {onSpeakQuestion && (
        <button
          onClick={onSpeakQuestion}
          className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E4772E] text-white font-black text-xs md:text-sm border-2 border-white hover:bg-[#CC6620] active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
          <span>聽題目</span>
        </button>
      )}
    </div>
  );
}


