# API de reacciones del blog

Guarda los me gusta y los comentarios por párrafo del blog y de los casos. Es un solo archivo (`server.mjs`), sin dependencias, con SQLite.

## Desplegar en Dokploy

1. En el proyecto **Portafolio**, crea una aplicación nueva (`api`) con el mismo repositorio de GitHub y la rama `main`.
2. Build Type: **Dockerfile**, Build Path: `/api`.
3. **Domains**: `jorgesanchez.engineer`, Path `/api`, Container Port `3001`, HTTPS con Let's Encrypt. No marques «Strip Path».
4. **Advanced → Volumes**: un volumen montado en `/data` (si no, los comentarios se borran en cada despliegue).
5. **Environment**: `ADMIN_TOKEN=<una clave larga>` para moderar.
6. Deploy. Comprueba `https://jorgesanchez.engineer/api/salud` → `{"ok":true}`.

Si la API no está desplegada, el blog sigue funcionando: los me gusta se guardan en el navegador y el panel de comentarios invita a escribir por WhatsApp.

## Moderar

```bash
# Ver los últimos 100 comentarios
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://jorgesanchez.engineer/api/comentarios/recientes
# Borrar uno
curl -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" https://jorgesanchez.engineer/api/comentario/42
```

## Probar en local

```bash
DB_PATH=./reacciones.db node server.mjs
```
