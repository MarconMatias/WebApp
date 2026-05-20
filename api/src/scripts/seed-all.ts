import { execSync } from 'child_process';
import path from 'path';

const scripts = [
  'seed-admin.ts',
  'seed-categorias.ts',
  'seed-productos.ts',
  'seed-usuarios.ts',
];

console.log('Ejecutando todos los seeds...\n');

for (const script of scripts) {
  const filePath = path.join(__dirname, script);
  console.log(`▶ ${script}`);
  try {
    execSync(`ts-node "${filePath}"`, { stdio: 'inherit' });
  } catch {
    console.error(`Error en ${script}`);
    process.exit(1);
  }
  console.log();
}

console.log('Todos los seeds ejecutados correctamente.');
