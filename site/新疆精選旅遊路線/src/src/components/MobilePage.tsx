import { useEffect, useRef, useState } from "react";
import "./MobilePage.css";

// ── 18 段口播，對應頁面各節主卡片 id ────────────────────────────────
const SEGMENTS = [
  // intro (開場 · 2段)
  { id: "intro",  step: 1, cardId: "mp-s-hero" },
  { id: "intro",  step: 2, cardId: "mp-s-overview" },
  // winter (冬季線 · 2段)
  { id: "winter", step: 1, cardId: "mp-s-r1-winter" },
  { id: "winter", step: 2, cardId: "mp-s-r1-winter" },
  // r1 (北疆大環線 · 3段)
  { id: "r1",     step: 1, cardId: "mp-s-r1" },
  { id: "r1",     step: 2, cardId: "mp-s-r1" },
  { id: "r1",     step: 3, cardId: "mp-c-r1-days" },
  // r2 (南疆大環線 · 3段)
  { id: "r2",     step: 1, cardId: "mp-s-r2" },
  { id: "r2",     step: 2, cardId: "mp-s-r2" },
  { id: "r2",     step: 3, cardId: "mp-c-r2-days" },
  // r3 (伊犁河谷 · 3段)
  { id: "r3",     step: 1, cardId: "mp-s-r3" },
  { id: "r3",     step: 2, cardId: "mp-s-r3" },
  { id: "r3",     step: 3, cardId: "mp-c-r3-days" },
  // r4 (東疆絲路 · 3段)
  { id: "r4",     step: 1, cardId: "mp-s-r4" },
  { id: "r4",     step: 2, cardId: "mp-s-r4" },
  { id: "r4",     step: 3, cardId: "mp-c-r4-days" },
  // know (行前必知 · 2段)
  { id: "know",   step: 1, cardId: "mp-s-know" },
  { id: "know",   step: 2, cardId: "mp-s-know" },
];

const CHAPTER_GROUPS = [
  { label: "開場",    start: 0,  end: 1  },
  { label: "冬季線",  start: 2,  end: 3  },
  { label: "北疆環線", start: 4,  end: 6  },
  { label: "南疆環線", start: 7,  end: 9  },
  { label: "伊犁縱貫", start: 10, end: 12 },
  { label: "東疆秘境", start: 13, end: 15 },
  { label: "行前必知", start: 16, end: 17 },
];

