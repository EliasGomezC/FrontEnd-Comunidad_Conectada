# Arquitectura del Frontend — Comunidad Conectada

## Stack tecnológico

| Componente   | Tecnología                    |
|--------------|-------------------------------|
| Framework    | Next.js 16 (App Router)       |
| Lenguaje     | TypeScript (strict)           |
| Bundler      | Turbopack                     |
| Estilos      | Tailwind CSS                  |
| Iconos       | react-icons (Io5)             |
| HTTP         | Fetch nativo                  |

---

## Estructura del proyecto

```
FrontEnd-Comunidad_Conectada/
├── src/
│   ├── app/                        # App Router (Next.js)
│   │   ├── page.tsx                # Home → redirección según rol
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── login/                  # Página de inicio de sesión
│   │   ├── register/               # Registro de usuario
│   │   ├── lobby/                  # Panel principal del habitante
│   │   ├── perfil/                 # Perfil de usuario
│   │   ├── admin/                  # Panel del moderador (protegido)
│   │   │   ├── layout.tsx          # Protege rutas: solo moderadores
│   │   │   ├── usuarios/           # CRUD de usuarios
│   │   │   ├── reportes/           # Reportes
│   │   │   ├── reservaciones/     # Reservaciones
│   │   │   ├── directorio/         # Directorio
│   │   │   ├── encuestas/          # Encuestas
│   │   │   ├── eventos/            # Eventos
│   │   │   ├── objetos-perdidos/   # Objetos perdidos
│   │   │   └── pagos/             # Pagos
│   │   └── admin-comunidad/        # Panel del admin global
│   │       ├── layout.tsx          # Protege rutas: solo isStaff
│   │       └── page.tsx            # Dashboard de administración global
│   ├── components/                 # Componentes reutilizables
│   │   └── Sidebar.tsx             # Sidebar de navegación (filtrado por módulos)
│   ├── features/
│   │   └── authentication/         # Lógica de autenticación
│   │       └── AuthContext.tsx      # Contexto global de auth
│   ├── services/                   # Capa de API
│   │   ├── api.ts                  # Cliente HTTP base (fetchApi, fetchApiAuth)
│   │   ├── auth.ts                 # Servicios de autenticación
│   │   ├── privadas.ts             # Servicios de privadas y módulos
│   │   └── admin.ts               # Servicios de administración global
│   ├── types/                      # Tipos TypeScript
│   │   ├── auth.ts                 # User, Membership, Perfil, tokens
│   │   ├── privadas.ts             # Privada, ModuloSistema, filtros
│   │   └── usuarios.ts            # Usuario, filtros de usuarios
│   └── lib/
│       └── api.ts                  # Helpers de URL y fetch
└── docs/
    └── ARQUITECTURA.md             # Este documento
```

---

## Flujo de autenticación

### AuthContext (`features/authentication/AuthContext.tsx`)

El contexto central que maneja:

| Estado            | Descripción                                      |
|-------------------|--------------------------------------------------|
| `user`            | Objeto `User` con perfil, membresías y rol       |
| `token`           | Token JWT de acceso                              |
| `isAuthenticated` | bool — si hay sesión activa                      |
| `isModerator`     | bool — si el usuario es moderador de alguna privada |
| `isSystemAdmin`   | bool — si el usuario es admin global (`is_staff`)  |
| `isLoading`       | bool — mientras se verifica la sesión            |

### Flujo de inicio de sesión

```
/login → POST /api/auth/token/ → { access, refresh }
  → GET /api/auth/me/          → { user }
  → Determinar redirección:
      - role === "admin"        → /admin-comunidad
      - role === "moderador"    → /admin/usuarios
      - default                 → /lobby
```

### Protección de rutas

Cada layout verifica el rol antes de renderizar los hijos:

| Layout               | Ruta               | Guard condition                          |
|----------------------|--------------------|------------------------------------------|
| `admin/layout.tsx`   | `/admin/*`         | `isModerator`                            |
| `admin-comunidad/layout.tsx` | `/admin-comunidad/*` | `isSystemAdmin`                  |
| `lobby/page.tsx`     | `/lobby`           | `isAuthenticated`                        |
| `page.tsx` (home)    | `/`                | Redirección según rol                    |

---

## Capa de servicios (`services/`)

Cada archivo agrupa llamadas a la API relacionadas:

```
services/
├── api.ts              # fetchApi<T>() genérico + fetchApiAuth<T>()
├── auth.ts             # login, register, refreshToken
├── privadas.ts         # getPrivadas, getMisPrivadas, crearPrivada, unirseAPrivada, getModulosSistema
└── admin.ts            # getAdminPrivadas, getAdminModulos, crearAdmin, crearModulo, actualizarModulosPrivada, cambiarPassword
```

### `fetchApiAuth`
Envía automáticamente el header `Authorization: Bearer <token>`. Si la respuesta no es OK, parsea el error y lanza una excepción.

---

## Sidebar y navegación

### Sidebar (`components/Sidebar.tsx`)

- Muestra el **código de la privada** con botón de copiar para compartir con otros habitantes.
- Filtra las rutas visibles según los **módulos contratados** de la privada actual.
- El admin global (`role === "admin"`) ve **todos** los módulos más el enlace a "Administración global".

### Flujo de filtrado del sidebar

```
1. Obtener membresías del usuario autenticado
2. Extraer modulos_contratados de cada membresía
3. Filtrar menuItems solo por los códigos contratados
4. Si es admin global, mostrar todos los ítems sin filtrar
```

---

## Área de administración global (`/admin-comunidad`)

Página protegida para administradores globales. Incluye:

- **Listado de privadas**: código, nombre, habitantes, módulos contratados.
- **Asignación de módulos**: selector de módulos por privada con guardado.
- **Catálogo de módulos**: creación de nuevos módulos del sistema.
- **Creación de administradores**: formulario para crear nuevos admins.
- **Cambio de contraseña**: formulario de cambio de contraseña.

---

## Manejo de errores de API

Toda llamada a API está envuelta en try/catch. El error se muestra al usuario mediante:

- `message` state local → muestra notificación en la UI.
- `fetchApi` loggea en consola la respuesta de error completa para debug.
- Errores de red (servidor caído) muestran mensaje descriptivo.

---

## Convenciones de código

- **Nombres de archivos**: kebab-case (ej. `objetos-perdidos/page.tsx`).
- **Componentes**: PascalCase para exportaciones, function components.
- **Tipos**: interfaces en `types/`, import de `@/types/`.
- **API services**: funciones que retornan `Promise<T>`, nombres descriptivos (`getMisPrivadas`).
- **Estado**: `useState` y `useEffect` para estado local, `AuthContext` para estado global de sesión.
