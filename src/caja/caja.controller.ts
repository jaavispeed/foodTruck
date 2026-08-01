import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Usuario } from '../auth/entities/usuario.entity';
import { CajaService } from './caja.service';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';

@Controller('caja')
@Auth()
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post('abrir')
  abrirCaja(@Body() abrirCajaDto: AbrirCajaDto, @GetUser() usuario: Usuario) {
    return this.cajaService.abrirCaja(abrirCajaDto, usuario);
  }

  @Patch('cerrar')
  cerrarCaja(@Body() cerrarCajaDto: CerrarCajaDto) {
    return this.cajaService.cerrarCaja(cerrarCajaDto);
  }

  @Get('abierta')
  getCajaAbierta() {
    return this.cajaService.getCajaAbierta();
  }

  @Get('reporte')
  getReporte(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('usuarioId') usuarioId?: number,
  ) {
    return this.cajaService.getReporteCajas(fechaInicio, fechaFin, usuarioId);
  }
}
