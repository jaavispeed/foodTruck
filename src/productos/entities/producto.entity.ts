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

import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text', {
    unique: true,
  })
  nombre!: string;

  @Column('text', {
    nullable: true,
  })
  descripcion?: string;

  @Column('int', {
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

  @OneToMany(() => OrdenDetalle, (ordenDetalle) => ordenDetalle.producto)
  ordenDetalles!: OrdenDetalle[];
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, { eager: true, nullable: true })
  categoria!: Categoria;
}
