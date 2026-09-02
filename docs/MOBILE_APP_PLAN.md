# Plan de app móvil — Comunidad Conectada

## Contexto actual
- **Backend**: Django + Django REST Framework (API REST ya existente, endpoints en `/api/*`, autenticación por token).
- **Frontend web**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind.
- Los servicios (`src/services/*`) y tipos (`src/types/*`) del frontend ya encapsulan el consumo de la API. Esto es la base para la app móvil.

## Decisión de tecnología

### Opción A — React Native + Expo (Recomendada)
- Mismo lenguaje (TypeScript/JSX), mismo equipo, mismo ecosistema React.
- Permite **reutilizar** los tipos (`src/types/*`) y la lógica de servicios de la API con ajustes mínimos.
- Expo facilita: push notifications, cámara, galería, deep links, OTA updates y builds a iOS/Android.
- Se publica en ambas tiendas desde un solo código.

### Opción B — Crear un proyecto nativo nuevo (Kotlin/Swift) desde cero
- Máximo rendimiento y acceso nativo, pero:
  - Dos bases de código independientes (una por plataforma o KMP).
  - No reutiliza nada del frontend web.
  - Costo de mantenimiento y tiempo mucho mayores.
- Solo justificable si se requiere algo muy nativo (bluetooth, hardware) — no es el caso aquí.

### Opción C — Flutter
- Un solo código con Dart, buen rendimiento y UI consistente.
- Contras: hay que reescribir todo en Dart (no se reutiliza el frontend React) y el equipo debe aprender un lenguaje nuevo.

### Recomendación
**React Native + Expo, como un proyecto nuevo (monorepo) que reutiliza la capa de API y tipos del frontend web.** No se convierte el Next.js en RN; se crea un app RN que comparte el backend existente. Si el objetivo es solo probar, empezar con **Expo Go** y publicar después con EAS Build.

## Estructura propuesta (monorepo)
```
/
├── Comunidad_Conectada-backend/        # Django DRF (ya existe, sin cambios de dominio)
├── FrontEnd-Comunidad_Conectada/       # Web Next.js (ya existe)
└── App-Comunidad_Conectada/            # NUEVO: React Native + Expo
    ├── app/                            # rutas (Expo Router, tabs por rol)
    ├── src/
    │   ├── api/                        # cliente HTTP + tokens (port de src/services)
    │   ├── types/                      # tipos compartidos (port de src/types)
    │   ├── screens/
    │   │   ├── habitante/
    │   │   └── moderador/
    │   └── components/                 # UI (galería, modales, tarjetas)
    ├── app.json
    └── package.json
```

## Alcance por rol (pantallas prioritarias)

### Habitante
1. **Home / Dashboard**: resumen de avisos, pagos pendientes, reservaciones próximas.
2. **Reportes e incidentes**: crear/ver incidente con **galería de fotos** y estado.
3. **Reservaciones**: lista, nueva reservación con **verificación de disponibilidad** y galería del área.
4. **Directorio**: lista, detalle con **tipo de ubicación (local/externo)**, **Maps** y botón **Llamar**.
5. **Pagos**: ver cuotas, subir comprobante (cámara/galería), estado.
6. **Objetos perdidos**: publicar, reclamar, galería de imágenes.
7. **Eventos y proyectos**: detalle con galería.

### Moderador
1. **Aprobaciones**: reservaciones y reclamaciones pendientes.
2. **Gestión de pagos**: validar comprobantes (aceptar/declinar).
3. **Reportes**: seguimiento y generación de reportes con galería.
4. **Directorio**: alta/edición de contactos con ubicación y Maps.
5. **Usuarios**: gestión de habitantes.

## Reutilización con el frontend web
- Portar `src/types/*` tal cual (son interfaces TS independientes de React).
- Portar `src/services/*` a un cliente que use `fetch`/`axios` con el token; cambiar solo la parte de formularios `multipart` (imágenes) por la API nativa de RN.
- La **galería**: en web usa `<input type="file">` + `GalleryInput`; en RN usar `expo-image-picker` + `expo-image` para mostrar.
- **Maps**: en RN usar `react-native-maps` (o abrir el `maps_url` con `Linking`).

## Decisiones pendientes de infraestructura
- **Autenticación**: conservar token JWT del backend; guardarlo en `expo-secure-store`.
- **Notificaciones push**: `expo-notifications` con suscripción por usuario y privada.
- **Base de datos offline**: `expo-sqlite` o `WatermelonDB` solo si hace falta modo offline; en una primera fase mantener online-first.
- **Monorepo**: usar `npm workspaces` o `turborepo` para compartir tipos; si se complica, copiar la carpeta `types` versionada.

## Hoja de ruta sugerida
- **Sprint 1 — Base**: crear app Expo con navegación por rol (tabs), login con token y home de cada rol.
- **Sprint 2 — Habitante core**: reportes con galería, reservaciones con disponibilidad, directorio con Maps/llamar.
- **Sprint 3 — Pagos y objetos perdidos**: subir comprobante con cámara, publicar/reclamar con fotos.
- **Sprint 4 — Moderador**: aprobaciones, validación de pagos, gestión de directorio y reportes.
- **Sprint 5 — Pulido**: notificaciones, estados vacíos/loading, accesibilidad y builds (EAS) a TestFlight/Play internal.

## Riesgos
- Mantener **dos frontends** (web y móvil): mitigar reutilizando tipos y servicios, y documentando cambios de contrato en el backend.
- JSX web muy compacto no se porta directo a RN (los estilos de Tailwind no aplican igual): habrá que reescribir presentación, no lógica.
- El backend debe permanecer **agnóstico de plataforma**: validar que los endpoints sirvan JSON y `multipart` de forma consistente.

## Conclusión
Usar **React Native + Expo** (nuevo proyecto `App-Comunidad_Conectada`) que comparte el backend y reutiliza tipos/servicios del web es la opción más rápida y de menor riesgo. Empezar con Expo Router y navegación por rol, resolviendo primero autenticación y el flujo de imágenes/medios.
