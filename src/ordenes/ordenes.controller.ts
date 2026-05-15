import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Usuario } from '../auth/entities/usuario.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { OrdenesService } from './ordenes.service';

@Controller('ordenes')
@Auth()
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  create(
    @Body() createOrdenDto: CreateOrdenDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.ordenesService.create(createOrdenDto, usuario);
  }

  @Get()
  getAll(@Query() paginationDto: PaginationDto) {
    return this.ordenesService.getAll(paginationDto);
  }

  @Get(':idOrden')
  getById(@Param('idOrden') idOrden: string) {
    return this.ordenesService.getByIdOrden(+idOrden);
  }

  @Delete(':idOrden')
  anular(@Param('idOrden') idOrden: string) {
    return this.ordenesService.softDelete(+idOrden);
  }
}
