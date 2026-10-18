# 维护说明

## 内容编辑

地点坐标与类别在 `src/data.js`；区域日期在 `src/app.js` 的 `REGION_DATES`。详情从 `src/media.js` 的 `PLACE_MEDIA` 按地点 id 关联。

每条景点详情使用：

- `title`：中文名称
- `tagline`：一句话介绍
- `highlights`：看点数组
- `details`：详细介绍段落数组
- `history`：可靠的历史背景；没有则为 null，不显示该章
- `facts`：营业、位置、费用等 `{label,value}` 条目
- `checkedOn`、`informationSources`：核对时间及来源
- `photos`：图片 URL、中文说明、署名、原始来源与核验信息
- `note`：季节或到访提示

只使用确认为该地点的照片；在 caption 中标清冬季、非冬季和资料图。不要用图像生成补作实景，也不要把官方页面上的图片视为自由授权素材。更新营业时间时优先核对运营方及当地官方旅游网站，并区别12月时间与夏季时间。

## 补充餐厅

确认用户提供的分店名称和具体地址后再添加，避免同名店坐标混淆。`data.js` 中使用 `type: 'food'`；新内容仍放点击详情中。添加时同步调整详情类别文本和必要字段，不能把餐厅称为景点。当前没有餐厅数据。

## 验收

1. 执行 `node scripts/check.mjs` 和 `python3 build.py`。
2. 用本地 HTTP 服务打开构建结果，检查375×844和390×667两种手机视口。
3. 切换总览与三个区域；确认道路底图、日期及标记正常。总览检查机场→札幌→旭川→美瑛→旭川→机场的连续动画、循环播放、全岛视角保持不动、离开标签后停止动画，以及下滑阅读介绍。
4. 点击密集景点，确认44像素触控范围；逐张查看图片，检查加载失败提示及重试。
5. 查看一句话、看点、详细介绍、历史（可选）、实用信息章节。
6. 下滑长详情，确认关闭按钮可见可点、文字不横向溢出。
7. 原有桌面入口需要同步时使用 `python3 build.py --output ../北海道家庭旅行地图.html`。

2026-10-15：已在上述两个视口检查16个景点与37张图片，图片最终全部加载；青池冬景首次稍慢。外部照片与地图可用性仍取决于网络及来源网站。

## 本机历史资料

旧迭代截图、旧路线脚本和轮廓地图保留在忽略的 `local-archive/`；抓取研究材料保留在忽略的 `research/`。它们不上传，当前页面的来源信息已保存在 `media.js`。本地旧目录 `hokkaido-map` 是指向新目录的兼容符号链接。

## 首页北海道读本

编辑 `content/hokkaido.json`，保留主题来源、核对日期、统计口径以及 `image` 中的图片地址、说明、署名和原始网页。每主题仅展示一张对应配图，图片后跟文字说明。运行 `python3 scripts/build_intro.py`，再执行 `python3 build.py`；不要直接修改生成文章。

四大分区沿用北海道官方旅游网站：道央、道南、道北、道东。札幌及新千岁机场在道央，旭川和美瑛在道北。分区底图沿用官方 SVG 轮廓，`src/assets/intro/regions-zh.svg` 已移除日文标签，改为中文并标注四个目的地；地点为示意位置，不用于导航。

当前配图均为官方来源外链，需联网；不可把它们当作自由授权图片。若以后使用生成插画，应明确标注，不替代实景证据。人口采用2020年普查，耕地面积采用2024年数据。样式限定在 `#hokkaidoIntro`，不要影响地区地图。

## 主题封面与阅读页

首页使用七个照片封面按钮，`sections` 保存每篇的分章正文；`summary` 是封面摘要。生成脚本输出按钮和模板，`src/intro.js` 控制独立原生 dialog 阅读页。地图交互不依赖阅读页。新增章节时核验来源、年代和含义，不能仅堆年份。

