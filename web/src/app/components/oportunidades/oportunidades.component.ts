import { Component, signal, computed } from '@angular/core';
import { NgStyle } from '@angular/common';

interface Producto {
  nombre: string;
  precioOriginal: number;
  precioOferta: number;
  descuento: number;
  imagen: string;
  colores: string[];
}

@Component({
  selector: 'app-oportunidades',
  imports: [NgStyle],
  templateUrl: './oportunidades.component.html',
  styleUrl: './oportunidades.component.css'
})
export class OportunidadesComponent {
  productos: Producto[] = [
    {
      nombre: 'Campera Oversize Acolchada',
      precioOriginal: 89900,
      precioOferta: 26970,
      descuento: 70,
      imagen: 'modeloImagen_hombre.jpg',
      colores: ['#4a3728', '#1a1a1a', '#6b7280'],
    },
    {
      nombre: 'Campera Corta con Capucha',
      precioOriginal: 75000,
      precioOferta: 22500,
      descuento: 70,
      imagen: 'modeloImagen_mujer.jpg',
      colores: ['#c9a96e', '#1a1a1a'],
    },
  ];

  currentIndex = signal(0);

  prev(): void {
    this.currentIndex.update(i => (i === 0 ? this.productos.length - 1 : i - 1));
  }

  next(): void {
    this.currentIndex.update(i => (i === this.productos.length - 1 ? 0 : i + 1));
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR', { minimumFractionDigits: 2 });
  }

  cuotas(precio: number): string {
    return this.formatPrice(precio / 3);
  }

  precioTransferencia(precio: number): string {
    return this.formatPrice(precio * 0.9);
  }
}
