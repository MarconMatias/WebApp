export interface Admin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  created_at: Date;
}

export interface LoginAdminDTO {
  email: string;
  password: string;
}
