import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import sql from '../config/database';

dotenv.config();

const ADMIN = {
  nombre:   'Admin',
  apellido: 'Tienda',
  email:    'admin@tienda.com',
  password: 'Admin1234!',
};

const run = async () => {
  await connectDB();

  const existe = await new sql.Request()
    .input('email', sql.NVarChar(255), ADMIN.email)
    .query('SELECT id FROM Admins WHERE email = @email');

  if (existe.recordset.length > 0) {
    console.log('El admin ya existe, no se creó uno nuevo.');
    process.exit(0);
  }

  const password_hash = await bcrypt.hash(ADMIN.password, 10);

  await new sql.Request()
    .input('nombre',        sql.NVarChar(100), ADMIN.nombre)
    .input('apellido',      sql.NVarChar(100), ADMIN.apellido)
    .input('email',         sql.NVarChar(255), ADMIN.email)
    .input('password_hash', sql.NVarChar(255), password_hash)
    .query(`
      INSERT INTO Admins (nombre, apellido, email, password_hash)
      VALUES (@nombre, @apellido, @email, @password_hash)
    `);

  console.log('Admin creado exitosamente:');
  console.log(`  Email:    ${ADMIN.email}`);
  console.log(`  Password: ${ADMIN.password}`);
  console.log('Cambia la contraseña luego del primer login.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Error al crear admin:', err);
  process.exit(1);
});
