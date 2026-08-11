// High-fidelity SVG game UI mockups matching official screenshots for Game Selection Hub

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim().replace(/\s+/g, ' '))}`;
}

// 01. 太空台語生存戰
export const game1Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0B1021"/>
      <stop offset="100%" stop-color="#050811"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="laserGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0"/>
      <stop offset="100%" stop-color="#FBBF24" stop-opacity="1"/>
    </linearGradient>
    <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="360" rx="16" fill="url(#bg1)"/>
  
  <!-- Stars -->
  <circle cx="50" cy="80" r="1.5" fill="#60A5FA" opacity="0.8"/>
  <circle cx="120" cy="180" r="1" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="280" cy="90" r="2" fill="#FBBF24" opacity="0.9"/>
  <circle cx="450" cy="220" r="1.5" fill="#38BDF8" opacity="0.7"/>
  <circle cx="530" cy="110" r="1" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="80" cy="300" r="2" fill="#A7F3D0" opacity="0.6"/>
  <circle cx="380" cy="320" r="1" fill="#F472B6" opacity="0.8"/>

  <!-- Top HUD Bar -->
  <rect x="12" y="12" width="576" height="52" rx="12" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
  
  <!-- HUD: Left Time Badge -->
  <rect x="22" y="22" width="100" height="32" rx="8" fill="#3B1A0E" stroke="#EA580C" stroke-width="1"/>
  <text x="30" y="42" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#FB923C" font-weight="bold">存活時間</text>
  <text x="74" y="43" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#F97316" font-weight="900">8.28s</text>

  <!-- HUD: Center Question Box -->
  <rect x="130" y="20" width="310" height="36" rx="10" fill="#1E3A8A" stroke="#3B82F6" stroke-width="1"/>
  <circle cx="148" cy="38" r="10" fill="#3B82F6"/>
  <text x="148" y="42" font-family="sans-serif" font-size="10" fill="#FFFFFF" text-anchor="middle">🔊</text>
  <text x="165" y="36" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#93C5FD" font-weight="bold">題目任務：請找出「麵茶」的台語說法</text>
  <text x="165" y="49" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#60A5FA">台語主題：鹿港美食</text>

  <!-- HUD: Right Stats -->
  <text x="450" y="35" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#38BDF8" font-weight="bold">分數 <tspan fill="#FBBF24" font-weight="900">120</tspan></text>
  <text x="450" y="49" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#EF4444">生命 ❤️❤️❤️❤️❤️</text>
  <rect x="532" y="24" width="46" height="28" rx="6" fill="#065F46"/>
  <text x="555" y="42" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#34D399" font-weight="900" text-anchor="middle">x4</text>

  <!-- Center Planets / Asteroids Cards -->

  <!-- Card 1: 麵茶 (Target Hit) -->
  <g transform="translate(140, 110)">
    <circle cx="50" cy="40" r="46" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5" filter="url(#glow1)"/>
    <circle cx="50" cy="40" r="40" fill="#0F172A"/>
    <text x="50" y="34" font-family="Noto Sans TC, sans-serif" font-size="16" fill="#FFFFFF" font-weight="900" text-anchor="middle">麵茶</text>
    <text x="50" y="52" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#38BDF8" font-weight="bold" text-anchor="middle">mī-tê</text>
  </g>

  <!-- Card 2: 麻粩 -->
  <g transform="translate(370, 120)">
    <circle cx="45" cy="40" r="42" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
    <circle cx="45" cy="40" r="36" fill="#0F172A"/>
    <text x="45" y="34" font-family="Noto Sans TC, sans-serif" font-size="15" fill="#E2E8F0" font-weight="bold" text-anchor="middle">麻粩</text>
    <text x="45" y="51" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">muâ-láu</text>
  </g>

  <!-- Card 3: 圓仔湯 -->
  <g transform="translate(100, 230)">
    <circle cx="45" cy="40" r="42" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
    <circle cx="45" cy="40" r="36" fill="#0F172A"/>
    <text x="45" y="34" font-family="Noto Sans TC, sans-serif" font-size="14" fill="#E2E8F0" font-weight="bold" text-anchor="middle">圓仔湯</text>
    <text x="45" y="51" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#94A3B8" text-anchor="middle">înn-á-thng</text>
  </g>

  <!-- Card 4: 牛舌餅 -->
  <g transform="translate(390, 240)">
    <circle cx="45" cy="40" r="42" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
    <circle cx="45" cy="40" r="36" fill="#0F172A"/>
    <text x="45" y="34" font-family="Noto Sans TC, sans-serif" font-size="14" fill="#E2E8F0" font-weight="bold" text-anchor="middle">牛舌餅</text>
    <text x="45" y="51" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#94A3B8" text-anchor="middle">gû-tsi̍h-piánn</text>
  </g>

  <!-- Laser Beams -->
  <line x1="280" y1="280" x2="190" y2="175" stroke="#FBBF24" stroke-width="3" stroke-dasharray="6 3" opacity="0.8"/>

  <!-- Rocket Ship -->
  <g transform="translate(260, 275) rotate(-25)">
    <!-- Jet Flame -->
    <polygon points="12,45 20,62 28,45" fill="#F97316"/>
    <polygon points="15,45 20,55 25,45" fill="#FBBF24"/>
    <!-- Wings -->
    <path d="M5,25 L0,40 L12,35 Z" fill="#EF4444"/>
    <path d="M35,25 L40,40 L28,35 Z" fill="#EF4444"/>
    <!-- Body -->
    <path d="M20,0 C30,12 32,30 28,42 L12,42 C8,30 10,12 20,0 Z" fill="#E2E8F0"/>
    <!-- Cockpit -->
    <circle cx="20" cy="18" r="6" fill="#38BDF8"/>
    <!-- Accent Line -->
    <rect x="14" y="28" width="12" height="4" fill="#3B82F6"/>
  </g>

  <!-- Bottom Info Badge -->
  <rect x="16" y="322" width="140" height="24" rx="12" fill="#1E293B" opacity="0.8"/>
  <text x="86" y="338" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#CBD5E1" font-weight="bold" text-anchor="middle">拖曳戰機 · 撞擊答題</text>
</svg>
`);

