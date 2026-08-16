import "./Day5.css";

interface Props { step: number; }

export default function Day5({ step }: Props) {
  return (
    <div className="d5-stage">
      <div className="d5-header">
        <div className="d5-day-tag">DAY 05 &nbsp;·&nbsp; 03.04 THU</div>
        <div className="d5-day-title">歸途</div>
      </div>

      {step === 0 && (
        <div className="d5-block">
          <div className="d5-flight-row">
            <div className="d5-node">
              <div className="d5-node-name">HND 羽田</div>
              <div className="d5-node-time">05:00</div>
            </div>
            <div className="d5-arrow">
              <div className="d5-arrow-line" />
              <div className="d5-arrow-dur">虎航 IT</div>
            </div>
            <div className="d5-node">
              <div className="d5-node-name">TPE 桃園</div>
              <div className="d5-node-time">07:55</div>
            </div>
          </div>
          <div className="d5-end">
            <div className="d5-end-title">四天三夜，三日券連滑三天。</div>
            <div className="d5-end-sub">日本最大雪場群，這次算是滑透了。</div>
          </div>
        </div>
      )}
    </div>
  );
}
