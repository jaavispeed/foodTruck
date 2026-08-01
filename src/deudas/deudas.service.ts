import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deuda } from './entities/deuda.entity';
import { Estado } from '../common/enum/estados.enum';
import { CreateDeudaDto } from './dto/create-deuda.dto';
import { UpdateDeudaDto } from './dto/update-deuda.dto';
import { Usuario } from '../auth/entities/usuario.entity';

@Injectable()
export class DeudasService {
  constructor(
    @InjectRepository(Deuda)
    private readonly deudaRepository: Repository<Deuda>,
  ) {}

  async create(createDeudaDto: CreateDeudaDto, usuario: Usuario): Promise<Deuda> {
    const deuda = this.deudaRepository.create({
      ...createDeudaDto,
      usuario,
    });
    return this.deudaRepository.save(deuda);
  }

  async findAll(): Promise<Deuda[]> {
    return this.deudaRepository.find({
      where: { estado: Estado.VIGENTE },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async calcularMetas(startOfMonth: Date, endOfMonth: Date): Promise<{ metaDiaria: number, metaMensual: number }> {
    // Obtener todas las deudas activas/vigentes
    const deudasActivas = await this.deudaRepository.find({
      where: {
        estado: Estado.VIGENTE,
      },
    });

    let totalCuotasMensuales = 0;
    for (const deuda of deudasActivas) {
      if (deuda.cuotasTotales > 0) {
        const interes = deuda.porcentajeInteres ? Number(deuda.porcentajeInteres) : 0;
        
        let cuotaMensual = 0;
        if (interes > 0 && deuda.cuotasTotales > 0) {
          const r = interes / 100;
          const n = deuda.cuotasTotales;
          cuotaMensual = deuda.montoTotal * (r / (1 - Math.pow(1 + r, -n)));
        } else if (deuda.cuotasTotales > 0) {
          cuotaMensual = deuda.montoTotal / deuda.cuotasTotales;
        }
        
        totalCuotasMensuales += cuotaMensual;
      }
    }

    // Calcular la cantidad de días del mes
    const year = startOfMonth.getFullYear();
    const month = startOfMonth.getMonth() + 1; // 1-12
    const daysInMonth = new Date(year, month, 0).getDate();

    const metaDiaria = totalCuotasMensuales / daysInMonth;

    return {
      metaDiaria: Math.round(metaDiaria),
      metaMensual: Math.round(totalCuotasMensuales),
    };
  }

  async findOne(id: number): Promise<Deuda> {
    const deuda = await this.deudaRepository.findOne({ where: { id, estado: Estado.VIGENTE } });
    if (!deuda) {
      throw new NotFoundException(`Deuda con id ${id} no encontrada`);
    }
    return deuda;
  }

  async update(id: number, updateDeudaDto: UpdateDeudaDto): Promise<Deuda> {
    const deuda = await this.findOne(id);
    
    // Update fields
    if (updateDeudaDto.montoTotal !== undefined) deuda.montoTotal = updateDeudaDto.montoTotal;
    if (updateDeudaDto.cuotasTotales !== undefined) deuda.cuotasTotales = updateDeudaDto.cuotasTotales;
    if (updateDeudaDto.porcentajeInteres !== undefined) deuda.porcentajeInteres = updateDeudaDto.porcentajeInteres;

    return this.deudaRepository.save(deuda);
  }

  async remove(id: number): Promise<void> {
    const deuda = await this.findOne(id);
    deuda.estado = Estado.ELIMINADO;
    await this.deudaRepository.save(deuda);
  }
}
