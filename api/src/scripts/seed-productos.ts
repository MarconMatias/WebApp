import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import sql from '../config/database';

dotenv.config();

const productos = [
  {
    categoria: 'Remeras',
    nombre: 'Remera Básica Blanca',
    descripcion: 'Remera de algodón 100%, corte recto, ideal para el día a día.',
    precio: 8500,
    variantes: [
      { talle: 'S',  color: 'Blanco' },
      { talle: 'M',  color: 'Blanco' },
      { talle: 'L',  color: 'Blanco' },
      { talle: 'XL', color: 'Blanco' },
      { talle: 'S',  color: 'Negro'  },
      { talle: 'M',  color: 'Negro'  },
      { talle: 'L',  color: 'Negro'  },
    ],
  },
  {
    categoria: 'Remeras',
    nombre: 'Remera Oversize',
    descripcion: 'Remera oversize con caída amplia, tendencia urbana.',
    precio: 11000,
    variantes: [
      { talle: 'S',  color: 'Gris'   },
      { talle: 'M',  color: 'Gris'   },
      { talle: 'L',  color: 'Gris'   },
      { talle: 'M',  color: 'Negro'  },
      { talle: 'L',  color: 'Negro'  },
      { talle: 'XL', color: 'Negro'  },
    ],
  },
  {
    categoria: 'Pantalones',
    nombre: 'Jean Skinny',
    descripcion: 'Jean de corte skinny, tela denim elastizada.',
    precio: 24000,
    variantes: [
      { talle: '38', color: 'Azul'   },
      { talle: '40', color: 'Azul'   },
      { talle: '42', color: 'Azul'   },
      { talle: '44', color: 'Azul'   },
      { talle: '38', color: 'Negro'  },
      { talle: '40', color: 'Negro'  },
    ],
  },
  {
    categoria: 'Pantalones',
    nombre: 'Pantalón de Vestir',
    descripcion: 'Pantalón recto de vestir, tela liviana ideal para oficina.',
    precio: 19500,
    variantes: [
      { talle: '38', color: 'Beige'  },
      { talle: '40', color: 'Beige'  },
      { talle: '42', color: 'Beige'  },
      { talle: '40', color: 'Negro'  },
      { talle: '42', color: 'Negro'  },
      { talle: '44', color: 'Negro'  },
    ],
  },
  {
    categoria: 'Vestidos',
    nombre: 'Vestido Midi Floral',
    descripcion: 'Vestido midi con estampado floral, perfecto para el verano.',
    precio: 27000,
    variantes: [
      { talle: 'XS', color: 'Floral Rosa'  },
      { talle: 'S',  color: 'Floral Rosa'  },
      { talle: 'M',  color: 'Floral Rosa'  },
      { talle: 'L',  color: 'Floral Azul'  },
      { talle: 'XL', color: 'Floral Azul'  },
    ],
  },
  {
    categoria: 'Buzos',
    nombre: 'Buzo Canguro',
    descripcion: 'Buzo con capucha y bolsillo canguro, tela frisada.',
    precio: 18000,
    variantes: [
      { talle: 'S',  color: 'Gris Melange' },
      { talle: 'M',  color: 'Gris Melange' },
      { talle: 'L',  color: 'Gris Melange' },
      { talle: 'XL', color: 'Gris Melange' },
      { talle: 'S',  color: 'Negro'        },
      { talle: 'M',  color: 'Negro'        },
    ],
  },
  {
    categoria: 'Camperas',
    nombre: 'Campera de Cuero Sintético',
    descripcion: 'Campera estilo biker en cuero sintético, look rockero.',
    precio: 45000,
    variantes: [
      { talle: 'S',  color: 'Negro' },
      { talle: 'M',  color: 'Negro' },
      { talle: 'L',  color: 'Negro' },
      { talle: 'XL', color: 'Negro' },
    ],
  },
  {
    categoria: 'Shorts',
    nombre: 'Short Jean',
    descripcion: 'Short de jean con dobladillo, ideal para el verano.',
    precio: 14500,
    variantes: [
      { talle: '38', color: 'Celeste' },
      { talle: '40', color: 'Celeste' },
      { talle: '42', color: 'Celeste' },
      { talle: '38', color: 'Blanco'  },
      { talle: '40', color: 'Blanco'  },
    ],
  },
];

const run = async () => {
  await connectDB();

  let creados  = 0;
  let omitidos = 0;

  for (const p of productos) {
    // obtener id de categoria
    const catResult = await new sql.Request()
      .input('nombre', sql.NVarChar(100), p.categoria)
      .query('SELECT id FROM Categorias WHERE nombre = @nombre');

    if (catResult.recordset.length === 0) {
      console.warn(`Categoría "${p.categoria}" no encontrada, omitiendo "${p.nombre}"`);
      omitidos++;
      continue;
    }

    const categoria_id = catResult.recordset[0].id;

    // verificar si el producto ya existe
    const existe = await new sql.Request()
      .input('nombre', sql.NVarChar(200), p.nombre)
      .query('SELECT id FROM Productos WHERE nombre = @nombre');

    if (existe.recordset.length > 0) {
      omitidos++;
      continue;
    }

    // insertar producto
    const prodResult = await new sql.Request()
      .input('categoria_id', sql.Int,            categoria_id)
      .input('nombre',       sql.NVarChar(200),  p.nombre)
      .input('descripcion',  sql.NVarChar(sql.MAX), p.descripcion)
      .input('precio',       sql.Decimal(10, 2), p.precio)
      .query(`
        INSERT INTO Productos (categoria_id, nombre, descripcion, precio)
        OUTPUT INSERTED.id
        VALUES (@categoria_id, @nombre, @descripcion, @precio)
      `);

    const producto_id = prodResult.recordset[0].id;

    // insertar variantes
    for (const v of p.variantes) {
      await new sql.Request()
        .input('producto_id', sql.Int,          producto_id)
        .input('talle',       sql.NVarChar(10), v.talle)
        .input('color',       sql.NVarChar(50), v.color)
        .query(`
          INSERT INTO ProductoVariantes (producto_id, talle, color)
          VALUES (@producto_id, @talle, @color)
        `);
    }

    creados++;
  }

  console.log(`Productos creados: ${creados} | Omitidos (ya existían): ${omitidos}`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Error en seed de productos:', err);
  process.exit(1);
});
