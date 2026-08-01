import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Caja } from '../../caja/entities/caja.entity';
import { Estado } from '../../common/enum/estados.enum';
import { Gasto } from '../../gastos/entities/gasto.entity';
import { Orden } from '../../ordenes/entities/orden.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Deuda } from '../../deudas/entities/deuda.entity';

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

  @Column('text', {
    select: false,
  })
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

  @OneToMany(() => Producto, (producto) => producto.usuario)
  producto!: Producto;

  @OneToMany(() => Orden, (orden) => orden.usuario)
  ordenes!: Orden[];

  @OneToMany(() => Caja, (caja) => caja.usuario)
  cajas!: Caja[];

  @OneToMany(() => Gasto, (gasto) => gasto.usuario)
  gastos!: Gasto[];

  @OneToMany(() => Deuda, (deuda) => deuda.usuario)
  deudas!: Deuda[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email.toLowerCase().trim();
  }
}