验收：逐个打开七个封面，检查配图、章数、长文滚动、顶部和底部返回，以及 Escape 关闭。手机上返回按钮须始终可见；退出后保留封面列表位置。

地理章节的四区支持 `image`（含来源、尺寸、核验日期）、`position`、`role`、`spots` 和 `trip` 字段。图片必须与对应地区景点匹配；区域背景景点与既定行程须分别注明。

农业对比图数据在 `content/agriculture-comparison.json`。更新后运行 `python3 scripts/build_agriculture_chart.py` 再生成介绍及构建。分别生成耕地面积、农业产出额两张图，各列全国前五名的名称、原始数值和占比，另列其余42个都府县合计。占比从原始值计算，不能手填补数。耕地分母为全国耕地面积；产出额分母为47个都道府县估算值之和（2024年108,200亿日元），不能混用全国单独估算值107,801亿日元。不要将面积和产出额当成相同指标。

### 2026-10-15 · Seven-topic enrichment
- Reader now contains 41 chapters across geography, history, population, food, landscapes, industry and culture. Each topic gains specific explanation, photos or dated figures; map behavior remains unchanged.
- `scripts/build_reading_charts.py` builds population density, age structure, fishery comparison and historical timeline SVGs. Run it before `scripts/build_intro.py` when changing their source figures.
- Density and age use 2020 census figures, fisheries use 2024 marine fishing/aquaculture territorial statistics; processing shipments use 2023 data. Do not conflate these denominators or years.
- Optional section `image`, `chart`, and `facts` are independent of geography-only `position`, `role`, `spots`, `trip`.
- Official photos remain externally hosted and require internet; source URLs/captions are stored in content/hokkaido.json. New photos visually checked at 390×844.

### 2026-10-15 · Name the comparator prefectures
- Fishery comparison now has two charts listing named prefectures, absolute values and national shares; data is stored in content/fishery-comparison.json.
- IMPORTANT correction: use the national MAFF/JFA 2024 table for all prefectures. Hokkaido is 897,524 t and 279,298 million yen in this table, not the previous local-territorial figures. Do not mix these series.
- Quantity shows six selected prefectures, not a complete ranking: Ibaraki's marine total/aquaculture is confidential. Value shows the national top five. Remaining aggregate is explicitly described.
- Supersedes the previous fisheries scope note above. Old two-color fishery asset removed. Both charts checked at 390×844 without overflow; local standalone rebuilt byte-identically.

### 2026-10-15 · Agriculture regional comparison and chart audit
- Agriculture now has two separate mobile charts (2024): cultivated area and agricultural output. Named top-five prefectures, absolute values, shares, year and statistical scope are visible; remaining 42 prefectures are explicitly aggregated.
- Source figures and URLs live in content/agriculture-comparison.json. The obsolete agriculture-comparison.svg is removed. Reader now has 43 chapters.
- Audited all seven active charts: agricultural area/output, fishery quantity/value, population density, age structure and historical timeline. Regional charts use consistent denominators; density explicitly compares Hokkaido with Japan including Hokkaido; age percentages are Hokkaido internal age groups. Timeline is not a share comparison.
- Checked mobile reader at 390×844: charts load, labels fit without horizontal overflow, and return button remains accessible. Map scripts and attraction content are unchanged.

### 2026-10-15 · Named population comparisons
- Added content/population-comparison.json from the 2020 census table I-2-1; six prefectures at the same administrative level and date.
- population-total.svg compares populations with exact counts and reference areas; population-density.svg uses published densities on one linear scale. Hokkaido density excludes the four islands noted in the source, unlike the reference-area column.
- Both SVGs have matching 640×1120 metadata. Source labels, data values and standalone build equality checked; browser file preview was blocked by URL policy, so this revision has no completed mobile browser visual check.

### 2026-10-16 · Mobile population chart verification
- Previewed over localhost at 390×844, then checked revised charts at 375×812. Enlarged supporting text to 28 SVG units, separated exact population and area onto two lines, and increased row spacing. Both chart dimensions are now 640×1530.
- Verified all six names/values visually, loaded images, no horizontal overflow, scrolling to chart headings and footnotes, and sticky return button closure. This completes the previously blocked mobile visual check.

