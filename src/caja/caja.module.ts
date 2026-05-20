import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { Caja } from './entities/caja.entity';

@Module({
  controllers: [CajaController],
  providers: [CajaService],
  imports: [TypeOrmModule.forFeature([Caja]), AuthModule],
  exports: [CajaService],
})
export class CajaModule {}
