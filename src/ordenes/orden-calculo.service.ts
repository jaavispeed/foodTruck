import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdenCalculoService {
  private redondear(valor: number): number {
    return Math.round(valor * 100) / 100;
  }

  calcularSubtotal(cantidad: number, precioUnitario: number): number {
    return this.redondear(cantidad * precioUnitario);
  }

  calcularTotal(subtotales: number[]): number {
    // La suma de los subtotales para obtener el total de la orden
    const total = subtotales.reduce((acc, subtotal) => acc + subtotal, 0);
    return this.redondear(total);
  }
}
