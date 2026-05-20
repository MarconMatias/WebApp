import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import productosRoutes from './routes/productos.routes';
import categoriasRoutes from './routes/categorias.routes';
import usuariosRoutes from './routes/usuarios.routes';
import adminsRoutes from './routes/admins.routes';
import pedidosRoutes from './routes/pedidos.routes';
import enviosRoutes from './routes/envios.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/envios', enviosRoutes);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
};

start();
