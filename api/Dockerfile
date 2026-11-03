# API de reacciones del blog (me gusta y comentarios por párrafo). Node 24 sin dependencias: http + node:sqlite.
# En Dokploy: app tipo «Dockerfile» con Build Path /api, dominio jorgesanchez.engineer con Path /api,
# un volumen montado en /data (ahí vive la base) y la variable ADMIN_TOKEN para moderar.
FROM node:24-alpine
WORKDIR /app
COPY server.mjs ./
ENV NODE_ENV=production PORT=3001 DB_PATH=/data/reacciones.db
VOLUME /data
EXPOSE 3001
USER node
HEALTHCHECK CMD wget -qO- http://127.0.0.1:3001/api/salud >/dev/null || exit 1
CMD ["node", "server.mjs"]
