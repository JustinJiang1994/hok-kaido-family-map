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

确认用户提供的分店名称和具体地址后再添加，避免同名店坐标混淆。`data.js` 中使用 `type: 'food'`；新内容仍放点击详情中。添加时同步调整详情类别文本和必要字段，不能把餐厅称为景点。当前已有餐厅数据；补充前先核对现有地点及具体分店，避免重复。

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

## 2026-10-18 图片加载优化
- 74张不同来源照片生成640/1200宽度WebP（不放大小图）、24像素占位，保留原图来源、图注、署名。原图35,597,581字节；640版本3,306,680字节；高清版本7,787,998字节。
- 详情当前图优先，加载后预取邻图；读本IntersectionObserver仅加载接近可视区域的照片。同源内容哈希图片一年缓存，HTML不缓存。
- 390×760浏览器预览：札幌钟楼、旭山动物园、白金青池前三张延迟加载、翻页与关闭通过；薯条三兄弟包装清晰、固定返回按钮可见；不是实体iPhone微信测试。
- 本机同200KB/s传输测试：青池原图426,766字节/1.82秒，640版77,300字节/0.32秒。此为受控传输对比，不代表真实移动网络延迟。
- 检查：check-images.py、check.mjs、check-location.mjs、check-weather.mjs；部署前幸福助手MainPID=1638、NRestarts=0、HTTP200。

## 2026-10-28 研究资料按原格式整合

- `src/media.js` 沿用 facts、details、checkedOn、informationSources 更新7个已有地点；照片与历史原文保留，不新增重复地图点。
- `content/hokkaido.json` 沿用读本 sections/facts/paragraphs/sources：美食列Lilac及大雪地ビール館，风景列AOAO室内备选，特色补SNOWS与原ROYCE章，地理补交通待办及研究边界。三处候选尚未核实坐标，明确待定位，不猜造地图点。
- 先运行 `python3 scripts/build_intro.py`，再运行原构建与检查，并用 `python3 build.py --output ../北海道家庭旅行地图.html` 同步桌面版本。研究附录保留作原始档案，既有追踪基线的独立发现不变。

### 2026-10-28 本机Chrome视觉抽查

- 使用现有Chrome原生窗口，预览仅绑定127.0.0.1的dist版本；未安装软件。
- 白色恋人公园与大通圣诞市集：实际打开并滚动至新增facts，浅色卡片及长文本换行正常，所见画面无横向溢出；固定关闭按钮可见。Escape、关闭按钮、白色恋人重复打开通过。
- 美食读本Lilac／大雪地ビール館、景观读本AOAO：实际滚动至新增章节并截图观察，原有标题、提示卡、正文与来源样式正常，无可见横向溢出；美食底部返回主题、景观Escape返回通过。
- 地理读本已打开，辅助功能树包含交通待办及不确定性说明；随后滚动工具连续返回noWindowsAvailable，未完成交通段落的视觉检查及特色读本SNOWS／ROYCE抽查。此次不是精确375/390像素手机视口或实体手机验收。
- 未发现本次抽查范围内需要修复的UI问题；未改页面或重新导出。

### 2026-10-28 窗口恢复尝试

重新启动仅127.0.0.1预览并通过受支持工具重新获取Chrome。可以读取北海道预览窗口的辅助功能树和截图，但窗口停在地理读本顶部；查找快捷键未产生可见滚动，尝试窗口Raise及滚动时工具返回elementHasNoFrame。按要求停止恢复，不反复重试。交通段落与SNOWS／ROYCE视觉验收仍未完成；未修改页面、其他窗口或浏览器设置。

## 2026-10-28 补充资料去重整合

对照研究补充和既有追踪基线，保留当前未提交修改，补齐花まる、かに本家、大黑屋订位条件、じゅんぺい周一休业、白色恋人圣诞餐饮及白金ビルケ之森候选。新候选仅进入读本，未核准坐标前不加地图点；照片、地图交互及已有地点 ID 保持不变。来源日期表示研究归档，不表示本次重新核价或查余位。Bäckerei Hachi 仍仅作为资料线索保留，未官方复核冬季营业，不提升为推荐。阅读检查改为读取当前 dist/index.html，避免依赖已归档测试版。

