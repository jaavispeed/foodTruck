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
  getProductosMasVendidos(@Query('limit') limit?: number) {
    return this.dashboardService.getProductosMasVendidos(limit ? limit : 5);
  }

  @Get('ordenes-recientes')
  getOrdenesRecientes() {
    return this.dashboardService.getOrdenesRecientes();
  }
}
