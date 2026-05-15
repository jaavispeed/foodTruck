import { Module } from '@nestjs/common';
import { OrdenDetalleService } from './orden-detalle.service';
import { OrdenDetalleController } from './orden-detalle.controller';

@Module({
  controllers: [OrdenDetalleController],
  providers: [OrdenDetalleService],
})
export class OrdenDetalleModule {}
