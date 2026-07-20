export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  perfil?: Perfil;
}

export interface Perfil {
  id: number;
  user: number;
  role: 'admin' | 'moderador' | 'habitante';
  phone?: string;
  address?: string;
}
