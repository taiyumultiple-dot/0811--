// 全站底圖：米白紙感。
//
// 2026-08-19 全站改成跟課本插畫同一種水彩繪本風，原本的深藍霓虹背景
// （OldStreetBackground）跟插畫是兩個世界，換成溫潤的紙張底色＋淡淡的
// 水彩暈染，插畫貼上去像貼在紙上，不會有「深色網頁貼米白圖」的違和感。
export default function PaperBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#F7F2E7]" />
      {/* 幾團很淡的水彩暈染，讓大片底色不會太平 */}
      <div className="absolute -top-24 -left-20 w-[38rem] h-[38rem] rounded-full bg-[#E3EBD6] opacity-60 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-[34rem] h-[34rem] rounded-full bg-[#FBE7D2] opacity-55 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#EAF0F6] opacity-60 blur-3xl" />
      {/* 紙紋 */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
