import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CajaModule } from './caja/caja.module';
import { CommonModule } from './common/common.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GastosModule } from './gastos/gastos.module';
import { OrdenDetalleModule } from './orden-detalle/orden-detalle.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductosModule,
    CommonModule,
    AuthModule,
    OrdenesModule,
    OrdenDetalleModule,
    DashboardModule,
    CajaModule,
    GastosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
