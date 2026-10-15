# 第三方内容

## Leaflet

使用 Leaflet 1.9.4，BSD-2-Clause。代码来自 https://leafletjs.com/ 。许可证位于 `src/vendor/LICENSE-Leaflet`。

## 地图

使用日本国土地理院淡色地图： https://maps.gsi.go.jp/development/ichiran.html 。页面保留地理院瓦片署名。地图需联网加载。

## 照片与信息

图片从景点运营方、札幌官方旅游网站、美瑛官方旅游网站、美瑛町政府、旭川市及北海道官方旅游网站直接加载，未打包第三方照片。

每张图的 URL、页面来源、署名和核验记录位于 `src/media.js`。这些照片及来源内容的权利属于各自权利人，官方公开可见不代表取得再分发许可。仓库不对第三方素材授予任何新的许可。

## 北海道主题信息图

`src/assets/intro/*.svg` 为本项目原创矢量信息图，不是官方照片或实景图。文字与数字依据北海道政府、北海道官方旅游网站、北海道博物馆及 Upopoy；逐主题来源 URL 和核对日期保存在 `content/hokkaido.json`。地理卡使用项目现有北海道轮廓数据，其来源沿用原有轮廓说明。
