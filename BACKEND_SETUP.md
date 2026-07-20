# Configuración Rápida - Backend Django

## 1. Instalar django-cors-headers

```bash
pip install django-cors-headers
```

## 2. Agregar a INSTALLED_APPS en settings.py

```python
INSTALLED_APPS = [
    # ... tus apps existentes
    'corsheaders',
]
```

## 3. Agregar middleware en settings.py

**IMPORTANTE:** Debe ir **AL PRINCIPIO** de la lista, antes de `CommonMiddleware`:

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <-- PRIMERO
    'django.middleware.common.CommonMiddleware',
    # ... otros middleware
]
```

## 4. Configurar CORS en settings.py

### Opción A: Permitir solo localhost (Recomendado para desarrollo)

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Opción B: Permitir todos los orígenes (Solo desarrollo)

```python
CORS_ALLOW_ALL_ORIGINS = True
```

### Opción C: Con credenciales (si usas cookies o auth headers)

```python
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## 5. Reiniciar el servidor Django

```bash
python manage.py runserver
```

## 6. Verificar que funcione

Abre la consola del navegador (F12) y verifica que:
- No haya errores de CORS
- El login funcione correctamente

## Errores Comunes

### ❌ "Failed to fetch"
- CORS no está configurado en Django
- El servidor Django no está corriendo
- La URL en `.env.local` es incorrecta

### ❌ "404 /api/auth/token/"
- La ruta del endpoint está mal
- Django no tiene las URLs configuradas

### ❌ "401 Unauthorized"
- Las credenciales son incorrectas
- El usuario no existe en la base de datos

## Verificación del Backend

Para verificar que el endpoint de auth funciona, usa curl:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tu-password"}'
```

Deberías recibir:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```
