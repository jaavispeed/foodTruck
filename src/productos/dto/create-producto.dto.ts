import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsInt({ message: 'El precio debe ser un número entero (CLP)' })
  @Min(0)
  precio!: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @IsOptional()
  categoriaId?: number;
}
