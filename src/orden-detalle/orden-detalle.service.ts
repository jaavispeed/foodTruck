import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { OrdenCalculoService } from '../ordenes/orden-calculo.service';
import { Producto } from '../productos/entities/producto.entity';
import { CreateOrdenDetalleDto } from './dto/create-orden-detalle.dto';
import { OrdenDetalle } from './entities/orden-detalle.entity';

@Injectable()
export class OrdenDetalleService {
  constructor(
    private readonly ordenCalculoService: OrdenCalculoService,
    @InjectRepository(OrdenDetalle)
    private readonly ordenDetalleRepository: Repository<OrdenDetalle>,
  ) {}

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

  getByIdOrden(idOrden: number) {
    return this.ordenDetalleRepository.find({
      where: { orden: { id: idOrden } },
      relations: ['producto'],
    });
  }
}
