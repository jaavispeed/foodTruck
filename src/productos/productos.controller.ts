import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from './common/dtos/pagination.dto';
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
  getAll(@Query() paginationDto: PaginationDto) {
    return this.productosService.getAll(paginationDto);
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
