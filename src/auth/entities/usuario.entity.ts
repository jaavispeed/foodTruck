import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Estado } from '../../common/enum/estados.enum';
import { Producto } from '../../productos/entities/producto.entity';

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

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email.toLowerCase().trim();
  }
}
