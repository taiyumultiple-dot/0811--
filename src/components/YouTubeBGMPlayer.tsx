import { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, Youtube, Minimize2, Maximize2, Radio, Sparkles } from 'lucide-react';

interface YouTubeBGMPlayerProps {
  videoId?: string;
  autoplay?: boolean;
}

export default function YouTubeBGMPlayer({
  videoId = '24Yv0M8T53c',
  autoplay = true
}: YouTubeBGMPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Construct iframe embed URL with loop and JS API parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=1&playlist=${videoId}&enablejsapi=1&origin=${encodeURIComponent(
    window.location.origin
  )}`;

  const togglePlay = () => {
    if (!iframeRef.current) return;
    const command = isPlaying ? 'pauseVideo' : 'playVideo';
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      '*'
    );
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!iframeRef.current) return;
    const command = isMuted ? 'unMute' : 'mute';
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: [] }),
      '*'
    );
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-[#071322] border-2 border-cyan-400 rounded-3xl p-4 md:p-5 shadow-[0_0_25px_rgba(2,132,199,0.3)] text-white relative overflow-hidden my-3">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-950 border border-rose-500/60 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Youtube className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300 text-[11px] font-black flex items-center gap-1">
                <Radio className="w-3 h-3 text-rose-400 animate-spin" /> 官方 YouTube 首頁背景音樂
              </span>
              {isPlaying && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> 播放中
                </span>
              )}
            </div>
            <h3 className="font-black text-base md:text-lg text-white mt-0.5 flex items-center gap-2">
              <span>經典台語氛圍主題曲</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
          </div>
        </div>

        {/* Quick Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? '暫停音樂' : '播放背景音'}</span>
          </button>

          <button
            onClick={toggleMute}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                : 'bg-cyan-950 border-cyan-400 text-cyan-200 hover:bg-cyan-900'
            }`}
            title={isMuted ? '開啟聲音' : '靜音'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? '靜音中' : '聲音開啟'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:border-cyan-300 transition-colors cursor-pointer"
            title={isExpanded ? '縮小影片視窗' : '展開影片畫面'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded YouTube Video Container */}
      <div
        className={`w-full transition-all duration-300 overflow-hidden rounded-2xl border border-cyan-500/30 bg-black/80 ${
          isExpanded ? 'h-[280px] md:h-[360px] opacity-100' : 'h-[180px] md:h-[220px] opacity-95'
        }`}
      >
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full rounded-2xl"
        ></iframe>
      </div>

      {/* Music info footer */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-cyan-200/80 font-bold">
        <span className="flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-amber-300" /> YouTube 影音代碼：<code className="text-amber-300 font-mono">24Yv0M8T53c</code>
        </span>
        <span className="text-[11px] text-emerald-300 font-black">
          ✨ 本首曲目已同步設為網站首頁背景音樂
        </span>
      </div>
    </div>
  );
}
