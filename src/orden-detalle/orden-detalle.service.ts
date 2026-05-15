import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrdenCalculoService } from '../ordenes/orden-calculo.service';
import { Producto } from '../productos/entities/producto.entity';
import { OrdenDetalle } from './entities/orden-detalle.entity';
import { CreateOrdenDetalleDto } from './dto/create-orden-detalle.dto';

@Injectable()
export class OrdenDetalleService {
  constructor(private readonly ordenCalculoService: OrdenCalculoService) {}

  createDetalle(
    detalleDto: CreateOrdenDetalleDto,
    producto: Producto,
    manager: EntityManager,
  ): OrdenDetalle {

    const subtotal = this.ordenCalculoService.calcularSubtotal(
      detalleDto.cantidad,
      producto.precio,
    );

    return manager.create(OrdenDetalle, {
      cantidad: detalleDto.cantidad,
      precioUnitario: producto.precio,
      subtotal,
      producto,
    });
  }
}
