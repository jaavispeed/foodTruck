import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  apellido?: string;
}