// 02. 臺羅聲韻打磚王
export const game2Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#080C16"/>
      <stop offset="100%" stop-color="#02040A"/>
    </linearGradient>
  </defs>

  <rect width="600" height="360" rx="16" fill="url(#bg2)"/>
  
  <!-- Top HUD Bar -->
  <rect x="12" y="12" width="576" height="44" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
  <text x="28" y="38" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#FBBF24" font-weight="900">分數 028750</text>
  <text x="140" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#EF4444">生命 ❤️❤️❤️</text>

  <rect x="220" y="20" width="220" height="28" rx="8" fill="#1E3A8A"/>
  <text x="330" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#60A5FA" font-weight="bold" text-anchor="middle">聽音擊磚：麵茶 (mī-tê)</text>

  <!-- Mascot Avatar Box -->
  <rect x="460" y="18" width="116" height="32" rx="8" fill="#1E293B" stroke="#334155"/>
  <text x="518" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#A7F3D0" font-weight="bold" text-anchor="middle">🦖 聲韻導航員</text>

  <!-- Brick Grid Matrix -->
  <!-- Row 1 -->
  <g transform="translate(40, 75)">
    <rect x="0" y="0" width="75" height="30" rx="6" fill="#1D4ED8" stroke="#60A5FA" stroke-width="1"/>
    <text x="37" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">mī</text>

    <rect x="85" y="0" width="75" height="30" rx="6" fill="#047857" stroke="#34D399" stroke-width="1"/>
    <text x="122" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">tê</text>

    <rect x="170" y="0" width="75" height="30" rx="6" fill="#B91C1C" stroke="#F87171" stroke-width="1"/>
    <text x="207" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">muâ</text>

    <rect x="255" y="0" width="75" height="30" rx="6" fill="#B45309" stroke="#FBBF24" stroke-width="1"/>
    <text x="292" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">láu</text>

    <rect x="340" y="0" width="75" height="30" rx="6" fill="#6D28D9" stroke="#C084FC" stroke-width="1"/>
    <text x="377" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">înn</text>

    <rect x="425" y="0" width="75" height="30" rx="6" fill="#0369A1" stroke="#38BDF8" stroke-width="1"/>
    <text x="462" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">gû</text>
  </g>

  <!-- Row 2 -->
  <g transform="translate(40, 115)">
    <rect x="0" y="0" width="75" height="30" rx="6" fill="#6D28D9" stroke="#C084FC" stroke-width="1"/>
    <text x="37" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">tsi̍h</text>

    <rect x="85" y="0" width="75" height="30" rx="6" fill="#B45309" stroke="#FBBF24" stroke-width="1"/>
    <text x="122" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">piánn</text>

    <rect x="170" y="0" width="75" height="30" rx="6" fill="#047857" stroke="#34D399" stroke-width="1"/>
    <text x="207" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">tshia</text>

    <rect x="255" y="0" width="75" height="30" rx="6" fill="#1D4ED8" stroke="#60A5FA" stroke-width="1"/>
    <text x="292" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">lōo</text>

    <rect x="340" y="0" width="75" height="30" rx="6" fill="#B91C1C" stroke="#F87171" stroke-width="1"/>
    <text x="377" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">miō</text>

    <rect x="425" y="0" width="75" height="30" rx="6" fill="#0369A1" stroke="#38BDF8" stroke-width="1"/>
    <text x="462" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">hāng</text>
  </g>

  <!-- Row 3 Special Power Blocks -->
  <g transform="translate(40, 155)">
    <rect x="0" y="0" width="75" height="30" rx="6" fill="#334155" stroke="#64748B" stroke-width="1"/>
    <text x="37" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#94A3B8" font-weight="bold" text-anchor="middle">⚡ 加速</text>

    <rect x="85" y="0" width="75" height="30" rx="6" fill="#1D4ED8" stroke="#60A5FA" stroke-width="1"/>
    <text x="122" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">mī</text>

    <rect x="170" y="0" width="75" height="30" rx="6" fill="#334155" stroke="#64748B" stroke-width="1"/>
    <text x="207" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#94A3B8" font-weight="bold" text-anchor="middle">💣 炸彈</text>

    <rect x="255" y="0" width="75" height="30" rx="6" fill="#047857" stroke="#34D399" stroke-width="1"/>
    <text x="292" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">tê</text>

    <rect x="340" y="0" width="75" height="30" rx="6" fill="#334155" stroke="#64748B" stroke-width="1"/>
    <text x="377" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#94A3B8" font-weight="bold" text-anchor="middle">🛡️ 護盾</text>

    <rect x="425" y="0" width="75" height="30" rx="6" fill="#B45309" stroke="#FBBF24" stroke-width="1"/>
    <text x="462" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="bold" text-anchor="middle">láu</text>
  </g>

  <!-- Laser Ball Trajectory & Ball -->
  <line x1="280" y1="305" x2="210" y2="190" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="4 3"/>
  <circle cx="210" cy="190" r="7" fill="#06B6D4"/>
  <circle cx="210" cy="190" r="11" fill="#06B6D4" opacity="0.3"/>

  <!-- Player Paddle at Bottom -->
  <rect x="220" y="310" width="120" height="14" rx="7" fill="#06B6D4" stroke="#22D3EE" stroke-width="2"/>
  <rect x="260" y="313" width="40" height="8" rx="4" fill="#E0F2FE"/>
