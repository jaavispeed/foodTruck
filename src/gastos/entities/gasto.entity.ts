import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Estado } from '../../common/enum/estados.enum';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Deuda } from '../../deudas/entities/deuda.entity';

@Entity()
export class Gasto {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text')
  descripcion!: string;

  @Column('int')
  monto!: number;

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

  @ManyToOne(() => Usuario, (usuario) => usuario.gastos, {
    eager: true,
  })
  usuario!: Usuario;
  @ManyToOne(() => Categoria, (categoria) => categoria.gastos, { eager: true, nullable: true })
  categoria!: Categoria;

  @ManyToOne(() => Deuda, (deuda) => deuda.gastosAsociados, { nullable: true })
  deudaAsociada!: Deuda;
}
