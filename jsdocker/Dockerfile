# Dockerfile
FROM nginx:alpine

# Node + envsubst
RUN apk add --no-cache nodejs npm bash gettext

WORKDIR /app
COPY server.js /app/server.js
RUN npm install express mysql2 cookie-parser dotenv

# Nginx template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# 啟動時生成 conf + Node + nginx 前景
# 複製腳本
COPY start.sh /start.sh
RUN chmod +x /start.sh

# CMD 用 JSON 格式
CMD ["/start.sh"]