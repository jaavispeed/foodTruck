import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenDetalle } from './entities/orden-detalle.entity';
import { OrdenDetalleService } from './orden-detalle.service';
import { OrdenCalculoService } from '../ordenes/orden-calculo.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenDetalle])],
  providers: [OrdenDetalleService, OrdenCalculoService],
  exports: [TypeOrmModule, OrdenDetalleService],
})
export class OrdenDetalleModule {}
