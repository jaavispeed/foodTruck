import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [
    TypeOrmModule.forFeature([Categoria]),
    AuthModule,
  ],
  exports: [CategoriasService, TypeOrmModule],
})
export class CategoriasModule {}
