import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CerrarCajaDto {
  @IsInt({ message: 'El monto final en efectivo debe ser un número entero' })
  @Min(0)
  montoFinalEfectivo!: number;

  @IsOptional()
  @IsInt({ message: 'El monto final en tarjeta debe ser un número entero' })
  @Min(0)
  montoFinalTarjeta?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
