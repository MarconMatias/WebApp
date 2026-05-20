export interface Producto {
  id: number;
  categoria_id: number;
  categoria_nombre?: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductoVariante {
  id: number;
  producto_id: number;
  talle: string;
  color: string | null;
  disponible: boolean;
}

export interface ProductoImagen {
  id: number;
  producto_id: number;
  url: string;
  es_principal: boolean;
  orden: number;
}

export interface ProductoDetalle extends Producto {
  variantes: ProductoVariante[];
  imagenes: ProductoImagen[];
}

export interface CreateProductoDTO {
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
}

export interface UpdateProductoDTO {
  categoria_id?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
}

export interface ProductoFiltros {
  categoria_id?: number;
}