</svg>
`);

// 03. 臺語太空礦場 (Game 4)
export const game3Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="100%" stop-color="#1C2541"/>
    </linearGradient>
  </defs>

  <rect width="600" height="360" rx="16" fill="url(#bg3)"/>

  <!-- Moon Surface Rocks Bottom -->
  <path d="M0,240 Q150,220 300,250 T600,230 L600,360 L0,360 Z" fill="#3A506B"/>
  <ellipse cx="120" cy="280" rx="35" ry="12" fill="#1C2541" opacity="0.6"/>
  <ellipse cx="480" cy="290" rx="50" ry="16" fill="#1C2541" opacity="0.6"/>

  <!-- Top HUD Bar -->
  <rect x="12" y="12" width="576" height="44" rx="10" fill="#0B132B" stroke="#3A506B" stroke-width="1.5"/>
  <text x="25" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#FBBF24" font-weight="900">資金 $120</text>
  <text x="105" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#38BDF8" font-weight="900">礦石 $450</text>

  <rect x="185" y="20" width="230" height="28" rx="8" fill="#1E293B" stroke="#3B82F6"/>
  <text x="300" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#60A5FA" font-weight="bold" text-anchor="middle">聽音任務：牛舌餅 (gû-tsi̍h-piánn)</text>

  <text x="435" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#F43F5E" font-weight="900">時間 58s</text>
  <text x="520" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#10B981" font-weight="900">等級 1</text>

  <!-- Mechanical Crane Mechanism Top Center -->
  <rect x="280" y="56" width="40" height="20" rx="4" fill="#64748B"/>
  <!-- Crane Cable -->
  <line x1="300" y1="76" x2="220" y2="180" stroke="#94A3B8" stroke-width="2.5"/>

  <!-- Crane Claw grabbing a glowing ore -->
  <g transform="translate(220, 180) rotate(20)">
    <path d="M-12,0 C-15,15 -5,25 0,22 C5,25 15,15 12,0 Z" fill="#CBD5E1"/>
    <!-- Grabbed Ore -->
    <polygon points="0,15 -18,35 0,50 18,35" fill="#F59E0B" stroke="#FBBF24" stroke-width="2"/>
    <text x="0" y="38" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#FFFFFF" font-weight="900" text-anchor="middle">牛舌餅</text>
  </g>

  <!-- Ores on Ground -->
  <!-- Ore 1: 麵茶 -->
  <g transform="translate(100, 260)">
    <polygon points="0,-15 -25,10 -10,25 20,20 25,-5" fill="#475569" stroke="#64748B" stroke-width="1.5"/>
    <text x="0" y="5" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#E2E8F0" font-weight="bold" text-anchor="middle">麵茶</text>
  </g>

  <!-- Ore 2: 麻粩 -->
  <g transform="translate(280, 280)">
    <polygon points="0,-20 -30,12 -12,30 25,22 30,-10" fill="#475569" stroke="#64748B" stroke-width="1.5"/>
    <text x="0" y="5" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#E2E8F0" font-weight="bold" text-anchor="middle">麻粩</text>
  </g>

  <!-- Ore 3: 圓仔湯 -->
  <g transform="translate(420, 265)">
    <polygon points="0,-18 -22,10 -8,22 22,18 22,-8" fill="#475569" stroke="#64748B" stroke-width="1.5"/>
    <text x="0" y="5" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#E2E8F0" font-weight="bold" text-anchor="middle">圓仔湯</text>
  </g>

  <!-- Astronaut Cat Miner on Right -->
  <g transform="translate(520, 220)">
    <circle cx="20" cy="20" r="22" fill="#E2E8F0"/>
    <circle cx="20" cy="20" r="17" fill="#0284C7"/>
    <text x="20" y="25" font-family="sans-serif" font-size="18" text-anchor="middle">🐱</text>
    <rect x="5" y="42" width="30" height="35" rx="8" fill="#E2E8F0"/>
  </g>
</svg>
`);

