import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { MetodoPago } from '../../common/enum/metodo-pago.enum';

class OrdenProductoDto {
  @IsInt()
  @IsPositive()
  productoId!: number;

  @IsInt()
  @IsPositive()
  cantidad!: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precioPersonalizado?: number;
}

export class CreateOrdenDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrdenProductoDto)
  orden!: OrdenProductoDto[];

  @IsEnum(MetodoPago)
  metodoPago!: MetodoPago;
}
