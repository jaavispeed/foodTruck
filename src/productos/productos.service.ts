import { Injectable, Logger, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Estado } from '../common/enum/estados.enum';
import { handleDBExceptions } from '../common/helpers/handle-db-exceptions.helper';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService implements OnModuleInit {
  private readonly logger = new Logger('ProductosService');

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async onModuleInit() {
    const existing = await this.productoRepository.findOneBy({ nombre: 'Otro' });
    if (!existing) {
      const otro = this.productoRepository.create({
        nombre: 'Otro',
        descripcion: 'Producto con monto personalizado',
        precio: 0,
        estado: Estado.VIGENTE,
      });
      await this.productoRepository.save(otro);
      this.logger.log('Producto "Otro" creado automáticamente.');
    }
  }

  async create(productoDto: CreateProductoDto, usuario: Usuario) {
    try {
      const { categoriaId, ...rest } = productoDto;
      const producto = this.productoRepository.create({
        ...rest,
        categoria: (categoriaId ? { id: categoriaId } : null) as any,
        usuario,
      });
      return await this.productoRepository.save(producto);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, search } = paginationDto;
    
    const whereCondition = search ? { nombre: ILike(`%${search}%`) } : {};

    return this.productoRepository.find({
      take: limit,
      skip: offset,
      where: whereCondition,
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }

  async getVigentes(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, search } = paginationDto;
    
    const whereCondition: any = { estado: Estado.VIGENTE };
    if (search) {
      whereCondition.nombre = ILike(`%${search}%`);
    }

    return this.productoRepository.find({
      take: limit,
      skip: offset,
      where: whereCondition,
      order: {
        fechaCreacion: 'DESC',
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
    const { categoriaId, ...rest } = updateProductoDto;
    const product = await this.productoRepository.preload({
      id: id,
      ...rest,
      ...(categoriaId !== undefined ? { categoria: (categoriaId ? { id: categoriaId } : null) as any } : {}),
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
    const producto = await this.getByIdProducto(id);
    if (producto.nombre.toLowerCase() === 'otro') {
      throw new BadRequestException('No se puede eliminar el producto "Otro"');
    }

    try {
      await this.productoRepository.update(id, { estado: Estado.ELIMINADO });
      return { message: `Producto con id ${id} eliminado correctamente` };
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
