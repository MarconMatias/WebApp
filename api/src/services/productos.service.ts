import { ProductosRepository } from '../repositories/productos.repository';
import { CreateProductoDTO, UpdateProductoDTO, ProductoFiltros } from '../types/producto.types';

const repository = new ProductosRepository();

export class ProductosService {
  async getAll(filtros: ProductoFiltros = {}) {
    return repository.findAll(filtros);
  }

  async getById(id: number) {
    const producto = await repository.findById(id);
    if (!producto) throw new Error('Producto no encontrado');
    return producto;
  }

  async create(data: CreateProductoDTO) {
    if (!data.nombre?.trim()) throw new Error('El nombre es requerido');
    if (!data.precio || data.precio <= 0) throw new Error('El precio debe ser mayor a 0');
    if (!data.categoria_id) throw new Error('La categoría es requerida');

    const id = await repository.create(data);
    return repository.findById(id);
  }

  async update(id: number, data: UpdateProductoDTO) {
    const existe = await repository.findById(id);
    if (!existe) throw new Error('Producto no encontrado');

    if (data.precio !== undefined && data.precio <= 0)
      throw new Error('El precio debe ser mayor a 0');

    await repository.update(id, data);
    return repository.findById(id);
  }

  async delete(id: number) {
    const existe = await repository.findById(id);
    if (!existe) throw new Error('Producto no encontrado');
    await repository.deactivate(id);
  }
}