本轮验证：`build_intro.py`、`build.py`、全部6项 `check*.mjs`、`check-images.py`、`check-reading.cjs` 和 `git diff --check` 通过；另核对章节标题与来源 URL 无重复、地点 ID 及照片列表未改变。阅读 DOM 检查使用临时目录 `/tmp/hokkaido-dom-validation` 中的 linkedom 0.18.12，通过 `HOKKAIDO_DOM_MODULE` 指定，未加入生产依赖。已同步桌面原入口；本轮没有新增手机视觉验收记录，没有提交、推送或部署。

### 2026-10-28 接续复核与剩余视觉验收完成

接续时HEAD为d3a2483（Expand winter travel reference and family dining details），工作区干净；保留该后续提交全部内容。逐项对照附录，7个地点与4个读本主题均已整合，附录全部外部来源URL已进入现有数据，未发现需要重复新增的具体遗漏。既有37地点、51张地点照片不变。

重新运行build_intro.py、build.py、桌面导出、全部6项check*.mjs、check-images.py、check-reading.cjs及git diff --check通过。DOM检查复用已存在的/tmp/hokkaido-dom-validation/node_modules/linkedom，没有安装新软件。生成过程未改变已跟踪页面内容。

通过现有Chrome新标签打开本地dist/index.html，实际滚动检查交通段落、SNOWS章节及展开后的ROYCE机场工厂时间段落：保留原读本卡片和正文排版，长文本正常换行，所见桌面画面无横向溢出。返回主题、特色读本重复打开和Escape关闭通过。此前这三项的窗口工具视觉验收缺口现已补完；本次不包含精确手机视口或实体手机测试。未改页面样式或内容，未提交、推送、部署或重发交接。

## 2026-10-29 日常研究检查（10月30日补同步）

没有符合通知门槛的新增推荐、预约开放或重大风险变化；仅维护检查记录。基线已存在 `checks_2026_10_29`（含千代田／牧场等待核实线索），完整保留，不重复创建当日记录。

## 2026-10-30 日常研究检查与同步

没有符合通知门槛的新增推荐、预约开放或重大风险变化。已知圣诞活动、动物园冬季时间及青池灯光与原基线一致。企鹅散步本季开始日和美瑛冬季巴士尚未获得新公告；白色恋人11月1日可能开放12月预约仍仅按当月及次月规则推断，不表示已开放；道北巴士临时班表不能外推为12月21日取消。

