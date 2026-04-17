# nginx stage for serving content
ARG NGINX_IMAGE=harbor.mbank.kg/dockerhub-proxy/library/nginx:1.23.3-alpine
FROM ${NGINX_IMAGE}

# Copy static assets from builder stage
COPY ./dist  /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]