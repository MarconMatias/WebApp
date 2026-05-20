import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server:   process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  user:     process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  port:     Number(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

export const connectDB = async (): Promise<void> => {
  await sql.connect(config);
  console.log('Conectado a SQL Server');
};

export default sql;
