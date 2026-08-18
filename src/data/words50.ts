// 「聲母韻母鬥看覓」的 50 個字：漢字、臺羅、真人錄音。
//
// 來源是《多媒體輔教－聲母韻母鬥看覓》數位版簡報與所附音檔，
// 拼音取自簡報上的題目（每題把字拆成聲母＋韻母），錄音是同一批的 50 個 wav。
// 這是全站唯一「一個字一段真人錄音」的資料，聲母例字與鬥看覓遊戲都用它。

export type Word50 = {
  /** 音檔編號，對應 public/audio/words/NN.mp3 */
  id: string;
  han: string;
  tailo: string;
  /** 臺羅拆出來的聲母（零聲母為空字串） */
  initial: string;
  /** 臺羅拆出來的韻母，含聲調符號 */
  final: string;
};

export const WORDS_50: Word50[] = [
  { id: '01', han: '豹', tailo: 'pà', initial: 'p', final: 'à' },
  { id: '02', han: '筆', tailo: 'pit', initial: 'p', final: 'it' },
  { id: '03', han: '麭', tailo: 'pháng', initial: 'ph', final: 'áng' },
  { id: '04', han: '馬', tailo: 'bé', initial: 'b', final: 'é' },
  { id: '05', han: '墓', tailo: 'bōng', initial: 'b', final: 'ōng' },
  { id: '06', han: '麵', tailo: 'mī', initial: 'm', final: 'ī' },
  { id: '07', han: '門', tailo: 'mn̂g', initial: 'm', final: 'n̂g' },
  { id: '08', han: '豬', tailo: 'ti', initial: 't', final: 'i' },
  { id: '09', han: '竹', tailo: 'tik', initial: 't', final: 'ik' },
  { id: '10', han: '桌', tailo: 'toh', initial: 't', final: 'oh' },
  { id: '11', han: '兔', tailo: 'thòo', initial: 'th', final: 'òo' },
  { id: '12', han: '湯', tailo: 'thng', initial: 'th', final: 'ng' },
  { id: '13', han: '窗', tailo: 'thang', initial: 'th', final: 'ang' },
  { id: '14', han: '籃', tailo: 'nâ', initial: 'n', final: 'â' },
  { id: '15', han: '卵', tailo: 'nn̄g', initial: 'n', final: 'n̄g' },
  { id: '16', han: '貓', tailo: 'niau', initial: 'n', final: 'iau' },
  { id: '17', han: '龍', tailo: 'lîng', initial: 'l', final: 'îng' },
  { id: '18', han: '爐', tailo: 'lôo', initial: 'l', final: 'ôo' },
  { id: '19', han: '矸', tailo: 'kan', initial: 'k', final: 'an' },
  { id: '20', han: '狗', tailo: 'káu', initial: 'k', final: 'áu' },
  { id: '21', han: '猴', tailo: 'kâu', initial: 'k', final: 'âu' },
  { id: '22', han: '雞', tailo: 'ke', initial: 'k', final: 'e' },
  { id: '23', han: '橋', tailo: 'kiô', initial: 'k', final: 'iô' },
  { id: '24', han: '球', tailo: 'kiû', initial: 'k', final: 'iû' },
  { id: '25', han: '褲', tailo: 'khòo', initial: 'kh', final: 'òo' },
  { id: '26', han: '跤', tailo: 'kha', initial: 'kh', final: 'a' },
  { id: '27', han: '鵝', tailo: 'gô', initial: 'g', final: 'ô' },
  { id: '28', han: '牛', tailo: 'gû', initial: 'g', final: 'û' },
  { id: '29', han: '夾', tailo: 'ngeh', initial: 'ng', final: 'eh' },
  { id: '30', han: '熊', tailo: 'hîm', initial: 'h', final: 'îm' },
  { id: '31', han: '葉', tailo: 'hio̍h', initial: 'h', final: 'io̍h' },
  { id: '32', han: '虎', tailo: 'hóo', initial: 'h', final: 'óo' },
  { id: '33', han: '雨', tailo: 'hōo', initial: 'h', final: 'ōo' },
  { id: '34', han: '井', tailo: 'tsénn', initial: 'ts', final: 'énn' },
  { id: '35', han: '舌', tailo: 'tsi̍h', initial: 'ts', final: 'i̍h' },
  { id: '36', han: '鳥', tailo: 'tsiáu', initial: 'ts', final: 'iáu' },
  { id: '37', han: '船', tailo: 'tsûn', initial: 'ts', final: 'ûn' },
  { id: '38', han: '蛇', tailo: 'tsuâ', initial: 'ts', final: 'uâ' },
  { id: '39', han: '鼠', tailo: 'tshí', initial: 'tsh', final: 'í' },
  { id: '40', han: '車', tailo: 'tshia', initial: 'tsh', final: 'ia' },
  { id: '41', han: '尺', tailo: 'tshioh', initial: 'tsh', final: 'ioh' },
  { id: '42', han: '樹', tailo: 'tshiū', initial: 'tsh', final: 'iū' },
  { id: '43', han: '象', tailo: 'tshiūnn', initial: 'tsh', final: 'iūnn' },
  { id: '44', han: '獅', tailo: 'sai', initial: 's', final: 'ai' },
  { id: '45', han: '扇', tailo: 'sìnn', initial: 's', final: 'ìnn' },
  { id: '46', han: '岫', tailo: 'siū', initial: 's', final: 'iū' },
  { id: '47', han: '筍', tailo: 'sún', initial: 's', final: 'ún' },
  { id: '48', han: '傘', tailo: 'suànn', initial: 's', final: 'uànn' },
  { id: '49', han: '字', tailo: 'jī', initial: 'j', final: 'ī' },
  { id: '50', han: '日', tailo: 'ji̍t', initial: 'j', final: 'i̍t' },
];

/** 某個聲母的例字（聲母學習頁用） */
export function wordsForInitial(symbol: string): Word50[] {
  return WORDS_50.filter((w) => w.initial === symbol);
}

export function wordAudioUrl(id: string): string {
  return `${import.meta.env.BASE_URL}audio/words/${id}.mp3`;
}
