import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Estado } from '../../common/enum/estados.enum';
import { OrdenDetalle } from '../../orden-detalle/entities/orden-detalle.entity';

@Entity()
export class Orden {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('float', {
    default: 0,
  })
  total!: number;

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

  @ManyToOne(() => Usuario, (usuario) => usuario.ordenes)
  usuario!: Usuario;

  @OneToMany(() => OrdenDetalle, (ordenDetalle) => ordenDetalle.orden, {
    cascade: true,
  })
  detalles!: OrdenDetalle[];
}
