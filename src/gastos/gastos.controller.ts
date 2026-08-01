import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { GetGastosDto } from './dto/get-gastos.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { GastosService } from './gastos.service';

@Controller('gastos')
@Auth()
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  create(@Body() createGastoDto: CreateGastoDto, @GetUser() usuario: Usuario) {
    return this.gastosService.create(createGastoDto, usuario);
  }

  @Get()
  getAll(@Query() paginationDto: GetGastosDto) {
    return this.gastosService.getAll(paginationDto);
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.gastosService.getByIdGasto(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return this.gastosService.update(id, updateGastoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gastosService.softDelete(id);
  }
}
