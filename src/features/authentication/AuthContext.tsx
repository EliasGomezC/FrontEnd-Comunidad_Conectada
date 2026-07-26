'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, RegisterRequest, RegisterResponse, TokenResponse, User, Perfil, Membership } from '@/types/auth';
import { ApiError, fetchApi } from '@/lib/api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  perfil: Perfil | null;
  activeMembership: Membership | null;
  isAuthenticated: boolean;
  isModerator: boolean;
  isSystemAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  selectPrivate: (membership: Membership) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'comunidad-conectada-access-token';
const REFRESH_TOKEN_KEY = 'comunidad-conectada-refresh-token';
const USER_KEY = 'comunidad-conectada-user';
const PERFIL_KEY = 'comunidad-conectada-perfil';
const ACTIVE_MEMBERSHIP_KEY = 'comunidad-conectada-active-membership';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      const storedPerfil = localStorage.getItem(PERFIL_KEY);
      const storedMembership = localStorage.getItem(ACTIVE_MEMBERSHIP_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!storedToken || !storedUser) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        let validAccessToken = storedToken;
        let currentUser: User & { perfil?: Perfil };
        try {
          currentUser = await fetchApi<User & { perfil?: Perfil }>('/api/usuarios/me/', {
            headers: { 'Authorization': `Bearer ${validAccessToken}` },
          });
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 401 || !storedRefresh) throw error;
          const refreshed = await fetchApi<TokenResponse>('/api/auth/token/refresh/', {
            method: 'POST',
            body: JSON.stringify({ refresh: storedRefresh }),
          });
          validAccessToken = refreshed.access;
          localStorage.setItem(TOKEN_KEY, validAccessToken);
          if (refreshed.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refreshed.refresh);
          currentUser = await fetchApi<User & { perfil?: Perfil }>('/api/usuarios/me/', {
            headers: { 'Authorization': `Bearer ${validAccessToken}` },
          });
        }
        if (!mounted) return;
        setToken(validAccessToken);
        setUser(currentUser);
        setPerfil(currentUser.perfil || (storedPerfil ? JSON.parse(storedPerfil) : null));
        if (storedMembership) {
          const parsed = JSON.parse(storedMembership) as Membership;
          const current = currentUser.membresias?.find((membership) => membership.privada === parsed.privada);
          if (current) setActiveMembership(current);
          else localStorage.removeItem(ACTIVE_MEMBERSHIP_KEY);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PERFIL_KEY);
        localStorage.removeItem(ACTIVE_MEMBERSHIP_KEY);
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
      setActiveMembership(null);
      localStorage.removeItem(ACTIVE_MEMBERSHIP_KEY);
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      if (userInfo.perfil) {
        localStorage.setItem(PERFIL_KEY, JSON.stringify(userInfo.perfil));
      }

      router.push(userInfo.role === 'admin' ? '/admin-comunidad' : '/lobby');
    } catch (error) {
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
    setActiveMembership(null);
    localStorage.removeItem(ACTIVE_MEMBERSHIP_KEY);
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
    setActiveMembership(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERFIL_KEY);
    localStorage.removeItem(ACTIVE_MEMBERSHIP_KEY);
    router.push('/login');
  };

  const isModerator = user?.role === 'admin' || activeMembership?.rol === 'moderador' ||
    (!activeMembership && user?.membresias?.some((membership) => membership.rol === 'moderador') === true);
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

  const selectPrivate = (membership: Membership) => {
    setActiveMembership(membership);
    localStorage.setItem(ACTIVE_MEMBERSHIP_KEY, JSON.stringify(membership));
  };

  const value: AuthContextType = {
    token,
    user,
    perfil,
    activeMembership,
    isAuthenticated: !!token,
    isModerator,
    isSystemAdmin,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    selectPrivate,
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
