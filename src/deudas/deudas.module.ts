import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DeudasService } from './deudas.service';
import { DeudasController } from './deudas.controller';
import { Deuda } from './entities/deuda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deuda]), AuthModule],
  controllers: [DeudasController],
  providers: [DeudasService],
  exports: [DeudasService], // Exportamos para poder usarlo en Dashboard
})
export class DeudasModule {}
