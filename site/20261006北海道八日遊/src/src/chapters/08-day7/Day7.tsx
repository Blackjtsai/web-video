import "./Day7.css";

interface Props { step: number; }
const base = import.meta.env.BASE_URL;

export default function Day7({ step }: Props) {
  if (step === 0) return <Step0 />;
  if (step === 1) return <Step1 />;
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  return null;
}

function Step0() {
  return (
    <div className="d7-hero">
      <div className="d7-hero-photo"><img src={`${base}images/day7.jpg`} alt="Day 7 小樽 慶功" /></div>
      <div className="d7-hero-info">
        <div className="d7-day-label">Day 7 · 10/12 (Sun)</div>
        <div className="d7-day-title">小樽遊船<br />和牛慶功宴</div>
        <div className="d7-day-sub">小樽運河遊船 → 伴手禮採購<br />→ 還車 → 頂級燒肉慶功</div>
        <div className="d7-accent-bar" />
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="d7-canal">
      <div className="d7-canal-kicker">Morning · Otaru Canal Cruise</div>
      <div className="d7-canal-title"><span>小樽運河</span>遊船</div>
      <div className="d7-canal-badge">長輩免走路：坐船看紅磚倉庫群</div>
      <div className="d7-canal-body">
        舒服坐在遊船上，以絕佳視野遊覽浪漫紅磚倉庫群。
        拍出的照片比岸上站著還要好看。
      </div>
      <div className="d7-canal-photo">
        <img src={`${base}images/otaru-canal.jpg`} alt="小樽運河" />
      </div>
    </div>
  );
}

function Step2() {
  const items = ["白色戀人", "六花亭", "薯條三兄弟", "起司蛋糕"];
  return (
    <div className="d7-shop">
      <div className="d7-shop-left">
        <div className="d7-shop-kicker">After Cruise · Shopping</div>
        <div className="d7-shop-title"><span>音樂盒堂</span><br />× 北菓樓</div>
        <div className="d7-shop-body">
          下船後在音樂盒堂和北菓樓採買伴手禮。
          行李箱的重量，又多了幾公斤。
        </div>
        <div className="d7-shop-tags">
          {items.map(i => <span key={i} className="d7-shop-tag">{i}</span>)}
        </div>
      </div>
      <div className="d7-shop-right">
        <div className="d7-box-lid" />
        <div className="d7-box-body" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 3, background: "var(--accent)", transform: "translateX(-50%)" }} />
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="d7-wagyu">
      <div className="d7-wagyu-label">Dinner · Celebration</div>
      <div className="d7-wagyu-title">頂級<span>和牛燒肉</span><br />自駕慶功宴</div>
      <div className="d7-wagyu-no-lamb">全員不吃羊肉！訂位前確認菜單</div>
      <div className="d7-wagyu-body">
        歡慶四天自駕成功！特別安排札幌極致和牛燒肉名店，不吃羊也能極致奢華澎湃。
      </div>
      <div className="d7-wagyu-places">
        <div className="d7-wagyu-place">燒肉世界肉之兵衛</div>
        <div className="d7-wagyu-place">德壽</div>
      </div>
    </div>
  );
}
