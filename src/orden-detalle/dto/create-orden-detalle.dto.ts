import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrdenDetalleDto {
  @IsNumber()
  @IsPositive()
  productoId!: number;

  @IsNumber()
  @IsPositive()
  cantidad!: number;
}
