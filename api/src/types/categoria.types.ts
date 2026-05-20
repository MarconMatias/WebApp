export interface Categoria {
  id: number;
  nombre: string;
  activa: boolean;
  created_at: Date;
}

export interface CreateCategoriaDTO {
  nombre: string;
}

export interface UpdateCategoriaDTO {
  nombre?: string;
  activa?: boolean;
}
