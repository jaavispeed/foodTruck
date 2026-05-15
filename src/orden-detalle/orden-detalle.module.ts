import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OrdenCalculoService } from '../ordenes/orden-calculo.service';
import { OrdenDetalle } from './entities/orden-detalle.entity';
import { OrdenDetalleController } from './orden-detalle.controller';
import { OrdenDetalleService } from './orden-detalle.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenDetalle]), AuthModule],
  controllers: [OrdenDetalleController],
  providers: [OrdenDetalleService, OrdenCalculoService],
  exports: [TypeOrmModule, OrdenDetalleService],
})
export class OrdenDetalleModule {}
