import { Controller, Get, Query } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@Auth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumen')
  getResumen(@Query('fecha') fecha?: string) {
    return this.dashboardService.getResumen(fecha);
  }

  @Get('productos-mas-vendidos')
  getProductosMasVendidos(
    @Query('fecha') fecha?: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getProductosMasVendidos(fecha, limit ? limit : 5);
  }

  @Get('ordenes-recientes')
  getOrdenesRecientes(@Query('fecha') fecha?: string) {
    return this.dashboardService.getOrdenesRecientes(fecha);
  }
}
