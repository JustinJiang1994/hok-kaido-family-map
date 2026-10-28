# hokkaido-family-map

北海道家庭旅行地图：面向手机和长辈的中文景点地图。

从行程总览切换到札幌、旭川、美瑛三个区域，标签附日期与第几天。点击地图圆点查看景点照片、分章节介绍和营业信息。当前收录37个地点、51张地点资料照片；包含景点、餐厅、购物多选分类（默认仅景点），不自动规划行程。

## 本地运行

需要 Python 3；无 npm 依赖。Node.js 仅用于代码检查。

```sh
python3 build.py
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

打开 `http://127.0.0.1:8765/`。地图瓦片需联网；照片由本站压缩资源提供。代码和 Leaflet 已打包在 HTML 中。

生成指定位置的本地版本（HTML 与同目录 hokkaido-assets 文件夹须一起保留）：

```sh
python3 build.py --output ../北海道家庭旅行地图.html
```

## 项目结构

- `content/hokkaido.json`：北海道七个主题的文字、统计年份及官方来源
- `scripts/build_intro.py`：生成每主题一张配图的首页介绍
- `src/index.html`：页面结构
- `src/app.js`：地图、区域日期、标记和详情交互
- `src/intro.js`：主题封面与独立分章阅读页
- `src/style.css`：移动端样式
- `src/data.js`：地点名称、区域、经纬度和类型
- `src/media.js`：景点章节、图片、来源、核对日期
- `src/vendor/`：本地 Leaflet 1.9.4
- `build.py`：生成 `dist/index.html`，生成物不提交
- `scripts/check.mjs`：数据完整性和 JavaScript 语法检查
- `docs/MAINTENANCE.md`：后续维护及人工验收步骤
- `docs/THIRD_PARTY.md`：地图、图片和第三方依赖说明

## 检查

```sh
node scripts/check.mjs
python3 build.py
```

GitHub Actions 对推送和拉取请求执行同样检查。它不发布网站。

## 当前设计约定

- 最左侧为行程总览，固定北海道全岛视角展示6天动线；其余三个区域标签附日期提示。
- 浅色真实道路底图；景点玫红、餐厅橙色、机场灰蓝。
- 地图上不放编号或大名称框；点击后展开详情。
- 总览适配手机首屏，无播放控制按钮；详情照片可横滑，介绍按章节显示，关闭按钮固定在弹层顶部。
- 总览按已有行程自动播放，每段约2秒；自动循环，日期放在地图角落，下滑阅读北海道介绍。不自动规划行程。
- 景点介绍不放跳转链接；来源 URL 保存在数据里供维护核验。

这是家庭项目，仓库默认私有；未启用 GitHub Pages。

## 版本维护

`main` 是唯一长期维护与发布分支。动效已整合到主版本；完成的实验分支合并后删除，不再维护平行 HTML 版本。回滚使用 Git 历史及 `baseline-before-motion-2026-10-18` 标签。

发布前运行 `scripts/check*.mjs`、`scripts/check-images.py`，并按 `docs/MAINTENANCE.md` 做手机验收。服务端使用 `deploy/update.sh` 原子替换北海道 HTML，不重启其他服务。

## 旅行研究更新

- [2026-10-28 研究补充](docs/北海道旅行研究补充-2026-10-28.md)：原始研究留档；适用内容已整合进地图中7个地点详情及首页读本的美食、风景、特色、地理章节，并补齐既有追踪基线中的餐厅预约、休业日与圣诞餐饮，按原生成流程输出。
- [既有追踪基线](../北海道追踪基线.json)：保留原有餐厅、预约及10月28日独立发现，与补充并读。
