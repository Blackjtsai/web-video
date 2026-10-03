from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether

pdfmetrics.registerFont(TTFont("L", "/System/Library/Fonts/STHeiti Light.ttc", subfontIndex=0))
pdfmetrics.registerFont(TTFont("M", "/System/Library/Fonts/STHeiti Medium.ttc", subfontIndex=0))
ACC = colors.HexColor("#bf4400"); INK = colors.HexColor("#2a1a0e"); MUTE = colors.HexColor("#7a5c3e"); SOFT = colors.HexColor("#f5ece0")
S = lambda n, **k: ParagraphStyle(n, fontName=k.pop("fontName", "L"), textColor=k.pop("textColor", INK), **k)
title = S("t", fontName="M", fontSize=22, leading=30, textColor=ACC)
sub = S("s", fontSize=10.5, leading=16, textColor=MUTE)
h2 = S("h2", fontName="M", fontSize=14, leading=20, textColor=ACC, spaceBefore=10, spaceAfter=4)
dayh = S("dh", fontName="M", fontSize=12, leading=18, textColor=colors.white)
body = S("b", fontSize=10, leading=16)
cell = S("c", fontSize=9.5, leading=14)
cellh = S("ch", fontName="M", fontSize=9.5, leading=14, textColor=colors.white)
bul = S("bu", fontSize=10, leading=16, leftIndent=10, bulletIndent=0, bulletFontName="L")
meal = S("m", fontSize=9.5, leading=15, textColor=MUTE, leftIndent=0, spaceBefore=2)

def footer(c, d):
    c.saveState(); c.setFont("L", 8); c.setFillColor(MUTE)
    c.drawString(18*mm, 10*mm, "2026 北海道秋季家族慢活之旅"); c.drawRightString(A4[0]-18*mm, 10*mm, f"{d.page}"); c.restoreState()

