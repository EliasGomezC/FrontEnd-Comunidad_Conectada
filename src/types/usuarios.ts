export interface Usuario {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  role?: 'admin' | 'moderador' | 'habitante';
  perfil?: {
    id: string;
    usuario: string;
    nombres: string;
    apellidos: string;
    numero_casa: string;
    telefono: string;
    bio: string;
  };
}

export interface UsuarioFilter {
  privada?: string;
  search?: string;
  role?: 'admin' | 'moderador' | 'habitante';
  is_active?: boolean;
  page?: number;
}

export interface UsuariosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Usuario[];
}
