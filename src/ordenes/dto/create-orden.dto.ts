import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

class OrdenProductoDto {
  @IsNumber()
  @IsPositive()
  productoId!: number;

  @IsNumber()
  @IsPositive()
  cantidad!: number;
}

export class CreateOrdenDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrdenProductoDto)
  orden!: OrdenProductoDto[];
}
