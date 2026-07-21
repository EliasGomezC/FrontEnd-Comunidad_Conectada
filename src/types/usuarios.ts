export interface Usuario {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  perfil?: {
    id: string;
    usuario: string;
    nombres: string;
    apellidos: string;
    numero_casa: string;
    telefono: string;
    bio: string;
  };
  role?: 'admin' | 'moderador' | 'habitante';
}

export interface UsuarioFilter {
  search?: string;
  role?: 'admin' | 'moderador' | 'habitante';
  is_active?: boolean;
}

export interface UsuariosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Usuario[];
}
