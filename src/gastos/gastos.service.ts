import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Estado } from '../common/enum/estados.enum';
import { handleDBExceptions } from '../common/helpers/handle-db-exceptions.helper';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { GetGastosDto } from './dto/get-gastos.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto } from './entities/gasto.entity';

@Injectable()
export class GastosService {
  private readonly logger = new Logger('GastosService');

  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto, usuario: Usuario) {
    try {
      const { categoriaId, ...gastoData } = createGastoDto;
      const gasto = this.gastoRepository.create({
        ...gastoData,
        categoria: categoriaId ? { id: categoriaId } : undefined,
        usuario,
      });

      return await this.gastoRepository.save(gasto);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAll(paginationDto: GetGastosDto) {
    const { limit = 10, offset = 0, desde, hasta, estado, categoriaId } = paginationDto;

    let queryDesde: Date | undefined;
    let queryHasta: Date | undefined;

    if (desde) {
      const [year, month, day] = desde.split('-');
      queryDesde = new Date(Number(year), Number(month) - 1, Number(day));
      queryDesde.setHours(0, 0, 0, 0);
    }
    
    if (hasta) {
      const [year, month, day] = hasta.split('-');
      queryHasta = new Date(Number(year), Number(month) - 1, Number(day));
      queryHasta.setHours(23, 59, 59, 999);
    }

    const where: any = {};
    if (queryDesde && queryHasta) {
      where.fechaCreacion = Between(queryDesde, queryHasta);
    } else if (queryDesde) {
      where.fechaCreacion = MoreThanOrEqual(queryDesde);
    } else if (queryHasta) {
      where.fechaCreacion = LessThanOrEqual(queryHasta);
    }

    if (estado) {
      where.estado = estado;
    }
    
    if (categoriaId) {
      where.categoria = { id: categoriaId };
    }

    const [data, total] = await this.gastoRepository.findAndCount({
      take: limit,
      skip: offset,
      where,
      order: { fechaCreacion: 'DESC' },
    });

    const query = this.gastoRepository.createQueryBuilder('gasto');
    if (queryDesde) query.andWhere('gasto.fechaCreacion >= :desde', { desde: queryDesde });
    if (queryHasta) query.andWhere('gasto.fechaCreacion <= :hasta', { hasta: queryHasta });
    if (estado) query.andWhere('gasto.estado = :estadoFiltro', { estadoFiltro: estado });
    if (categoriaId) query.andWhere('gasto.categoriaId = :categoriaId', { categoriaId });

    const { sumaGastos } = await query
      .select('SUM(gasto.monto)', 'sumaGastos')
      .getRawOne();

    return {
      data,
      total,
      sumaTotalGastos: Number(sumaGastos) || 0,
    };
  }

  async getByIdGasto(id: number) {
    const gasto = await this.gastoRepository.findOneBy({ id });

    if (!gasto) {
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);
    }

    return gasto;
  }

  async update(id: number, updateGastoDto: UpdateGastoDto) {
    const { categoriaId, ...gastoData } = updateGastoDto;
    const gasto = await this.gastoRepository.preload({
      id,
      ...gastoData,
      ...(categoriaId !== undefined ? { categoria: categoriaId ? { id: categoriaId } : undefined } : {}),
    });

    if (!gasto) {
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);
    }

    try {
      return await this.gastoRepository.save(gasto);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async softDelete(id: number) {
    try {
      await this.gastoRepository.update(id, {
        estado: Estado.ELIMINADO,
      });

      return {
        message: `Gasto con id ${id} eliminado correctamente`,
      };
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