// 04. 臺羅送批大挑戰 (Game 3)
export const game4Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
  </defs>

  <rect width="600" height="360" rx="16" fill="url(#bg4)"/>

  <!-- City Skyline Silhouette Background -->
  <path d="M0,120 L30,120 L30,90 L70,90 L70,120 L120,120 L120,70 L160,70 L160,120 L220,120 L220,100 L270,100 L270,120 L350,120 L350,80 L400,80 L400,120 L480,120 L480,95 L530,95 L530,120 L600,120 L600,160 L0,160 Z" fill="#090D16" opacity="0.8"/>

  <!-- Top HUD Bar -->
  <rect x="12" y="12" width="576" height="44" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
  <text x="28" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#38BDF8" font-weight="900">天數 15</text>

  <rect x="150" y="20" width="280" height="28" rx="8" fill="#1E3A8A" stroke="#3B82F6"/>
  <text x="290" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#93C5FD" font-weight="bold" text-anchor="middle">送批任務：請寄送「麵茶」(mī-tê)</text>

  <text x="450" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#F43F5E" font-weight="900">時間 12s</text>
  <text x="525" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#FBBF24" font-weight="900">包裹 2</text>

  <!-- Perspective Highway Road -->
  <polygon points="220,130 380,130 580,360 20,360" fill="#1E293B"/>
  
  <!-- Road Lanes (3 Lanes) -->
  <line x1="273" y1="130" x2="200" y2="360" stroke="#FBBF24" stroke-width="2" stroke-dasharray="8 6"/>
  <line x1="326" y1="130" x2="400" y2="360" stroke="#FBBF24" stroke-width="2" stroke-dasharray="8 6"/>

  <!-- Road Barriers / Mail Destination Cards -->
  <!-- Lane 1: 麵茶 (Target Box) -->
  <g transform="translate(110, 210)">
    <rect x="0" y="0" width="90" height="40" rx="8" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
    <text x="45" y="24" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="900" text-anchor="middle">麵茶 ✉️</text>
  </g>

  <!-- Lane 2: 麻粩 -->
  <g transform="translate(255, 170)">
    <rect x="0" y="0" width="70" height="32" rx="6" fill="#DC2626" stroke="#EF4444" stroke-width="1.5"/>
    <text x="35" y="20" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#FFFFFF" font-weight="bold" text-anchor="middle">麻粩 🚧</text>
  </g>

  <!-- Lane 3: 圓仔湯 -->
  <g transform="translate(390, 220)">
    <rect x="0" y="0" width="90" height="40" rx="8" fill="#475569" stroke="#64748B" stroke-width="1.5"/>
    <text x="45" y="24" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#FFFFFF" font-weight="bold" text-anchor="middle">圓仔湯</text>
  </g>

  <!-- Blue Mail Truck / Dino Mailman on Road -->
  <g transform="translate(250, 275)">
    <!-- Blue Mail Truck Body -->
    <rect x="0" y="0" width="100" height="50" rx="10" fill="#2563EB" stroke="#60A5FA" stroke-width="2"/>
    <!-- Windshield -->
    <rect x="15" y="6" width="70" height="18" rx="4" fill="#93C5FD"/>
    <!-- Dino Driver icon -->
    <text x="50" y="20" font-family="sans-serif" font-size="12" text-anchor="middle">🦖</text>
    <!-- Mail Logo -->
    <rect x="35" y="28" width="30" height="14" rx="3" fill="#FFFFFF"/>
    <text x="50" y="39" font-family="sans-serif" font-size="9" text-anchor="middle">✉️</text>
    <!-- Headlights -->
    <circle cx="8" cy="42" r="5" fill="#FBBF24"/>
    <circle cx="92" cy="42" r="5" fill="#FBBF24"/>
  </g>
