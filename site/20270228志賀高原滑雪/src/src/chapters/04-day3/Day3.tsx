import "./Day3.css";

function MapPin({ q }: { q: string }) {
  return (
    <a className="d3-map-pin" target="_blank" rel="noopener noreferrer"
      href={`https://maps.google.com/?q=${encodeURIComponent(q)}`}>
      📍 地圖
    </a>
  );
}

interface Props { step: number; }

export default function Day3({ step }: Props) {
  return (
    <div className="d3-stage">
      <div className="d3-header">
        <div className="d3-day-tag">DAY 03 &nbsp;·&nbsp; 03.02 TUE</div>
        <div className="d3-day-title">一之瀨 → 燒額山 → 奧志賀</div>
      </div>

      {step === 0 && (
        <div className="d3-block">
          <div className="d3-ticket">
            <span className="d3-ticket-label">3日券</span>
            <span className="d3-ticket-day">Day 2 / 3</span>
          </div>
          <div className="d3-route">
            <div className="d3-route-stop d3-route-stop--active">
              一之瀨
              <MapPin q="Ichinose Ski Area Shiga Kogen Nagano" />
            </div>
            <span className="d3-route-sep">→</span>
            <div className="d3-route-stop">
              燒額山
              <MapPin q="Yakebitaiyama Ski Area Shiga Kogen Nagano" />
            </div>
            <span className="d3-route-sep">→</span>
            <div className="d3-route-stop">
              奧志賀
              <MapPin q="Okushiga Kogen Ski Area Nagano" />
            </div>
          </div>
          <div className="d3-note-box">
            <div className="d3-note-label">主力巡航日</div>
            <div className="d3-note-text">今天是體力主戰場，三個雪場串成一條長路線，把最好的雪況留給今天。</div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="d3-block">
          <div className="d3-spot">
            <div className="d3-spot-name">一之瀨</div>
            <div className="d3-spot-tag">志賀高原最大雪場區塊</div>
            <MapPin q="Ichinose Ski Area Shiga Kogen Nagano" />
          </div>
          <div className="d3-note-box">
            <div className="d3-note-label">開場</div>
            <div className="d3-note-text">纜車網密集，坡道選擇多，早上先把體力用在這裡熱身。</div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="d3-block">
          <div className="d3-spot">
            <div className="d3-spot-name">燒額山</div>
            <div className="d3-spot-tag">1998 長野冬奧滑降賽道</div>
            <MapPin q="Yakebitaiyama Ski Area Shiga Kogen Nagano" />
          </div>
          <div className="d3-note-box">
            <div className="d3-note-label">競技級雪道</div>
            <div className="d3-note-text">雪質紮實，適合拉開速度，感受一次冬奧選手滑過的坡道。</div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="d3-block">
          <div className="d3-spot">
            <div className="d3-spot-name">奧志賀</div>
            <div className="d3-spot-tag">志賀高原最深處</div>
            <MapPin q="Okushiga Kogen Ski Area Nagano" />
          </div>
          <div className="d3-note-box">
            <div className="d3-note-label">下午：預留回程時間</div>
            <div className="d3-note-text">遊客相對少、雪況相對原始，但別滑到沒力氣走回纜車站——早點折返。</div>
          </div>
        </div>
      )}
    </div>
  );
}
