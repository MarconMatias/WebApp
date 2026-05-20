import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import sql from '../config/database';

dotenv.config();

const categorias = [
  'Remeras',
  'Camisas',
  'Pantalones',
  'Vestidos',
  'Shorts',
  'Buzos',
  'Camperas',
  'Accesorios',
];

const run = async () => {
  await connectDB();

  let creadas = 0;
  let omitidas = 0;

  for (const nombre of categorias) {
    const existe = await new sql.Request()
      .input('nombre', sql.NVarChar(100), nombre)
      .query('SELECT id FROM Categorias WHERE nombre = @nombre');

    if (existe.recordset.length > 0) {
      omitidas++;
      continue;
    }

    await new sql.Request()
      .input('nombre', sql.NVarChar(100), nombre)
      .query('INSERT INTO Categorias (nombre) VALUES (@nombre)');

    creadas++;
  }

  console.log(`Categorias creadas: ${creadas} | Omitidas (ya existían): ${omitidas}`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Error en seed de categorías:', err);
  process.exit(1);
});
