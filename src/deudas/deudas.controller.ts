import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { DeudasService } from './deudas.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Usuario } from '../auth/entities/usuario.entity';
import { CreateDeudaDto } from './dto/create-deuda.dto';
import { UpdateDeudaDto } from './dto/update-deuda.dto';

@Controller('deudas')
@Auth()
export class DeudasController {
  constructor(private readonly deudasService: DeudasService) {}

  @Post()
  create(@Body() createDeudaDto: CreateDeudaDto, @GetUser() usuario: Usuario) {
    return this.deudasService.create(createDeudaDto, usuario);
  }

  @Get()
  findAll() {
    return this.deudasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deudasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeudaDto: UpdateDeudaDto,
  ) {
    return this.deudasService.update(id, updateDeudaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deudasService.remove(id);
  }
}
