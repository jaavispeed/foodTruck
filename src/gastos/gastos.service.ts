import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Estado } from '../common/enum/estados.enum';
import { handleDBExceptions } from '../common/helpers/handle-db-exceptions.helper';
import { CreateGastoDto } from './dto/create-gasto.dto';
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
      const gasto = this.gastoRepository.create({
        ...createGastoDto,
        usuario,
      });

      return await this.gastoRepository.save(gasto);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.gastoRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async getByIdGasto(id: number) {
    const gasto = await this.gastoRepository.findOneBy({ id });

    if (!gasto) {
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);
    }

    return gasto;
  }

  async update(id: number, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.gastoRepository.preload({
      id,
      ...updateGastoDto,
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
