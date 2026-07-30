import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { MetodoPago } from '../../common/enum/metodo-pago.enum';
import { Estado } from '../../common/enum/estados.enum';

export class GetOrdenesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  desde?: string;

  @IsOptional()
  @IsString()
  hasta?: string;

  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
