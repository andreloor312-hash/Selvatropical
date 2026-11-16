# Selva Tropical

Catálogo de medicina natural y suplementos con React + Vite, Firebase y pedidos por WhatsApp.

La aplicación está en la carpeta [`selva-tropical`](./selva-tropical):

```bash
cd selva-tropical
npm install
npm run dev
```

## Deploy en Cloudflare Pages

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `selva-tropical`
- **Node:** 22.12 (archivo `.node-version`)

El proyecto incluye `public/_redirects` para el fallback de React Router, `public/_headers` para caché y `wrangler.toml` para desplegar con:

```bash
cd selva-tropical
npm run deploy
```

Instrucciones detalladas en [`selva-tropical/README.md`](./selva-tropical/README.md).
