import { useState, useEffect } from 'react';
import { QrCode, X, Copy, Check } from 'lucide-react';
import type { Word } from './wordBank';

// 「掃碼帶著走」：老師把目前這批詞卡投影成 QR，學生用手機掃，
// 就在自己的手機上得到同一批詞卡可以練習。
//
// 這個站是純靜態的 GitHub Pages，沒有後端可以存資料，所以詞卡內容
// 直接編碼在網址的 # 後面，掃碼的人是「拿到一份資料」而不是「連到伺服器」。
// 好處是老師不必登入、學生不必註冊，也不會有任何個資離開這台電腦。

/** UTF-8 → base64url，塞進網址 hash 用 */
function encodePayload(data: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function buildShareUrl(title: string, words: Word[]): string {
  const payload = { t: title, w: words.map((w) => [w.han, w.tailo, w.zh]) };
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
  return `${base}tools/cards.html#${encodePayload(payload)}`;
}

export function ShareQrModal({
  title,
  words,
  onClose,
}: {
  title: string;
  words: Word[];
  onClose: () => void;
}) {
  const [svg, setSvg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  // 網址太長時 QR 會密到投影機上掃不動，超過 24 張就只帶前 24 張
  const limited = words.slice(0, 24);
  const url = buildShareUrl(title, limited);

  useEffect(() => {
    let alive = true;
    // QR 產生器只有這裡用得到，改成點開才下載，不要拖累首屏
    import('qrcode-generator').then(({ default: qrcode }) => {
      if (!alive) return;
      const qr = qrcode(0, 'L');
      qr.addData(url);
      qr.make();
      setSvg(qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }));
    });
    return () => {
      alive = false;
    };
  }, [url]);

  const copy = () => {
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#071322] border-2 border-cyan-400 rounded-3xl p-5 md:p-6 flex flex-col gap-4 shadow-[0_0_35px_rgba(2,132,199,0.4)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black text-white text-lg md:text-xl flex items-center gap-2">
            <QrCode className="w-6 h-6 text-amber-300" strokeWidth={2.5} />
            掃碼帶著走
          </h3>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <p className="font-black text-cyan-100 text-sm md:text-base leading-relaxed">
          投影這個 QR，學生用手機相機掃一下，就會在自己的手機上看到這 {limited.length} 張詞卡，
          可以自己翻卡、聽發音、做自我測驗。不必登入，也不會上傳任何資料。
        </p>

        <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
          {svg ? (
            <div className="w-full max-w-[16rem] [&>svg]:w-full [&>svg]:h-auto" dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <span className="text-slate-500 font-black py-16">產生中…</span>
          )}
        </div>

        <button
          onClick={copy}
          className="w-full py-3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-300" strokeWidth={2.5} /> : <Copy className="w-5 h-5" strokeWidth={2.5} />}
          {copied ? '已複製連結' : '複製連結（貼到班級群組）'}
        </button>

        {words.length > limited.length && (
          <p className="text-center font-black text-amber-300 text-xs md:text-sm">
            詞卡太多，QR 只帶前 {limited.length} 張（避免碼太密掃不到）
          </p>
        )}
      </div>
    </div>
  );
}

export function ShareQrButton({ title, words }: { title: string; words: Word[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={words.length === 0}
        data-sound="pop"
        className="px-4 py-2.5 rounded-xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-sm md:text-base transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <QrCode className="w-4 h-4" strokeWidth={2.5} />
        掃碼帶著走
      </button>
      {open && <ShareQrModal title={title} words={words} onClose={() => setOpen(false)} />}
    </>
  );
}
