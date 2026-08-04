const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const config: RequestInit = {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (fetchError) {
    console.error('Fetch error:', fetchError);
    if (fetchError instanceof TypeError) {
      throw new Error(
        'No se pudo conectar al backend. Verifica que:\n' +
        '1. El servidor Django esté corriendo (python manage.py runserver)\n' +
        '2. CORS esté configurado en Django\n' +
        '3. La URL del backend sea correcta (.env.local: NEXT_PUBLIC_API_URL=http://127.0.0.1:8000)'
      );
    }
    throw fetchError;
  }
  
  if (!response.ok) {
    const responseText = await response.text();
    let errorData: Record<string, unknown> = {};

    try {
      if (responseText.trim()) {
        const parsedData: unknown = JSON.parse(responseText);
        if (parsedData && typeof parsedData === 'object') {
          errorData = parsedData as Record<string, unknown>;
        }
      }
    } catch {
      // La respuesta puede ser HTML o estar vacía (por ejemplo, un proxy).
    }

    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
      body: responseText || '(respuesta vacía)',
    });

    const nonFieldErrors = errorData.non_field_errors;
    const errorMessage =
      (typeof errorData.detail === 'string' && errorData.detail) ||
      (typeof errorData.message === 'string' && errorData.message) ||
      (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string' && nonFieldErrors[0]) ||
      (Object.keys(errorData).length > 0 ? JSON.stringify(errorData) : '') ||
      `Error ${response.status}: ${response.statusText || 'Error en la petición'}`;

    throw new Error(errorMessage);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function fetchApiAuth<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