### 2026-10-16 · Trip weather
- Independent src/weather.js panel for fixed 2026-12-17 through 2026-12-22 dates and four selectable locations. Uses Open-Meteo daily forecast, Asia/Tokyo, forecast_days=16; opening/refresh/visible-hourly updates, no background notification service.
- Never substitutes today's weather or climate averages for out-of-range trip dates. Missing dates, missing values, past dates, timeout and failures have explicit messages. Region changes abort previous requests. Open-Meteo attribution and JMA seasonal information link remain visible.
- Run node scripts/check-weather.mjs for Japan-date boundaries, 16-day horizon, exact date lookup and null/zero values. Live API returned the expected 16-day schema; 375×812 mobile check passed region switch, refresh, six dates and no horizontal overflow. Future December forecasts cannot yet be verified against live data.
- build.py embeds weather.js in the standalone HTML; trip dates are maintained in weather.js and the panel heading.

### 2026-10-16 · December historical climate reference
- content/december-climate.json records JMA 1991–2020 December normals for Sapporo, Asahikawa and Biei, including individual station URLs and verification date. Matching static HTML in #climateReference is available offline; update both when changing source data.
- Monthly mean temperature, mean daily max/min, total snowfall depth and mean monthly maximum snow depth are explicitly historical, whole-month measures, not trip forecasts or extreme values. Biei station is not a substitute for higher-elevation Shirogane sites. Clothing guidance references official Sapporo tourism advice; its older climate figures are not reused.
- When no trip dates are forecastable, hide six repeated placeholder cards and show historical reference. Live forecasts remain above history once available. Added far-range/near-range labels, no-store fetch and JMA latest forecast/warning links. Fetch time is not model issuance time; no accuracy guarantee.
- Checked at 375×812: three cards, no horizontal overflow or label/value overlaps; historical label, snowfall explanation and clothing copy readable. Date-boundary tests continue to pass.

### 2026-10-16 · Near-departure mobile simulation
- Run python3 scripts/build_weather_preview.py after build.py to generate local-archive/weather-preview/index.html. Serve that directory locally only. It mocks Date to Dec 16 and only the weather endpoint; all weather numbers are fictitious and a persistent watermark identifies screenshots. Release HTML is never modified.
- 375×812 checks passed: six dates shown, Sapporo -4/1, Asahikawa -11/-6, Biei -14/-9 (fixture values), location coordinates and no-store fetch correct; Japan fetch times advanced 10:01 → 10:02 → 10:03, refresh → 10:04.
- Missing date gives five days and explicit missing-day text; null temperature says unavailable while zero snowfall remains 0. Network failure clears the prior data/time. A delayed Sapporo response that ignores abort did not overwrite Asahikawa after a quick switch.
- All six date headings verified; no horizontal overflow. Historical reference remains below live forecast with a separate label and styling. Screenshots are in ignored local-archive; simulation cannot verify accuracy of real December weather.

### 2026-10-16 · Compact mobile weather
- Default view shows only selected-region forecast; six days use a two-column grid on phones. Temperature notation is minimum–maximum, explained above cards. Unavailable forecasts hide both the grid and its units legend.
- Historical climate, clothing guidance and forecast/source notes use independent native details/summary controls, collapsed by default. Historical label and source content remain inside the historical panel.
- Verified actual-date empty state and simulated Dec 16 forecast at 375×812, Biei selection/time, no horizontal overflow, independent expand/collapse. Existing forecast logic tests and map checks passed; release contains no fixture data.

