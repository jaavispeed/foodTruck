import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from './entities/caja.entity';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { Usuario } from '../auth/entities/usuario.entity';

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

  async cerrarCaja(id: number, cerrarCajaDto: CerrarCajaDto) {
    const caja = await this.cajaRepository.findOne({
      where: { id },
    });

    if (!caja) {
      throw new NotFoundException(`Caja con ID ${id} no encontrada`);
    }

    if (!caja.estaAbierta) {
      throw new BadRequestException(`La caja con ID ${id} ya está cerrada`);
    }

    caja.estaAbierta = false;
    caja.fechaCierre = new Date();
    caja.montoFinal = cerrarCajaDto.montoFinal;

    return this.cajaRepository.save(caja);
  }

  async getCajaAbierta() {
    return this.cajaRepository.findOne({
      where: { estaAbierta: true },
    });
  }
}