HOTELS = [
 ("10/06 (二)", "札幌京急 EX 酒店", "附早餐", "札幌市區住宿"),
 ("10/07 (三)", "札幌京急 EX 酒店", "附早餐", "連住第二晚"),
 ("10/08 (四)", "札幌京急 EX 酒店", "附早餐", "連住第三晚"),
 ("10/09 (五)", "洞爺湖萬世閣", "附早晚餐", "洞爺湖溫泉住宿，晚餐為自助餐"),
 ("10/10 (六)", "Torifito Hotel & Pod Niseko", "附早餐", "二世谷住宿"),
 ("10/11 (日)", "Glow", "不含餐", "小樽住宿（包棟別墅）"),
 ("10/12 (一)", "札幌京急 EX 酒店", "附早餐", "返回札幌"),
]
DAYS = [
 ("10/06 (二)｜DAY 1：抵達北海道、札幌初日", "桃園機場 → 新千歲機場 → JR 快速 Airport 號 → 札幌", [
  "03:40 出發前往桃園機場；虎航 IT236 06:20 起飛，11:05 抵達新千歲",
  "12:15 出關後步行至國內線航廈 3 樓午餐（約 5–8 分鐘）",
  "14:19 搭 JR 快速 Airport 號前往札幌，約 40 分鐘，自由席 ¥1,230",
  "15:30 Check-in 稍作休息；16:30 JR 塔觀景台"],
  "早餐：機上｜午餐：新千歲機場國內線航廈｜晚餐 18:00：根室花丸或奧芝湯咖哩"),
 ("10/07 (三)｜DAY 2：札幌市區慢遊", "步行、地鐵與路面電車彈性移動", [
  "二條市場、札幌電視塔、大通公園、狸小路商店街",
  "夜景：藻岩山（有興趣者前往）。搭路面電車至「纜車入口站」步行 7–10 分鐘，或搭免費接駁車至藻岩山麓站購票上山"],
  "早餐：飯店｜午餐：Dekitateya Tokeidai Branch｜晚餐：蟹座 (17:30，建議提早訂位)"),
 ("10/08 (四)｜DAY 3：札幌經典景點", "以地鐵東西線為主", [
  "北海道神宮：圓山公園站 (T06) 步行約 14 分鐘",
  "場外市場：二十四軒站 (T04) 步行約 10 分鐘；或 JR 桑園站西剪票口步行 8–12 分鐘",
  "白色戀人公園：宮之澤站 (T01)",
  "發寒 AEON Mall：發寒南站 (T02)"],
  "早餐：飯店｜午餐：場外市場或 AEON Mall｜晚餐：札幌車站附近"),
 ("10/09 (五)｜DAY 4：取車自駕、定山溪、支笏湖、洞爺湖", "08:30 前往 WNR 取車，開始自駕", [
  "定山溪散步：二見公園、二見吊橋、河童淵、赤岩の洞；停車：定山溪公共停車場 (¥500)",
  "定山湖大壩（豐平峽水庫）",
  "支笏湖：Patissier Labo 甜品店",
  "道之驛洞爺湖展望台"],
  "早餐：飯店｜午餐：定山溪 Konno 拉麵店或紅葉亭（蕎麥麵、天丼）｜晚餐：洞爺湖萬世閣飯店自助餐"),
 ("10/10 (六)｜DAY 5：有珠山、二世谷、神仙沼", "洞爺湖 → 有珠山 → 二世谷，自駕移動", [
  "有珠山纜車：導航設定「有珠山 昭和新山駐車場」，纜車約每 15 分鐘一班（00、15、30、45 分）",
  "道之驛洞爺湖展望台",
  "Niseko View Plaza 道路休息站、高橋牧場",
  "神仙沼"],
  "早餐：飯店｜午餐：行程中彈性安排｜晚餐：札幌らーめん 大心 ニセコ店（Sapporo Ramen Daishin Niseko）"),
 ("10/11 (日)｜DAY 6：積丹半島、余市、小樽", "二世谷 → 積丹半島 → 余市 → 小樽，自駕移動", [
  "島武意海岸", "神威岬",
  "余市威士忌蒸餾所", "柿崎商店與對面的余市",
  "小樽天狗山觀景台", "入住 Glow（不含餐）"],
  "早餐：飯店｜午餐、晚餐：行程中彈性安排"),
 ("10/12 (一)｜DAY 7：小樽慢遊、返回札幌", "小樽市區慢遊；當晚返回札幌住宿", [
  "早餐自理",
  "三角市場、小樽堺町通商店街、小樽運河",
  "返回札幌並還車"],
  "早餐：自理｜午餐、晚餐：行程中彈性安排"),
 ("10/13 (二)｜DAY 8：新千歲機場、返程回家", "札幌 → JR 前往新千歲機場 → 搭乘 IT235 返回台北", [
  "07:00 飯店早餐；08:45 出發前往機場",
  "JR 班次參考：09:00→09:37、09:04→09:48、09:18→09:57",
  "虎航 IT235：新千歲 12:05 起飛，台北 15:20 抵達"],
  "早餐：飯店｜午餐：機上"),
]

doc = SimpleDocTemplate("/tmp/hk_manual.pdf" if False else "hk_manual.pdf", pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=16*mm, bottomMargin=16*mm,
                        title="2026 北海道秋季家族慢活之旅 行程手冊", author="Eason")
