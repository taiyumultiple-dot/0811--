import { useState, useMemo } from 'react';
import { Copy, Check, Printer, MessageSquare } from 'lucide-react';
import { playPopSound } from '../../../utils/soundEffects';
import { Panel } from './shared';

// 親師溝通與行政：親師訊息產生器 / 班級通知單
//
// 這兩個工具刻意「不接 AI」：訊息是用固定句型拼出來的，
// 老師看得到每一句從哪來，也不會把學生姓名或家庭狀況送到任何外部服務。
// 產出的內容一律是草稿，老師自己讀過、改過再送出。

type Tone = 'warm' | 'formal';

type Scene = {
  key: string;
  label: string;
  emoji: string;
  /** [親切版, 正式版] */
  body: [string, string];
};

const SCENES: Scene[] = [
  {
    key: 'praise',
    label: '表現優異',
    emoji: '🌟',
    body: [
      '今天在台語課表現得很棒，主動舉手唸課文，發音也很清楚，想跟您分享這個好消息。',
      '本日台語課堂表現優異，主動參與朗讀活動，發音表現良好，特此告知。',
    ],
  },
  {
    key: 'progress',
    label: '進步鼓勵',
    emoji: '📈',
    body: [
      '最近台語的聲調唸得比之前穩定很多，看得出來有在家練習，請您也幫忙鼓勵他。',
      '近期台語聲調表現較先前明顯進步，顯示課後有持續練習，敬請家長繼續給予支持。',
    ],
  },
  {
    key: 'homework',
    label: '作業未繳',
    emoji: '📝',
    body: [
      '這次的台語作業還沒有交，想跟您確認一下在家的狀況，如果有困難我們可以一起想辦法。',
      '本次台語作業尚未繳交，請家長協助了解情形並提醒於期限內補交，謝謝配合。',
    ],
  },
  {
    key: 'absent',
    label: '缺席關心',
    emoji: '🏥',
    body: [
      '今天沒有看到他來上課，想關心一下身體狀況，缺的進度我會再幫他補上。',
      '本日未到校上課，特此關心學生狀況；缺課進度將於返校後另行補足。',
    ],
  },
  {
    key: 'event',
    label: '活動通知',
    emoji: '📣',
    body: [
      '下週台語課有個小活動要跟您報告，也想邀請您有空的話來看看孩子的表演。',
      '謹此通知下週台語課相關活動事宜，歡迎家長撥冗參與，詳情如下。',
    ],
  },
  {
    key: 'bring',
    label: '提醒攜帶',
    emoji: '🎒',
    body: [
      '明天台語課要用到一些東西，麻煩您提醒他帶來，謝謝您。',
      '明日台語課程需使用相關用品，請家長協助提醒學生攜帶，感謝配合。',
    ],
  },
];

// 開頭與結尾也給台語版，老師想在聯絡簿上寫一句台語問候時可以直接用
const OPENERS: Record<Tone, string> = {
  warm: '家長您好，我是{teacher}老師：',
  formal: '{parent}家長 您好：',
};

const CLOSERS: Record<Tone, string> = {
  warm: '有任何問題都可以直接跟我說，謝謝您。',
  formal: '如有疑問請與導師聯繫，謝謝您的配合。',
};

const TAIGI_GREETINGS = [
  { han: '食飽未？', tailo: 'Tsia̍h pá--buē?' },
  { han: '真多謝你的幫贊。', tailo: 'Tsin to-siā lí ê pang-tsān.' },
  { han: '囡仔真𠢕，請你共伊講一聲。', tailo: 'Gín-á tsin gâu, tshiánn lí kā i kóng tsi̍t siann.' },
];

function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        readOnly
        rows={8}
        className="w-full px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 text-white font-black text-sm md:text-base leading-relaxed resize-y"
      />
      <button
        onClick={() => {
          navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }, () => {});
        }}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-base md:text-lg shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <Copy className="w-5 h-5" strokeWidth={2.5} />}
        {copied ? '已複製，可以貼到 LINE 或聯絡簿了' : '複製訊息'}
      </button>
    </div>
  );
}

// ─────────────────────────── 親師訊息產生器 ───────────────────────────