本日独立研究复核的主要官方页面：[美瑛灯光](https://www.biei-hokkaido.jp/ja/27188)、[美遊巴士](https://www.biei-hokkaido.jp/ja/bus)、[动物园日程](https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/event/event.html)、[白色恋人手作](https://www.shiroikoibitopark.jp/facility/dream-kitchen.html)、[SNOWS公告](https://www.snows-winter.com/news/22737/)。本次仅同步已完成研究，本地同步未重新访问网页，不将未复查地点的checkedOn统一改为新日期。

平台限制：未取得符合条件的新实访样本。小红书无可读取原帖；B站／抖音仅摘要；YouTube未观看；Instagram外部摘要；Google Maps无新完整评论；部分食べログ／Tripadvisor缓存日期冲突。不声称全面覆盖。

[同级追踪基线](../../北海道追踪基线.json)的两日原记录及所有既有键值保持不变，仅增加 `check_sync_2026_10_30` 汇总补充来源、限制与待核实项，并引用既有记录去重。本轮无实质内容变化，不修改或重建地点、读本和HTML。校验JSON、既有键值保留、日志追加去重与受保护文件字节一致性；未提交、推送、部署或重发交接。

## 2026-11-04 · 近期研究与发布准备

保留接续时已有维护日志和基线全部键值。同步同级追踪基线中的独立检查：10月31日为花まる次日预约窗口提醒；11月1日按前月1日规则进入12月电话预约期（未查余位）；11月2、3日无达到通知门槛的新变化，餐饮线索保留待核实，未升级推荐。上述历史检查仅归档，不冒充本日重新核查。

11月4日读取官方圣诞专题、圣诞老人活动页及动物园新闻页，去重补充白色恋人餐食、LINE申请方式与“已结束”状态矛盾、旭山动物园12月6—25日圣诞树展示；12月6日装饰活动不在旅期。园方11月3日公告明确冬期延续至2027年4月7日并排除年末休园日，修正旧条目只列到12月29日的不完整表述。来源保存在原schema中，仅两处地点更新checkedOn并明确核查范围，读本新增章节单独标日期；不更改地图坐标和照片。

没有新增已核验的交通通票、票价或预约余位；原有交通条件与不确定性保留。未提交申请、购票或联系商家；不声称全面复核社交平台。用户本次授权必要提交、推送与原站点发布，不扩展为未来自动发布。

验证：build_intro.py、build.py及桌面导出通过；全部6项check*.mjs、check-images.py与git diff --check通过，仍为37地点、51张地点照片、74张总照片。原有基线键值逐项比较一致，桌面HTML在资源路径标准化后与dist一致。check-reading.cjs因临时linkedom目录文件已被清理而报MODULE_NOT_FOUND，未安装依赖；改用现有Chrome独立临时配置实际加载构建页面，在375×844与390×667检查两处详情、美食与景观读本，文本存在、无横向溢出、关闭及重复打开通过，并等待过渡动画完成后检查截图，原卡片排版和固定返回正常。本轮不包含实体手机验收。

发布连接核对：GitHub main为d3a2483，与本地基点一致；原HTTPS站点读取HTTP 200。部署目标仍为120.26.54.152的/srv/hokkaido-family-map，未更改任何服务。docs/DEPLOYMENT.md记载上次临时SSH公钥已移除；当前无该主机已验证的SSH配置/主机记录或可用管理工具，未猜测登录身份、未新增密钥，服务器预检与部署尚未执行。需恢复原获授权管理连接并核对服务端工作树后，才能运行既有deploy/update.sh及生产内容验收。

## 2026-11-05 · 圣诞活动状态与交通预告

按用户确认将白色恋人圣诞老人合影抽选标为已结束，替换当前详情与读本的LINE申请指引；除非官方明确更新，不再作为可报名活动。11月4日历史研究记录保留。大通市集详情及景观读本补入圣诞老人见面候选（场次、收费、预约未确认）；旭川站前Yukinowa Christmas仅列读本候选（12月19、20日，圣诞老人未确认），不猜坐标、不新增地图点。

同级基线已有checks_2026_11_05巴士预告，保留全部键值并新增check_sync_2026_11_05状态补充，未重复10月31日至11月4日日志。复核观光协会11月3日原文后，地理读本同步11月9日售票预告及周一不适配、儿童和票价待确认等限制，修正当前页面“冬季计划仍待公布”的旧表述。来源存于现有schema，日期按章节和地点核查范围标注。本轮不提交、推送或部署。

补充：青池详情也同步巴士预告，明确未列白须瀑布，完整运行日历及例外待核实。大黑屋沿用美食读本既有候选段落，补官网营业/年末休业及秋季亲子实访的儿童增高椅、室内等候游乐区、烟较大信息；原文未列完整分店地址，不把该经验保证为五丁目店12月设施。不引用旧价格，不新增地图点。

本轮验证：介绍生成、构建、桌面导出、check.mjs、check-images.py、git diff --check通过；基线旧键值保留，37地点/51地点照片及74张总照片不变。独立Chrome在375×844和390×667检查白色恋人、大通、青池详情及美食、地理、景观读本：更新文本存在，无横向溢出，关闭/返回和重复打开通过；最终截图复核青池与景观读本排版正常。本轮没有重新运行已知缺少linkedom的check-reading.cjs；未做实体手机测试。临时预览启动首次加载慢，等待页面就绪后检查通过。未提交、推送或部署。

### 2026-11-05 · 大通圣诞老人工作日时段补充

按本轮研究任务已核实的2026官方指南第9—10页，替换大通详情及景观读本原先未有时间范围的描述：1丁目工作日日本时间16:00—20:00期间不定时出现，非全时在场；12月17、18日为周四、周五，费用、预约与具体出现时刻未列明。来源入原schema，同级基线新增有supersedes说明的记录并保留全部旧键值。本地网页工具因PDF约20.8MB超限未独立重读，来源页码来自本轮已核实研究。

本次文字修订验证：build_intro.py、build.py、桌面导出、check.mjs、check-images.py、git diff --check通过；桌面与dist资源路径标准化后完全一致，旧描述已替换，工作日映射校验通过。37地点、51地点照片、74总照片不变。本次未重复手机视觉验收（同日上一轮已检查原布局）；未提交、推送或部署。

## 2026-11-06 · 日常同步准备（待研究结果）

已读取维护规范与同级追踪基线，保留既有未提交内容。11月5日札幌圣诞老人时段及美瑛灯光巴士已同步，本次不重复添加。今日研究结果尚待提供，仅新增pending_research准备记录，不宣称已完成检查或无实质变化，不修改last_checked_at或地点checkedOn。

准备阶段仅更新日志与基线，不重建未变页面；JSON有效性、旧键值保留及页面文件哈希不变检查通过，桌面HTML与dist在资源路径标准化后一致。未提交、推送或部署。

### 2026-11-06 · 检查完成

动物园详情和景观读本同步企鹅散步预计12月下旬至3月中旬、计划日本时间11:00/14:30，保留积雪天气条件、确切开始日未公布及12月20日不保证。地理读本用道北巴士11月5日公告替换“结束未定”：11月9日起恢复平日正常班次，12月21日具体车次仍未核实；旧公告来源保留。

White Birch and Blue River雪鞋线路未在原项目收录，仅在基线记录2026—27冬季目前不计划运营，不推断青池或瀑布关闭。同级基线新增checks_2026_11_06完成记录并指明取代准备状态，保留全部原键值。网页核查限制：动物园预计季节与场次采用本轮研究任务已核实结论，本地抽取文本未显示该段；道北巴士首页正文可读，独立文章遭验证码限制，未绕过。

本次内容更新验证：build_intro.py、build.py、桌面导出、check.mjs、check-images.py、git diff --check通过；桌面HTML与dist在资源路径标准化后一致，当前页面旧流感“结束未定”警示已替换。基线比较发现另一检查同时更新了last_checked_at、准备状态及当日检查记录，已保留其值并重新读取后追加本地完成记录，不覆盖独立结论。地点与照片数量不变。本轮未重跑手机视觉验收或缺少linkedom的独立DOM测试；沿用现有文字段落与facts格式，未修改UI。未提交、推送或部署。

补充札幌市青少年科学馆：去重确认与旭川Saipal不同，作为新札幌室内备选进入景观读本，含冬期时间、展厅价格、儿童免费仍需票、28天预售及不可改退规则；秋季实访明确非冬季，坐标未核准，不建地图点。并发基线更新后，本地完成状态另存local_content_sync_2026_11_06，保留另一检查全部原键值及旧季链接提醒。

最终补充验收：加入科学馆后重新生成并通过check.mjs、check-images.py、git diff --check；桌面HTML与dist一致。本轮已完成375×844及390×667真实Chrome预览：动物园详情、地理/景观读本新文本、无横向溢出、关闭与重复打开通过，科学馆所在读本截图排版正常（取代上文“未重跑手机视觉验收”的中间状态）。初次脚本误选扩展后台页，定位原因并限定普通预览标签后通过；没有修改网站UI。实体手机和独立linkedom DOM测试仍未执行。

## 2026-11-06 · 增量发布复核

用户新授权本次增量检查、提交、推送及既有生产部署。复核现有四个修改文件均为11月5—6日资料与生成/维护记录，没有混入其他源码改动。重跑介绍生成、构建、桌面导出、全部6项check*.mjs、check-images.py、git diff --check通过；章节标题及来源URL无重复，原37地点/51地点照片不变，桌面导出一致。沿用同日已完成两种手机尺寸视觉验收，本轮重建无内容变化；独立linkedom检查依赖缺失仍保留为限制。

只读线上核验纠正先前历史状态：HTTPS正常通过验证并返回200，Last-Modified为2026-11-04 08:24:01 GMT，618164字节，SHA256为72f7e9f7d9e83b4d58f1ab12c48956236d0fc0fa3ba9e451a4289819700919ec；与在内存中重现的0e6f7bbe3b16f1c175ca789d3f7a03778de80d6a构建逐字节相同，证明11月4日版本后来已上线，但不能据此判断由谁部署。11月5—6日增量尚不在线。

原任务01a13d9a-ee87-7dc2-8511-7c8f3d429831本机官方read_thread返回Codex app tool request failed，无法核实交接回执；未绕过或重发。当前没有目标服务器SSH配置/已验证主机记录，也无可用远程管理工具；未创建密钥或扩大授权，服务端工作树检查与本次部署尚未执行。需要恢复或提供既有获授权管理连接，再按deploy/update.sh发布并复核线上内容；不应要求重复确认本次普通部署。

## 2026-11-07 · 官方季节核对与新增候选

逐项核验7条线索：动物园d082799现明确令和8年度、更新2026-11-06，直接读到企鹅计划（首日未定、3月仅11:00），补齐例外并保留旧季警告历史；青池/瀑布灯光及札幌市集已有信息不重复，保留2026指南Santa时段。洲际2026午餐、Factory2026室内圣诞树、DOME2026—27雪玩区新增到原读本，费用适用范围、年龄、积雪、7人和转城限制明确标注；坐标未核准，不建新点或新增照片。滝野红叶页为2026，开园规则12/23起且12/22非周日，排除旅期。全部来源与结论入同级基线local_content_sync_2026_11_07，旧键值保留。

本轮仅动物园checkedOn随本次具体核对更新，其余未变地点日期保留。当前可用本地技能目录无适用工程技能，按项目维护/构建规范执行；未创建平行项目。服务器管理连接仍缺失，不重复SSH或创建凭据，部署尚未执行。

验收：build_intro.py、build.py、桌面导出、全部6项check*.mjs、check-images.py及git diff --check通过；章节/来源去重、原地点ID和照片保留、桌面HTML一致性通过。独立Chrome在375×844和390×667实际检查动物园详情与美食/景观读本，新内容存在、无横向溢出、返回及重复打开通过；截图复核午餐与雪玩区长文排版正常。没有新图片/坐标或UI重构，仍为37地点、51张地点照片、74总照片。独立linkedom测试依赖仍缺失，未安装软件或宣称实体手机验收。

## 2026-11-08 · 面包小偷札幌场增量

直接核对10月22日官方改期公告与票务页，确认2026/11/23—12/30、Factory Hall、工作日12—18点/末入17:30、按购买日期的成人1650/1850日元、未学龄免费及监护人陪同；12月17—18日不属指定时段日，12月19日14点前需指定时段。新增到景观读本，与Factory圣诞树分别说明；不查余位、不购票、不猜坐标、不改照片风格或地点checkedOn。基线已有独立当日检查保留，另加local_content_sync_2026_11_08。服务器没有现有管理连接，不重复SSH或新增授权，部署尚未执行。

验收：介绍生成、构建、桌面导出、全部6项check*.mjs、check-images.py、git diff --check通过，章节标题/来源URL无重复，桌面与dist资源路径标准化后一致。独立Chrome在375×844和390×667检查新增读本内容、无横向溢出、关闭及重复打开通过，截图排版正常。地图37地点、51地点照片/74总照片不变；未重跑缺依赖的linkedom测试或实体手机验收。

11月8日HTTPS生产核对：200，Last-Modified仍2026-11-04 08:24:01 GMT，SHA256仍72f7e9f7d9e83b4d58f1ab12c48956236d0fc0fa3ba9e451a4289819700919ec（前次逐字节确认的0e6f7bb构建），尚无本次展览内容。服务器管理连接未恢复，本次部署尚未执行，并非部署失败；未新建凭据或绕过TLS。

## 2026-11-09 · 美瑛巴士正式安排

已完整读取英文正式页、开售公告及冬季FAQ。替换青池详情/地理读本旧预告：灯光线周五六，12月21日不能乘；新增圣诞树之木既有详情的12月21日适用日历、三班往返四季之信息馆、起价、幼儿占座及自由席限制。未进入余位或交易，不把开售公告当作交易成功。保留历史基线与所有原来源，新增local_content_sync_2026_11_09；坐标、照片和其他地点checkedOn不变。服务器管理连接未恢复，未尝试新密钥或部署。

验收：介绍生成、构建、桌面导出、全部6项check*.mjs、check-images.py、git diff --check通过；章节/来源去重、原地点ID及照片不变、桌面输出一致。独立Chrome在375×844和390×667检查青池/圣诞树详情与交通读本、新内容及关闭/重复打开，无横向溢出，交通长文截图正常。独立linkedom测试依赖仍缺失，未执行实体手机测试。

11月9日生产HTTPS验证正常、HTTP 200，SHA256仍72f7e9f7d9e83b4d58f1ab12c48956236d0fc0fa3ba9e451a4289819700919ec，Last-Modified仍2026-11-04 08:24:01 GMT，对应已确证0e6f7bb旧版。缺既有管理连接，本次部署尚未执行。

## 2026-11-10 · 西门冬季停车（首项增量，等待当日研究结束）

完整核准园方11月10日公告的令和8—9年日期、休园例外、出租车及各类巴士禁用条件；按原schema补入旭山详情和地理读本，不默认用户包车适用、不新增入口坐标或时间。仅动物园checkedOn更新并注明范围；基线保留全部旧键值，新增local_content_sync_2026_11_10。暂缓提交，等待当日其他研究。

今日生产HTTPS200，HTML与abdd4b8独立构建逐字节一致（ea80ea0a2ae85db084db46e3750cd8199401addba019d79f4daa90752436172c），说明11月9日增量已上线，无法据此确认部署者或管理连接恢复。未重试被拒绝的辅助功能/网页JavaScript操作。

第二项候选：核准Factory Gallery（3条馆3楼）儿童视角体验展2026会期、时间、当日价格和持票监护人规则，加入景观读本，与Factory Hall面包小偷展独立。11月6日文章为开展首日实访，未视为当天到访；预售截止、预约及余位待后续核查。未新增地图坐标或照片。

第三项为Lilac既有规则核实而非新优惠：只在原美食读本替换学前费用/儿童椅未知说明，限定食饮放题免费，不泛化单点或Garden Grill套餐；保留七人座位与余位未知及成人价格旧基线。原项目没有Lilac地图点，不误改啤酒博物馆。

本地验收：介绍生成、构建、桌面导出、全部6项check*.mjs、74张图片检查及git diff --check通过；章节/来源URL去重、桌面资源路径标准化后一致、原37地点及51地点照片保留。独立临时Chrome在375×844及390×667检查动物园详情与地理/景观/美食读本，新文字存在、无横向溢出、关闭与重复打开通过；景观读本截图排版正常。未执行实体手机或缺依赖的linkedom检查。三项内容已保存，待本日研究结束统一提交；本轮未推送部署。

### 11月10日研究结束 · 交通补充

读取道北公告及两张官方原图，核准10/1生效时刻、800/900日元单程票价、末班只到美瑛及28分钟窗口；图未列平假日区别或截止日，12/21仍需行前复核。补青池/白须瀑布详情和地理读本。美瑛ハイヤー仅一辆大车已核准，载客人数未明确，保留实车/余位未知。圣诞树详情和原读本补发券取消费、临近出发比例（已含手续费）、减员整单重订和安全停运例外，区分公共公交与灯光线。其余当日三项继续保留，未新增坐标/照片。

最终验收：全量6项脚本、图片、构建、桌面导出及去重一致性检查通过。375×844/390×667独立Chrome实测动物园、青池、白须瀑布、圣诞树详情及地理/景观/美食读本，新内容存在、无横向溢出、关闭及重复打开通过；圣诞树详情截图正常。当前无受支持CUA工具、活动SSH/终端会话或已加载SSH身份，未重试被拒操作；无可用管理路径时停止部署。本次统一提交仅含今日数据、生成页面和维护记录。

## 2026-11-10 · NIKKA 招牌拍照点

按用户请求新增札幌 sight 类型 nikka-sign，保留薄野街区点，两者分别代表具体外墙招牌与周边区域。地图坐标取来源地图链接43.05540,141.35358；Google Maps按日文地标名与建筑名导航，不用坐标代替入口。补齐简介、看点、拍照建议、历史、交通和实用信息；亮灯时段未确认，不写为全天点亮。复用已压缩官方薄野照片，目视确认右侧招牌，标明历史资料图、画面可能更新，无新增图片下载或授权声明。

38地点、52条地点照片引用（74张独立图片）。全部6项check*.mjs、图片校验、构建、桌面导出及diff检查通过。独立Chrome在375×844和390×667检查札幌新增详情：照片加载、无横向溢出、名称导航、长文滚动后关闭按钮可见及关闭通过；未做实体iPhone测试。仅更新本地，未提交、推送或部署。

### 2026-11-10 · 用户餐厅与札幌分店补充
- 新增33个餐厅标记：德寿15家、いっぴん6家、蟹座／信玄／一幻／宝来／五丈原各1家、ルンゴカーニバル不同业态7家。加上原有5家餐厅，现共71个地点、52张地点照片引用。保留此前未提交的NIKKA资料。
- 分店范围沿用札幌、旭川、美瑛。白老かに王按用户明确要求排除；机场、石狩、带广等范围外分店不收录。五丈原月寒旧店已关闭；宝来川沿同名店未证实与北24条店为同一连锁，不冒认分店。
- 资料核对日2026-11-10，来源保存在PLACE_MEDIA.informationSources，并同步content/user-places.json。坐标取各店官方地图、Google具名地点及牡蛎小屋店铺地图；Google导航继续用日文分店名＋地址。
- F45官网明确不接待儿童，已写入标题与家庭信息。本店吸烟／儿童接待资料冲突、野菜店未成年人仅限禁烟席，均明确提示。7人同桌、儿童椅、儿童收费与实际余位未获店方确认，不能表示已预约。
- 信玄、五丈原营业时间存在新旧资料差异；牡蛎小屋公开开门时间与用户提供不同，已注明复核。三家拉面店不能保证7人同桌。新增餐厅暂无已核实实景照片，photos保持空数组，不借用其他店图片。
- 六项Node检查、图片检查、构建及git diff --check通过。独立Chrome手机模拟375×844、390×667逐个检查38家餐厅详情无横向溢出、名称导航和滚动后关闭按钮；四个区域切换及默认景点/多选分类正常。此为浏览器模拟，不等同iPhone微信实机验证。
- 同步生成dist及桌面HTML；本次未提交、推送或部署。

### 2026-11-10 · 山珍购物点与Seicomart四款商品
- 新增珍味の山珍札幌店购物标记，官方仅列札幌／白老两店；白老不在既定收录范围。札幌店地址、时间、电话取官网，坐标核对Google具名地点。导航仍为日文店名＋地址。总地点72个。
- 山珍实际以海鲜干货、奶酪珍味为主，不写成鲜奶酸奶超市；商品原料产地不作统一保证。
- 特色读本新增四个清单小章：山芥末盐味拉面、北海道メロンモナカ、亲子丼、生乳95%酸奶。亲子丼有历史销售证据，未确认12月持续供应，已明确标记；其余名称及规格取品牌官方页面。未新增未经核对商品照片。
- 六项Node检查、图片资源检查、构建、diff检查通过；本地桌面HTML已同步。尚未提交、推送、部署。

### 2026-11-10 · 小红书餐厅收藏
- 新增Susukino Depart（南5西2）及牛しゃぶ・すき焼専門店 禅（南2西1）两个food标记；官方地址、时间、预约电话及具名地图坐标已核对，总数74个地点。
- 德寿沿用已有15个标记，不重复添加。PLACE_MEDIA.recommendation记录用户提供的小红书推荐来源；德寿明确为品牌推荐、未指定分店，不冒称每店均获独立推荐。
- 详情导航按钮上方显示推荐徽标；新增两店的备注说明未提供具体笔记链接，店铺事实与用户推荐分开记录。同步content/user-places.json。
- 六项Node检查、图片检查、构建及diff检查通过，桌面HTML已更新；本次未提交、推送或部署。

## 2026-11-11 · 首项增量，待当日研究完成

保留用户后续f223d11新增地点/推荐内容（现74地点、52地点照片引用）；本地和远端相同，两版718fb70/f223d11 CI成功。生产今日HTTPS200仍匹配abdd4b8，未误报昨天内容已上线。无受支持CUA及活动SSH会话/加载身份，不重试被拒操作。

本季11月6日公告全文核实两处广场冬期关闭，原详情/读本尚未收录，已补动物园详情及既有景观章节，企鹅场次计划与首日未知保留。来源已在原schema，无重复新增；基线旧键值保留另增当日准备记录。暂不提交，等待剩余研究。

### 11月11日研究完成

动物园新增夏季限定婴儿车借用、雪橇/雪球夹禁带及东门餐厅官方营业时间；儿童椅餐具来自10月18日秋季两岁实访（11月4日发表），不推定冬季等待或同桌。美唄雪场仅入景观读本候选，核准11月10日预约迁移、预计开业、基础票/5岁以下范围及租赁尺寸；300/500日元接驳冲突和预约说明新旧冲突明确保留。未访问被403拒绝的JapanTicket，不猜坐标、不改用户新增地图点。

最终验证：全部6项check*.mjs、74张独立图片、构建、diff及章节/来源去重通过；74地点、52地点照片引用保持，除动物园外PLACE_MEDIA逐项与用户最新HEAD相同。桌面与dist资源路径标准化后一致。独立Chrome在375×844及390×667验证动物园详情、景观读本及重复打开关闭，无横向溢出；原8765被占用，改用本次8767预览重新通过，未干扰原服务。未做实体手机或缺依赖linkedom测试。当前未获得新管理连接，不重试被拒辅助功能、不增凭据。