W = A4[0] - 36*mm
st = []
# Page 1: map
st += [Paragraph("2026 北海道秋季家族慢活之旅", title), Paragraph("8 天 7 夜｜2026/10/06 (二) ～ 10/13 (二)｜路線地圖（示意）", sub), Spacer(1, 4*mm)]
mh = 297*mm - 32*mm - 30*mm
st += [Image("map.jpg", width=mh*2/3, height=mh, hAlign="CENTER"), PageBreak()]
# Page 2: basics + hotels
st += [Paragraph("基本資訊與交通配置", h2)]
info = [
 ["旅遊日期", "2026/10/06 (二) ～ 10/13 (二)｜8 天 7 夜"],
 ["家族成員", "共 6 人"],
 ["去程", "台灣虎航 IT236｜台北 06:20 → 新千歲 11:05"],
 ["回程", "台灣虎航 IT235｜新千歲 12:05 → 台北 15:20"],
 ["自駕", "10/09 08:30 前往 WNR 取車；路線：定山溪 → 支笏湖 → 洞爺湖 → 二世谷 → 積丹 → 余市 → 小樽"],
]
t = Table([[Paragraph(a, S("k", fontName="M", fontSize=9.5, leading=14, textColor=MUTE)), Paragraph(b, cell)] for a, b in info], colWidths=[24*mm, W-24*mm])
t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LINEBELOW",(0,0),(-1,-1),0.4,colors.HexColor("#d8c8b0")),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
st += [t, Paragraph("飯店住宿一覽表", h2)]
rows = [[Paragraph(x, cellh) for x in ("日期", "住宿飯店 / 民宿名稱", "餐食", "備註")]] + [[Paragraph(c, cell) for c in r] for r in HOTELS]
t = Table(rows, colWidths=[24*mm, 60*mm, 22*mm, W-106*mm], repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),INK),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,SOFT]),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("GRID",(0,0),(-1,-1),0.4,colors.HexColor("#d8c8b0")),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
st += [t, Paragraph("行前核心提醒", h2)]
for x in ["10/07 17:30 蟹座，六人含長輩，請提早上網訂位。",
          "Day 4 起進入自駕段，出發前確認 WNR 取車資料、駕照／日文譯本與導航設定。",
          "10 月北海道早晚溫差大，洞爺湖、二世谷、積丹等戶外景點建議攜帶保暖與防風外套。",
          "全員不吃羊肉，訂餐廳前請確認菜單。",
          "10/11 Glow 不含餐，餐食需自行安排。"]:
    st.append(Paragraph(x, bul, bulletText="•"))
import json as _json
WX = _json.load(open("wx.json", encoding="utf-8"))
st.append(Paragraph("每日天氣預報（參考）", h2))
wrows = [[Paragraph(x, cellh) for x in ("日期", "地點", "天氣", "氣溫", "降雨機率", "雨量")]] + \
        [[Paragraph(f"{w['day']} {w['date']}", cell), Paragraph(w["place"], cell), Paragraph(w["text"], cell),
          Paragraph(f"{w['min']}–{w['max']}°C", cell), Paragraph(f"{w['pop']}%", cell), Paragraph(f"{w['rain']} mm", cell)] for w in WX]
t = Table(wrows, colWidths=[40*mm, 22*mm, 24*mm, 28*mm, 24*mm, W-138*mm], repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),INK),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,SOFT]),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("GRID",(0,0),(-1,-1),0.4,colors.HexColor("#d8c8b0")),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
st += [t, Paragraph("資料：Open-Meteo｜查詢時間 2026/10/03 20:04（台灣時間）｜預報會變動，出發前請再確認。", S("wn", fontSize=8.5, leading=13, textColor=MUTE))]
st.append(PageBreak())
# Daily
st.append(Paragraph("每日詳細行程規劃", h2))
for head, tr, items, meals in DAYS:
    hd = Table([[Paragraph(head, dayh)]], colWidths=[W]); hd.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),ACC),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),("LEFTPADDING",(0,0),(-1,-1),8)]))
    blk = [hd, Spacer(1, 2*mm), Paragraph("交通：" + tr, S("tr", fontSize=9.5, leading=15, textColor=MUTE))]
    blk += [Paragraph(i, bul, bulletText="•") for i in items] + [Paragraph("餐飲：" + meals, meal), Spacer(1, 5*mm)]
    st.append(KeepTogether(blk))
doc.build(st, onFirstPage=footer, onLaterPages=footer)
print("ok")