### 2026-10-16 · Map-to-weather region linkage
- Weather listens to region-tab clicks without modifying map rendering. Sapporo/Asahikawa/Biei tabs select and refresh the matching weather location. Overview preserves the last choice; animated route steps do not trigger weather requests.
- Historical cards are reordered in the DOM with the selected location first and visibly highlighted. Summary includes its name. Open/closed state is retained; manual weather choices also reorder history. Airport has no substituted historical station.
- 375×812 simulation checked three region tabs, successive switches, matching request location/time and current history card, overview retention, open history retention, and absence of horizontal overflow. Slow previous-location responses remain guarded by request identity.

### 2026-10-16 · Overview-only weather selector
- Regional tabs hide and disable the weather select and show the current region name instead. Overview restores the selector and keeps the last weather choice. Control mode updates even when the selected weather already matches the tab.
- 375×812 simulation verified all three named regions, overview manual airport choice, and return to Sapporo with matching weather and prioritized history; no horizontal overflow.

### 2026-10-16 · Region-scoped historical weather
- Regional pages render only their matching historical climate card; overview restores all three and labels the section as a comparison. Cached original DOM cards preserve values and station links across switches.
- Mode changes update history even when weather selection stays the same (Biei → overview → Biei). Expanded state is preserved. Verified all three regional cards and overview round trip at 375×812. Snowfall explanation now uses a general heading instead of Sapporo's specific number.

### 2026-10-16 · Weather visual hierarchy
- Empty forecast state now displays a selected-region historical temperature hero with explicit historical/not-current-forecast label, large mean low/high range, a plain-language cold summary and short clothing suggestion. Values match JMA December normals in content/december-climate.json; update the weather.js hero values alongside those normals.
- Available forecasts use weather icons and emphasized daily temperature ranges. Optional climate/clothing details remain folded; technical/source notes are secondary. Station URLs remain in source markup but are not displayed on each climate card; Open-Meteo attribution stays in optional weather notes.
- Verified 375×812 real-date hero, Biei linkage and simulated six-day forecast with icons, hero hidden and no horizontal overflow. No mock values enter the release.

### 2026-10-16 · Direct regional weather listing
- Overview now directly lists Sapporo, Asahikawa and Biei; regional map tabs show their own card. Removed weather selectors, refresh buttons and collapsible sections. Clothing, historical temperature ranges and monthly snowfall are visible without interaction.
- Near departure, each visible region fetches its own forecast concurrently, with independent timeout/error states and identity protection on map switches. Visible-hourly and reopen refresh remain. Small Open-Meteo attribution retained.
- Checked 375×812 actual-date view: three regions, zero weather buttons/selects/summaries, no overflow. Simulated forecast produced six days for each region; Biei tab reduced listing to Biei. Historical inputs remain sourced in content/december-climate.json.

### 2026-10-16 · One-screen mobile climate comparison
- Mobile cards place region left and temperature right, with one compact snowfall line and clothing line. Removed redundant feel/retry copy from the historical-only mobile layout; historical/not-current-forecast label stays visible.
- Verified 375×812 screenshot shows all three regions with clothing in one screen. At 320×740, combined cards measured about 399px tall, without horizontal overflow or region/temperature collision. Live-forecast history temperatures retain normal flow.

### 2026-10-16 · Compact six-day forecast comparison
- Overview forecasts now use one semantic table: six date rows and three regional columns, with conditions, minimum–maximum temperatures and new snowfall. Regional pages retain their own forecast and clearly labeled historical reference. Clothing stays in three short lines below the overview table.
- Historical-only footnote is hidden when the overview comparison is active. Each region retains independent fetch/error handling and Japan-time update labels; missing dates remain aligned cells.
- Simulated Dec 16 at 375×812: all six rows and three clothing lines visible together. At 320×740 no horizontal overflow or temperature overflow. Checked missing dates/null temperatures, zero snow, network errors and region/overview switching. Fixtures remain isolated in ignored local-archive; these are not real December forecasts.

### 2026-10-16 · Weather icons and stronger temperatures
- Conditions now pair decorative sun/cloud/snow/rain/fog/thunder icons with text in overview and regional forecasts. Temperatures use bold dark type and whole-degree rounding for compact phone comparisons; underlying API data is unchanged.
- At 375px and 320px, three region columns remain visible with no page or temperature overflow. Preview fixture now includes sunny/cloudy/rainy days as well as snow to check the icons; fixture data stays out of the release.

