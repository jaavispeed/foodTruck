import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { OrdenDetalleService } from './orden-detalle.service';

@Controller('orden-detalle')
@Auth()
export class OrdenDetalleController {
  constructor(private readonly ordenDetalleService: OrdenDetalleService) {}

  @Get(':idOrden')
  getByIdOrden(@Param('idOrden') idOrden: string) {
    return this.ordenDetalleService.getByIdOrden(+idOrden);
  }
}
