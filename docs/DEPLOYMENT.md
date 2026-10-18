# 杭州服务器部署

- 服务器：120.26.54.152（杭州 ECS）
- 访问网址：`https://120.26.54.152/hokkaido/`；根路径暂返回 404，留给个人主页。
- 网站目录：`/srv/hokkaido-family-map`，仅 `dist` 对外提供文件
- 独立 Web 服务：Nginx，443 端口；80 端口保留证书验证并跳转 HTTPS
- 配置：`/etc/nginx/conf.d/hokkaido-family-map.conf`，模板在 `deploy/nginx.conf`
- 幸福助手：`xingfu-assistant-tool.service`，8080 端口；网站更新不操作此服务

## Git 更新

服务器可以访问 GitHub 时，在服务器执行 `bash deploy/update.sh`。
若直连 GitHub 超时，在可信本地仓库生成 Git bundle，经已有获授权的管理连接上传，再运行：

```sh
git bundle create hokkaido.bundle main
# 上传后，在服务器项目目录执行
bash deploy/update.sh /tmp/hokkaido.bundle
```

脚本先在独立发布目录构建，再快进 Git 分支并原子替换 HTML，保留前一版 HTML 备份。无需重启幸福助手或 Nginx。

首次部署通过 Git bundle 导入完整 main 历史，origin 保持指向 GitHub；没有使用第三方 GitHub 镜像、关闭 TLS 校验或保存 GitHub 凭证。临时 SSH 公钥仅在本次部署时由用户批准，完成后移除。

## 验证和回滚

```sh
nginx -t
curl -fsS -o /dev/null -H 'Host: 120.26.54.152' http://127.0.0.1/hokkaido/
curl -fsS -o /dev/null http://127.0.0.1:8080/
systemctl show xingfu-assistant-tool -p MainPID -p NRestarts
```

回滚时将选定的 `dist/index.html.backup-<commit>` 复制为临时文件，再 `mv` 替换 `dist/index.html`；保留 Git 历史用于排查。不要重启或改写幸福助手的服务和文件。

## HTTPS 与续期

使用 Let’s Encrypt 公网 IP 短期证书（约 6 天），Certbot 5.8.0 官方 snap 管理。
证书名称 `hokkaido-ip`，文件位于 `/etc/letsencrypt/live/hokkaido-ip/`，私钥只保留在服务器。
`snap.certbot.renew.timer` 自动检查续期；部署钩子 `/etc/letsencrypt/renewal-hooks/deploy/hokkaido-nginx` 在配置检查通过后重新加载 Nginx。
HTTP 验证目录 `/var/www/letsencrypt/.well-known/acme-challenge/` 必须保持公网可访问。安全组需要 TCP 80、443；不改幸福助手 8080。

```sh
/snap/bin/certbot renew --cert-name hokkaido-ip --dry-run
systemctl list-timers --all | grep certbot
curl -fsS -o /dev/null https://120.26.54.152/hokkaido/
```

上线前配置备份：`/etc/nginx/hokkaido.pre-tls.conf`。不要用不带证书路径的旧配置覆盖当前 HTTPS 配置。

## 图片资源发布
版本化 WebP 位于 dist/assets/photos；部署先复制图片、启用仅该路径的一年 immutable 缓存，再原子替换 HTML。照片路径为相对路径，兼容 /hokkaido/。首次启用缓存仅增补北海道站点 location，保留 TLS 配置，nginx -t 通过才 reload；幸福助手服务不操作。
本地 --output 输出旁会生成 hokkaido-assets/photos，移动 HTML 时须同时携带该文件夹。旧哈希图片保留，支持旧 HTML 回滚。
