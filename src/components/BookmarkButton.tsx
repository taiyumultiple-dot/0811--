import { useState, useEffect } from 'react';
import { Bookmark, Heart } from 'lucide-react';
import { isFavorite, toggleFavorite, FavoriteWord } from '../lib/favoriteStore';

interface BookmarkButtonProps {
  word: Omit<FavoriteWord, 'addedAt'>;
  variant?: 'heart' | 'bookmark' | 'badge';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function BookmarkButton({
  word,
  variant = 'bookmark',
  size = 'md',
  className = '',
  showText = false,
}: BookmarkButtonProps) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (word.hanzi && word.tailo) {
      setFav(isFavorite(word.hanzi, word.tailo));
    }
  }, [word.hanzi, word.tailo]);

  useEffect(() => {
    const handleUpdate = () => {
      if (word.hanzi && word.tailo) {
        setFav(isFavorite(word.hanzi, word.tailo));
      }
    };
    window.addEventListener('tai_lo_favorites_updated', handleUpdate);
    return () => window.removeEventListener('tai_lo_favorites_updated', handleUpdate);
  }, [word.hanzi, word.tailo]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!word.hanzi || !word.tailo) return;
    const nextState = toggleFavorite(word);
    setFav(nextState);
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'badge') {
    return (
      <button
        onClick={handleToggle}
        type="button"
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
          fav
            ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
            : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
        } ${className}`}
        title={fav ? '已加入單字本 (點擊取消)' : '收藏到單字本'}
      >
        <Bookmark className={`${iconSizes[size]} ${fav ? 'fill-amber-500 text-amber-500' : ''}`} />
        <span>{fav ? '已收藏' : '收藏'}</span>
      </button>
    );
  }

  const Icon = variant === 'heart' ? Heart : Bookmark;

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
        fav
          ? variant === 'heart'
            ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
            : 'text-amber-500 bg-amber-50 hover:bg-amber-100'
          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
      } ${className}`}
      title={fav ? '已加入單字本 (點擊取消)' : '收藏到單字本'}
    >
      <Icon
        className={`${iconSizes[size]} ${
          fav ? (variant === 'heart' ? 'fill-rose-500' : 'fill-amber-500') : ''
        }`}
      />
      {showText && <span className="text-xs font-bold">{fav ? '已收藏' : '收藏'}</span>}
    </button>
  );
}