export function ParentMessageTool({ names }: { names: string[] }) {
  const [scene, setScene] = useState('praise');
  const [tone, setTone] = useState<Tone>('warm');
  const [student, setStudent] = useState('');
  const [teacher, setTeacher] = useState('');
  const [extra, setExtra] = useState('');
  const [greeting, setGreeting] = useState(-1);

  const message = useMemo(() => {
    const s = SCENES.find((x) => x.key === scene) ?? SCENES[0];
    const who = student.trim() || '孩子';
    const opener = OPENERS[tone].replace('{teacher}', teacher.trim() || '台語課').replace('{parent}', who);
    const body = `${who}${s.body[tone === 'warm' ? 0 : 1]}`;
    const g = greeting >= 0 ? `\n\n${TAIGI_GREETINGS[greeting].han}（${TAIGI_GREETINGS[greeting].tailo}）` : '';
    const note = extra.trim() ? `\n\n${extra.trim()}` : '';
    return `${opener}\n\n${body}${note}${g}\n\n${CLOSERS[tone]}`;
  }, [scene, tone, student, teacher, extra, greeting]);

  return (
    <Panel>
      <div className="flex flex-wrap gap-2">
        {SCENES.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setScene(s.key);
              playPopSound();
            }}
            className={`px-4 py-2.5 rounded-xl font-black text-sm md:text-base border-2 transition-all active:scale-95 cursor-pointer ${
              scene === s.key
                ? 'bg-emerald-500/20 border-emerald-400 text-white'
                : 'bg-[#030b17] border-cyan-500/40 text-cyan-100 hover:border-cyan-300'
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          list="roster-names-comm"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          placeholder="學生姓名"
          className="px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 transition-colors"
        />
        <datalist id="roster-names-comm">
          {names.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>

        <input
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          placeholder="老師姓名（例如：王）"
          className="px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 transition-colors"
        />

        <div className="flex gap-2">
          {(['warm', 'formal'] as Tone[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`flex-1 px-4 py-3 rounded-2xl font-black text-sm md:text-base border-2 transition-all active:scale-95 cursor-pointer ${
                tone === t ? 'bg-amber-400 border-amber-300 text-slate-950' : 'bg-[#030b17] border-cyan-500/40 text-cyan-100'
              }`}
            >
              {t === 'warm' ? '親切' : '正式'}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
        rows={2}
        placeholder="想補充的話（可留空）"
        className="w-full px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 resize-y transition-colors"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-black text-white text-sm md:text-base">加一句台語</span>
        <button
          onClick={() => setGreeting(-1)}
          className={`px-3 py-2 rounded-xl font-black text-sm border-2 transition-all cursor-pointer ${
            greeting === -1 ? 'bg-amber-400 border-amber-300 text-slate-950' : 'bg-[#030b17] border-cyan-500/40 text-cyan-100'
          }`}
        >
          不加
        </button>
        {TAIGI_GREETINGS.map((g, i) => (
          <button
            key={g.han}
            onClick={() => setGreeting(i)}
            className={`px-3 py-2 rounded-xl font-black text-sm border-2 transition-all cursor-pointer ${
              greeting === i ? 'bg-amber-400 border-amber-300 text-slate-950' : 'bg-[#030b17] border-cyan-500/40 text-cyan-100'
            }`}
          >
            {g.han}
          </button>
        ))}
      </div>

      <CopyBox text={message} />

      <p className="text-center font-black text-cyan-300/80 text-xs md:text-sm">
        <MessageSquare className="w-4 h-4 inline mr-1" strokeWidth={2.5} />
        產出的是草稿，送出前請自己讀一遍；所有內容都在這台電腦上組合，不會上傳。
      </p>
    </Panel>
  );
}

// ─────────────────────────── 班級通知單 ───────────────────────────

export function NoticeTool() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    place: '',
    bring: '',
    note: '',
    teacher: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const notice = useMemo(() => {
    const lines = [
      `【${form.title || '活動通知'}】`,
      '',
      '親愛的家長您好：',
      '',
      `　　為配合本學期台語課程，謹訂於下列時間舉辦「${form.title || '（活動名稱）'}」，敬請家長協助提醒學生準備。`,
      '',
      `日　　期：${form.date || '（待填）'}`,
      `時　　間：${form.time || '（待填）'}`,
      `地　　點：${form.place || '（待填）'}`,
      `攜帶物品：${form.bring || '無'}`,
    ];
    if (form.note.trim()) lines.push('', `備　　註：${form.note.trim()}`);
    lines.push('', `${form.teacher.trim() || '台語課'}老師　敬上`);
    return lines.join('\n');
  }, [form]);

  /** 開一個乾淨的列印視窗，不要把整站的深色背景印出來 */
  const print = () => {
    const w = window.open('', '_blank', 'width=800,height=900');
    if (!w) return;
    w.document.write(
      `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>${form.title || '班級通知單'}</title>` +
        '<style>body{font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;line-height:2;padding:48px;font-size:18px;white-space:pre-wrap}</style>' +
        `</head><body>${notice.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string)}</body></html>`,
    );
    w.document.close();
    w.focus();
    w.print();
  };

  const fields: [keyof typeof form, string, string][] = [
    ['title', '活動名稱', '例如：台語朗讀比賽'],
    ['date', '日期', '例如：11 月 20 日（星期四）'],
    ['time', '時間', '例如：上午 9:00–11:00'],
    ['place', '地點', '例如：本校視聽教室'],
    ['bring', '攜帶物品', '例如：課本、練習單'],
    ['teacher', '老師姓名', '例如：王小明'],
  ];

  return (
    <Panel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map(([key, label, ph]) => (
          <label key={key} className="flex flex-col gap-1.5">
            <span className="font-black text-white text-sm md:text-base">{label}</span>
            <input
              type="text"
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={ph}
              className="px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 transition-colors"
            />
          </label>
        ))}
      </div>

      <textarea
        value={form.note}
        onChange={(e) => set('note', e.target.value)}
        rows={2}
        placeholder="備註（可留空）"
        className="w-full px-4 py-3 rounded-2xl bg-[#030b17] border-2 border-cyan-500/40 focus:border-cyan-300 outline-hidden text-white font-black text-sm md:text-base placeholder:text-cyan-200/40 resize-y transition-colors"
      />

      <CopyBox text={notice} />

      <button
        onClick={print}
        className="w-full py-3 rounded-2xl bg-cyan-950 border-2 border-cyan-500/50 text-cyan-100 hover:text-white hover:bg-cyan-900 font-black text-base md:text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <Printer className="w-5 h-5" strokeWidth={2.5} />
        列印通知單
      </button>
    </Panel>
  );
}
