FROM busybox:1.28.3 as config-writer
WORKDIR /usr/src/config
COPY docker/base-package-json.sh package.json ./
RUN ./base-package-json.sh > docker-base-package.json

FROM node:11.6.0-alpine as builder
WORKDIR /usr/src/build
COPY --from=config-writer /usr/src/config/docker-base-package.json package.json
RUN npm install
COPY src ./src/
COPY angular.json tsconfig.json tslint.json ./
RUN ./node_modules/.bin/ng build --prod --aot --base-href /megaten-fusion-tool/

FROM nginx:1.17.6-alpine
RUN sed -i -e '/listen/!b' -e '/80;/!b' -e 's/80;/8080;/' /etc/nginx/conf.d/default.conf \
    && sed -i -e '/user/!b' -e '/nginx/!b' -e '/nginx/d' /etc/nginx/nginx.conf \
    && sed -i 's!/var/run/nginx.pid!/tmp/nginx.pid!g' /etc/nginx/nginx.conf \
    && sed -i "/^http {/a \    proxy_temp_path /tmp/proxy_temp;\n    client_body_temp_path /tmp/client_temp;\n    fastcgi_temp_path /tmp/fastcgi_temp;\n    uwsgi_temp_path /tmp/uwsgi_temp;\n    scgi_temp_path /tmp/scgi_temp;\n" /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx/ /etc/nginx/conf.d/
EXPOSE 8080
USER nginx

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /usr/src/build/dist/megaten-fusion-tool/ /var/www/megaten-fusion-tool/
