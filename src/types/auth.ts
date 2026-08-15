export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  numero_casa?: string;
  codigo_postal?: string;
  password: string;
  password_confirm: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse extends TokenResponse {
  user: User;
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
  membresias?: Membership[];
  role?: 'admin' | 'moderador' | 'habitante';
}

export interface Perfil {
  id: number;
  usuario: string;
  nombres: string;
  apellidos: string;
  numero_casa: string;
  codigo_postal: string;
  telefono: string;
  casa?: string | null;
  avatar?: string;
  bio: string;
}

export interface Membership {
  id: string;
  privada: string;
  privada_nombre: string;
  privada_codigo: string;
  rol: 'moderador' | 'habitante';
  usuario?: string;
  status?: 'activo' | 'suspendido';
  created_at?: string;
  inactivated_at?: string | null;
  modulos_contratados?: string[];
}
