FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod -R g+w /var/cache/nginx /var/run /usr/share/nginx/html

USER 1001
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]