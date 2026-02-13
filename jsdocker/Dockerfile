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
CMD sh -c "\
  envsubst '\$DOMAIN' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
  node /app/server.js & \
  nginx -g 'daemon off;' \
"
