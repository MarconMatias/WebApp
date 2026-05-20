import { CategoriasRepository } from '../repositories/categorias.repository';
import { CreateCategoriaDTO, UpdateCategoriaDTO } from '../types/categoria.types';

const repository = new CategoriasRepository();

export class CategoriasService {
  async getAll() {
    return repository.findAll();
  }

  async getById(id: number) {
    const categoria = await repository.findById(id);
    if (!categoria) throw new Error('Categoría no encontrada');
    return categoria;
  }

  async create(data: CreateCategoriaDTO) {
    if (!data.nombre?.trim()) throw new Error('El nombre es requerido');

    const existente = await repository.findByNombre(data.nombre.trim());
    if (existente) throw new Error('Ya existe una categoría con ese nombre');

    const id = await repository.create({ nombre: data.nombre.trim() });
    return repository.findById(id);
  }

  async update(id: number, data: UpdateCategoriaDTO) {
    const existe = await repository.findById(id);
    if (!existe) throw new Error('Categoría no encontrada');

    if (data.nombre !== undefined) {
      if (!data.nombre.trim()) throw new Error('El nombre no puede estar vacío');

      const existente = await repository.findByNombre(data.nombre.trim());
      if (existente && existente.id !== id) throw new Error('Ya existe una categoría con ese nombre');

      data.nombre = data.nombre.trim();
    }

    await repository.update(id, data);
    return repository.findById(id);
  }

  async delete(id: number) {
    const existe = await repository.findById(id);
    if (!existe) throw new Error('Categoría no encontrada');
    await repository.deactivate(id);
  }
}
