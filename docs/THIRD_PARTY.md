# 第三方内容

## Leaflet

使用 Leaflet 1.9.4，BSD-2-Clause。代码来自 https://leafletjs.com/ 。许可证位于 `src/vendor/LICENSE-Leaflet`。

## 地图

使用日本国土地理院淡色地图： https://maps.gsi.go.jp/development/ichiran.html 。页面保留地理院瓦片署名。地图需联网加载。

## 照片与信息

图片从景点运营方、札幌官方旅游网站、美瑛官方旅游网站、美瑛町政府、旭川市及北海道官方旅游网站提供，现生成同源 WebP 优化副本。

每张图的 URL、页面来源、署名和核验记录位于 `src/media.js`。这些照片及来源内容的权利属于各自权利人，官方公开可见不代表取得再分发许可。仓库不对第三方素材授予任何新的许可。

## 北海道读本配图

每主题一张配图；照片通过同源 WebP 优化副本加载。中文分区图为官方 SVG 底图的标注改编版，保存在 `src/assets/intro/regions-zh.svg` 并内嵌到单文件 HTML，原始地址为 https://www.visit-hokkaido.jp/basic/images/areaMap.svg 。其余配图：分区地图和拉面来自 HOKKAIDO LOVE!；钟楼及札幌夜景来自札幌官方旅游网站；青池来自美瑛町；田园来自美瑛町观光协会；阿伊努生活文化来自 Upopoy。原图版权归相应权利人；署名、图注和原始网页保存在 `content/hokkaido.json`，不暗示自由再利用授权。

地理分区章节另引用四张官方资料图：札幌大通公园圣诞市集、美瑛青池、函馆山夜景、摩周湖。逐图地址、原始网页与署名保存在地理主题各章节的 `image` 字段。

## 图片优化（2026-10-18）
为家庭旅行页面生成现有74张照片的缩小 WebP 副本；未改变照片主体和地点，署名及原始 URL 保留。资源映射为 content/image-assets.json；此优化不表示获得新的再分发许可，原权利及来源网站使用条件继续适用。
