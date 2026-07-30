import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenDetalle } from '../orden-detalle/entities/orden-detalle.entity';
import { Orden } from '../ordenes/entities/orden.entity';
import { Gasto } from '../gastos/entities/gasto.entity';
import { Estado } from '../common/enum/estados.enum';
import { DashboardCalculoService } from './dashboard-calculo.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
    @InjectRepository(OrdenDetalle)
    private readonly ordenDetalleRepository: Repository<OrdenDetalle>,
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
    private readonly dashboardCalculoService: DashboardCalculoService,
  ) {}

  private parseDateRange(fecha?: string): { startOfRange: Date; endOfRange: Date } {
    let startOfRange: Date;
    let endOfRange: Date;

    if (fecha) {
      const parts = fecha.split('-');
      if (parts.length === 2) {
        // Formato YYYY-MM
        const year = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        startOfRange = new Date(year, month, 1, 0, 0, 0, 0);
        endOfRange = new Date(year, month + 1, 0, 23, 59, 59, 999);
      } else {
        // Formato YYYY-MM-DD
        const year = Number(parts[0]);
        const month = Number(parts[1]) - 1;
        const day = Number(parts[2]);
        startOfRange = new Date(year, month, day, 0, 0, 0, 0);
        endOfRange = new Date(year, month, day, 23, 59, 59, 999);
      }
    } else {
      const today = new Date();
      startOfRange = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0,
        0,
      );
      endOfRange = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    }
    return { startOfRange, endOfRange };
  }

  async getResumen(fecha?: string) {
    const { startOfRange, endOfRange } = this.parseDateRange(fecha);

    const qb = this.ordenRepository.createQueryBuilder('orden');
    qb.where('orden.fechaCreacion >= :startOfRange', { startOfRange }).andWhere(
      'orden.fechaCreacion <= :endOfRange',
      { endOfRange },
    );

    const result = await qb
      .select('SUM(orden.total)', 'ventas')
      .addSelect('COUNT(orden.id)', 'cantidadOrdenes')
      .getRawOne();

    const detallesResult = await this.ordenDetalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.orden', 'orden')
      .where('orden.fechaCreacion >= :startOfRange', { startOfRange })
      .andWhere('orden.fechaCreacion <= :endOfRange', { endOfRange })
      .select('SUM(detalle.cantidad)', 'productosVendidos')
      .getRawOne();

    const gastosResult = await this.gastoRepository
      .createQueryBuilder('gasto')
      .leftJoin('gasto.categoria', 'categoria')
      .where('gasto.fechaCreacion >= :startOfRange', { startOfRange })
      .andWhere('gasto.fechaCreacion <= :endOfRange', { endOfRange })
      .andWhere('gasto.estado = :estado', { estado: Estado.VIGENTE })
      .andWhere(
        '(categoria.id IS NULL OR (LOWER(categoria.nombre) NOT LIKE :fijo AND LOWER(categoria.nombre) NOT LIKE :deuda AND LOWER(categoria.nombre) NOT LIKE :financiamiento))',
        {
          fijo: '%fijo%',
          deuda: '%deuda%',
          financiamiento: '%financiamiento%',
        },
      )
      .select('SUM(gasto.monto)', 'totalGastos')
      .getRawOne();

    const ventas = Number(result.ventas) || 0;
    const gastos = Number(gastosResult.totalGastos) || 0;

    // Calcular la meta diaria en base a los gastos fijos del mes
    const startOfMonth = new Date(startOfRange.getFullYear(), startOfRange.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(startOfRange.getFullYear(), startOfRange.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const metaDiaria = await this.dashboardCalculoService.calcularMetaDiaria(startOfMonth, endOfMonth);

    return {
      ventas,
      cantidadOrdenes: Number(result.cantidadOrdenes) || 0,
      productosVendidos: Number(detallesResult.productosVendidos) || 0,
      gastos,
      ganancias: ventas - gastos,
      metaDiaria,
    };
  }

  async getProductosMasVendidos(fecha?: string, limit: number = 5) {
    const { startOfRange, endOfRange } = this.parseDateRange(fecha);

    const result = await this.ordenDetalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.orden', 'orden')
      .innerJoin('detalle.producto', 'producto')
      .where('orden.fechaCreacion >= :startOfRange', { startOfRange })
      .andWhere('orden.fechaCreacion <= :endOfRange', { endOfRange })
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

  async getOrdenesRecientes(fecha?: string, limit: number = 10) {
    const { startOfRange, endOfRange } = this.parseDateRange(fecha);

    return this.ordenRepository.createQueryBuilder('orden')
      .where('orden.fechaCreacion >= :startOfRange', { startOfRange })
      .andWhere('orden.fechaCreacion <= :endOfRange', { endOfRange })
      .orderBy('orden.fechaCreacion', 'DESC')
      .limit(limit)
      .select(['orden.id', 'orden.total', 'orden.fechaCreacion'])
      .getMany();
  }
}
