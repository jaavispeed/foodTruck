import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenDetalle } from '../orden-detalle/entities/orden-detalle.entity';
import { Orden } from '../ordenes/entities/orden.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
    @InjectRepository(OrdenDetalle)
    private readonly ordenDetalleRepository: Repository<OrdenDetalle>,
  ) {}

  async getResumen(fecha?: string) {
    let startOfDay: Date;
    let endOfDay: Date;

    if (fecha) {
      const [year, month, day] = fecha.split('-');
      startOfDay = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        0,
        0,
        0,
        0,
      );
      endOfDay = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        23,
        59,
        59,
        999,
      );
    } else {
      const today = new Date();
      startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0,
      );
      endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999,
      );
    }

    const qb = this.ordenRepository.createQueryBuilder('orden');
    qb.where('orden.fechaCreacion >= :startOfDay', { startOfDay }).andWhere(
      'orden.fechaCreacion <= :endOfDay',
      { endOfDay },
    );

    const result = await qb
      .select('SUM(orden.total)', 'ventas')
      .addSelect('COUNT(orden.id)', 'cantidadOrdenes')
      .getRawOne();

    const detallesResult = await this.ordenDetalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.orden', 'orden')
      .where('orden.fechaCreacion >= :startOfDay', { startOfDay })
      .andWhere('orden.fechaCreacion <= :endOfDay', { endOfDay })
      .select('SUM(detalle.cantidad)', 'productosVendidos')
      .getRawOne();

    return {
      ventas: Number(result.ventas) || 0,
      cantidadOrdenes: Number(result.cantidadOrdenes) || 0,
      productosVendidos: Number(detallesResult.productosVendidos) || 0,
    };
  }

  async getProductosMasVendidos(limit: number = 5) {
    const result = await this.ordenDetalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.producto', 'producto')
      .select('producto.nombre', 'producto')
      .addSelect('SUM(detalle.cantidad)', 'cantidad')
      .groupBy('producto.id')
      .addGroupBy('producto.nombre')
      .orderBy('SUM(detalle.cantidad)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      producto: item.producto,
      cantidad: Number(item.cantidad) || 0,
    }));
  }

  async getOrdenesRecientes(limit: number = 10) {
    return this.ordenRepository.find({
      order: {
        fechaCreacion: 'DESC',
      },
      take: limit,
      select: ['id', 'total', 'fechaCreacion'],
    });
  }
}
