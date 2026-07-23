'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, RegisterRequest, RegisterResponse, TokenResponse, User, Perfil } from '@/types/auth';
import { fetchApi } from '@/lib/api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  perfil: Perfil | null;
  isAuthenticated: boolean;
  isModerator: boolean;
  isSystemAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
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
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      const storedPerfil = localStorage.getItem(PERFIL_KEY);

      if (!storedToken || !storedUser) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchApi<User & { perfil?: Perfil }>('/api/usuarios/me/', {
          headers: { 'Authorization': `Bearer ${storedToken}` },
        });
        if (!mounted) return;
        setToken(storedToken);
        setUser(currentUser);
        setPerfil(currentUser.perfil || (storedPerfil ? JSON.parse(storedPerfil) : null));
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PERFIL_KEY);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => { mounted = false; };
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

      router.push(userInfo.role === 'admin' ? '/admin-comunidad' : userInfo.role === 'moderador' ? '/admin/usuarios' : '/lobby');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión. Verifica tu conexión al backend.";
      throw new Error(errorMessage);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    const data = await fetchApi<RegisterResponse>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    setToken(data.access);
    setUser(data.user);
    setPerfil(data.user.perfil || null);
    localStorage.setItem(TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    if (data.user.perfil) {
      localStorage.setItem(PERFIL_KEY, JSON.stringify(data.user.perfil));
    }
    router.push('/lobby');
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

  const isModerator = user?.role === 'admin' || user?.role === 'moderador' ||
    user?.membresias?.some((membership) => membership.rol === 'moderador') === true;
  const isSystemAdmin = user?.role === 'admin';

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
    isModerator,
    isSystemAdmin,
    isLoading,
    login,
    register,
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
