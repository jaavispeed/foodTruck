import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Estado } from '../common/enum/estados.enum';
import { handleDBExceptions } from '../common/helpers/handle-db-exceptions.helper';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductosService');

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(productoDto: CreateProductoDto, usuario: Usuario) {
    try {
      const producto = this.productoRepository.create({
        ...productoDto,
        usuario,
      });
      return await this.productoRepository.save(producto);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productoRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async getVigentes(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productoRepository.find({
      take: limit,
      skip: offset,
      where: {
        estado: Estado.VIGENTE,
      },
    });
  }

  async getByIdProducto(id: number) {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const product = await this.productoRepository.preload({
      id: id,
      ...updateProductoDto,
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    try {
      return await this.productoRepository.save(product);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async softDelete(id: number) {
    try {
      await this.productoRepository.update(id, { estado: Estado.ELIMINADO });
      return { message: `Producto con id ${id} eliminado correctamente` };
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
