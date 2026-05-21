import { IsInt, Min } from 'class-validator';

export class CerrarCajaDto {
  @IsInt({ message: 'El monto final debe ser un número entero (CLP)' })
  @Min(0)
  montoFinal!: number;
}
