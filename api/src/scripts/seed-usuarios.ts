import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import sql from '../config/database';

dotenv.config();

const usuarios = [
  { nombre: 'Laura',   apellido: 'González', email: 'laura@gmail.com',   telefono: '1155551111', password: 'Laura1234!' },
  { nombre: 'Martín',  apellido: 'Rodríguez',email: 'martin@gmail.com',  telefono: '1155552222', password: 'Martin1234!' },
  { nombre: 'Sofía',   apellido: 'López',    email: 'sofia@gmail.com',   telefono: '1155553333', password: 'Sofia1234!' },
];

const run = async () => {
  await connectDB();

  let creados  = 0;
  let omitidos = 0;

  for (const u of usuarios) {
    const existe = await new sql.Request()
      .input('email', sql.NVarChar(255), u.email)
      .query('SELECT id FROM Usuarios WHERE email = @email');

    if (existe.recordset.length > 0) {
      omitidos++;
      continue;
    }

    const password_hash = await bcrypt.hash(u.password, 10);

    await new sql.Request()
      .input('nombre',        sql.NVarChar(100), u.nombre)
      .input('apellido',      sql.NVarChar(100), u.apellido)
      .input('email',         sql.NVarChar(255), u.email)
      .input('password_hash', sql.NVarChar(255), password_hash)
      .input('telefono',      sql.NVarChar(20),  u.telefono)
      .query(`
        INSERT INTO Usuarios (nombre, apellido, email, password_hash, telefono)
        VALUES (@nombre, @apellido, @email, @password_hash, @telefono)
      `);

    creados++;
  }

  console.log(`Usuarios creados: ${creados} | Omitidos (ya existían): ${omitidos}`);
  console.log('Contraseñas: Laura1234! / Martin1234! / Sofia1234!');
  process.exit(0);
};

run().catch((err) => {
  console.error('Error en seed de usuarios:', err);
  process.exit(1);
});
