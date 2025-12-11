FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/run/nginx \
    /var/log/nginx && \
    chown -R 1001:0 /var/cache/nginx \
    /var/run/nginx \
    /var/log/nginx \
    /usr/share/nginx/html \
    /etc/nginx/conf.d && \
    chmod -R g+w /var/cache/nginx \
    /var/run/nginx \
    /var/log/nginx \
    /usr/share/nginx/html \
    /etc/nginx/conf.d

USER 1001
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]