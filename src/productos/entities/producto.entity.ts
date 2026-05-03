import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Estado } from '../../common/enum/estados.enum';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text', {
    unique: true,
  })
  nombre!: string;

  @Column('float', {
    default: 0,
  })
  precio!: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
  })
  fechaCreacion!: Date;

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.VIGENTE,
  })
  estado!: Estado;

  @ManyToOne(() => Usuario, (usuario) => usuario.producto, { eager: true })
  usuario!: Usuario;
}
