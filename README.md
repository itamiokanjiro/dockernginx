
# 啟動所有服務並建構最新 image

建立 /data/npm/index.html 與 /data/save/index.html

docker compose up -d --build

test-bot 服務，建立 3 個副本

docker compose up -d --scale test-bot=3


啟動單個服務

docker compose up -d serverfile

docker compose up -d ok-bot

停止並移除所有容器、網路

docker compose down 。

注意：
- Docker Compose 會自動建立網路，容器之間可以用 service 名稱互通
- 如需自訂網路，請在 docker-compose.yml 裡設定 network
- 記得先在/data/npm 或save 放置網站的index.html
- .env.template 複製一份.env 填入數據庫帳密
