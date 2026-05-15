import { Injectable } from '@nestjs/common';
import { CreateOrdenDetalleDto } from './dto/create-orden-detalle.dto';
import { UpdateOrdenDetalleDto } from './dto/update-orden-detalle.dto';

@Injectable()
export class OrdenDetalleService {
  create(createOrdenDetalleDto: CreateOrdenDetalleDto) {
    return 'This action adds a new ordenDetalle';
  }

  findAll() {
    return `This action returns all ordenDetalle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenDetalle`;
  }

  update(id: number, updateOrdenDetalleDto: UpdateOrdenDetalleDto) {
    return `This action updates a #${id} ordenDetalle`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenDetalle`;
  }
}
