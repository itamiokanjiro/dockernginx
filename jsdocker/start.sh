#!/bin/sh
set -e

# 1. 生成 nginx 配置
envsubst '$DOMAIN' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# 2. 啟動 Node.js 後台
node /app/server.js &

# 3. 啟動 nginx 前台
nginx -g 'daemon off;'