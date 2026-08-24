# Plan responsive Comunidad Conectada

## Objetivo
Tener una base web responsive consistente para `habitante` y `moderador` antes de migrar pantallas a app móvil.

## Estado de avance
- [x] Fase 1 — completada.
- [ ] Fase 2, 3 y 4 — pendientes (ver `MOBILE_APP_PLAN.md` para la Fase 4).

## Fase 1 (completada)
- [x] Convertir `Sidebar` a drawer móvil con botón flotante, backdrop y cierre automático al navegar.
- [x] Normalizar `main` layouts: padding `p-4 pt-20 sm:p-6 sm:pt-24 lg:pt-6` en `HabitantePage` y en todas las páginas con `Sidebar`.
- [x] Hacer `ModuleHeader` (título, búsqueda y acción) colapsable en una columna bajo `md`.
- [x] Envolver tablas en `overflow-x-auto` con `min-w-[720px]`+ (`pagos`, `admin/pagos/[cuotaId]`); `usuarios` y `reservaciones` ya lo traían.
- [x] Encabezados de módulos: `text-3xl→5xl` responsive en `pagos`, `admin/pagos`, `admin/reportes`, `objetos perdidos`.
- [x] Grid de resumen de pagos responsivo (`grid-cols-2 → sm:3 → lg:6`).

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
- Preparar equivalencia con app móvil — ver `docs/MOBILE_APP_PLAN.md`.

## Riesgos
- Varias páginas siguen con JSX muy compacto o en una sola línea, lo que dificulta mantenimiento.
- Algunos módulos todavía mezclan detalle y edición en el mismo archivo; conviene separarlos antes de la migración móvil.
- Las tablas extensas sin paginación visual móvil siguen siendo el punto más débil.
