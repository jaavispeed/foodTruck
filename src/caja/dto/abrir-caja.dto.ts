import { IsNumber, IsPositive, Min } from 'class-validator';

export class AbrirCajaDto {
  @IsNumber()
  @Min(0)
  montoInicial!: number;
}