</svg>
`);

// 05. 臺羅戰機防衛戰 (Game 5)
export const game5Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070814"/>
      <stop offset="100%" stop-color="#11132B"/>
    </linearGradient>
  </defs>

  <rect width="600" height="360" rx="16" fill="url(#bg5)"/>

  <!-- Cyberpunk Perspective Grid Lines -->
  <line x1="300" y1="60" x2="0" y2="360" stroke="#831843" stroke-width="1" opacity="0.4"/>
  <line x1="300" y1="60" x2="100" y2="360" stroke="#831843" stroke-width="1" opacity="0.4"/>
  <line x1="300" y1="60" x2="200" y2="360" stroke="#831843" stroke-width="1" opacity="0.4"/>
  <line x1="300" y1="60" x2="400" y2="360" stroke="#831843" stroke-width="1" opacity="0.4"/>
  <line x1="300" y1="60" x2="500" y2="360" stroke="#831843" stroke-width="1" opacity="0.4"/>
  <line x1="300" y1="60" x2="600" y2="360" stroke="#831843" stroke-width="1" opacity="0.4"/>

  <!-- Horizontal Grid Lines -->
  <line x1="0" y1="120" x2="600" y2="120" stroke="#831843" stroke-width="1" opacity="0.3"/>
  <line x1="0" y1="180" x2="600" y2="180" stroke="#831843" stroke-width="1" opacity="0.3"/>
  <line x1="0" y1="250" x2="600" y2="250" stroke="#831843" stroke-width="1" opacity="0.3"/>

  <!-- Top HUD Bar -->
  <rect x="12" y="12" width="576" height="44" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
  <text x="28" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#FBBF24" font-weight="900">分數 005420</text>

  <rect x="160" y="20" width="280" height="28" rx="8" fill="#312E81" stroke="#6366F1"/>
  <text x="300" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#A5B4FC" font-weight="bold" text-anchor="middle">題目任務：【Lôo-káng】美食 (麵茶)</text>

  <rect x="460" y="20" width="115" height="28" rx="8" fill="#065F46"/>
  <text x="517" y="38" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#34D399" font-weight="900" text-anchor="middle">POWER 2 🔥</text>

  <!-- Enemy Ships at Top -->
  <!-- Enemy 1: 麵茶 (Target Enemy) -->
  <g transform="translate(250, 90)">
    <polygon points="50,0 90,30 75,50 25,50 10,30" fill="#881337" stroke="#F43F5E" stroke-width="2"/>
    <rect x="15" y="12" width="70" height="26" rx="6" fill="#1E293B"/>
    <text x="50" y="25" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#FFFFFF" font-weight="900" text-anchor="middle">麵茶</text>
    <text x="50" y="35" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#38BDF8" text-anchor="middle">mī-tê</text>
  </g>

  <!-- Enemy 2: 麻粩 -->
  <g transform="translate(80, 110)">
    <polygon points="40,0 70,25 60,40 20,40 10,25" fill="#312E81" stroke="#6366F1" stroke-width="1.5"/>
    <text x="40" y="22" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#E0E7FF" font-weight="bold" text-anchor="middle">麻粩</text>
  </g>

  <!-- Enemy 3: 牛舌餅 -->
  <g transform="translate(440, 110)">
    <polygon points="40,0 70,25 60,40 20,40 10,25" fill="#312E81" stroke="#6366F1" stroke-width="1.5"/>
    <text x="40" y="22" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#E0E7FF" font-weight="bold" text-anchor="middle">牛舌餅</text>
  </g>

  <!-- Green Fighter Spaceship at Bottom -->
  <!-- Triple Lasers Fired -->
  <line x1="300" y1="280" x2="300" y2="150" stroke="#10B981" stroke-width="3"/>
  <line x1="285" y1="285" x2="270" y2="150" stroke="#10B981" stroke-width="2"/>
  <line x1="315" y1="285" x2="330" y2="150" stroke="#10B981" stroke-width="2"/>

  <!-- Fighter Body -->
  <g transform="translate(270, 280)">
    <polygon points="30,0 60,40 45,50 15,50 0,40" fill="#047857" stroke="#34D399" stroke-width="2"/>
    <circle cx="30" cy="25" r="8" fill="#6EE7B7"/>
    <!-- Wing Thrusters -->
    <rect x="-5" y="30" width="10" height="15" rx="2" fill="#059669"/>
    <rect x="55" y="30" width="10" height="15" rx="2" fill="#059669"/>
  </g>
</svg>
`);

