'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoginRequest, TokenResponse, User, Perfil } from '@/types/auth';
import { fetchApi } from '@/lib/api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  perfil: Perfil | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'comunidad-conectada-access-token';
const REFRESH_TOKEN_KEY = 'comunidad-conectada-refresh-token';
const USER_KEY = 'comunidad-conectada-user';
const PERFIL_KEY = 'comunidad-conectada-perfil';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedPerfil = localStorage.getItem(PERFIL_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedPerfil) {
          setPerfil(JSON.parse(storedPerfil));
        }
      } catch (e) {
        console.error('Error al parsear datos del usuario desde localStorage:', e);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PERFIL_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const data = await fetchApi<TokenResponse>('/api/auth/token/', {
        method: 'POST',
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      setToken(data.access);
      localStorage.setItem(TOKEN_KEY, data.access);
      
      if (data.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
      }

      // Obtener info del usuario
      const userInfo = await fetchApi<User & { perfil?: Perfil }>('/api/usuarios/me/', {
        headers: {
          'Authorization': `Bearer ${data.access}`,
        },
      });

      setUser(userInfo);
      setPerfil(userInfo.perfil || null);
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      if (userInfo.perfil) {
        localStorage.setItem(PERFIL_KEY, JSON.stringify(userInfo.perfil));
      }

      router.push('/admin/usuarios');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión. Verifica tu conexión al backend.";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPerfil(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERFIL_KEY);
    router.push('/login');
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) {
      logout();
      return;
    }

    try {
      const data = await fetchApi<TokenResponse>('/api/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });

      setToken(data.access);
      localStorage.setItem(TOKEN_KEY, data.access);
      
      if (data.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
      }
    } catch {
      logout();
    }
  };

  const value: AuthContextType = {
    token,
    user,
    perfil,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
