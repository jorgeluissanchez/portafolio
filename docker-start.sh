#!/bin/sh
# Arranca el servidor de Astro (solo /api) y Nginx (páginas estáticas). Si uno de los dos cae, el contenedor se
# detiene y Dokploy lo reinicia.
set -e
mkdir -p /data
node /app/dist/server/entry.mjs &
NODE_PID=$!
nginx -g 'daemon off;' &
NGINX_PID=$!
trap 'kill $NODE_PID $NGINX_PID 2>/dev/null' TERM INT
while kill -0 $NODE_PID 2>/dev/null && kill -0 $NGINX_PID 2>/dev/null; do sleep 2; done
kill $NODE_PID $NGINX_PID 2>/dev/null
exit 1
