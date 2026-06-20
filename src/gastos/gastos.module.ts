import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Gasto } from './entities/gasto.entity';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';

@Module({
  controllers: [GastosController],
  providers: [GastosService],
  imports: [TypeOrmModule.forFeature([Gasto]), AuthModule],
})
export class GastosModule {}