function scrollToCard(idx: number) {
  const seg = SEGMENTS[idx];
  if (!seg) return;
  const el = document.getElementById(seg.cardId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── 右下角圓形 FAB + 長按 Scrubber ──────────────────────────────────
function MobileAudioFab({ baseUrl }: { baseUrl: string }) {
  const [playing, setPlaying]           = useState(false);
  const [index, setIndex]               = useState(0);
  const [showScrubber, setShowScrubber] = useState(false);
  const [scrubIdx, setScrubIdx]         = useState(0);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const indexRef   = useRef(index);
  const lpTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  indexRef.current = index;

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.addEventListener("ended", () => {
      const next = indexRef.current + 1;
      if (next < SEGMENTS.length) setIndex(next);
      else { setPlaying(false); setIndex(0); }
    });
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => { scrollToCard(index); }, [index]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const seg = SEGMENTS[index];
    if (!seg) return;
    if (playing) { audio.src = `${baseUrl}audio/${seg.id}/${seg.step}.mp3`; audio.play().catch(() => {}); }
    else audio.pause();
  }, [index, playing, baseUrl]);

  const longFired = useRef(false);
  const startPos  = useRef<{ x: number; y: number } | null>(null);

  const openScrubber = () => {
    longFired.current = true;
    setPlaying(false);
    setScrubIdx(index);
    setShowScrubber(true);
    if (navigator.vibrate) navigator.vibrate(40);
  };
  const cancelLongPress = () => {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    longFired.current = false;
    lpTimer.current = setTimeout(openScrubber, 500);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPos.current || !lpTimer.current) return;
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > 8 || dy > 8) cancelLongPress();
  };
  const handlePointerUp = () => cancelLongPress();
  const handleClick = () => {
    if (longFired.current) { longFired.current = false; return; }
    if (!showScrubber) setPlaying(p => !p);
  };

  const confirmScrub = (idx: number) => {
    setShowScrubber(false);
    setIndex(idx);
    setPlaying(true);
  };

  const circ = 125.7;
  const dash = circ - (index / SEGMENTS.length) * circ;

  return (
    <>
      <button
        className={`mp-audio-fab ${playing ? "mp-audio-fab--playing" : ""}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        aria-label={playing ? "暫停" : "播放語音導讀"}
      >
        <svg className="mp-fab-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r="20" className="mp-fab-ring-bg" />
          <circle cx="22" cy="22" r="20" className="mp-fab-ring-fill"
            strokeDasharray={circ} strokeDashoffset={dash} />
        </svg>
        <span className="mp-fab-icon">{playing ? "⏸" : "🔊"}</span>
      </button>

      {showScrubber && (
        <div className="mp-scrubber-overlay" onPointerDown={() => setShowScrubber(false)}>
          <div className="mp-scrubber-sheet" onPointerDown={e => e.stopPropagation()}>
            <div className="mp-scrubber-handle" />
            <div className="mp-scrubber-current">
              <span className="mp-scrubber-current-ch">
                {CHAPTER_GROUPS.find(c => scrubIdx >= c.start && scrubIdx <= c.end)?.label}
              </span>
              <span className="mp-scrubber-current-num">{scrubIdx + 1} / {SEGMENTS.length}</span>
            </div>
            <div className="mp-scrubber-chips">
              {CHAPTER_GROUPS.map(ch => (
                <button
                  key={ch.label}
                  className={`mp-scrubber-chip ${scrubIdx >= ch.start && scrubIdx <= ch.end ? "mp-scrubber-chip--active" : ""}`}
                  onPointerDown={e => { e.stopPropagation(); setScrubIdx(ch.start); scrollToCard(ch.start); }}
                >
                  {ch.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              className="mp-scrubber-range"
              min={0} max={SEGMENTS.length - 1}
              value={scrubIdx}
              onChange={e => { const v = Number(e.target.value); setScrubIdx(v); scrollToCard(v); }}
            />
            <div className="mp-scrubber-ticks">
              {CHAPTER_GROUPS.map(ch => (
                <span key={ch.label} className="mp-scrubber-tick"
                  style={{ left: `${(ch.start / (SEGMENTS.length - 1)) * 100}%` }}>
                  {ch.label}
                </span>
              ))}
            </div>
            <button className="mp-scrubber-confirm" onPointerDown={() => confirmScrub(scrubIdx)}>
              從這裡播放
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface Props { baseUrl: string; }

interface Food { name: string; note: string; }
interface SpotData {
  name: string;
  desc: string;
  food: Food[];
  tip: string;
  img: string | null;
  q: string;
}

// ── 景點資料庫 (Wikimedia Commons CC授權圖片) ──────────────────────────
const SPOTS: Record<string, SpotData> = {
  hemu: {
    name: "禾木村",
    img: "hemu.jpg",
    q: "Hemu Village Xinjiang China",
    desc: "藏在阿爾泰山深處的圖瓦人聚落，木屋炊煙、晨霧繚繞，秋天層林染成金紅色，宛如從童話中走出的畫面。木屋半嵌入地下，是抵禦漫長嚴冬的千年智慧。",
    food: [
      { name: "圖瓦奶茶", note: "磚茶熬煮加鮮牛奶與鹽，濃郁鹹香，是圖瓦人日常熱量來源" },
      { name: "手抓羊肉", note: "阿爾泰草場放牧的羊，肉質鮮嫩少羶，以鹽和洋蔥搭配大口啃食" },
      { name: "松籽酥糖", note: "西伯利亞紅松的松籽製成，香氣濃郁，是最受歡迎的伴手禮" },
    ],
    tip: "9月下旬至10月初是賞秋色黃金期，氣溫驟降需備羽絨外套；旺季木屋民宿需提早數週預訂。",
  },
  kanas: {
    name: "喀納斯湖",
    img: "kanas.jpg",
    q: "Kanas Lake Xinjiang China",
    desc: "鑲嵌在阿爾泰山脈的翡翠湖泊，湖水因季節光線變幻出湛藍、碧綠、乳白等多種色彩，被哈薩克牧民視為「神秘之湖」。湖面時常升起晨霧，加上傳說中的巨型「湖怪」，讓這裡多了幾分史詩氛圍。",
    food: [
      { name: "哈薩克馬腸", note: "馬肉與油脂灌入馬腸熏製，肉香濃郁，是哈薩克族冬季保存食物的傳統技藝" },
      { name: "卡特瑪油炸薄餅", note: "麵糰擀薄油炸後搭配酥油或蜂蜜，酥脆可口" },
      { name: "酸馬奶（克馬斯）", note: "新鮮馬奶發酵而成，微酸帶氣泡，草原上的保健飲品" },
    ],
    tip: "景區靠擺渡車進出，旺季排隊時間長；建議搶清晨第一班入園，在霧散前拍攝湖面晨霧。",
  },
  wucaitan: {
    name: "布爾津五彩灘",
    img: "wucaitan.jpg",
    q: "Wucai Beach Burqin Xinjiang",
    desc: "額爾齊斯河南岸的彩色丹霞礫岩，在落日光線下呈現橙、紅、紫、黃的層疊色彩，河對岸一片鬱鬱蔥蔥的胡楊林與荒蕪石灘形成奇異對比。清晨或黃昏時分，絢麗色彩倒映在靜謐河面，如同天然油畫。",
    food: [
      { name: "布爾津烤魚", note: "額爾齊斯河特產冷水魚現烤，撒孜然與辣椒，焦香入味" },
      { name: "阿爾泰蜂蜜", note: "中國重要的百花蜜產區，野花蜜色澤金黃、甜而不膩" },
    ],
    tip: "最佳拍攝時機是日落前一小時，暖橙光線讓彩灘色彩飽和度倍增；景區橋上觀景台比河岸地面視角更好。",
  },
  urho: {
    name: "烏爾禾魔鬼城",
    img: null,
    q: "Urho World Ghost City Xinjiang",
    desc: "準噶爾盆地邊緣的雅丹地貌奇景，億萬年風蝕造就無數奇形怪狀的土丘與石柱，烈風呼嘯時發出陰森鬼嚎聲，故得此名。日落時分，金色光芒將整片「城堡」染成古銅色，曾是《臥虎藏龍》的取景地。",
    food: [
      { name: "克拉瑪依烤包子", note: "皮薄餡厚，以羊肉丁、洋蔥為餡，在饢坑貼壁烤製，外酥內鮮" },
      { name: "大盤雞", note: "整雞與馬鈴薯、辣椒大火翻炒，最後加入手拉麵拌汁，豪邁過癮" },
    ],
    tip: "景區廣大建議購觀光車票環遊；黃昏前1.5小時入園可同時拍日落金光與藍調天空。",
  },
  sayram: {
    name: "賽里木湖",
    img: "sayram.jpg",
    q: "Sayram Lake Xinjiang China",
    desc: "天山深處海拔2073公尺的高山湖泊，湖水清澈見底、藍得令人窒息，被哈薩克牧民稱為「大西洋最後一滴眼淚」。春夏之際，湖畔野花盛開，牧民驅趕羊群遷徙至此，帳篷點點，構成悠遠的遊牧畫卷。",
    food: [
      { name: "烤全羊", note: "整隻羊架炭火慢烤，外皮焦酥、肉鮮嫩多汁，是牧民慶典主角" },
      { name: "哈薩克奶疙瘩", note: "牛奶熬煮後晾曬成硬塊，酸鹹開胃，可直接咀嚼或泡入奶茶" },
    ],
    tip: "湖邊風大紫外線強，必備防曬與擋風外套；5月底至6月初遊客較少，可享受更安靜的湖景。",
  },
  nalati: {
    name: "那拉提草原",
    img: "nalati.jpg",
    q: "Nalati Grassland Xinjiang",
    desc: "被稱為「世界四大草原之一」的空中草原，地形起伏如波浪，晴日藍天白雲投影在翠綠坡地上，哈薩克氈房散布其間，彷彿整片土地都在呼吸。夏季萬紫千紅的野花地毯，讓遊客恍如置身阿爾卑斯山牧場。",
    food: [
      { name: "馬奶酒（科孜木）", note: "新鮮馬奶發酵約三天釀成，酒精度低、微酸帶泡，夏日消暑聖品" },
      { name: "手抓飯", note: "羊肉、胡蘿蔔、葡萄乾燉炒米飯，色澤金黃油潤，新疆全境最普遍主食" },
      { name: "烤羊肉串", note: "現烤羊腿肉串撒孜然辣椒粉，炭香四溢，路邊攤就是最道地的吃法" },
    ],
    tip: "草原面積廣大，建議搭馬匹或電瓶車深入草場；6月下旬至8月是草最肥美的時節。",
  },
  duku: {
    name: "獨庫公路",
    img: null,
    q: "Duku Highway Xinjiang China",
    desc: "全長561公里、被譽為「中國最美公路」，穿越天山山脈，一路切換雪山冰川、高山草甸、峽谷溪流與戈壁荒漠，每年僅開放約4個月，造就「天路穿越」的傳奇地位。行駛其中，窗外風景每隔幾十公里就換了一個世界。",
    food: [
      { name: "奎屯大盤雞", note: "起點城市奎屯特色料理，整雞與馬鈴薯大火翻炒，最後加入拉條子拌汁" },
      { name: "庫車饢", note: "南端終點庫車的薄圓饢，石饢坑高溫烤製，外脆內韌，香氣逼人" },
    ],
    tip: "通常6月下旬至10月初開放，出發前查詢實時封路狀況；全程油站稀少，建議在奎屯或庫車加滿油。",
  },
  guozigou: {
    name: "果子溝大橋",
    img: "guozigou.jpg",
    q: "Guozigou Bridge Xinjiang China",
    desc: "橫跨果子溝峽谷的雙塔斜拉橋，橋面距谷底近200公尺，橋旁絕壁蒼松清流奔涌，春季山杏花開時整條峽谷宛如粉白瀑布。站在觀景台俯瞰，橋身輕盈懸在山谷之間，現代工程之美與天山自然奇景完美交融。",
    food: [
      { name: "伊犁薰衣草蜂蜜", note: "霍城蜜源豐富，色淡味清，花香沁人，伊犁最受歡迎的特產" },
      { name: "伊寧烤包子", note: "伊犁烤包子皮更薄，餡料加入芹菜提鮮，味道層次豐富" },
    ],
    tip: "距伊寧市約1小時車程，通常與果子溝景區串聯遊覽；最佳拍攝點步行至橋西側約需10分鐘。",
  },
  lavender: {
    name: "霍城薰衣草莊園",
    img: null,
    q: "Huocheng Lavender Xinjiang China",
    desc: "伊犁霍城縣是中國最大的薰衣草種植基地，每年6至7月，綿延數十公里的紫色花海在天山腳下盛開，與雪頂山巒相互映襯，馥郁花香隨風而來令人沉醉。站在田壟間，一望無際的紫色讓人誤以為身處普羅旺斯。",
    food: [
      { name: "薰衣草冰淇淋", note: "以薰衣草精油與鮮奶製成，淡紫色外觀，花香清淡回甘，莊園現場供應" },
      { name: "薰衣草蜂蜜茶", note: "蜜蜂採集薰衣草蜂蜜沖泡花草茶，鎮靜舒緩，夏日午後享用最宜" },
      { name: "伊犁手抓羊肉", note: "伊犁河谷牧草豐美，出產的羊肉細嫩清香，公認全疆最優質" },
    ],
    tip: "花期集中在每年6月中旬至7月上旬，僅約3週；莊園有免費騎馬活動但等待時間較長。",
  },
  xiata: {
    name: "昭蘇夏塔古道",
    img: null,
    q: "Zhaosu Xiata Ancient Road Xinjiang",
    desc: "橫跨天山的古絲路驛道，海拔從1800公尺急升至3600公尺，沿途草甸如茵、冰川近在咫尺，冰涼融雪化成的溪流在腳邊奔流。這條路承載了兩千年的商旅記憶，走在上面，腳下是歷史，眼前是雪山。",
    food: [
      { name: "昭蘇馬肉", note: "昭蘇是全疆最重要的馬匹產地，馬肉熏腸與清燉馬肉是當地招牌" },
      { name: "哈薩克黃油餅", note: "新鮮黃油和面烤製，趁熱吃酥香撲鼻，是牧民徒步時的隨身乾糧" },
    ],
    tip: "徒步穿越古道需約2天，需聘請當地馬伕馱運行李；7、8月午後雷陣雨頻繁，備好防水裝備。",
  },
  kalajun: {
    name: "喀拉峻草原",
    img: "kalajun.jpg",
    q: "Kalajun Grassland Xinjiang China",
    desc: "伊犁河谷深處的世界自然遺產核心區，草場與雲彬山脈疊嶂的景觀層次繁複，哈薩克氈房、馬群與婉蜒牧道點綴其間，構成天山最動人的遊牧圖景。不同海拔的草甸顏色深淺各異，由高往低如同漸層的翡翠地毯。",
    food: [
      { name: "氈房烤肉", note: "哈薩克牧民在氈房以柴火現烤的羊排，原汁原味，最道地的用餐體驗" },
      { name: "酥油奶茶", note: "加入大量酥油的磚茶，熱量高暖胃，在高海拔草原能快速補充體力" },
    ],
    tip: "景區入口在特克斯縣方向，需換乘馬匹；建議預留2天，第一天騎行觀景，第二天清晨拍攝雲霧日出。",
  },
  tangbula: {
    name: "唐布拉百里畫廊",
    img: null,
    q: "Tangbula Scenic Area Xinjiang",
    desc: "沿著喀什河綿延100公里的山谷，兩岸高山草甸、峽谷瀑布與白樺林相互交替，每一個轉彎都是一幅新的風景畫。從喀什河谷驅車緩行，窗外的美景幾乎令人目不暇接，被稱為「百里畫廊」絕非誇張。",
    food: [
      { name: "尼勒克蜂蜜", note: "喀什河谷野花豐富，多花種蜂蜜香甜複雜，路邊牧民即可購買" },
      { name: "手抓羊肉", note: "唐布拉草場的羊以山地野草為食，肉質格外鮮嫩清香" },
    ],
    tip: "沿途有多個觀景台可停車，全程自駕最靈活；建議上午順光行駛，光線最適合拍攝山谷全景。",
  },
  kashgar: {
    name: "喀什古城",
    img: "kashgar.jpg",
    q: "Kashgar Old City Xinjiang China",
    desc: "絲綢之路上保存最完整的中亞風格古城，迷宮般的黃土街巷蜿蜒盤繞，兩側是維吾爾族匠人世代居住的土坯老宅，叮叮噹噹的銅器敲打聲與飄散的烤羊肉香交織成獨特感官世界。站在艾提尕爾清真寺前，彷彿穿越時空回到千年前的西域重鎮。",
    food: [
      { name: "薄皮包子", note: "皮薄如紙的蒸包子，羊肉洋蔥餡一咬肉汁四溢，是喀什清晨最普遍的早餐" },
      { name: "喀什烤饢", note: "品種繁多，以芝麻饢和玫瑰花饢最知名，饢坑高溫烤出的焦脆香氣是新疆飲食靈魂" },
      { name: "巴扎乾果", note: "葡萄乾、無花果乾、桑椹乾琳瑯滿目，兼具風土滋味的零食與伴手禮" },
    ],
    tip: "古城內部分仍是居民生活區，拍攝人像前務必先徵得同意；週五中午禮拜時間，清真寺周邊人潮最盛。",
  },
  baisha: {
    name: "帕米爾白沙湖",
    img: null,
    q: "Baisha Lake Pamir Xinjiang China",
    desc: "位於帕米爾高原海拔3300公尺的隱秘湖泊，湖水顏色如孔雀石般藍綠，四周環繞著柔白沙丘，山湖沙融為一體的奇景在地球上幾乎找不到第二處。被柯爾克孜牧民視為沙漠聖泉，傳說全年水位不變。",
    food: [
      { name: "帕米爾烤羊肉串", note: "塔吉克族烤肉以整塊羊腿肉為主，調料單純，突出羊肉本身的鮮香" },
      { name: "塔吉克奶疙瘩", note: "牦牛奶或羊奶製成的乳酪乾，比哈薩克奶疙瘩更硬更鹹，高原行走的補鈣食物" },
    ],
    tip: "外國遊客進入帕米爾地區需辦邊境許可（邊防證），建議在喀什市提前2-3天辦理。",
  },
  karakuli: {
    name: "卡拉庫里湖",
    img: "karakuli.jpg",
    q: "Karakuli Lake Xinjiang China",
    desc: "海拔3600公尺的高原湖泊，背後正是「冰山之父」慕士塔格峰的巨大身影倒映湖中，天晴時藍天、白雪、碧湖三色構成震撼人心的純粹構圖。無需任何登山技術，就能近距離感受帕米爾高原的磅礴氣場。",
    food: [
      { name: "柯爾克孜手抓肉", note: "帕米爾高原放牧的羊隻清燉，搭配皮芽子（洋蔥）生吃，最真誠的待客之道" },
      { name: "奶皮子", note: "新鮮牛奶加熱後撈取表層凝固奶皮，口感綿密似豆腐，蘸蜂蜜食用鮮美" },
    ],
    tip: "湖邊常有牧民提供駱駝或馬匹騎乘可繞湖一圈；下午光線最佳，慕士塔格峰反射金光讓湖面如同熔金。",
  },
  muztagh: {
    name: "慕士塔格峰",
    img: "muztagh.jpg",
    q: "Muztagh Ata Peak Xinjiang China",
    desc: "海拔7546公尺的「冰山之父」，山體龐大冰川縱橫，雄踞帕米爾高原與崑崙山脈交匯處，是全球知名的高海拔登山目標。即便遠觀，這座銀白色的巨峰從3600公尺的卡拉庫里湖畔拔地而起的姿態，已足以讓人沉默許久。",
    food: [
      { name: "帕米爾風乾牛肉", note: "高海拔低溫環境下自然風乾的牛肉，纖維細密、味道濃縮，登山口商店有售" },
      { name: "玉米麵餅（庫依瑪克）", note: "柯爾克孜族傳統麵食，玉米粉薄餅配酸奶，是帕米爾牧民的主食" },
    ],
    tip: "非登山者可在公路旁觀景台遠眺；最佳拍攝位置是卡拉庫里湖對岸的小山丘。",
  },
  panlong: {
    name: "盤龍古道（瓦恰鄉）",
    img: null,
    q: "Panlong Ancient Road Wucha Xinjiang",
    desc: "帕米爾高原上以髮夾彎著稱的山路，從河谷底部盤旋而上，連續急彎在衛星圖上宛如一條蜷曲的龍，是中國最壯觀的盤山公路之一。沿途視野開闊，可俯瞰整個克孜勒河谷，遠方雪山層疊，每一個急彎都成為難忘記憶。",
    food: [
      { name: "塔吉克族饢與酸奶", note: "瓦恰鄉以塔吉克族為主，全麥饢配自製濃稠酸奶，簡單而飽足" },
      { name: "牦牛肉湯", note: "高原寒冷，一碗熱騰騰的牦牛肉清湯加土豆，是沿路最能暖身的食物" },
    ],
    tip: "路況不穩定建議四驅越野車；手機訊號極差，出發前下載離線地圖並告知家人行程。",
  },
  bandir: {
    name: "班迪爾藍湖",
    img: null,
    q: "Bandil Lake Xinjiang China",
    desc: "隱藏在帕米爾山褶皺中的小型高山湖群，湖水呈現罕見的孔雀藍，透明度極高，湖底岩石紋理清晰可見。湖群周圍是柯爾克孜族的夏季牧場，白色氈房星星點點，寧靜得讓人不忍大聲說話。",
    food: [
      { name: "新鮮羊奶", note: "牧民清晨擠取的羊奶，溫熱直飲，濃稠香甜，拜訪氈房時最真誠的款待" },
      { name: "烤羊肉饢包肉", note: "烤熟羊肉夾入剛出爐的饢餅，肉汁與饢香融合，帕米爾地區的路邊快餐" },
    ],
    tip: "尚未大規模開發，需四驅越野車與當地嚮導；此區也需邊境許可，建議與白沙湖行程合併安排。",
  },
  flaming: {
    name: "吐魯番火焰山",
    img: "flaming.jpg",
    q: "Flaming Mountains Turpan Xinjiang",
    desc: "塔克拉瑪干沙漠邊緣的赤紅砂岩山脈，夏日地表溫度可超過70℃，遠望如熊熊烈焰燃燒，《西遊記》中唐僧師徒取經的「火焰山」正是此地原型。橫貫山體的沖溝在陽光下呈現深紅、橙黃、暗褐的層次，宛如凝固的火焰。",
    food: [
      { name: "吐魯番葡萄", note: "火焰山南麓光照強烈，出產的無核白葡萄、馬奶葡萄甜度驚人，鮮吃或製成葡萄乾均是極品" },
      { name: "烤羊肉串", note: "吐魯番巴扎的炭烤羊肉串撒上孜然，就著烈日食用別有風味" },
      { name: "拉條子", note: "手拉麵澆上番茄羊肉臊子，是吐魯番最普遍的家常麵食" },
    ],
    tip: "夏季地表溫度極高，建議清晨或傍晚遊覽；景區設有室外溫度計可拍照留念。",
  },
  kumtag: {
    name: "庫木塔格沙漠（鄯善）",
    img: null,
    q: "Kumtagh Desert Shanshan Xinjiang",
    desc: "世界上唯一一處與城鎮直接相連的沙漠，金色沙丘直接從鄯善縣城邊緣拔起，不需驅車長途跋涉就能踏上柔軟的沙海。沙丘連綿起伏如凝固的海浪，清晨光影在沙壟上勾勒出千萬條流動的線條，美得極為純粹。",
    food: [
      { name: "鄯善哈密瓜", note: "緊鄰哈密的鄯善同樣是瓜果之鄉，夏季哈密瓜糖分極高，路邊買一個現切現吃暢快極了" },
      { name: "無核白葡萄乾", note: "鄯善蔭房風乾，色澤金綠、甜中帶酸，最具代表性的東疆土特產" },
    ],
    tip: "徒步登沙丘建議穿沙漠防沙鞋套；清晨或傍晚沙丘溫度宜人，光線斜射角度最適合拍攝沙丘線條。",
  },
  hamiGhost: {
    name: "哈密五堡魔鬼城",
    img: null,
    q: "Hami Wubao Ghost City Xinjiang",
    desc: "哈密郊外的雅丹地貌群，千萬年風蝕造就的土丘如古堡、如蘑菇、如羅馬廢墟，在晨昏光線下呈現溫暖的赤橙色調。相比烏爾禾知名度較低，遊客稀少，更能在安靜中感受大自然的雕塑藝術，是攝影愛好者的隱藏秘境。",
    food: [
      { name: "哈密瓜", note: "哈密是哈密瓜的發源地，清脆多汁的哈密大瓜是到訪必吃的首選，7-9月最佳賞味季" },
      { name: "哈密大棗", note: "駿棗皮薄肉厚，甜度高核小，曬乾後是滋補佳品" },
    ],
    tip: "距哈密市區約80公里需自駕或包車；建議與巴里坤草原合併安排，形成「草原＋地貌」半日組合。",
  },
  barkol: {
    name: "巴里坤草原",
    img: "barkol.jpg",
    q: "Barkol Grassland Xinjiang China",
    desc: "天山東段海拔1650公尺的高原盆地草原，四周雪峰環抱，一汪湛藍的巴里坤湖倒映著白雲與山影，哈薩克牧民的氈房在廣袤綠色草場上錯落分布。相較於北疆其他知名草原，巴里坤人煙稀少，多了一份未被過度開發的原始靜謐。",
    food: [
      { name: "巴里坤熏馬腸", note: "以當地馬肉灌腸後以松木熏製，外皮焦香、肉有嚼勁，哈密地區最具代表性的肉食" },
      { name: "烤全羊", note: "哈薩克牧民節慶主角，以整隻羊架炭烤約2-3小時，外皮酥脆金黃、油脂芳香" },
    ],
    tip: "縣城有哈薩克族民俗博物館可搭配遊覽；夜晚草原光害極低，是觀星拍銀河的絕佳地點。",
  },
  jsjm: {
    name: "將軍山國際滑雪度假區",
    img: null,
    q: "Jiangjunshan Ski Resort Altay Xinjiang",
    desc: "全中國唯一與城市直接相連的高山滑雪場，天然阿勒泰粉雪享譽雪界，雪質輕盈乾燥、摩擦力低，每一次落地都像踩入棉花。傍晚滑雪者在金橘色光芒籠罩的「日落橘子海」中飛馳而下，這一幕被公認是中國最壯觀的滑雪夕陽景象。",
    food: [
      { name: "饢坑肉", note: "整塊羊排貼壁饢坑慢烤，外皮焦酥、骨髓鎖汁，阿勒泰冬季最暖胃的硬菜" },
      { name: "哈薩克大盤雞", note: "整雞與馬鈴薯辣炒加拉條子，份量豪邁，雪後補充熱量的最佳選擇" },
      { name: "駝奶熱飲", note: "新鮮駱駝乳加熱後微甜濃香，高原冬日獨特暖身飲品，雪場附近攤位有售" },
    ],
    tip: "12–2 月積雪最厚、粉雪最佳；3 月氣溫回暖光線柔美，是追「日落橘子海」的黃金期。入場前確認纜車開放時段。",
  },
  jikpu: {
    name: "吉克普林滑雪場",
    img: null,
    q: "Jikepulin Ski Resort Burqin Xinjiang",
    desc: "緊鄰禾木景區的高難度技術型雪場，雪道陡峭起伏，比將軍山更具挑戰性，是新疆滑雪發燒友的朝聖之地。背景是阿爾泰山雪白山脊與整片白樺林，風景原始開闊，滑完高難度道路後抬眼便是絕對的荒野靜謐。",
    food: [
      { name: "禾木圖瓦手抓羊肉", note: "鄰近禾木村用餐，阿爾泰山區放牧羊，肉質緊實清甜，就著奶茶一起吃最過癮" },
      { name: "圖瓦奶茶", note: "磚茶加鮮牛奶與鹽熬煮的鹹香熱飲，滑完高難度雪道後一杯立刻暖心暖胃" },
    ],
    tip: "難度較將軍山高，建議中級以上雪友前往；設施較簡樸，可從禾木村出發當天往返，不需另住雪場。",
  },
};

// ── 路線資料 ──────────────────────────────────────────────────────────
const ROUTES = [
  {
    id: "r1", img: "route1.jpg", label: "路線一", title: "北疆大環線",
    color: "blue", planCaption: "北疆大環線 12天 逐日路線規劃圖",
    duration: "12 天", season: "5 月 ~ 9 月",
    audience: "第一次去新疆、假期充裕，想一次收齊可可托海 · 禾木 · 喀納斯 · 賽里木湖 · 獨庫公路",
    desc: "以烏魯木齊為起訖點的深度大環線，從天山天池出發北上可可托海，深入禾木 · 喀納斯仙境，南下五彩灘 · 賽里木湖 · 薰衣草花海，途經那拉提草原與巴音布魯克，最後走獨庫公路穿越天山收尾，12 天串聯北疆最核心美景。",
    spotIds: ["hemu", "kanas", "wucaitan", "urho", "sayram", "lavender", "guozigou", "nalati", "duku"],
    days: [
      ["Day 1",  "烏魯木齊 → 天山天池（西王母瑤池 · 雪山倒影）→ 阜康"],
      ["Day 2",  "穿越古爾班通古特沙漠 → 卡拉麥里保護區（有機率見普氏野馬）→ 富蘊"],
      ["Day 3",  "可可托海國家地質公園（額爾齊斯大峽谷 · 神鐘山）→ 布爾津（夜市烤魚）"],
      ["Day 4",  "布爾津 → 禾木風景區（圖瓦人村落 · 白樺林）"],
      ["Day 5",  "禾木清晨晨霧 → 喀納斯（神仙灣 · 月亮灣 · 臥龍灣三道灣）"],
      ["Day 6",  "喀納斯觀魚台（俯瞰全湖）→ 五彩灘（傍晚雅丹地貌落日）→ 布爾津"],
      ["Day 7",  "烏爾禾魔鬼城（風蝕雅丹 · 拍日落絕佳）→ 克拉瑪依"],
      ["Day 8",  "克拉瑪依 → 賽里木湖（大西洋最後一滴眼淚 · 環湖賞白天鵝）"],
      ["Day 9",  "賽里木湖 → 果子溝大橋 → 霍城薰衣草園 → 伊寧六星街"],
      ["Day 10", "伊寧 → 那拉提空中草原（牛羊 · 雪山 · 氈房交織）"],
      ["Day 11", "那拉提 → 巴音布魯克大草原（天鵝湖 · 九曲十八彎 · 九個太陽奇觀）"],
      ["Day 12", "巴音布魯克 → 獨庫公路（一日歷四季）→ 返回烏魯木齊"],
    ],
    r1note: null,
    amapUrl: "https://uri.amap.com/navigation?from=87.6168,43.8256,烏魯木齊出發&to=87.6168,43.8256,返回烏魯木齊&via=88.1500,43.8500,天山天池|89.5180,46.9940,可可托海|87.4321,48.5678,禾木村|87.0155,48.6912,喀納斯湖|87.5312,47.9811,五彩灘|84.9062,44.4221,烏爾禾魔鬼城|81.1942,44.6015,賽里木湖|80.8715,44.0221,霍城薰衣草|83.6472,43.3255,那拉提草原|84.1600,42.6800,巴音布魯克&mode=car&callnative=1",
    gmapUrl: "https://www.google.com/maps/dir/?api=1&origin=43.8256,87.6168&destination=43.8256,87.6168&waypoints=43.85,88.15|46.994,89.518|48.5678,87.4321|48.6912,87.0155|47.9811,87.5312|44.4221,84.9062|44.6015,81.1942|43.3255,83.6472|42.68,84.16&travelmode=driving",
  },
  {
    id: "r2", img: "route2.jpg", label: "路線二", title: "南疆風情大環線",
    color: "green", planCaption: "南疆風情大環線 12天 逐日路線規劃圖",
    duration: "12 天", season: "4 月 ~ 10 月",
    audience: "深度旅人，熱愛絲路人文 · 沙漠公路 · 帕米爾高原極限風光",
    desc: "烏魯木齊出發，穿越吐魯番盆地南下庫車峽谷，縱穿塔克拉瑪干沙漠公路抵和田，再進喀什古城，攀上帕米爾探訪慕士塔格峰與盤龍古道，完整體驗「北疆看風景，南疆看人文」的極致之旅。",
    spotIds: ["flaming", "kashgar", "baisha", "karakuli", "muztagh", "panlong", "kumtag"],
    days: [
      ["Day 1",  "烏魯木齊 → 吐魯番（交河故城 · 坎兒井 · 火焰山）"],
      ["Day 2",  "翻越天山 → 乾溝公路峽谷 → 博斯騰湖（中國最大內陸淡水湖）→ 庫爾勒"],
      ["Day 3",  "庫爾勒 → 庫車大峽谷（天山神秘大峽谷）→ 克孜爾千佛洞"],
      ["Day 4",  "庫車 → 塔里木胡楊林國家森林公園（生而千年不倒）→ 阿拉爾"],
      ["Day 5",  "縱穿塔克拉瑪干沙漠公路（「死亡之海」沙丘）→ 和田夜市（烤蛋 · 烤全羊）"],
      ["Day 6",  "和田 → 葉城（新藏公路零公里）→ 喀什（連住三晚）"],
      ["Day 7",  "喀什古城深度遊（開城儀式 · 艾提尕爾清真寺 · 香妃園 · 百年茶館）"],
      ["Day 8",  "喀喇昆侖公路 → 白沙湖 → 喀拉庫里湖（遠眺慕士塔格峰）→ 塔縣"],
      ["Day 9",  "石頭城遺址 → 金草灘（高原濕地雪山倒影）→ 盤龍古道 → 返回喀什"],
      ["Day 10", "喀什飛返或自駕 → 返回庫爾勒"],
      ["Day 11", "庫爾勒 → 羅布人村寨（沙漠 · 神秘河流 · 胡楊三合一）"],
      ["Day 12", "吐和高速 → 返回烏魯木齊（國際大巴扎採購收官）"],
    ],
    r1note: null,
    amapUrl: "https://uri.amap.com/navigation?from=87.6168,43.8256,烏魯木齊出發&to=87.6168,43.8256,返回烏魯木齊&via=89.1805,42.9425,吐魯番|86.1586,41.7254,庫爾勒|82.9600,41.7200,庫車大峽谷|81.2758,40.5430,阿拉爾胡楊林|79.9227,37.1120,和田夜市|75.9892,39.4677,喀什古城|75.2332,37.7752,塔什庫爾干|75.0672,38.4385,喀拉庫里湖|75.5728,37.7085,盤龍古道&mode=car&callnative=1",
    gmapUrl: "https://www.google.com/maps/dir/?api=1&origin=43.8256,87.6168&destination=43.8256,87.6168&waypoints=42.9425,89.1805|41.7254,86.1586|41.72,82.96|40.543,81.2758|37.112,79.9227|39.4677,75.9892|37.7752,75.2332|38.4385,75.0672|37.7085,75.5728&travelmode=driving",
  },
  {
    id: "r3", img: "route3.jpg", label: "路線三", title: "伊犁河谷深度縱貫獨庫",
    color: "amber", planCaption: "伊犁河谷深度縱貫獨庫 12天 逐日路線規劃圖",
    duration: "12 天", season: "5 月 ~ 8 月",
    audience: "公路自駕控 · 花海攝影愛好者，想完整征服獨庫公路全段",
    desc: "烏魯木齊出發，取道獨庫公路北段進入伊犁腹地，深入那拉提空中草原、瓊庫什台秘境村落、喀拉峻大草原，走伊昭公路到夏塔古道，賞霍城薰衣草後環繞賽里木湖，最後從巴音布魯克走獨庫公路南段穿越天山返回，全程涵蓋獨庫公路南北完整段。",
    spotIds: ["duku", "nalati", "tangbula", "kalajun", "xiata", "lavender", "sayram", "guozigou"],
    days: [
      ["Day 1",  "烏魯木齊 → 獨山子大峽谷（流水侵蝕奇觀）→ 奎屯市"],
      ["Day 2",  "獨庫公路北段（一日歷四季）→ 唐布拉百里畫廊 → 那拉提"],
      ["Day 3",  "那拉提空中草原（立體草原景觀）→ 特克斯八卦城（無紅綠燈 · 夜看燈光秀）"],
      ["Day 4",  "特克斯後山公路 → 瓊庫什台歷史文化名村（原始哈薩克小木屋）"],
      ["Day 5",  "喀拉峻大草原（闊克蘇大峽谷 · 九曲十八彎 · 鱷魚灣）"],
      ["Day 6",  "伊昭公路（翻越烏孫山）→ 夏塔古道（遠眺木札爾特冰川）→ 昭蘇"],
      ["Day 7",  "昭蘇 → 霍城薰衣草基地（6–7月盛開期）→ 六星街 → 伊寧"],
      ["Day 8",  "伊寧 → 果子溝大橋 → 賽里木湖（環湖星空帳篷）"],
      ["Day 9",  "賽里木湖 → 獨庫公路中段 → 巴音布魯克（天鵝湖 · 九曲十八彎落日）"],
      ["Day 10", "獨庫公路南段（紅色雅丹石林）→ 大小龍池 → 庫車大峽谷"],
      ["Day 11", "克孜爾千佛洞（比敦煌更古老的石窟）→ 庫爾勒"],
      ["Day 12", "乾溝峽谷 → 吐和高速 → 返回烏魯木齊"],
    ],
    r1note: null,
    amapUrl: "https://uri.amap.com/navigation?from=87.6168,43.8256,烏魯木齊出發&to=87.6168,43.8256,返回烏魯木齊&via=84.8820,44.3200,獨山子大峽谷|83.6472,43.3255,那拉提草原|81.8380,43.2170,特克斯八卦城|80.8665,42.7082,喀拉峻草原|81.1312,43.1200,昭蘇夏塔|80.8715,44.0221,霍城薰衣草|81.1942,44.6015,賽里木湖|84.1600,42.6800,巴音布魯克|82.9600,41.7200,庫車大峽谷|86.1586,41.7254,庫爾勒&mode=car&callnative=1",
    gmapUrl: "https://www.google.com/maps/dir/?api=1&origin=43.8256,87.6168&destination=43.8256,87.6168&waypoints=44.32,84.882|43.3255,83.6472|43.217,81.838|42.7082,80.8665|43.12,81.1312|44.0221,80.8715|44.6015,81.1942|42.68,84.16|41.72,82.96&travelmode=driving",
  },
  {
    id: "r4", img: "route4.jpg", label: "路線四", title: "東疆全景絲路秘境",
    color: "red", planCaption: "東疆全景絲路秘境 12天 逐日路線規劃圖",
    duration: "12 天", season: "4 月 ~ 10 月",
    audience: "絲路歷史迷 · 大漠探險玩家，想探索新疆最少人知的秘境",
    desc: "烏魯木齊出發向東，探索奇台江布拉克麥海、木壘胡楊林，翻越東天山抵達巴里坤大草原，深入神秘大海道雅丹地貌，轉戰哈密古城，南下庫木塔格沙漠與吐魯番葡萄溝，穿越達坂城萬畝風車陣返回，完整體驗絲路文化與硬核地理景觀。",
    spotIds: ["barkol", "kumtag", "flaming", "hamiGhost"],
    days: [
      ["Day 1",  "烏魯木齊 → 奇台江布拉克（天山麥海 · 高山草甸立體景觀）"],
      ["Day 2",  "奇台 → 木壘（6500年原始胡楊林 · 鳴沙山滑沙轟鳴）"],
      ["Day 3",  "翻越東天山景觀公路 → 巴里坤大草原 · 巴里坤湖（高山鹹水湖 · 水鳥雪山）"],
      ["Day 4",  "巴里坤 → 哈密東天山（林海雪原一小時切換至戈壁綠洲）"],
      ["Day 5",  "大海道雅丹地貌（地球最像火星之地 · 出發前高德下載離線地圖）"],
      ["Day 6",  "哈密人文歷史（哈密王陵 · 市博物館 · 回王府）"],
      ["Day 7",  "哈密 → 連霍高速穿越百里風區 → 庫木塔格沙漠（城市零距離沙漠 · 日落金沙）→ 鄯善"],
      ["Day 8",  "鄯善 → 吐峪溝麻扎村（1700年古老維吾爾族土坂村）→ 吐魯番"],
      ["Day 9",  "火焰山（與巨型溫度計合照）→ 高昌故城（世界最大最古老生土建築城市）"],
      ["Day 10", "坎兒井民俗園（古代地下暗渠水利奇蹟）→ 葡萄溝（品嚐甜瓜與葡萄）"],
      ["Day 11", "吐魯番 → 紅河谷峽谷（斷崖紅峽 · 戈壁綠洲極致視覺對比）→ 托克遜"],
      ["Day 12", "達坂城風力發電廠（延綿數十公里的風車陣）→ 返回烏魯木齊"],
    ],
    r1note: null,
    amapUrl: "https://uri.amap.com/navigation?from=87.6168,43.8256,烏魯木齊出發&to=87.6168,43.8256,返回烏魯木齊&via=89.5900,44.0200,奇台江布拉克|90.2870,43.8350,木壘胡楊林|93.0168,43.5942,巴里坤草原|93.5192,42.8142,哈密市|91.5000,42.5000,大海道雅丹|90.2100,42.8600,鄯善庫木塔格|89.1805,42.9425,吐魯番火焰山|88.6500,42.7900,托克遜紅河谷&mode=car&callnative=1",
    gmapUrl: "https://www.google.com/maps/dir/?api=1&origin=43.8256,87.6168&destination=43.8256,87.6168&waypoints=44.02,89.59|43.835,90.287|43.5942,93.0168|42.8142,93.5192|42.5,91.5|42.86,90.21|42.9425,89.1805|42.79,88.65&travelmode=driving",
  },
];

const MUST_KNOW = [
  { emoji: "🧥", title: "溫差極大", desc: "日夜溫差極大，「早穿皮襖午穿紗」。夏天去北疆或高原也要帶防風保暖外套或輕薄羽絨衣。" },
  { emoji: "☀️", title: "防曬必備", desc: "氣候乾燥、紫外線強烈。護唇膏、保濕乳液、高係數防曬乳、墨鏡、遮陽帽缺一不可。" },
  { emoji: "🚗", title: "路途遙遠", desc: "景點間車程動輒 4–6 小時以上。出發前備好隨身充電、舒適頸枕、打發時間的零食。" },
  { emoji: "🛣️", title: "獨庫公路", desc: "每年約 6月中旬至 10月初開放，視天氣可能提前關閉。規劃行程前務必查詢最新公告。" },
  { emoji: "📍", title: "導航注意", desc: "中國大陸境內自駕建議用高德地圖（GCJ-02 座標系最精準）。Google Maps（WGS-84）在中國境內座標有偏移，導航較不可靠。" },
];

// ── 將軍山冬季滑雪版資料 ─────────────────────────────────────────────
const ROUTE1_WINTER = {
  spotIds: ["jsjm", "hemu", "jikpu"],
  days: [
    ["Day 1", "直飛阿勒泰雪都機場，取車入住市區，晚嚐饢坑肉與哈薩克大盤雞"],
    ["Day 2", "將軍山國際滑雪度假區全天暢滑，傍晚追「日落橘子海」"],
    ["Day 3", "開往禾木村，冬日水墨木屋世界，入住後仰望零光害星空"],
    ["Day 4", "禾木清晨「潑水成冰」體驗 → 吉克普林高難度雪道 → 傍晚返回阿勒泰"],
    ["Day 5", "市區採買乾果 · 駝奶粉伴手禮 → 雪都機場還車賦歸"],
  ],
  amap: [
    { name: "阿勒泰雪都機場", coord: "88.0825,47.7492" },
    { name: "將軍山滑雪場遊客中心", coord: "88.1455,47.8412" },
    { name: "阿勒泰市區", coord: "88.1362,47.8285" },
    { name: "禾木風景區遊客中心", coord: "87.4321,48.5678" },
    { name: "吉克普林滑雪度假區", coord: "87.3215,48.6122" },
  ],
  amapUrl: "https://uri.amap.com/navigation?from=88.0825,47.7492,阿勒泰雪都機場&to=88.0825,47.7492,阿勒泰雪都機場&via=88.1455,47.8412,將軍山滑雪場|88.1362,47.8285,阿勒泰市區|87.4321,48.5678,禾木風景區|87.3215,48.6122,吉克普林滑雪場&mode=car&callnative=1",
  gmapUrl: "https://www.google.com/maps/dir/?api=1&origin=47.7492,88.0825&destination=47.7492,88.0825&waypoints=47.8412,88.1455|47.8285,88.1362|48.5678,87.4321|48.6122,87.3215&travelmode=driving",
};

// ── 景點卡組件 ────────────────────────────────────────────────────────
function SpotCard({ spotId, baseUrl }: { spotId: string; baseUrl: string }) {
  const spot = SPOTS[spotId];
  if (!spot) return null;
  const imgSrc = spot.img ? `${baseUrl}images-spots/${spot.img}` : null;

  return (
    <div className="mp-spot-card">
      {imgSrc && (
        <img className="mp-spot-card-img" src={imgSrc} alt={spot.name} loading="lazy" />
      )}
      <div className="mp-spot-card-body">
        <div className="mp-spot-card-header">
          <span className="mp-spot-card-name">{spot.name}</span>
          <a
            href={`https://uri.amap.com/search?keyword=${encodeURIComponent(spot.name)}&callnative=1`}
            target="_blank" rel="noopener noreferrer"
            className="mp-map-btn"
            onClick={e => e.stopPropagation()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </a>
        </div>

        <p className="mp-spot-card-desc">{spot.desc}</p>

        <div className="mp-spot-food-section">
          <div className="mp-spot-food-label">🍽 當地美食</div>
          {spot.food.map(f => (
            <div key={f.name} className="mp-spot-food-row">
              <span className="mp-spot-food-name">{f.name}</span>
              <span className="mp-spot-food-note">{f.note}</span>
            </div>
          ))}
        </div>

        <div className="mp-spot-tip">
          <span className="mp-spot-tip-icon">💡</span>
          <span className="mp-spot-tip-text">{spot.tip}</span>
        </div>
      </div>
    </div>
  );
}

function AmapRouteBtn({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mp-gmap-btn">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      在高德地圖開啟完整路線
    </a>
  );
}

function GMapRouteBtn({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mp-gmap-btn mp-gmap-btn--google">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      在 Google 地圖開啟完整路線
    </a>
  );
}

// ── 主組件 ────────────────────────────────────────────────────────────
export function MobilePage({ baseUrl }: Props) {
  const img = (name: string) => `${baseUrl}images-mobile/${name}`;

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.style.overflowY = "auto";
    root.style.overflowX = "hidden";
    root.style.height = "100dvh";
    root.scrollTop = 0;
    return () => {
      root.style.overflowY = "";
      root.style.overflowX = "";
      root.style.height = "";
    };
  }, []);

  const isLineBrowser = navigator.userAgent.indexOf("Line/") > -1;

  return (
    <div className="mp-root">
      {isLineBrowser && (
        <div className="mp-line-banner">
          請點右上角 <strong>···</strong> → <strong>在瀏覽器中開啟</strong>以獲得最佳體驗
        </div>
      )}

      {/* ── Hero ── */}
      <div id="mp-s-hero" className="mp-hero">
        <img className="mp-hero-img" src={img("cover.jpg")} alt="新疆旅遊精選路線封面" />
        <div className="mp-hero-text">
          <div className="mp-hero-sub">根據導遊小雅攻略整理</div>
          <div className="mp-hero-title">新疆旅遊精選路線</div>
          <div className="mp-hero-badges">
            <span className="mp-badge">北疆大環線</span>
            <span className="mp-badge">伊犁環線</span>
            <span className="mp-badge">南疆小環線</span>
            <span className="mp-badge">東疆短線</span>
          </div>
          <div className="mp-scroll-hint">▼ 滑動查看路線與景點介紹</div>
        </div>
      </div>

      {/* ── Overview ── */}
      <section id="mp-s-overview" className="mp-section">
        <div className="mp-day-cover">
          <img className="mp-day-img" src={img("overview.jpg")} alt="五條精選路線速覽" />
          <div className="mp-day-overlay">
            <div className="mp-day-label-row">
              <span className="mp-day-tag">五條精選路線</span>
              <span className="mp-day-date">點選路線直接跳轉</span>
            </div>
          </div>
        </div>
        <div id="mp-c-ov-compare" className="mp-card">
          <div className="mp-card-title">路線速選表</div>
          {[
            { label: "❄️ 北疆滑雪線",       days: "5 天 4 夜", season: "12月 ~ 3月",  note: "將軍山粉雪 · 禾木木屋 · 橘子海日落",          color: "snow",  anchor: "mp-s-r1-winter" },
            { label: "北疆大環線",           days: "12 天",    season: "5月 ~ 9月",   note: "第一次首選 · 可可托海 · 喀納斯 · 獨庫公路", color: "blue",  anchor: "mp-s-r1" },
            { label: "南疆風情大環線",       days: "12 天",    season: "4月 ~ 10月",  note: "塔克拉瑪干 · 喀什古城 · 帕米爾高原",         color: "green", anchor: "mp-s-r2" },
            { label: "伊犁河谷深度縱貫獨庫", days: "12 天",    season: "5月 ~ 8月",   note: "獨庫公路全段 · 薰衣草花海 · 喀拉峻草原",     color: "amber", anchor: "mp-s-r3" },
            { label: "東疆全景絲路秘境",     days: "12 天",    season: "4月 ~ 10月",  note: "大海道 · 火焰山 · 哈密古城 · 巴里坤",         color: "red",   anchor: "mp-s-r4" },
          ].map(r => (
            <button
              key={r.label}
              className={`mp-compare-row mp-compare-row--${r.color}`}
              onClick={() => document.getElementById(r.anchor)?.scrollIntoView({ behavior: "smooth" })}
            >
              <div className="mp-compare-label">{r.label}</div>
              <div className="mp-compare-meta">
                <span>🕒 {r.days}</span><span>📅 {r.season}</span>
              </div>
              <div className="mp-compare-row-footer">
                <span className="mp-compare-note">{r.note}</span>
                <span className="mp-compare-arrow">↓</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── 將軍山冬季路線（置頂第一） ── */}
      <section id="mp-s-r1-winter" className="mp-section">
        <div className="mp-winter-divider"><span>❄️ 將軍山粉雪自駕 · 冬季專線</span></div>

        <div className="mp-card mp-card--winter-intro">
          <div className="mp-card-title">❄️ 冬季替代路線</div>
          <div className="mp-route-desc">
            12 月至 3 月雪季，北疆大環線轉換為「阿勒泰粉雪自駕行程」：
            以將軍山國際滑雪度假區為核心，搭配冬日禾木木屋夜宿與吉克普林挑戰雪道，
            一次領略「人類滑雪起源地」的極致魅力。
          </div>
          <div className="mp-route-meta-row" style={{ marginTop: "10px" }}>
            <span className="mp-meta-chip">🕒 5 天 4 夜</span>
            <span className="mp-meta-chip">📅 12 月 ~ 3 月</span>
            <span className="mp-meta-chip mp-meta-chip--snow">🏂 滑雪版</span>
            <a href={ROUTE1_WINTER.amapUrl} target="_blank" rel="noopener noreferrer" className="mp-amap-pin-btn" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </a>
            <a href={ROUTE1_WINTER.gmapUrl} target="_blank" rel="noopener noreferrer" className="mp-gmap-pin-btn" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mp-ski-plan-wrap">
          <img className="mp-ski-plan-img" src={img("ski-plan.jpg")} alt="將軍山5天4夜行程規劃圖" loading="lazy" />
          <div className="mp-ski-plan-caption">將軍山5天4夜行程規劃圖</div>
        </div>

        <div className="mp-spots-section-label">⛷ 冬季亮點景點</div>
        {ROUTE1_WINTER.spotIds.map(sid => (
          <SpotCard key={`w-${sid}`} spotId={sid} baseUrl={baseUrl} />
        ))}

        <div className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">📅 冬季逐日行程</div>
          <div className="mp-days-list">
            {ROUTE1_WINTER.days.map(([d, t]) => (
              <div key={d} className="mp-day-row">
                <div className="mp-day-badge">{d}</div>
                <div className="mp-day-text">{t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🗺 路線導航</div>
          <AmapRouteBtn href={ROUTE1_WINTER.amapUrl} />
          <GMapRouteBtn href={ROUTE1_WINTER.gmapUrl} />
          <div className="mp-amap-note" style={{ marginTop: "10px" }}>也可手動複製以下座標貼入高德搜尋框</div>
          {ROUTE1_WINTER.amap.map(item => (
            <div key={item.name} className="mp-amap-row">
              <span className="mp-amap-name">{item.name}</span>
              <code className="mp-amap-coord">{item.coord}</code>
            </div>
          ))}
        </div>
      </section>

      {/* ── 四條主題路線 ── */}
      {ROUTES.map(route => (
        <section key={route.id} id={`mp-s-${route.id}`} className="mp-section">

          {/* 分隔線 */}
          <div className={`mp-route-divider mp-route-divider--${route.color}`}>
            <span>{route.label} · {route.title}</span>
          </div>

          {/* 介紹卡 */}
          <div className="mp-card">
            <div className="mp-route-meta-row">
              <span className="mp-meta-chip">🕒 {route.duration}</span>
              <span className="mp-meta-chip">📅 {route.season}</span>
              <a href={route.amapUrl} target="_blank" rel="noopener noreferrer" className="mp-amap-pin-btn" onClick={e => e.stopPropagation()}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
              <a href={route.gmapUrl} target="_blank" rel="noopener noreferrer" className="mp-gmap-pin-btn" onClick={e => e.stopPropagation()}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </div>
            <div className="mp-route-audience">👤 {route.audience}</div>
            <div className="mp-route-desc">{route.desc}</div>
          </div>

          {/* 路線規劃圖 */}
          <div className="mp-ski-plan-wrap">
            <img className="mp-ski-plan-img" src={img(route.img)} alt={route.planCaption} loading="lazy" />
            <div className="mp-ski-plan-caption">{route.planCaption}</div>
          </div>

          {/* 亮點景點 */}
          <div className="mp-spots-section-label">✨ 亮點景點</div>
          {route.spotIds.map(sid => (
            <SpotCard key={sid} spotId={sid} baseUrl={baseUrl} />
          ))}

          {/* 逐日行程 */}
          <div id={`mp-c-${route.id}-days`} className="mp-card mp-card--dark">
            <div className="mp-card-title mp-card-title--light">📅 逐日行程參考</div>
            <div className="mp-days-list">
              {route.days.map(([d, t]) => (
                <div key={d} className="mp-day-row">
                  <div className="mp-day-badge">{d}</div>
                  <div className="mp-day-text">{t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 路線導航 */}
          <div id={`mp-c-${route.id}-map`} className="mp-card">
            <div className="mp-card-title">🗺 路線導航</div>
            <AmapRouteBtn href={route.amapUrl} />
            <GMapRouteBtn href={route.gmapUrl} />
            <div className="mp-map-note">裝置上已安裝對應地圖 App 則直接開啟，否則以網頁版呈現</div>
          </div>

        </section>
      ))}

      {/* ── Must-know ── */}
      <section id="mp-s-know" className="mp-section">
        <div className="mp-know-header">
          <div className="mp-know-tag">行前必知</div>
          <div className="mp-know-title">出發前請確認</div>
        </div>
        {MUST_KNOW.map(item => (
          <div key={item.title} className="mp-card mp-card--know">
            <div className="mp-know-item-header">
              <span className="mp-know-emoji">{item.emoji}</span>
              <span className="mp-know-item-title">{item.title}</span>
            </div>
            <div className="mp-know-item-desc">{item.desc}</div>
          </div>
        ))}
      </section>

      {/* ── PDF Footer ── */}
      <div className="mp-pdf-section">
        <div className="mp-footer-label">新疆，我們來了。</div>
        <a href={`${baseUrl}新疆旅遊精選路線攻略.pdf`} download className="mp-pdf-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
          下載精選路線攻略 PDF
        </a>
        <div className="mp-pdf-date">資料來源：導遊小雅新疆攻略 · 圖片來源：Wikimedia Commons CC授權</div>
      </div>

      {/* 右下角語音導讀 FAB */}
      <MobileAudioFab baseUrl={baseUrl} />
    </div>
  );
}
