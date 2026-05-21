import { IsInt, Min } from 'class-validator';

export class AbrirCajaDto {
  @IsInt({ message: 'El monto inicial debe ser un número entero (CLP)' })
  @Min(0)
  montoInicial!: number;
}
