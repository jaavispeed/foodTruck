import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { MetodoPago } from '../../common/enum/metodo-pago.enum';

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

  @IsEnum(MetodoPago)
  metodoPago!: MetodoPago;
}
