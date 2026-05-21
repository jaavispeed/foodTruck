import { IsInt, IsPositive } from 'class-validator';

export class CreateOrdenDetalleDto {
  @IsInt()
  @IsPositive()
  productoId!: number;

  @IsInt()
  @IsPositive()
  cantidad!: number;
}
