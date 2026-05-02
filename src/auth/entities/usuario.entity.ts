import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Estado } from '../../common/enum/estados.enum';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text')
  nombre!: string;

  @Column('text')
  apellido!: string;

  @Column('text', {
    unique: true,
  })
  email!: string;

  @Column('text')
  password!: string;

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.VIGENTE,
  })
  estado!: Estado;

  @Column('text', {
    array: true,
    default: ['USER'],
  })
  rol!: string[];
}
