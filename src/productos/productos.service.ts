import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(productoDto: CreateProductoDto) {
    try {
      const producto = this.productoRepository.create(productoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAll() {
    return this.productoRepository.find({});
  }

  async getByIdProducto(id: number) {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  async softDelete(id: number) {
    const producto = await this.getByIdProducto(id);

    try {
      await this.productoRepository.update(id, { estado: 'ELIMINADO' });
      return { message: `Producto con id ${id} eliminado correctamente` };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, revisar logs del servidor',
    );
  }
}
