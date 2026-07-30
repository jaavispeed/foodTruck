import { IsEnum, IsString, MinLength } from 'class-validator';
import { TipoCategoria } from '../../common/enum/tipo-categoria.enum';

export class CreateCategoriaDto {
  @IsString()
  @MinLength(1)
  nombre!: string;

  @IsEnum(TipoCategoria)
  tipo!: TipoCategoria;
}
