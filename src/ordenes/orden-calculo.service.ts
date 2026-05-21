import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdenCalculoService {
  calcularSubtotal(cantidad: number, precioUnitario: number): number {
    return cantidad * precioUnitario;
  }

  calcularTotal(subtotales: number[]): number {
    // La suma de los subtotales para obtener el total de la orden
    return subtotales.reduce((acc, subtotal) => acc + subtotal, 0);
  }
}
