import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateGastoDto {
  @IsString({ message: 'La descripción del gasto debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción del gasto es obligatoria' })
  descripcion!: string;

  @IsInt({ message: 'El monto del gasto debe ser un número entero' })
  @IsPositive({ message: 'El monto del gasto debe ser un número positivo' })
  monto!: number;
}
