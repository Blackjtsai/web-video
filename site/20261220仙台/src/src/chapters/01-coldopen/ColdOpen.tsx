import "./ColdOpen.css";

interface Props { step: number; }

const FLAKES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5.2 + 2) % 98}%`,
  delay: `${(i * 0.35) % 4}s`,
  dur: `${4 + (i % 5) * 0.6}s`,
  size: i % 3 === 0 ? "5px" : i % 3 === 1 ? "3px" : "2px",
}));

const RESORTS = [
  { name: "宮城藏王\nEboshi", date: "12/21", delay: "0ms" },
  { name: "山形藏王\n溫泉滑雪場", date: "12/22", delay: "200ms" },
  { name: "仙台泉\nSpring Valley", date: "12/23", delay: "400ms" },
];

const STATS = [
  { num: "5", unit: "天", label: "五天四夜", delay: "0ms" },
  { num: "3", unit: "座", label: "雪場連破", delay: "150ms" },
  { num: "4WD", unit: "", label: "全程自駕", delay: "300ms" },
];

export default function ColdOpen({ step }: Props) {
  return (
    <div className="co-stage">
      <div className="co-snow">
        {FLAKES.map(f => (
          <div key={f.id} className="co-flake" style={{ left: f.left, width: f.size, height: f.size, animationDelay: f.delay, animationDuration: f.dur }} />
        ))}
      </div>

      {step === 0 && (
        <div className="co-hero">
          <div className="co-year">2026 · TOHOKU · WINTER</div>
          <div className="co-title">SENDAI</div>
          <div className="co-title-cn">仙台滑雪</div>
          <div className="co-dates">DEC 20 — DEC 24 &nbsp;·&nbsp; 5 DAYS &nbsp;·&nbsp; 3 MEN</div>
        </div>
      )}

      {step === 1 && (
        <div className="co-members-wrap">
          <div className="co-members">
            {[
              { icon: "🏂", label: "型男一號", delay: "0ms" },
              { icon: "⛷️", label: "型男二號", delay: "150ms" },
              { icon: "🎿", label: "型男三號", delay: "300ms" },
            ].map((m, i) => (
              <div key={i} className="co-member co-member--visible" style={{ animationDelay: m.delay }}>
                <div className="co-member-avatar"><div className="co-member-icon">{m.icon}</div></div>
                <div className="co-member-num">0{i + 1}</div>
                <div className="co-member-label">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="co-members-label">THREE MEN · ONE MISSION · PURE POWDER</div>
        </div>
      )}

      {step === 2 && (
        <div className="co-route">
          <div className="co-route-title">SKI RESORT ROUTE</div>
          <div className="co-route-line">
            {RESORTS.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                <div className="co-resort co-resort--visible" style={{ animationDelay: r.delay }}>
                  <div className="co-resort-dot" />
                  <div className="co-resort-name" style={{ whiteSpace: "pre-line" }}>{r.name}</div>
                  <div className="co-resort-date">{r.date}</div>
                </div>
                {i < 2 && (
                  <div className="co-route-connector co-route-connector--visible" style={{ animationDelay: `${parseInt(r.delay) + 300}ms` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="co-stats">
          {STATS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div className="co-stat co-stat--visible" style={{ animationDelay: s.delay }}>
                <div className="co-stat-num">{s.num}<span className="co-stat-unit">{s.unit}</span></div>
                <div className="co-stat-label">{s.label}</div>
              </div>
              {i < 2 && <div className="co-stat-divider" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
