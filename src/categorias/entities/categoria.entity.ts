import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TipoCategoria } from '../../common/enum/tipo-categoria.enum';
import { Producto } from '../../productos/entities/producto.entity';
import { Gasto } from '../../gastos/entities/gasto.entity';

@Entity()
@Unique(['nombre', 'tipo'])
export class Categoria {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text')
  nombre!: string;

  @Column({
    type: 'enum',
    enum: TipoCategoria,
  })
  tipo!: TipoCategoria;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos!: Producto[];

  @OneToMany(() => Gasto, (gasto) => gasto.categoria)
  gastos!: Gasto[];
}
