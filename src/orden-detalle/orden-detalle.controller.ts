import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenDetalleService } from './orden-detalle.service';
import { CreateOrdenDetalleDto } from './dto/create-orden-detalle.dto';
import { UpdateOrdenDetalleDto } from './dto/update-orden-detalle.dto';

@Controller('orden-detalle')
export class OrdenDetalleController {
  constructor(private readonly ordenDetalleService: OrdenDetalleService) {}

  @Post()
  create(@Body() createOrdenDetalleDto: CreateOrdenDetalleDto) {
    return this.ordenDetalleService.create(createOrdenDetalleDto);
  }

  @Get()
  findAll() {
    return this.ordenDetalleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenDetalleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenDetalleDto: UpdateOrdenDetalleDto) {
    return this.ordenDetalleService.update(+id, updateOrdenDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenDetalleService.remove(+id);
  }
}
