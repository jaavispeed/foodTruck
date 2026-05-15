import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OrdenDetalle } from '../orden-detalle/entities/orden-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Orden } from './entities/orden.entity';
import { OrdenCalculoService } from './orden-calculo.service';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { OrdenDetalleModule } from '../orden-detalle/orden-detalle.module';

@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService, OrdenCalculoService],
  imports: [TypeOrmModule.forFeature([Orden, OrdenDetalle, Producto]), AuthModule, OrdenDetalleModule],
})
export class OrdenesModule {}
