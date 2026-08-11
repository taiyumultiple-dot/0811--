import React from 'react';

interface FoodIllustrationProps {
  id: string;
  className?: string;
}

export const FoodIllustration: React.FC<FoodIllustrationProps> = ({ id, className = "w-full h-full" }) => {
  switch (id) {
    case 'baw': // 肉圓 (Translucent Taiwanese Meatball)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="72" rx="40" ry="12" fill="#E6DED0" stroke="#7C6B58" strokeWidth="2" />
          <ellipse cx="50" cy="71" rx="36" ry="9" fill="#FBF9F6" />
          <ellipse cx="50" cy="55" rx="25" ry="15" fill="#BF563B" opacity="0.25" />
          <circle cx="50" cy="48" r="23" fill="url(#bawGlass)" stroke="#D7CCC8" strokeWidth="1" />
          <circle cx="48" cy="48" r="11" fill="#795548" opacity="0.4" filter="blur(1px)" />
          <circle cx="55" cy="45" r="7" fill="#8D6E63" opacity="0.35" filter="blur(1px)" />
          <path d="M36 46 C40 41, 47 38, 51 40 C55 42, 51 51, 57 53 C63 55, 66 47, 66 51 C66 57, 47 61, 36 53 Z" fill="url(#bawSauce)" />
          <path d="M43 36 Q45 33 48 37 Q44 40 43 36" fill="#4CAF50" />
          <path d="M54 34 Q57 30 60 33 Q56 38 54 34" fill="#388E3C" />
          <path d="M48 50 Q50 47 53 49 Q50 53 48 50" fill="#2E7D32" />
          <line x1="15" y1="65" x2="85" y2="35" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="68" x2="82" y2="38" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
          <defs>
            <radialGradient id="bawGlass" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FFF2E6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E5DAC5" stopOpacity="0.65" />
            </radialGradient>
            <linearGradient id="bawSauce" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4511E" />
              <stop offset="50%" stopColor="#E64A19" />
              <stop offset="100%" stopColor="#D84315" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'tauhue': // 豆花 (Silken Tofu Pudding)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="74" rx="36" ry="8" fill="#D7CCC8" opacity="0.6" />
          <path d="M18 45 C18 45, 18 71, 50 71 C82 71, 82 45, 82 45 Z" fill="#F5F5F5" stroke="#3A6073" strokeWidth="3" />
          <path d="M18 45 C30 49, 70 49, 82 45 C70 41, 30 41, 18 45 Z" fill="#E0F7FA" stroke="#3A6073" strokeWidth="2" />
          <path d="M28 55 C35 60, 42 62, 50 62 C58 62, 65 60, 72 55" stroke="#1976D2" strokeWidth="2" fill="none" strokeDasharray="3 3" />
          <ellipse cx="50" cy="47" rx="30" ry="4" fill="#A1887F" />
          <path d="M24 46 C28 44, 38 44, 45 46 C40 48, 28 48, 24 46 Z" fill="#FFFFFF" opacity="0.95" />
          <path d="M38 45 C45 42, 58 42, 64 45 C58 48, 45 48, 38 45 Z" fill="#FFFFFF" opacity="0.98" />
          <path d="M50 48 C56 46, 68 46, 74 48 C68 50, 56 50, 50 48 Z" fill="#FFFBF0" opacity="0.9" />
          <circle cx="32" cy="48" r="3.5" fill="#212121" />
          <circle cx="38" cy="49" r="3.2" fill="#3E2723" />
          <circle cx="28" cy="49" r="3" fill="#212121" />
          <ellipse cx="62" cy="47" rx="3" ry="1.8" fill="#FFE082" />
          <ellipse cx="68" cy="48" rx="2.8" ry="1.5" fill="#FFD54F" />
          <ellipse cx="58" cy="49" rx="2.5" ry="1.5" fill="#FFE082" />
          <path d="M55 45 Q62 48 70 35 Q78 22 80 18 C82 16, 84 18, 82 20 L72 38 Q65 48 55 46 Z" fill="#B0BEC5" stroke="#37474F" strokeWidth="1" />
        </svg>
      );

    case 'bemtsuk': // 鹹粥 (Savory Rice Porridge)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="74" rx="32" ry="7" fill="#D7CCC8" opacity="0.6" />
          <path d="M20 48 C20 48, 22 72, 50 72 C78 72, 80 48, 80 48 Z" fill="#FFF9C4" stroke="#8D6E63" strokeWidth="2.5" />
          <path d="M20 48 C30 51, 70 51, 80 48 C70 45, 30 45, 20 48 Z" fill="#FFFDE7" stroke="#8D6E63" strokeWidth="2" />
          <ellipse cx="50" cy="49" rx="28" ry="3" fill="#FFFDE7" />
          <ellipse cx="38" cy="49" rx="1.5" ry="0.8" fill="#FFFFFF" />
          <ellipse cx="44" cy="48" rx="1.8" ry="0.9" fill="#FFFFFF" />
          <ellipse cx="52" cy="50" rx="1.5" ry="0.8" fill="#FFFFFF" />
          <ellipse cx="62" cy="49" rx="1.7" ry="0.9" fill="#FFFFFF" />
          <path d="M32 48 L35 49" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M48 49 L51 48" stroke="#D84315" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M58 48 L60 50" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="50" r="1.2" fill="#4CAF50" />
          <circle cx="42" cy="48" r="1" fill="#81C784" />
          <circle cx="55" cy="49" r="1.3" fill="#2E7D32" />
          <circle cx="65" cy="49" r="1" fill="#4CAF50" />
          <path d="M45 47 Q48 43 51 46 Q53 49 50 51" fill="#FF8A80" stroke="#FF5252" strokeWidth="0.8" />
          <path d="M42 35 Q45 28 43 20" stroke="#8D6E63" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M52 38 Q55 30 53 22" stroke="#8D6E63" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
        </svg>
      );

    case 'junbiann': // 潤餅 (Popiah / Crepe Roll)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="75" rx="35" ry="7" fill="#D7CCC8" opacity="0.5" />
          <path d="M18 55 C18 55, 30 32, 65 36 C72 37, 82 45, 82 52 C82 58, 70 66, 62 67 C35 70, 18 55, 18 55 Z" fill="#FBF4E6" stroke="#D7CCC8" strokeWidth="2" />
          <path d="M35 48 C42 46, 52 48, 58 52" stroke="#E0D5C1" strokeWidth="1.5" fill="none" />
          <path d="M48 56 C53 54, 62 56, 66 60" stroke="#E0D5C1" strokeWidth="1.5" fill="none" />
          <ellipse cx="38" cy="50" rx="4" ry="2" fill="#D7A15C" opacity="0.4" />
          <ellipse cx="55" cy="54" rx="5" ry="2.5" fill="#D7A15C" opacity="0.45" />
          <ellipse cx="68" cy="46" rx="3" ry="1.5" fill="#D7A15C" opacity="0.3" />
          <path d="M18 55 C16 52, 17 48, 22 45 C27 42, 30 46, 28 52 Z" fill="#795548" />
          <ellipse cx="22" cy="48" rx="4" ry="2.5" fill="#FFB74D" />
          <path d="M19 49 Q22 46 25 51" stroke="#81C784" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="20" y="50" width="5" height="2" rx="1" fill="#E53935" transform="rotate(-15 20 50)" />
          <line x1="22" y1="46" x2="25" y2="47" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'gerpiann': // 月餅 (Golden Baked Mooncake)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="72" rx="36" ry="10" fill="#D7CCC8" opacity="0.6" />
          <path d="M16 52 C16 40, 30 30, 50 30 C70 30, 84 40, 84 52 C84 64, 70 70, 50 70 C30 70, 16 64, 16 52 Z" fill="url(#mooncakeGold)" stroke="#A1887F" strokeWidth="2" />
          <path d="M22 52 C22 43, 33 34, 50 34 C67 34, 78 43, 78 52 C78 61, 67 66, 50 66 C33 66, 22 61, 22 52 Z" stroke="#8D6E63" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="#8D6E63" strokeWidth="1.5" />
          <path d="M47 45 L53 45 M50 45 L50 55 M46 51 L54 51" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M25 45 C32 40, 42 38, 50 38" stroke="#FFE082" strokeWidth="1" fill="none" opacity="0.6" />
          <defs>
            <radialGradient id="mooncakeGold" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="60%" stopColor="#F5B041" />
              <stop offset="100%" stopColor="#B7950B" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'tsuanntsa': // 串炸 (Crispy Kushikatsu Skewers)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="72" rx="38" ry="10" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1.5" />
          <line x1="18" y1="78" x2="68" y2="28" stroke="#D7CCC8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="32" y="52" width="12" height="12" rx="3" fill="#D35400" stroke="#A04000" strokeWidth="1" transform="rotate(-45 38 58)" />
          <rect x="42" y="42" width="12" height="12" rx="3" fill="#E67E22" stroke="#A04000" strokeWidth="1" transform="rotate(-45 48 48)" />
          <rect x="52" y="32" width="12" height="12" rx="3" fill="#D35400" stroke="#A04000" strokeWidth="1" transform="rotate(-45 58 38)" />
          <circle cx="36" cy="56" r="1" fill="#FED766" />
          <circle cx="48" cy="46" r="1.2" fill="#FED766" />
          <circle cx="56" cy="36" r="1" fill="#FED766" />
          <line x1="26" y1="68" x2="82" y2="38" stroke="#D7CCC8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="40" y="48" width="11" height="11" rx="3" fill="#CA6F1E" stroke="#935116" strokeWidth="1" transform="rotate(-25 45 53)" />
          <rect x="50" y="43" width="11" height="11" rx="3" fill="#E67E22" stroke="#935116" strokeWidth="1" transform="rotate(-25 55 48)" />
          <rect x="60" y="38" width="11" height="11" rx="3" fill="#CA6F1E" stroke="#935116" strokeWidth="1" transform="rotate(-25 65 43)" />
          <path d="M38 52 Q44 48 50 54 Q56 60 62 52" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.95" />
          <path d="M48 40 Q54 36 60 42" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.95" />
        </svg>
      );

    case 'uaakue': // 碗粿 (Savory Rice Cake)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="74" rx="34" ry="7" fill="#D7CCC8" opacity="0.6" />
          <path d="M16 44 C16 44, 20 70, 50 70 C80 70, 84 44, 84 44 Z" fill="#F5F5F5" stroke="#455A64" strokeWidth="3" />
          <path d="M16 44 C28 47, 72 47, 84 44 C72 41, 28 41, 16 44 Z" fill="#ECEFF1" stroke="#455A64" strokeWidth="1.5" />
          <ellipse cx="50" cy="46" rx="31" ry="3.5" fill="#E0D5C1" />
          <path d="M50 46 L30 46 C34 48, 46 48, 50 46 Z" fill="#BCAAA4" opacity="0.8" />
          <path d="M50 46 L62 48 C58 49, 52 48, 50 46 Z" fill="#BCAAA4" opacity="0.8" />
          <path d="M38 46 C42 45, 48 43, 52 45 C56 47, 54 52, 48 51 C44 50, 40 48, 38 46 Z" fill="#5D4037" />
          <path d="M46 44 Q49 41 52 43 Q50 46 46 44" fill="#3E2723" />
          <circle cx="56" cy="46" r="2.5" fill="#FFB300" />
          <circle cx="55.5" cy="45.5" r="1" fill="#FFD54F" />
        </svg>
      );

    case 'tshangyupiann': // 蔥油餅 (Scallion Pancake)
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="75" rx="36" ry="8" fill="#D7CCC8" opacity="0.6" />
          <ellipse cx="50" cy="72" rx="33" ry="11" fill="#EEDC82" stroke="#C5B358" strokeWidth="1.5" />
          <ellipse cx="50" cy="72" rx="29" ry="8" fill="#FFF8DC" stroke="#C5B358" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M22 62 L60 40 L44 68 Z" fill="#D4AC0D" stroke="#9A7D0A" strokeWidth="1" />
          <path d="M30 65 L68 38 L54 70 Z" fill="#F4D03F" stroke="#9A7D0A" strokeWidth="1" />
          <path d="M38 58 L78 35 L62 66 Z" fill="url(#pancakeGold)" stroke="#B7950B" strokeWidth="1.5" />
          <path d="M45 53 C52 48, 62 42, 70 42" stroke="#9A7D0A" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M52 58 C58 53, 65 48, 72 48" stroke="#9A7D0A" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M44 54 Q46 51 48 53" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M56 46 Q58 44 60 46" stroke="#2E7D32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M68 39 Q70 37 72 39" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M52 52 Q54 50 56 52" stroke="#81C784" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M64 54 Q66 52 68 54" stroke="#2E7D32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="48" cy="49" rx="3.5" ry="1.5" fill="#7E5109" opacity="0.4" transform="rotate(-30 48 49)" />
          <ellipse cx="62" cy="43" rx="4" ry="2" fill="#7E5109" opacity="0.45" transform="rotate(-30 62 43)" />
          <defs>
            <linearGradient id="pancakeGold" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#F4D03F" />
              <stop offset="60%" stopColor="#F5B041" />
              <stop offset="100%" stopColor="#D35400" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl rounded-xl">
          🍲
        </div>
      );
  }
};