### 2026-10-16 · Regional forecast verification and scroll fix
- Verified Sapporo, Asahikawa and Biei in six sequential switches at 375×812: one matching region, six icons/dates, 18px/800-weight temperatures, matching coordinates and Japan update times. 320px rows and page did not overflow.
- Delayed Sapporo by three seconds while ignoring abort, then switched to Biei: the late response did not replace Biei values or update time. Returning to overview restored the three-column comparison.
- Found regional main inherited non-scrolling full-screen map layout. Enabled main vertical scrolling for regional pages while retaining the map panel's 100% viewport height. Touch scrolling now reaches the last forecast date, historical reference and clothing. Rechecked regional switching and overview after the fix. All weather values in this check were isolated simulation data.

### 2026-10-16 · Compact regional forecasts and separate history
- Regional live forecasts use six dense rows with icons, bold 18–20px temperatures and secondary precipitation/snow text. Update time follows the forecast; historical climate and clothing move into a separate warm-colored panel headed with the region and explicitly labeled not this year's forecast.
- Verified all three regions at 320px: six rows, matching data/history region and no row overflow; forecast height about 352px (368px at 375px). Overview still restores its six-row three-region table. Historical-only and network-failure rendering paths retain the original compact cards.

### 2026-10-16 · Single-row mobile region tabs
- All four phone pages now share a four-column tab row with region, compact month/day dates and day numbers. Overview explicitly shows days 1–6. Desktop keeps full date notation. Header spacing is consistent across tabs.
- At 320px all four buttons share one row, measure 71×67px and have no horizontal text overflow. Switching all four tabs kept the layout consistent. At 375px the six-day regional forecast fits with substantially more visible space than the previous two-row tabs.

### 2026-10-16 · Four-tab phone scroll verification
- Checked 375px maps: loaded road tiles, 7/3/6 regional markers and 4 overview hubs; dates/day labels intact across forward and reverse switches.
- Found outer body/document could be programmatically scrolled when revealing overview weather, clipping the header. Fixed the viewport shell and clipped body overflow, leaving main as the only page content scroller.
- Rechecked all four tabs plus overview/Biei return at 320×740: root/body scroll stayed zero, tabs stayed at y=42.5, main began exactly below tabs, and all six forecast rows fitted below them. No tab text overflow. At 375×812 regional forecast and separate history heading were visible together. Weather values were isolated simulation data.

### 2026-10-16 · Additional regional sights
- Added seven sights (23 total): Hokkaido University Museum, Sapporo Beer Museum, Mt. Moiwa, Tokiwa Park, Kitasaito Garden, Hokusei-no-oka and Takushinkan. Added eight official-source reference photos (45 total), all visually inspected and browser-loaded. Summer pictures and the exhibition poster are explicitly captioned.
- New places have empty day lists and do not change the planned route. Winter closure, admission changes, opening hours and child-specific notes are in each detail.
- At a 375×700 iframe viewport, all seven details opened/closed with 549px scrollable bodies and no horizontal overflow; scrolling to the last Takushinkan information row retained the close button. This is browser layout testing, not a physical iPhone WeChat test.

## 2026-10-16 北海道特色读本
- 总览增加特色封面及六节图文：Seicomart、HOT CHEF、丰富町牛奶、Ribbon Napolin、Soft Katsugen、炒面便当；来源留在 content/hokkaido.json。
- 375×700 浏览器预览：六张官方图片加载成功，长文滚动与固定返回按钮正常。未改动地图、景点、天气或行程。

## 2026-10-16 特色读本伴手礼
- 新增白色恋人、六花亭、ROYCE 与选购比较四节，含四张官方商品图、代表口味、沿途购买地点、保存条件和12月白色恋人换包装提示。
- 375×700 浏览器预览逐节确认四张图片内容及加载，文字正常换行，固定返回按钮关闭成功；构建和现有检查通过。此为浏览器手机布局验证，非真实微信设备测试。

