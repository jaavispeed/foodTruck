import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class OrdenDetalle {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('int')
  cantidad!: number;

  @Column('float')
  precioUnitario!: number;

  @Column('float')
  subtotal!: number;

  @ManyToOne(() => Producto, (producto) => producto.ordenDetalles)
  producto!: Producto;

  @ManyToOne(() => Orden, (orden) => orden.detalles, { onDelete: 'CASCADE' })
  orden!: Orden;
}
