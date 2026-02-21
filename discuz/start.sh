#!/bin/bash
set -e

# 生成 nginx 配置
envsubst '$DOMAIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 啟動 PHP-FPM 後台
/usr/sbin/php-fpm7.4 -F &

# 啟動 nginx 前台
nginx -g 'daemon off;'