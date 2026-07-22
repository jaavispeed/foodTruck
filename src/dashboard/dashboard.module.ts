import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Gasto } from '../gastos/entities/gasto.entity';
import { OrdenDetalle } from '../orden-detalle/entities/orden-detalle.entity';
import { Orden } from '../ordenes/entities/orden.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orden, OrdenDetalle, Gasto]), AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
