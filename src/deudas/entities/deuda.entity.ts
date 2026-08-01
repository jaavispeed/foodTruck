import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Gasto } from '../../gastos/entities/gasto.entity';
import { Estado } from '../../common/enum/estados.enum';

@Entity()
export class Deuda {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('int')
  montoTotal!: number;

  @Column('int')
  cuotasTotales!: number;

  @Column('int', { default: 0 })
  cuotasPagadas!: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
  })
  fechaCreacion!: Date;

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.VIGENTE, // VIGENTE (activa) o INACTIVA (pagada/eliminada)
  })
  estado!: Estado;

  @ManyToOne(() => Usuario, (usuario) => usuario.deudas, {
    eager: true,
  })
  usuario!: Usuario;

  @OneToMany(() => Gasto, (gasto) => gasto.deudaAsociada)
  gastosAsociados!: Gasto[];
}
