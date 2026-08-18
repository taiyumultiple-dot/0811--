import { useEffect, useRef } from 'react';
import { isBGMActive, getBGMVolume } from '../utils/soundEffects';

interface BackgroundYouTubeAudioProps {
  videoId?: string;
}

export default function BackgroundYouTubeAudio({ videoId = '24Yv0M8T53c' }: BackgroundYouTubeAudioProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // autoplay=0 + mute=1：一進站不出聲，等使用者自己按下「背景音樂」才 unMute 播放
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&mute=1&loop=1&playlist=${videoId}&origin=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.origin : ''
  )}`;

  useEffect(() => {
    const handleBgmChange = (e: Event) => {
      const customEvt = e as CustomEvent;
      const { playing, volume } = customEvt.detail || {};

      if (!iframeRef.current) return;

      const targetVol = volume !== undefined ? volume : getBGMVolume();

      if (playing) {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*'
        );
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [targetVol] }),
          '*'
        );
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      } else {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      }
    };

    // Initial state check after iframe load
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const active = isBGMActive();
        const currentVol = getBGMVolume();
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [currentVol] }),
          '*'
        );
        if (active) {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
            '*'
          );
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        } else {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
            '*'
          );
        }
      }
    }, 1200);

    window.addEventListener('bgm-state-changed', handleBgmChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('bgm-state-changed', handleBgmChange);
    };
  }, []);

  return (
    <div className="sr-only fixed -top-[9999px] -left-[9999px] w-1 h-1 overflow-hidden pointer-events-none opacity-0 z-0" aria-hidden="true">
      <iframe
        ref={iframeRef}
        width="1"
        height="1"
        src={embedUrl}
        title="Background Music Stream"
        frameBorder="0"
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>
  );
}
