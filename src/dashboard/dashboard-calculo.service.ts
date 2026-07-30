import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gasto } from '../gastos/entities/gasto.entity';
import { Estado } from '../common/enum/estados.enum';
import { TipoCategoria } from '../common/enum/tipo-categoria.enum';

@Injectable()
export class DashboardCalculoService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  async calcularMetaDiaria(startOfMonth: Date, endOfMonth: Date): Promise<number> {
    // Buscar todos los gastos fijos vigentes en el mes
    const gastosFijosResult = await this.gastoRepository
      .createQueryBuilder('gasto')
      .innerJoin('gasto.categoria', 'categoria')
      .where('gasto.fechaCreacion >= :startOfMonth', { startOfMonth })
      .andWhere('gasto.fechaCreacion <= :endOfMonth', { endOfMonth })
      .andWhere('gasto.estado = :estado', { estado: Estado.VIGENTE })
      .andWhere('categoria.tipo = :tipo', { tipo: TipoCategoria.GASTO })
      .andWhere('(LOWER(categoria.nombre) LIKE :fijo OR LOWER(categoria.nombre) LIKE :deuda OR LOWER(categoria.nombre) LIKE :financiamiento)', {
        fijo: '%fijo%',
        deuda: '%deuda%',
        financiamiento: '%financiamiento%'
      })
      .select('SUM(gasto.monto)', 'totalFijos')
      .getRawOne();

    const totalFijos = Number(gastosFijosResult.totalFijos) || 0;

    // Calcular la cantidad de días del mes
    const year = startOfMonth.getFullYear();
    const month = startOfMonth.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const metaDiaria = totalFijos / daysInMonth;

    return Math.round(metaDiaria);
  }
}
