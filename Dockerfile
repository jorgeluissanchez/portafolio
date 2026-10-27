# Portafolio · Jorge Sánchez — sitio estático (Astro) servido con Nginx. Pensado para Dokploy (tipo «Dockerfile»).
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG SITE_URL=https://jorgesanchez.engineer
ENV SITE_URL=$SITE_URL
RUN pnpm build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
