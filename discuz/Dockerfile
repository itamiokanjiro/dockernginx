FROM nginx:bullseye

# 安裝 PHP 7.4 與擴展
RUN apt update && apt install -y \
    php7.4 \
    php7.4-cli \
    php7.4-fpm \
    php7.4-mysql \
    php7.4-gd \
    php7.4-curl \
    php7.4-mbstring \
    php7.4-xml \
    php7.4-zip \
    php7.4-opcache \
    curl unzip git gettext \
    && apt clean && rm -rf /var/lib/apt/lists/*

# 建立 nginx conf.d 目錄
RUN mkdir -p /etc/nginx/conf.d

# 建立 PHP-FPM socket 目錄
RUN mkdir -p /run/php

# 工作目錄
WORKDIR /usr/share/nginx/html

# 複製 nginx 配置模板
COPY ./nginx.conf.template /etc/nginx/conf.d/default.conf.template

# 設定 PHP-FPM pool 權限
RUN sed -i 's|^;listen.owner =.*|listen.owner = www-data|' /etc/php/7.4/fpm/pool.d/www.conf \
    && sed -i 's|^;listen.group =.*|listen.group = www-data|' /etc/php/7.4/fpm/pool.d/www.conf \
    && sed -i 's|^;listen.mode =.*|listen.mode = 0666|' /etc/php/7.4/fpm/pool.d/www.conf \
    && sed -i 's|^listen = .*|listen = /run/php/php7.4-fpm.sock|' /etc/php/7.4/fpm/pool.d/www.conf

# 複製 entrypoint
COPY start.sh /start.sh
RUN chmod +x /start.sh

# 開放 443
EXPOSE 443

# 用 JSON CMD 執行 entrypoint.sh
CMD ["/start.sh"]