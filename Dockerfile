# Portafolio · Jorge Sánchez. Pensado para Dokploy (tipo «Dockerfile»).
# - Las páginas son HTML estático (Astro) y las sirve Nginx, con sus redirecciones y caché.
# - Las rutas /api (me gusta y comentarios del blog) las atiende el servidor de Astro en Node, con node:sqlite.
#   La base vive en /data: en Dokploy monta un volumen ahí para que los comentarios sobrevivan a cada despliegue.
FROM node:24-alpine AS build
WORKDIR /app
# git: astro.config.mjs lee la fecha del último commit para el <lastmod> del sitemap
RUN apk add --no-cache git && corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG SITE_URL=https://jorgesanchez.engineer
ENV SITE_URL=$SITE_URL
RUN pnpm build && pnpm prune --prod

FROM node:24-alpine
RUN apk add --no-cache nginx
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/dist/server ./dist/server
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY docker-start.sh /docker-start.sh
ENV NODE_ENV=production HOST=127.0.0.1 PORT=4321 DB_PATH=/data/reacciones.db
VOLUME /data
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/api/salud >/dev/null || exit 1
CMD ["sh", "/docker-start.sh"]
