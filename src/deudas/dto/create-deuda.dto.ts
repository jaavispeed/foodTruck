import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateDeudaDto {
  @IsNumber()
  @IsPositive()
  montoTotal!: number;

  @IsNumber()
  @Min(1)
  cuotasTotales!: number;
}
