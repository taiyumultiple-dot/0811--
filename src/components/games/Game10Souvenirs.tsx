import { useState, useEffect, useRef } from 'react';
import { speakTaiyu } from '../../lib/speech';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';
import { Trophy, ShoppingCart, RotateCcw, ChevronRight, CheckCircle2, Info } from 'lucide-react';
import { GameShell } from './GameShell';
import { GameHeader } from './GameHeader';
import { recordGameResult } from '../../lib/progressStore';
import BadgeToast from './BadgeToast';
import {
  itemPineapple,
  itemNougat,
  itemTeaegg,
  itemMango,
  itemPeanut,
  itemSunCake,
  itemJerky,
  itemMungCake,
  itemCoffee,
  itemCookie,
} from '../../assets/images/games';

interface Product {
  id: string;
  name: string;
  mandarin: string;
  tailo: string;
  unit: string;
  price: number;
  img: string;
  required: boolean;
}

const PRODUCTS: Product[] = [
  { id: 'pineapple', name: '王梨酥', mandarin: '鳳梨酥', tailo: 'ông-lâi-so', unit: '1 盒', price: 320, img: itemPineapple, required: true },
  { id: 'nougat', name: '牛角糖', mandarin: '牛軋糖', tailo: 'gû-kok-thn̂g', unit: '1 包', price: 200, img: itemNougat, required: true },
  { id: 'teaegg', name: '茶葉卵', mandarin: '茶葉蛋', tailo: 'tê-hio̍h-nn̄g', unit: '6 粒', price: 120, img: itemTeaegg, required: true },
  { id: 'mango', name: '檨仔乾', mandarin: '芒果乾', tailo: 'suāinn-á-kuann', unit: '1 包', price: 180, img: itemMango, required: true },
  { id: 'peanut', name: '土豆糖', mandarin: '花生糖', tailo: 'thôo-tāu-thn̂g', unit: '1 包', price: 150, img: itemPeanut, required: true },
  { id: 'sunc', name: '太陽餅', mandarin: '太陽餅', tailo: 'thài-iông-piánn', unit: '1 盒', price: 280, img: itemSunCake, required: false },
  { id: 'jerky', name: '牛肉乾', mandarin: '牛肉乾', tailo: 'gû-bah-kuann', unit: '1 包', price: 350, img: itemJerky, required: false },
  { id: 'mungcake', name: '綠豆糕', mandarin: '綠豆糕', tailo: 'li̍k-tāu-ko', unit: '1 盒', price: 260, img: itemMungCake, required: false },
  { id: 'coffee', name: '咖啡豆', mandarin: '咖啡豆', tailo: 'ka-pi-tāu', unit: '1 包', price: 300, img: itemCoffee, required: false },
  { id: 'cookie', name: '手工餅乾', mandarin: '手工餅乾', tailo: 'tshiú-kang piánn-kan', unit: '1 盒', price: 250, img: itemCookie, required: false },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BUDGET = 1000;
const SHOPPING_LIST = PRODUCTS.filter((p) => p.required);

export default function Game10Souvenirs({ onNext, onHome }: { onNext: () => void; onHome?: () => void }) {
  const [shuffledProducts, setShuffledProducts] = useState<Product[]>(() => shuffleArray(PRODUCTS));
  const [basket, setBasket] = useState<string[]>([]);
  const [result, setResult] = useState<null | boolean>(null);

  const total = basket.reduce((sum, id) => sum + PRODUCTS.find((p) => p.id === id)!.price, 0);
  const remaining = BUDGET - total;

  const addItem = (id: string) => {
    if (basket.includes(id)) return; // one of each in this simplified version
    if (result !== null) setResult(null);
    setBasket((prev) => [...prev, id]);
  };

  const removeItem = (id: string) => {
    setBasket((prev) => prev.filter((x) => x !== id));
    setResult(null);
  };

  const checkout = () => {
    const hasAllRequired = SHOPPING_LIST.every((p) => basket.includes(p.id));
    const hasExtras = basket.some((id) => !PRODUCTS.find((p) => p.id === id)!.required);
    const withinBudget = total <= BUDGET;
    const isSuccess = hasAllRequired && !hasExtras && withinBudget;
    if (isSuccess) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    setResult(isSuccess);
  };

  const restart = () => {
    setBasket([]);
    setResult(null);
    setShuffledProducts(shuffleArray(PRODUCTS));
  };

  const done = result === true;

  const recordedRef = useRef(false);
  const [newBadges, setNewBadges] = useState<string[] | null>(null);
  useEffect(() => {
    if (done && !recordedRef.current) {
      recordedRef.current = true;
      const r = recordGameResult({ gameKey: 'game10', score: 300, accuracy: 100 });
      if (r.newlyEarnedBadges.length > 0) {
        setNewBadges(r.newlyEarnedBadges.map((b) => `${b.icon} ${b.title}`));
      }
    }
    if (!done) recordedRef.current = false;
  }, [done]);

  return (
    <GameShell onHome={onHome}>
      <BadgeToast badges={newBadges} onClose={() => setNewBadges(null)} />
      <GameHeader
        stageNumber={10}
        title="伴手禮採買任務"
        subtitle="學會伴手禮台語，完成採買任務！"
        onSpeakQuestion={() => {
          const reqs = PRODUCTS.filter((p) => p.required);
          const remainingReq = reqs.find((p) => !basket.includes(p.id));
          if (remainingReq) {
            speakTaiyu("請買" + remainingReq.name, undefined, remainingReq.tailo);
          } else {
            speakTaiyu("伴手禮買好囉！");
          }
        }}
      />

      <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4 md:p-5 flex items-center gap-6 flex-wrap text-sm font-bold text-[#5C5548]">
        <span className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#E4772E]" /> 目前分數 <span className="text-[#2D2A26]">{done ? 300 : 0} 分</span>
        </span>
        <span>
          剩餘金額 <span className={remaining < 0 ? 'text-red-500' : 'text-[#2D2A26]'}>NT$ {remaining}</span>
        </span>
        <span className="flex items-center gap-2 ml-auto text-[#8A8378] text-xs">
          <Info className="w-4 h-4" /> 阿爸欲買物件轉去予朋友，請照清單採買，預算是 1000 箍，愛注意金額喔！
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 flex-1">
        <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4">
          <div className="grid grid-cols-5 gap-3">
            {shuffledProducts.map((p) => {
              const inBasket = basket.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (inBasket) {
                      removeItem(p.id);
                    } else {
                      addItem(p.id);
                    }
                    speakTaiyu(p.name, undefined, p.tailo);
                  }}
                  className={`rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all ${
                    inBasket ? 'border-[#4E9B5D] bg-[#EAF6EC]' : 'border-[#EFE8D8] bg-white hover:border-[#E4772E]'
                  }`}
                >
                  <img src={p.img} alt={p.name} className="w-full aspect-square object-cover rounded-lg" />
                  <span className="text-xs font-bold text-[#3E2723]">
                    {p.tailo}（{p.unit}）
                  </span>
                  <span className="text-xs text-[#E4772E] font-bold">${p.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#FDFBF6] rounded-3xl shadow-lg p-4 flex flex-col">
          <div className="font-black text-[#2D2A26] mb-3">採買清單</div>
          <ul className="flex flex-col gap-2 text-sm mb-4">
            {SHOPPING_LIST.map((p, i) => (
              <li
                key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                  basket.includes(p.id) ? 'bg-[#EAF6EC] text-[#4E9B5D]' : 'bg-white text-[#3E2723]'
                }`}
              >
                <span>
                  {i + 1}. {p.mandarin} {p.unit}
                </span>
                <span className="font-bold">${p.price}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-[#F5F0E4] px-3 py-2 text-sm font-bold text-[#2D2A26] flex justify-between">
            <span>預算</span>
            <span className="text-[#E4772E]">${BUDGET}</span>
          </div>

          {result !== null && (
            <div
              className={`mt-3 rounded-xl px-3 py-2 text-sm font-bold flex items-center gap-2 ${
                result ? 'bg-[#EAF6EC] text-[#4E9B5D]' : 'bg-red-50 text-red-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {result ? '採買清單完成！做得好！' : '清單不對或超出預算，再檢查看看！'}
            </div>
          )}

          <div className="mt-auto pt-4 text-xs text-[#8A8378] bg-[#F5F0E4] rounded-2xl p-3">
            💡 聽清楚對話內容，注意數量與金額，才會買對喔！
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <button
          onClick={checkout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E4772E] text-white font-bold text-sm hover:bg-[#CC6620] transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> 檢查結帳
        </button>
        <button
          onClick={restart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A8378] text-white font-bold text-sm hover:bg-[#736C60] transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> 清空購物籃
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4E9B5D] text-white font-bold text-sm hover:bg-[#458752] transition-colors"
        >
          {done ? '返回總覽' : '下一關'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </GameShell>
  );
}
