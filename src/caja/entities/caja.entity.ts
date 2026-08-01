import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Orden } from '../../ordenes/entities/orden.entity';

@Entity()
export class Caja {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('int', {
    default: 0,
  })
  montoInicial!: number;

  @Column('int', {
    nullable: true,
  })
  montoEsperadoEfectivo!: number;

  @Column('int', {
    nullable: true,
  })
  montoFinalEfectivo!: number;

  @Column('int', {
    nullable: true,
  })
  montoFinalTarjeta!: number;

  @Column('int', {
    default: 0,
  })
  ventasEfectivo!: number;

  @Column('int', {
    default: 0,
  })
  ventasDigitales!: number;

  @Column('int', {
    nullable: true,
  })
  diferencia!: number;

  @Column('text', {
    nullable: true,
  })
  observaciones!: string;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
  })
  fechaApertura!: Date;

  @Column({
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  fechaCierre!: Date;

  @Column('boolean', {
    default: true,
  })
  estaAbierta!: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.cajas, { eager: true, nullable: true })
  usuario!: Usuario;

  @OneToMany(() => Orden, (orden) => orden.caja)
  ordenes!: Orden[];
}
