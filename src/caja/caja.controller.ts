import { Body, Controller, Post, Param, Patch, Get } from '@nestjs/common';
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
  abrirCaja(
    @Body() abrirCajaDto: AbrirCajaDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.cajaService.abrirCaja(abrirCajaDto, usuario);
  }

  @Patch('cerrar/:id')
  cerrarCaja(
    @Param('id') id: string,
    @Body() cerrarCajaDto: CerrarCajaDto,
  ) {
    return this.cajaService.cerrarCaja(+id, cerrarCajaDto);
  }

  @Get('abierta')
  getCajaAbierta() {
    return this.cajaService.getCajaAbierta();
  }
}
