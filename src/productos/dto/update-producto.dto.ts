import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { Estado } from '../../common/enum/estados.enum';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsEnum(Estado)
  @IsOptional()
  estado?: Estado;
}
