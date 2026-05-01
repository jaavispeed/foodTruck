import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(3)
  nombre!: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;
}
