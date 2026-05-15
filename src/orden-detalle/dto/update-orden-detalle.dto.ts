import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenDetalleDto } from './create-orden-detalle.dto';

export class UpdateOrdenDetalleDto extends PartialType(CreateOrdenDetalleDto) {}
