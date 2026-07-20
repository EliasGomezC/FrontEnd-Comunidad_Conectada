# Endpoints del Backend - Comunidad Conectada

## Autenticación JWT

Todos los endpoints requieren autenticación JWT excepto `/api/auth/token/` y `/api/auth/token/refresh/`.

### Headers requeridos
```
Authorization: Bearer <access_token>
```

## Endpoints por Módulo

### 1. Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/token/` | Obtener token (email + password) |
| POST | `/api/auth/token/refresh/` | Refrescar token |

### 2. Usuarios
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/usuarios/` | `search`, `role`, `is_active` |
| GET | `/api/usuarios/{id}/` | - |
| GET | `/api/perfiles/` | `search`, `role` |

### 3. Privadas
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/privadas/` | `search`, `codigo` |
| GET | `/api/privadas/{id}/` | - |

### 4. Módulos
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/modulos/` | `privada`, `search` |
| GET | `/api/modulos/{id}/` | - |

### 5. Casas
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/casas/` | `privada`, `modulo`, `search` |
| GET | `/api/casas/{id}/` | - |

### 6. Directorio
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/directorio/` | `categoria`, `search` |
| GET | `/api/directorio/{id}/` | - |

### 7. Áreas
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/areas/` | `tipo`, `search` |
| GET | `/api/areas/{id}/` | - |

### 8. Reservaciones
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/reservaciones/` | `area`, `fecha`, `estado`, `search` |
| GET | `/api/reservaciones/{id}/` | - |

### 9. Cuotas
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/cuotas/` | `privada`, `año`, `mes`, `estado` |
| GET | `/api/cuotas/{id}/` | - |

### 10. Pagos
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/pagos/` | `cuota`, `casa`, `estado` |
| GET | `/api/pagos/{id}/` | - |

### 11. Reportes
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/reportes/` | `tipo`, `estado`, `prioridad`, `search` |
| GET | `/api/reportes/{id}/` | - |

### 12. Incidentes
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/incidentes/` | `estado`, `prioridad`, `tipo`, `search` |
| GET | `/api/incidentes/{id}/` | - |

### 13. Objetos Perdidos
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/objetos-perdidos/` | `estado`, `categoria`, `search` |
| GET | `/api/objetos-perdidos/{id}/` | - |

### 14. Proyectos
| Método | Endpoint | Filtros |
|--------|----------|---------|
| GET | `/api/proyectos/` | `estado`, `privada`, `search` |
| GET | `/api/proyectos/{id}/` | - |

## Configuración

1. Copiar `.env.local.example` a `.env.local`
2. Actualizar `NEXT_PUBLIC_API_URL` con la URL de tu backend

```bash
cp .env.local.example .env.local
```

## Estructura de Archivos

```
src/
├── types/           # Tipos TypeScript para todas las entidades
│   ├── auth.ts
│   ├── usuarios.ts
│   ├── privadas.ts
│   └── ...
├── services/        # Servicios API para cada módulo
│   ├── usuarios.ts
│   ├── privadas.ts
│   └── ...
├── lib/             # Utilidades base
│   └── api.ts       # Fetch wrapper con auth
└── features/        # Features de la aplicación
    └── authentication/
        └── AuthContext.tsx  # Contexto de autenticación
```

## Uso del AuthContext

```tsx
import { useAuth } from "@/features/authentication/AuthContext";

function MiComponente() {
  const { token, user, isAuthenticated, login, logout } = useAuth();
  
  // Usar token para llamadas manuales
  // isAuthenticated para proteger rutas
}
```

## Uso de los Servicios

```tsx
import { getUsuarios } from "@/services/usuarios";
import { useAuth } from "@/features/authentication/AuthContext";

function UsuariosPage() {
  const { token } = useAuth();
  
  const usuarios = await getUsuarios(token, {
    search: "juan",
    role: "moderador",
  });
}
```
