# django-cors-headers
INSTALLED_APPS = [
    # ... tus otras apps
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <-- Debe ir AL PRINCIPIO
    'django.middleware.common.CommonMiddleware',
    # ... tus otros middleware
]

# Configuración CORS para desarrollo local
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# O para permitir todos (solo desarrollo)
CORS_ALLOW_ALL_ORIGINS = True

# Si necesitas enviar credenciales (cookies, auth headers)
CORS_ALLOW_CREDENTIALS = True

```