## 2026-10-16 KINOTOYA
- 特色读本补充现烤芝士挞、牛乳软冰淇淋与曲奇，含官方商品图、Pole Town/机场门店、冷藏期限及原机场Factory店更名说明。
- 375×700预览确认官方芝士挞照片加载、标题换行及固定返回按钮可见；构建和现有检查通过。

## 2026-10-16 用户指定地点与伴手礼
- 特色读本增加 LeTAO、薯条三兄弟官方商品图片、推荐品种、购买地点和保存说明。
- 新增14个札幌标点：4个景点、5个购物地点、丼兵卫3店及天马2店。已存在地点合并；丸井今井两馆分别定位。范围仅札幌、旭川、美瑛，不含小樽和北广岛分店。来源与坐标说明记录在 content/user-places.json；园区/地下街/楼宇参考点不代表精确入口。
- 375×700手机布局检查：新增详情打开关闭成功；八个文字详情无横向溢出，滚动区535–549px；滚动到营业信息仍可关闭。六张新地点照片和两张商品图已核验加载及内容，四个区域切换正常。为浏览器布局验证，非实体iPhone微信测试。
- 新增购物颜色及分类标题；自动检查37地点、51照片及地区缩放隔离通过。餐厅座位与儿童设施须联系店家，未宣称7人已可预约同桌。

## 2026-10-16 地点类型单选
- 地区地图默认景点，底部景点/餐厅/购物为44px单选按钮；切地区重置景点，切类型保留缩放并重新排列当前类型标记及引线。总览动线不受影响。
- 375×700预览检查札幌14景点/5餐厅/5购物，始终只有一个选中按钮；APIA详情开关正常；旭川和美瑛默认景点，空餐厅分类无标记且有明确提示。

## 2026-10-18 查看我附近
- 点击后才请求一次定位；不持续追踪，不持久保存坐标，不上传至项目服务器。HTTPS 或 localhost 才可使用。
- 蓝点和精度圈表示上次位置；附近模式按所选类型筛选5公里内已收录地点。详情增加直线距离及 Google Maps 目的地导航链接，链接不包含用户坐标。
- 更新位置、退出定位、切换区域与请求失效保护；拒绝、超时、不支持和空结果都有提示。
- 375×750 浏览器模拟检查札幌、旭川、美瑛成功定位，上海空结果、拒绝与超时；详情距离、导航、关闭与分类切换通过。模拟坐标仅存在 /tmp 的 QA 页面，不进入生产构建。未测试实体 iPhone 微信定位权限。
- 检查：node scripts/check.mjs；node scripts/check-location.mjs。

## 2026-10-18 自动申请与持续定位（替代上述单次定位）
- 页面加载后调用 watchPosition 申请定位；授权后随浏览器位置回调更新蓝点、精度、附近分类结果和已打开详情中的距离。不重建详情、不重置照片或滚动。
- 首次定位在已收录地点50公里内时进入附近地图；远离旅行区域时保留总览。后续更新不自动移动视角或切换地区，点击“查看我附近”可重新居中。
- 隐藏页面暂停监听，返回继续；关闭定位清理监听和位置，拒绝授权停止监听且不自动重试。无权限或受浏览器限制时保留手动入口。浏览器决定更新频率，不保证后台连续定位。
- 375×750手机布局模拟：无需点击自动定位；模拟移动后电视塔距离240米→930米；详情继续打开；手动美瑛地图保持；关闭后和权限拒绝后模拟位置不再更新。仅模拟测试，尚未实机验证微信权限弹窗。

## 2026-10-18 精简定位入口
- 按用户要求移除“查看我附近”和“关闭定位”两个按钮及事件处理，保留自动申请、前台持续定位、后台暂停和状态提示。未获定位时提示检查浏览器权限后刷新，不再引用不存在的按钮。
