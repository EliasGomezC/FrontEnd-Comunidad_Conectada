const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: 'Error en la petición' };
    }
    
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    });
    
    // Manejar diferentes formatos de error
    const errorMessage = 
      errorData.detail || 
      errorData.message || 
      errorData.non_field_errors?.[0] ||
      JSON.stringify(errorData) ||
      `Error ${response.status}: ${response.statusText}`;
    
    throw new Error(errorMessage);
  }

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