// 06. 臺羅拼音方塊研究所 (Game 6)
export const game6Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg6" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A121E"/>
      <stop offset="100%" stop-color="#040911"/>
    </linearGradient>
  </defs>

  <rect width="600" height="360" rx="16" fill="url(#bg6)"/>

  <!-- Top Title Banner -->
  <rect x="12" y="12" width="576" height="40" rx="8" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
  <rect x="22" y="20" width="180" height="24" rx="12" fill="#0284C7"/>
  <text x="112" y="36" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#FFFFFF" font-weight="900" text-anchor="middle">臺羅拼音方塊研究所</text>
  <text x="220" y="36" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#94A3B8">臺灣閩南語拼音方塊組裝</text>

  <!-- Left: Tetris Grid Frame -->
  <rect x="30" y="65" width="220" height="270" rx="12" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>

  <!-- Grid Cells background pattern -->
  <line x1="85" y1="65" x2="85" y2="335" stroke="#1E293B" stroke-width="1"/>
  <line x1="140" y1="65" x2="140" y2="335" stroke="#1E293B" stroke-width="1"/>
  <line x1="195" y1="65" x2="195" y2="335" stroke="#1E293B" stroke-width="1"/>

  <!-- Falling & Stacked Blocks -->
  <!-- Block m -->
  <rect x="40" y="275" width="50" height="50" rx="8" fill="#047857" stroke="#34D399" stroke-width="2"/>
  <text x="65" y="308" font-family="Noto Sans TC, sans-serif" font-size="22" fill="#FFFFFF" font-weight="900" text-anchor="middle">m</text>

  <!-- Block ī -->
  <rect x="95" y="275" width="50" height="50" rx="8" fill="#047857" stroke="#34D399" stroke-width="2"/>
  <text x="120" y="308" font-family="Noto Sans TC, sans-serif" font-size="22" fill="#FFFFFF" font-weight="900" text-anchor="middle">ī</text>

  <!-- Block - -->
  <rect x="150" y="275" width="50" height="50" rx="8" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
  <text x="175" y="308" font-family="Noto Sans TC, sans-serif" font-size="22" fill="#FFFFFF" font-weight="900" text-anchor="middle">-</text>

  <!-- Falling Block t -->
  <rect x="95" y="160" width="50" height="50" rx="8" fill="#B45309" stroke="#FBBF24" stroke-width="2"/>
  <text x="120" y="193" font-family="Noto Sans TC, sans-serif" font-size="22" fill="#FFFFFF" font-weight="900" text-anchor="middle">t</text>

  <!-- Falling Block ê -->
  <rect x="150" y="160" width="50" height="50" rx="8" fill="#B45309" stroke="#FBBF24" stroke-width="2"/>
  <text x="175" y="193" font-family="Noto Sans TC, sans-serif" font-size="22" fill="#FFFFFF" font-weight="900" text-anchor="middle">ê</text>

  <!-- Dino Scientist Character Bottom Right of Grid -->
  <g transform="translate(270, 200)">
    <circle cx="40" cy="40" r="35" fill="#10B981"/>
    <!-- Lab Coat -->
    <path d="M10,40 L70,40 L75,100 L5,100 Z" fill="#E2E8F0"/>
    <text x="40" y="48" font-family="sans-serif" font-size="28" text-anchor="middle">🦖</text>
    <text x="40" y="85" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#0F172A" font-weight="900" text-anchor="middle">博士</text>
  </g>

  <!-- Right Side Stats Panel -->
  <rect x="380" y="65" width="190" height="270" rx="12" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>
  
  <text x="400" y="100" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#94A3B8" font-weight="bold">Level</text>
  <text x="540" y="100" font-family="Noto Sans TC, sans-serif" font-size="16" fill="#38BDF8" font-weight="900" text-anchor="end">2</text>

  <text x="400" y="135" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#94A3B8" font-weight="bold">Lines</text>
  <text x="540" y="135" font-family="Noto Sans TC, sans-serif" font-size="16" fill="#34D399" font-weight="900" text-anchor="end">5</text>

  <text x="400" y="170" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#94A3B8" font-weight="bold">Score</text>
  <text x="540" y="170" font-family="Noto Sans TC, sans-serif" font-size="16" fill="#FBBF24" font-weight="900" text-anchor="end">2750</text>

  <line x1="400" y1="190" x2="550" y2="190" stroke="#1E293B" stroke-width="1.5"/>

  <!-- Next Block Preview Box -->
  <text x="400" y="215" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#94A3B8" font-weight="bold">NEXT</text>
  <rect x="425" y="230" width="100" height="80" rx="8" fill="#1E293B"/>
  <rect x="455" y="250" width="40" height="40" rx="6" fill="#6D28D9" stroke="#C084FC" stroke-width="2"/>
  <text x="475" y="276" font-family="Noto Sans TC, sans-serif" font-size="18" fill="#FFFFFF" font-weight="900" text-anchor="middle">p</text>
