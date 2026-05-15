import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Estado } from '../common/enum/estados.enum';
import { handleDBExceptions } from '../common/helpers/handle-db-exceptions.helper';
import { OrdenDetalle } from '../orden-detalle/entities/orden-detalle.entity';
import { OrdenDetalleService } from '../orden-detalle/orden-detalle.service';
import { Producto } from '../productos/entities/producto.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { Orden } from './entities/orden.entity';
import { OrdenCalculoService } from './orden-calculo.service';

@Injectable()
export class OrdenesService {
  private readonly logger = new Logger('OrdenesService');

  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly ordenCalculoService: OrdenCalculoService,
    private readonly ordenDetalleService: OrdenDetalleService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrdenDto: CreateOrdenDto, usuario: Usuario) {
    const { detalles } = createOrdenDto;

    const productIds = detalles.map((d) => d.productoId);
    const productos = await this.productoRepository.findBy({
      id: In(productIds),
    });

    if (productos.length !== productIds.length) {
      throw new BadRequestException('Algunos productos no fueron encontrados');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ordenDetalles: OrdenDetalle[] = [];
      const subtotales: number[] = [];

      for (const detalle of detalles) {
        const producto = productos.find(
          (producto) => producto.id === detalle.productoId,
        );

        if (!producto) {
          throw new BadRequestException('Producto no encontrado');
        }

        const ordenDetalle = this.ordenDetalleService.createDetalle(
          detalle,
          producto,
          queryRunner.manager,
        );

        ordenDetalles.push(ordenDetalle);

        subtotales.push(ordenDetalle.subtotal);
      }

      const total = this.ordenCalculoService.calcularTotal(subtotales);

      const orden = queryRunner.manager.create(Orden, {
        total,
        fechaCreacion: new Date(),
        usuario,
        detalles: ordenDetalles,
      });

      await queryRunner.manager.save(orden);
      await queryRunner.commitTransaction();

      return orden;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleDBExceptions(error, this.logger);
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.ordenRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async getByIdOrden(id: number) {
    const orden = await this.ordenRepository.findOne({
      where: { id },
    });

    if (!orden) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    return orden;
  }

  async softDelete(id: number) {
    try {
      await this.ordenRepository.update(id, { estado: Estado.ELIMINADO });
      return { message: `Orden con id ${id} anulada correctamente` };
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
