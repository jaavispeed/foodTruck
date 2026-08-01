import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { Estado } from '../../common/enum/estados.enum';

export class GetGastosDto extends PaginationDto {
  @IsOptional()
  @IsString()
  desde?: string;

  @IsOptional()
  @IsString()
  hasta?: string;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoriaId?: number;
}
