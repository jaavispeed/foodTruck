import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  getAll() {
    return this.productosService.getAll();
  }

  @Get(':idProducto')
  getById(@Param('idProducto') idProducto: string) {
    return this.productosService.getByIdProducto(+idProducto);
  }

  @Patch(':idProducto')
  update(
    @Param('idProducto') idProducto: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+idProducto, updateProductoDto);
  }

  @Delete(':idProducto')
  softDelete(@Param('idProducto') idProducto: string) {
    return this.productosService.softDelete(+idProducto);
  }
}
