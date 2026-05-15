import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateOrdenDetalleDto } from '../../orden-detalle/dto/create-orden-detalle.dto';

export class CreateOrdenDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrdenDetalleDto)
  detalles!: CreateOrdenDetalleDto[];
}
