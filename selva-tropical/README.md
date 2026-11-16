# Selva Tropical — Catálogo de Medicina Natural

Tienda/catálogo de suplementos naturales construida con **React + Vite + Mantine**, con inventario en tiempo real en **Firebase** y pedidos enviados por **WhatsApp**.

## Requisitos

- Node.js **20.19+** (recomendado 22.12, ver `.node-version`)
- npm 10+
- Un proyecto de Firebase con Authentication (correo/contraseña) y Firestore

## Desarrollo local

```bash
cd selva-tropical
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview   # sirve dist/ localmente
```

El resultado se genera en `dist/`.

## Configuración de Firebase

La configuración web está en `src/config/firebase.js`. Las claves web de Firebase son públicas, pero debes proteger tu proyecto con las **reglas de seguridad de Firestore** y restringir el dominio en Firebase.

Para que el login funcione en producción:

1. Ve a **Firebase Console → Authentication → Settings → Authorized domains**.
2. Agrega el dominio de Cloudflare Pages, por ejemplo:
   - `selva-tropical.pages.dev`
   - tu dominio personalizado (si lo tienes)

### Administrador

El correo administrador está definido en `src/store/useAuthStore.js`:

```js
const ADMIN_EMAIL = 'andreloor312@gmail.com';
```

Ese usuario puede crear, editar, ocultar y eliminar productos.

## Despliegue en Cloudflare Pages

El proyecto ya incluye:

- `public/_redirects` con fallback a `index.html` (necesario para React Router).
- `public/_headers` con caché para assets y cabeceras de seguridad.
- `wrangler.toml` con `pages_build_output_dir = "dist"`.
- `.node-version` para que Cloudflare use Node 22.

### Opción A — Desde el panel de Cloudflare (recomendado)

1. Sube el repositorio a GitHub/GitLab.
2. En Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona el repositorio.
4. Configura:
   - **Framework preset:** Vite
   - **Root directory:** `selva-tropical` (si el repo es la carpeta padre)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. En **Environment variables** agrega `NODE_VERSION = 22.12.0` (opcional si usa `.node-version`).
6. Deploy.

### Opción B — Desde la terminal con Wrangler

```bash
cd selva-tropical
npx wrangler login
npm run deploy
```

El script ejecuta el build y publica `dist/` en el proyecto `selva-tropical` (nombre definido en `wrangler.toml`). Si el proyecto aún no existe, Wrangler te pedirá crearlo.

> También puedes publicar arrastrando la carpeta `dist/` en **Cloudflare Pages → Upload assets**.

## Estructura

```
src/
  assets/            Logo e ilustración del hero
  components/        Navbar, BrandLogo, modales y Reveal (animaciones)
  config/            Firebase
  pages/             StorePage (catálogo + carrito)
  store/             Zustand: auth, productos, carrito
  styles/            Animaciones y microinteracciones
  index.css          Estilos globales
public/
  _redirects         Fallback SPA para Cloudflare Pages
  _headers           Caché y cabeceras
  icon.png           Favicon
  og-image.png       Imagen para redes sociales
```

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Ejecuta ESLint |
| `npm run deploy` | Build + deploy a Cloudflare Pages con Wrangler |
