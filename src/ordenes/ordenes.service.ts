import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { CajaService } from '../caja/caja.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Estado } from '../common/enum/estados.enum';
import { MetodoPago } from '../common/enum/metodo-pago.enum';
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
    private readonly cajaService: CajaService,
  ) {}

  async create(createOrdenDto: CreateOrdenDto, usuario: Usuario) {
    const cajaAbierta = await this.cajaService.getCajaAbierta();
    if (!cajaAbierta) {
      throw new BadRequestException(
        'No hay ninguna caja abierta. Debe abrir caja para registrar órdenes.',
      );
    }

    const { orden: productosOrden, metodoPago } = createOrdenDto;

    const productIds = productosOrden.map((d) => d.productoId);
    const productos = await this.productoRepository.findBy({
      id: In(productIds),
    });

    if (productos.length !== productIds.length) {
      const encontradosIds = productos.map((p) => p.id);
      const noEncontrados = productIds.filter(
        (id) => !encontradosIds.includes(id),
      );
      throw new BadRequestException(
        `Los siguientes productos no fueron encontrados: ${noEncontrados.join(', ')}`,
      );
    }

    const productosEliminados = productos.filter(
      (p) => p.estado === Estado.ELIMINADO,
    );
    if (productosEliminados.length > 0) {
      const nombres = productosEliminados.map((p) => p.nombre).join(', ');
      throw new BadRequestException(
        `Los siguientes productos no están disponibles: ${nombres}`,
      );
    }

    const estadoOrden =
      metodoPago === MetodoPago.FIADO ? Estado.PENDIENTE : Estado.VIGENTE;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ordenDetalles: OrdenDetalle[] = [];
      const subtotales: number[] = [];

      for (const item of productosOrden) {
        const producto = productos.find((p) => p.id === item.productoId)!;

        const ordenDetalle = this.ordenDetalleService.createDetalle(
          item,
          producto,
          queryRunner.manager,
        );

        ordenDetalles.push(ordenDetalle);
        subtotales.push(ordenDetalle.subtotal);
      }

      const total = this.ordenCalculoService.calcularTotal(subtotales);

      const orden = queryRunner.manager.create(Orden, {
        total,
        metodoPago,
        estado: estadoOrden,
        usuario,
        caja: cajaAbierta,
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
      relations: ['caja', 'usuario'],
    });
  }

  async getByIdOrden(id: number) {
    const orden = await this.ordenRepository.findOne({
      where: { id },
      relations: ['detalles', 'detalles.producto', 'caja', 'usuario'],
    });

    if (!orden) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    return orden;
  }

  async anular(id: number) {
    const orden = await this.ordenRepository.findOne({ where: { id } });

    if (!orden) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    if (orden.estado === Estado.ELIMINADO) {
      throw new BadRequestException(
        `La orden con id ${id} ya fue anulada anteriormente`,
      );
    }

    await this.ordenRepository.update(id, { estado: Estado.ELIMINADO });
    return { message: `Orden con id ${id} anulada correctamente` };
  }
}
