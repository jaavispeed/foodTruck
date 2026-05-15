import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenDto } from './create-orden.dto';

export class UpdateOrdeneDto extends PartialType(CreateOrdenDto) {}
