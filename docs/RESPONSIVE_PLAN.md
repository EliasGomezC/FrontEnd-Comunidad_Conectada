# Plan responsive Comunidad Conectada

## Objetivo
Tener una base web responsive consistente para `habitante` y `moderador` antes de migrar pantallas a app móvil.

## Fase 1
- Convertir `Sidebar` a drawer móvil con botón flotante, backdrop y cierre automático al navegar.
- Normalizar `main` layouts para usar `px-4 sm:px-6 lg:px-8` y tablas con `overflow-x-auto`.
- Ajustar encabezados de módulos para que acciones y búsqueda colapsen en una sola columna bajo `md`.

## Fase 2
- Reemplazar tablas críticas por tarjetas en móvil: `reservaciones`, `usuarios`, `pagos`, `reportes`.
- Definir breakpoints funcionales: `sm` para formularios, `md` para grids, `lg` para sidebar fijo.
- Extraer componentes reutilizables `MobileCard`, `ResponsiveTable` y `ModuleShell`.

## Fase 3
- Unificar navegación por rol:
- `Habitante`: acceso rápido a reportes, reservaciones, directorio, pagos y objetos perdidos.
- `Moderador`: accesos rápidos a gestión, aprobaciones y seguimiento.
- Añadir estados vacíos, skeletons y botones primarios de tamaño táctil mínimo `44px`.

## Fase 4
- Preparar equivalencia con app móvil:
- Documentar pantallas, acciones primarias y dependencias de cada rol.
- Separar lógica de datos de presentación para reutilizar servicios y tipos.
- Identificar módulos que conviene mover primero a React Native o Flutter por complejidad baja/media.

## Riesgos
- Varias páginas siguen con JSX muy compacto o en una sola línea, lo que dificulta mantenimiento.
- Algunos módulos todavía mezclan detalle y edición en el mismo archivo; conviene separarlos antes de la migración móvil.
- Las tablas extensas sin paginación visual móvil siguen siendo el punto más débil.