</svg>
`);

// 07. 華臺詞卡配對王 (Game 7)
export const game7Preview = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="600" height="360">
  <defs>
    <linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="100%" stop-color="#040911"/>
    </linearGradient>
  </defs>

  <rect width="600" height="360" rx="16" fill="url(#bg7)"/>

  <!-- Top Title Bar -->
  <rect x="12" y="10" width="576" height="38" rx="8" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
  <rect x="22" y="17" width="180" height="24" rx="12" fill="#E4772E"/>
  <text x="112" y="33" font-family="Noto Sans TC, sans-serif" font-size="12" fill="#FFFFFF" font-weight="900" text-anchor="middle">華臺詞卡配對王</text>
  <text x="215" y="33" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#38BDF8" font-weight="bold">鹿港篇 · 第1回</text>

  <!-- Left Side Info Box -->
  <rect x="20" y="58" width="160" height="280" rx="12" fill="#0F172A" stroke="#1E3A8A" stroke-width="2"/>
  <text x="35" y="85" font-family="Noto Sans TC, sans-serif" font-size="11" fill="#93C5FD" font-weight="900">🧪 配對研究所</text>
  <text x="35" y="108" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#CBD5E1">目標：配對國台語</text>
  <circle cx="100" cy="180" r="32" fill="#047857"/>
  <text x="100" y="188" font-family="sans-serif" font-size="28" text-anchor="middle">🦖</text>
  <rect x="30" y="240" width="140" height="80" rx="8" fill="#1E293B"/>
  <text x="100" y="260" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#FBBF24" text-anchor="middle">小提示：</text>
  <text x="100" y="280" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#E2E8F0" text-anchor="middle">請點選國語詞卡</text>
  <text x="100" y="298" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#E2E8F0" text-anchor="middle">再選擇對應台語！</text>

  <!-- Right Side Grid Area -->
  <!-- Upper Mandarin Cards Section -->
  <rect x="195" y="58" width="385" height="130" rx="12" fill="#0F172A" stroke="#0284C7" stroke-width="1.5"/>
  <rect x="205" y="50" width="80" height="18" rx="9" fill="#0284C7"/>
  <text x="245" y="62" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#FFFFFF" font-weight="bold" text-anchor="middle">國語詞彙</text>

  <!-- Mandarin Card 1 (Selected) -->
  <g transform="translate(210, 80)">
    <rect x="0" y="0" width="80" height="42" rx="8" fill="#B45309" stroke="#FBBF24" stroke-width="2"/>
    <text x="40" y="26" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="900" text-anchor="middle">伴手禮</text>
  </g>
  <!-- Mandarin Card 2 -->
  <g transform="translate(300, 80)">
    <rect x="0" y="0" width="80" height="42" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="1.5"/>
    <text x="40" y="26" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#E2E8F0" font-weight="bold" text-anchor="middle">麵茶</text>
  </g>
  <!-- Mandarin Card 3 -->
  <g transform="translate(390, 80)">
    <rect x="0" y="0" width="80" height="42" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="1.5"/>
    <text x="40" y="26" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#E2E8F0" font-weight="bold" text-anchor="middle">牛舌餅</text>
  </g>
  <!-- Mandarin Card 4 -->
  <g transform="translate(480, 80)">
    <rect x="0" y="0" width="80" height="42" rx="8" fill="#1E293B" stroke="#0284C7" stroke-width="1.5"/>
    <text x="40" y="26" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#E2E8F0" font-weight="bold" text-anchor="middle">圓仔湯</text>
  </g>

  <!-- Lower Taiwanese Cards Section -->
  <rect x="195" y="200" width="385" height="138" rx="12" fill="#0F172A" stroke="#047857" stroke-width="1.5"/>
  <rect x="205" y="192" width="80" height="18" rx="9" fill="#047857"/>
  <text x="245" y="204" font-family="Noto Sans TC, sans-serif" font-size="9" fill="#FFFFFF" font-weight="bold" text-anchor="middle">台語講法</text>

  <!-- Taiwanese Card 1 (Matched Green) -->
  <g transform="translate(210, 222)">
    <rect x="0" y="0" width="80" height="48" rx="8" fill="#047857" stroke="#34D399" stroke-width="2"/>
    <text x="40" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#FFFFFF" font-weight="900" text-anchor="middle">等路</text>
    <text x="40" y="36" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#A7F3D0" text-anchor="middle">tán-lōo</text>
    <circle cx="70" cy="12" r="7" fill="#34D399"/>
    <text x="70" y="16" font-family="sans-serif" font-size="9" fill="#047857" text-anchor="middle" font-weight="900">✓</text>
  </g>
  <!-- Taiwanese Card 2 -->
  <g transform="translate(300, 222)">
    <rect x="0" y="0" width="80" height="48" rx="8" fill="#1E293B" stroke="#047857" stroke-width="1.5"/>
    <text x="40" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#E2E8F0" font-weight="bold" text-anchor="middle">麵茶</text>
    <text x="40" y="36" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#34D399" text-anchor="middle">mī-tê</text>
  </g>
  <!-- Taiwanese Card 3 -->
  <g transform="translate(390, 222)">
    <rect x="0" y="0" width="80" height="48" rx="8" fill="#1E293B" stroke="#047857" stroke-width="1.5"/>
    <text x="40" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#E2E8F0" font-weight="bold" text-anchor="middle">牛舌餅</text>
    <text x="40" y="36" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#34D399" text-anchor="middle">gû-tsi̍h-piánn</text>
  </g>
  <!-- Taiwanese Card 4 -->
  <g transform="translate(480, 222)">
    <rect x="0" y="0" width="80" height="48" rx="8" fill="#1E293B" stroke="#047857" stroke-width="1.5"/>
    <text x="40" y="20" font-family="Noto Sans TC, sans-serif" font-size="13" fill="#E2E8F0" font-weight="bold" text-anchor="middle">圓仔湯</text>
    <text x="40" y="36" font-family="Noto Sans TC, sans-serif" font-size="10" fill="#34D399" text-anchor="middle">înn-á-thng</text>
  </g>
</svg>
`);
