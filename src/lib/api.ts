const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const ACCESS_TOKEN_KEY = 'comunidad-conectada-access-token';
const REFRESH_TOKEN_KEY = 'comunidad-conectada-refresh-token';
export const TOKEN_REFRESHED_EVENT = 'comunidad-conectada-token-refreshed';
export const SESSION_EXPIRED_EVENT = 'comunidad-conectada-session-expired';

interface RefreshResponse { access: string; refresh?: string }
let refreshRequest: Promise<string> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

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

    const nonFieldErrors = errorData.non_field_errors;
    const firstFieldError = Object.values(errorData).find(
      (value) => Array.isArray(value) && typeof value[0] === 'string'
    ) as string[] | undefined;
    const errorMessage =
      (typeof errorData.detail === 'string' && errorData.detail) ||
      (typeof errorData.message === 'string' && errorData.message) ||
      (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string' && nonFieldErrors[0]) ||
      firstFieldError?.[0] ||
      (Object.keys(errorData).length > 0 ? JSON.stringify(errorData) : '') ||
      `Error ${response.status}: ${response.statusText || 'Error en la petición'}`;

    throw new ApiError(errorMessage, response.status, errorData);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function fetchApiAuth<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const requestWithToken = (accessToken: string) => fetchApi<T>(endpoint, {
    ...options,
    headers: { ...options.headers, 'Authorization': `Bearer ${accessToken}` },
  });

  try {
    return await requestWithToken(token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || typeof window === 'undefined') throw error;

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      throw new ApiError('Tu sesión venció. Inicia sesión nuevamente.', 401);
    }

    let newAccessToken: string;
    try {
      if (!refreshRequest) {
        refreshRequest = fetchApi<RefreshResponse>('/api/auth/token/refresh/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        }).then((data) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
          if (data.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
          window.dispatchEvent(new CustomEvent(TOKEN_REFRESHED_EVENT, { detail: data.access }));
          return data.access;
        }).finally(() => { refreshRequest = null; });
      }
      newAccessToken = await refreshRequest;
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      throw new ApiError('Tu sesión venció. Inicia sesión nuevamente.', 401);
    }
    return requestWithToken(newAccessToken);
  }
}
