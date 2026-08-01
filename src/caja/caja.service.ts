import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../auth/entities/usuario.entity';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { Caja } from './entities/caja.entity';
import { MetodoPago } from '../common/enum/metodo-pago.enum';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
  ) {}

  async abrirCaja(abrirCajaDto: AbrirCajaDto, usuario: Usuario) {
    const cajaAbierta = await this.cajaRepository.findOne({
      where: { estaAbierta: true },
    });

    if (cajaAbierta) {
      throw new BadRequestException('Ya existe una caja abierta');
    }

    const caja = this.cajaRepository.create({
      montoInicial: abrirCajaDto.montoInicial,
      usuario,
    });

    return this.cajaRepository.save(caja);
  }

  async cerrarCaja(cerrarCajaDto: CerrarCajaDto) {
    const caja = await this.cajaRepository.findOne({
      where: { estaAbierta: true },
      relations: ['ordenes'],
    });

    if (!caja) {
      throw new BadRequestException('No existe una caja abierta');
    }

    let ventasEfectivo = 0;
    let ventasDigitales = 0;

    caja.ordenes.forEach((orden) => {
      if (orden.metodoPago === MetodoPago.EFECTIVO) {
        ventasEfectivo += orden.total;
      } else if (
        orden.metodoPago === MetodoPago.TARJETA ||
        orden.metodoPago === MetodoPago.TRANSFERENCIA ||
        orden.metodoPago === MetodoPago.OTRO
      ) {
        ventasDigitales += orden.total;
      }
    });

    const montoEsperadoEfectivo = caja.montoInicial + ventasEfectivo;
    const diferencia = cerrarCajaDto.montoFinalEfectivo - montoEsperadoEfectivo;

    caja.estaAbierta = false;
    caja.fechaCierre = new Date();
    caja.montoFinalEfectivo = cerrarCajaDto.montoFinalEfectivo;
    caja.montoFinalTarjeta = cerrarCajaDto.montoFinalTarjeta ?? 0;
    caja.observaciones = cerrarCajaDto.observaciones ?? '';
    
    caja.ventasEfectivo = ventasEfectivo;
    caja.ventasDigitales = ventasDigitales;
    caja.montoEsperadoEfectivo = montoEsperadoEfectivo;
    caja.diferencia = diferencia;

    return this.cajaRepository.save(caja);
  }

  async getCajaAbierta() {
    const caja = await this.cajaRepository.findOne({
      where: {
        estaAbierta: true,
      },
      relations: ['ordenes'],
      order: {
        fechaApertura: 'DESC',
      },
    });

    if (caja) {
      let ventasEfectivo = 0;
      let ventasDigitales = 0;

      caja.ordenes.forEach((orden) => {
        if (orden.metodoPago === MetodoPago.EFECTIVO) {
          ventasEfectivo += orden.total;
        } else if (
          orden.metodoPago === MetodoPago.TARJETA ||
          orden.metodoPago === MetodoPago.TRANSFERENCIA ||
          orden.metodoPago === MetodoPago.OTRO
        ) {
          ventasDigitales += orden.total;
        }
      });
      caja.ventasEfectivo = ventasEfectivo;
      caja.ventasDigitales = ventasDigitales;
      caja.montoEsperadoEfectivo = caja.montoInicial + ventasEfectivo;
      
      // no devolvemos ordenes al cliente para evitar payload gigante
      delete (caja as any).ordenes;
    }

    return caja;
  }

  async getReporteCajas(fechaInicio?: string, fechaFin?: string, usuarioId?: number) {
    const query = this.cajaRepository.createQueryBuilder('caja')
      .leftJoinAndSelect('caja.usuario', 'usuario')
      .orderBy('caja.fechaApertura', 'DESC');

    if (fechaInicio) {
      const start = fechaInicio.includes(' ') ? fechaInicio : `${fechaInicio} 00:00:00`;
      query.andWhere('caja.fechaApertura >= :start', { start });
    }

    if (fechaFin) {
      const end = fechaFin.includes(' ') ? fechaFin : `${fechaFin} 23:59:59`;
      query.andWhere('caja.fechaApertura <= :end', { end });
    }

    if (usuarioId) {
      query.andWhere('usuario.id = :usuarioId', { usuarioId });
    }

    const cajas = await query.getMany();

    const resumen = cajas.reduce(
      (acc, caja) => {
        acc.totalAperturas++;
        acc.totalVentasEfectivo += caja.ventasEfectivo || 0;
        acc.totalVentasDigitales += caja.ventasDigitales || 0;
        acc.totalDiferencia += caja.diferencia || 0;
        return acc;
      },
      {
        totalAperturas: 0,
        totalVentasEfectivo: 0,
        totalVentasDigitales: 0,
        totalDiferencia: 0,
      }
    );

    return { resumen, cajas };
  }
}
