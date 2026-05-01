import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('varchar', {
    length: 200,
    unique: true,
  })
  nombre!: string;

  @Column('numeric', {
    default: 0,
  })
  precio!: number;
}
