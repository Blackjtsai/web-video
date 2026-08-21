import "./Day2.css";

function MapPin({ q }: { q: string }) {
  return (
    <a className="d2-map-pin" target="_blank" rel="noopener noreferrer"
      href={`https://maps.google.com/?q=${encodeURIComponent(q)}`}>
      📍 地圖
    </a>
  );
}

interface Props { step: number; }

export default function Day2({ step }: Props) {
  return (
    <div className="d2-stage">
      <div className="d2-header">
        <div className="d2-day-tag">DAY 02 &nbsp;·&nbsp; 03.01 MON</div>
        <div className="d2-day-title">高天原・中央區全天滑</div>
      </div>

      {step === 0 && (
        <div className="d2-block">
          <div className="d2-ticket">
            <span className="d2-ticket-label">3日券</span>
            <span className="d2-ticket-day">Day 1 / 3</span>
          </div>
          <div className="d2-note-box">
            <div className="d2-note-label">零移動日</div>
            <div className="d2-note-text">飯店門口就是雪場入口，吃完早餐直接踩雪板出發，不用搬行李、不用換飯店。</div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="d2-block">
          <div className="d2-resort-row">
            <div className="d2-resort-card">
              <div className="d2-resort-name">高天原</div>
              <div className="d2-resort-desc">住宿基地・坡度平緩</div>
              <MapPin q="Kotanbara Bus Terminal Shiga Kogen Nagano" />
            </div>
            <div className="d2-resort-card">
              <div className="d2-resort-name">中央區</div>
              <div className="d2-resort-desc">雪道寬・適合熱身</div>
              <MapPin q="Shiga Kogen Chuo Ski Area Nagano" />
            </div>
          </div>
          <div className="d2-note-box">
            <div className="d2-note-label">上午：熱身</div>
            <div className="d2-note-text">先在坡度平緩的雪道找回身體感覺，再往中階路線推進。</div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="d2-block">
          <div className="d2-resort-row">
            <div className="d2-resort-card">
              <div className="d2-resort-name">東館山</div>
              <div className="d2-resort-desc">纜車直達・視野開闊</div>
              <MapPin q="Higashidateyama Ski Area Shiga Kogen Nagano" />
            </div>
            <div className="d2-resort-card">
              <div className="d2-resort-name">寺小屋</div>
              <div className="d2-resort-desc">中階路線・坡度拉高</div>
              <MapPin q="Terakoya Ski Area Shiga Kogen Nagano" />
            </div>
          </div>
          <div className="d2-note-box">
            <div className="d2-note-label">下午：拉高強度</div>
            <div className="d2-note-text">纜車串過去不用脫雪板走路，適合熱身完接著挑戰中階路線。</div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="d2-block">
          <div className="d2-route">
            <div className="d2-route-stop">高天原</div>
            <span className="d2-route-sep">→</span>
            <div className="d2-route-stop">東館山</div>
            <span className="d2-route-sep">→</span>
            <div className="d2-route-stop">寺小屋</div>
            <span className="d2-route-sep">→</span>
            <div className="d2-route-stop">
              一之瀨
              <MapPin q="Ichinose Ski Area Shiga Kogen Nagano" />
            </div>
            <span className="d2-route-sep">→</span>
            <div className="d2-route-stop d2-route-stop--dim">明日：燒額山・奧志賀</div>
          </div>
          <div className="d2-note-box">
            <div className="d2-note-label">先探路</div>
            <div className="d2-note-text">串到一之瀨，替明天的長程路線先探路。今晚回飯店溫泉報到，養好體力。</div>
          </div>
        </div>
      )}
    </div>
  );
}
