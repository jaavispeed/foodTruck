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
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductosService } from './productos.service';

@Controller('productos')
@Auth()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(
    @Body() createProductoDto: CreateProductoDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.productosService.create(createProductoDto, usuario);
  }

  @Get()
  getAll(@Query() paginationDto: PaginationDto) {
    return this.productosService.getAll(paginationDto);
  }

  @Get('vigentes')
  getVigentes(@Query() paginationDto: PaginationDto) {
    return this.productosService.getVigentes(paginationDto);
  }

  @Get(':idProducto')
  getById(@Param('idProducto') idProducto: number) {
    return this.productosService.getByIdProducto(idProducto);
  }

  @Patch(':idProducto')
  update(
    @Param('idProducto') idProducto: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(idProducto, updateProductoDto);
  }

  @Delete(':idProducto')
  softDelete(@Param('idProducto') idProducto: number) {
    return this.productosService.softDelete(idProducto);
  }
}
