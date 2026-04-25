# FanCollector - Frontend
Interfaz web para gestionar colecciones de items coleccionables (figuras, cartas, merchandising, etc.), conectada a la [API REST de FanCollector](https://github.com/NereaTM/FanCollector).

## Tecnologías utilizadas
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-FF6347?style=for-the-badge&logo=gmail&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

## Requisitos previos
Antes de ejecutar el proyecto, asegúrate de tener instalado:
- **Node.js 18+** [Descargar aquí](https://nodejs.org/)
- **Git** (si quieres clonar el repositorio)
- **Backend de FanCollector** corriendo en `http://localhost:8080` ([ver instrucciones](https://github.com/NereaTM/FanCollector))

## Estructura del proyecto
- **/src/auth**: Contexto de autenticación, guards de rutas y almacenamiento del token JWT
- **/src/components**: Componentes reutilizables
  - **/domain**: Tarjetas y paneles de colecciones, items y perfil
  - **/layout**: Header, Footer, Sidebar y Layout general
  - **/ui**: Componentes genéricos (modal, buscador, avisos, etc.)
- **/src/data**: Clientes de la API (colecciones, items, usuarios, auth, email)
- **/src/hooks**: Hooks personalizados (ej: preview de imágenes)
- **/src/pages**: Páginas organizadas por dominio
  - **/Coleccion**: Directorio, detalle, creación, edición de colecciones e items
  - **/Perfil**: Perfil de usuario, edición, cambio de contraseña, dashboards de Admin y Mod
- **/src/styles**: Estilos globales y por módulo (tokens, base, componentes, forms, home, colecciones)
- **/src/types**: Tipos TypeScript (colección, item, usuario, auth)
- **/src/utils**: Utilidades (fechas, imágenes, roles)
- **/src/__test__**: Tests unitarios e integración (Vitest + Testing Library)
- **/testE2E**: Tests end-to-end (Playwright)

### Rutas de la aplicación

#### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/login` | Inicio de sesión y registro |
| `/colecciones` | Directorio de colecciones públicas |
| `/colecciones/:id` | Detalle de una colección pública |

#### Protegidas (requieren autenticación)
| Ruta | Descripción |
|------|-------------|
| `/mis-colecciones` | Colecciones del usuario autenticado |
| `/mis-colecciones/:id` | Detalle de una colección propia |
| `/mis-colecciones/:id/items/editar` | Gestionar items de una colección propia |
| `/colecciones/crear` | Crear una nueva colección |
| `/colecciones/:id/editar` | Editar una colección existente |
| `/colecciones/:coleccionId/items/crear` | Crear un item en una colección |
| `/colecciones/:coleccionId/items/:itemId/editar` | Editar un item |
| `/usuario/:userId/perfil` | Ver perfil de usuario |
| `/usuario/:userId/perfil/editar` | Editar perfil propio |
| `/usuario/:userId/perfil/cambiar-password` | Cambiar contraseña |
| `/usuario/:userId/colecciones` | Ver colecciones de otro usuario |
| `/usuario/:userId/colecciones/:id` | Detalle de colección de otro usuario |

#### Protegidas por rol
| Ruta | Rol requerido |
|------|---------------|
| `/admin/dashboard` | ADMIN |
| `/admin/moderacion` | ADMIN, MODS |

## Instalación y arranque

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/NereaTM/FanCollector-React.git
   cd fancollector-react
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear el archivo `.env`** en la raíz del proyecto.  
   Este archivo contiene las variables de entorno necesarias. Usa el siguiente como plantilla:
   ```env
   VITE_API_URL=http://localhost:8080

   VITE_EMAILJS_SERVICE_ID=tu_service_id
   VITE_EMAILJS_PUBLIC_KEY=tu_public_key
   VITE_EMAILJS_TEMPLATE_ID=FORM_USER
   VITE_EMAILJS_NEWSLETTER_TEMPLATE_USER=NEWSLETTER_USER
   ```
   - `VITE_API_URL`: URL donde está corriendo el backend (por defecto `http://localhost:8080`).
   - Las variables `VITE_EMAILJS_*`: credenciales de [EmailJS](https://www.emailjs.com/) para el formulario de contacto y newsletter. Si no las usas, puedes dejarlas vacías.

4. **Arrancar en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Arrancar en modo desarrollo con hot-reload |
| `npm run build` | Compilar para producción |
| `npm run preview` | Previsualizar la build de producción |
| `npm run lint` | Analizar el código con ESLint |
| `npm run test` | Ejecutar tests unitarios e integración en modo watch |
| `npm run test:run` | Ejecutar tests unitarios e integración una sola vez |
| `npm run test:e2e` | Ejecutar tests end-to-end con Playwright |

## Autenticación
El frontend gestiona la autenticación mediante JWT, coordinado con la API del backend.

1. **Te registras o inicias sesión** en `/login`
2. **El token se almacena** automáticamente en `localStorage` a través de `AuthContext`
3. **Las rutas protegidas** verifican el token antes de renderizar; si no existe o ha expirado, redirigen a `/login`
4. **Aviso de expiración**: 2 minutos antes de que expire la sesión, aparece una notificación. Al expirar, el logout es automático

### Roles disponibles
- **ADMIN**: Acceso completo, incluyendo el panel de administración (`/admin/dashboard`)
- **MODS**: Acceso al panel de moderación (`/admin/moderacion`) y gestión de contenido público
- **USER**: Ver contenido público, gestionar sus propias colecciones e items, editar su perfil
- **No autenticado**: Ver la home, el directorio de colecciones públicas y sus detalles

## Tests

### Unitarios e integración (Vitest + Testing Library)
```bash
npm run test:run
```
Cubre: `apiClient`, `authStorage`, utilidades de fecha y roles, `ModalConfirm`, `AuthContext`, `RequireAuth` y `RequireRole`

### End-to-end (Playwright)
```bash
npm run test:e2e
```
Requiere que el backend esté corriendo. Los tests E2E comprueban flujos de autenticación completos desde el navegador  
Los resultados se guardan en `test-results/` y el informe visual en `playwright-report/index.html`


---
Proyecto escolar de DAM Curso 2025–2026