import { useEffect } from "react";
import "./MobilePage.css";

interface Props {
  baseUrl: string;
}

export function MobilePage({ baseUrl }: Props) {
  const img = (name: string) => `${baseUrl}images/${name}`;

  // base.css locks html/body/root with overflow:hidden for the stage layout.
  // Mobile is a plain scrollable page — unlock on mount, restore on unmount.
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const root = document.getElementById("root");
    if (root) els.push(root);
    els.forEach(el => {
      el.style.overflow = "visible";
      el.style.height = "auto";
    });
    return () => {
      els.forEach(el => {
        el.style.overflow = "";
        el.style.height = "";
      });
    };
  }, []);

  return (
    <div className="mp-root">

      {/* ── Hero ── */}
      <div className="mp-hero">
        <img className="mp-hero-img" src={img("cover.jpg")} alt="澎湖家族行" />
        <div className="mp-hero-text">
          <div className="mp-hero-sub">帶著一歲半的小寶寶</div>
          <div className="mp-hero-title">澎湖家族行</div>
          <div className="mp-hero-badges">
            <span className="mp-badge">九人成行</span>
            <span className="mp-badge">四天三夜</span>
            <span className="mp-badge">2026 · 五月</span>
          </div>
        </div>
      </div>

      {/* ── Day 1 ── */}
      <section className="mp-day">
        <img className="mp-day-img" src={img("day1.jpg")} alt="Day 1" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 1</span>
          <span className="mp-day-date">5月28日（四）</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">✈️ 航班</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">松山機場</div>
              <div className="mp-flight-time">12:10</div>
            </div>
            <div className="mp-flight-mid">→ 1小時 →</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">馬公機場</div>
              <div className="mp-flight-time">13:10</div>
            </div>
          </div>
          <div className="mp-tag-inline">華信航空</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🚗 抵達後分兩組</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">取車組（3人）</div>
              <div className="mp-col-val">順順租車行<br />Tiida + 機車 2 台</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">民宿組（其餘）</div>
              <div className="mp-col-val">接機專車<br />大件行李同行</div>
            </div>
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🏠 住宿</div>
          <div className="mp-hotel">夏天正涼民宿</div>
          <div className="mp-muted">3 晚 · 每日含早餐</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🧋 下午茶（三選一）約 15:00</div>
          {[
            { name: "楊媽媽韭菜盒", addr: "樹德路 15 號" },
            { name: "蔬脆蛋餅", addr: "光明路 45 號" },
            { name: "老家餡餅", addr: "民權路 72 號" },
          ].map(o => (
            <div className="mp-list-item" key={o.name}>
              <div className="mp-list-name">{o.name}</div>
              <div className="mp-list-sub">{o.addr}</div>
            </div>
          ))}
          <div className="mp-note">當天視距離順路決定</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🍽️ 晚餐 17:30</div>
          <div className="mp-highlight">阿東餐廳</div>
          <div className="mp-muted">澎湖在地海鮮桌菜 · 已預訂</div>
        </div>

        <div className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">🎆 花火節 21:00</div>
          <div className="mp-big-light">觀音亭煙火秀</div>
          <div className="mp-muted-light">提早去找好位置</div>
        </div>
      </section>

      {/* ── Day 2 ── */}
      <section className="mp-day">
        <img className="mp-day-img" src={img("day2.jpg")} alt="Day 2" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 2</span>
          <span className="mp-day-date">5月29日（五）整趟最豐富的一天</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">⛵ 員貝島嶼遊</div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-airport">07:40 集合</div>
              <div className="mp-flight-time-sm">岐頭遊客中心</div>
            </div>
            <div className="mp-flight-mid">開船 08:30</div>
            <div className="mp-flight-node">
              <div className="mp-flight-airport">14:30 回程</div>
              <div className="mp-flight-time-sm">共 6 小時</div>
            </div>
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🦅 季節限定</div>
          <div className="mp-highlight">賞燕鷗</div>
          <div className="mp-muted">搭船出海，邂逅夏日候鳥</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🌊 二選一體驗</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">潮間帶踏浪</div>
              <div className="mp-col-val">赤腳走入，探索海洋生態</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">傳統手捲圈釣魚</div>
              <div className="mp-col-val">澎湖傳統釣法體驗</div>
            </div>
          </div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🍱 島上午餐 & 體驗</div>
          {[
            { name: "豪華海島午餐", sub: "島上現做，邊吃邊看海" },
            { name: "小管一日干體驗", sub: "每人一隻小管，自己動手做" },
          ].map(i => (
            <div className="mp-list-item" key={i.name}>
              <div className="mp-list-name">{i.name}</div>
              <div className="mp-list-sub">{i.sub}</div>
            </div>
          ))}
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🐠 澎湖水族館 14:40 抵達</div>
          {[
            { time: "14:00", event: "礁岩池 — 魚魚啄菜球時間" },
            { time: "15:00", event: "大洋池 — 精彩餵食秀" },
            { time: "15:30", event: "觸摸池 — 生態親密接觸" },
          ].map(s => (
            <div className="mp-list-item" key={s.time}>
              <div className="mp-list-name">{s.time}</div>
              <div className="mp-list-sub">{s.event}</div>
            </div>
          ))}
          <div className="mp-note">室內 · 帶小孩最適合</div>
        </div>
      </section>

      {/* ── Day 3 ── */}
      <section className="mp-day">
        <img className="mp-day-img" src={img("day3.jpg")} alt="Day 3" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 3</span>
          <span className="mp-day-date">5月30日（六）</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🐟 第三魚市場（自由參加）</div>
          <div className="mp-highlight">05:00 – 07:00</div>
          <div className="mp-muted">澎湖最在地的清晨漁獲拍賣</div>
          <div className="mp-note">不想去的人繼續睡就好 😴</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🌉 西嶼鄉一日遊 09:30</div>
          <div className="mp-tags-row">
            <span className="mp-tag-chip">跨海大橋</span>
            <span className="mp-tag-chip">二崁聚落</span>
          </div>
          <div className="mp-muted">沿途慢慢走</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🦑 晶翔號夜釣小管</div>
          <div className="mp-row-between mp-time-row">
            <div className="mp-flight-node">
              <div className="mp-flight-time">17:30</div>
              <div className="mp-flight-airport">出發</div>
            </div>
            <div className="mp-flight-mid">→</div>
            <div className="mp-flight-node">
              <div className="mp-flight-time">20:30</div>
              <div className="mp-flight-airport">結束</div>
            </div>
          </div>
          <div className="mp-muted">集合：白沙鄉沙港村碼頭 · 提前 10 分鐘到</div>
          <div className="mp-two-col" style={{ marginTop: 12 }}>
            <div className="mp-col-item">
              <div className="mp-col-label">夜間海上垂釣</div>
              <div className="mp-col-val">五點半出發</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">現煮漁夫料理</div>
              <div className="mp-col-val">釣完直接吃</div>
            </div>
          </div>
        </div>

        <div className="mp-card mp-card--warn">
          <div className="mp-card-title">⚠️ 重要提醒</div>
          <div className="mp-big-light">小管噴墨汁</div>
          <div className="mp-muted-light">當晚絕對不要穿淺色衣服</div>
          <div className="mp-muted-light" style={{ fontWeight: 700 }}>任何淺色都不行</div>
        </div>
      </section>

      {/* ── Day 4 ── */}
      <section className="mp-day">
        <img className="mp-day-img" src={img("day4.jpg")} alt="Day 4" />
        <div className="mp-day-header">
          <span className="mp-day-tag">Day 4</span>
          <span className="mp-day-date">5月31日（日）最後一天</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🗺️ 市區自由行 09:00 – 12:00</div>
          <div className="mp-tags-row">
            {["北辰市場", "天后宮", "中央老街", "菊島之星", "澎湖開拓館"].map(s => (
              <span className="mp-tag-chip" key={s}>{s}</span>
            ))}
          </div>
          <div className="mp-note">自由逛街，順便帶伴手禮回家</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🚗 歸還車輛 13:30</div>
          <div className="mp-muted">還車前先加滿油 — 汽車 + 機車 × 2</div>
        </div>

        <div className="mp-card mp-card--dark">
          <div className="mp-card-title mp-card-title--light">✈️ 返程</div>
          <div className="mp-row-between">
            <div className="mp-flight-node">
              <div className="mp-flight-airport-light">14:00 報到</div>
              <div className="mp-flight-time-light">15:40 起飛</div>
              <div className="mp-flight-airport-light">馬公機場</div>
            </div>
            <div className="mp-flight-mid-light">→</div>
            <div className="mp-flight-node">
              <div className="mp-flight-time-light">16:35 落地</div>
              <div className="mp-flight-airport-light">松山機場</div>
            </div>
          </div>
          <div className="mp-finale">四天三夜，圓滿落幕 ✨</div>
        </div>
      </section>

      {/* ── Must-Know ── */}
      <section className="mp-day">
        <div className="mp-day-header mp-day-header--nophoto">
          <span className="mp-day-tag">出發前</span>
          <span className="mp-day-date">必知事項 & 伴手禮攻略</span>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">📋 必備證件</div>
          {[
            { name: "身分證", who: "大人必備" },
            { name: "健保卡", who: "小朋友" },
            { name: "駕照", who: "開車必備" },
          ].map(d => (
            <div className="mp-list-item" key={d.name}>
              <div className="mp-list-name">{d.name}</div>
              <div className="mp-list-sub">{d.who}</div>
            </div>
          ))}
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🧳 行李限制</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">手提</div>
              <div className="mp-col-val">1件 · 7 kg<br />56×36×23 cm</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">託運</div>
              <div className="mp-col-val">10 kg<br />三邊總和 ≤ 180 cm</div>
            </div>
          </div>
          <div className="mp-note">別超重！</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">⏰ 報到截止</div>
          <div className="mp-two-col">
            <div className="mp-col-item">
              <div className="mp-col-label">去程</div>
              <div className="mp-flight-time">11:40</div>
            </div>
            <div className="mp-col-item">
              <div className="mp-col-label">回程</div>
              <div className="mp-flight-time">15:10</div>
            </div>
          </div>
          <div className="mp-note">提早到，別遲到</div>
        </div>

        <div className="mp-card mp-card--warn">
          <div className="mp-card-title">💊 夜釣必備</div>
          <div className="mp-big-light">暈船藥</div>
          <div className="mp-muted-light">船停在海上還是會搖，容易暈的提前吃好</div>
        </div>

        <div className="mp-card">
          <div className="mp-card-title">🎁 伴手禮攻略</div>
          <div className="mp-souvenir-grid">
            {[
              { name: "黑糖糕", shops: "水月堂 · 春仁（在地）\n御品家（機場）", imgFile: "souvenir-black-sugar-cake.jpg" },
              { name: "干貝醬", shops: "高林 · 胡媽媽灶腳", imgFile: "souvenir-scallop-sauce.jpg" },
              { name: "花生酥", shops: "正一", imgFile: "souvenir-peanut.jpg" },
              { name: "鹹餅", shops: "盛興 · 泉利", imgFile: "souvenir-salty-cracker.jpg" },
            ].map(s => (
              <div className="mp-souvenir-item" key={s.name}>
                <img className="mp-souvenir-img" src={img(s.imgFile)} alt={s.name} />
                <div className="mp-souvenir-name">{s.name}</div>
                <div className="mp-souvenir-shops">{s.shops}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mp-footer">澎湖，我們來了。</div>
    </div>
  );
}
