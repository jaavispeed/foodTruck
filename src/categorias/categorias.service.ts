import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { TipoCategoria } from '../common/enum/tipo-categoria.enum';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger('CategoriasService');

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      await this.categoriaRepository.save(categoria);
      return categoria;
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.categoriaRepository.find();
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return categoria;
  }
  
  async findByTipo(tipo: TipoCategoria) {
    return this.categoriaRepository.find({ where: { tipo } });
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepository.preload({
      id,
      ...updateCategoriaDto,
    });

    if (!categoria) throw new NotFoundException(`Categoría con id ${id} no encontrada`);

    try {
      await this.categoriaRepository.save(categoria);
      return categoria;
    } catch (error: any) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
    return { message: `Categoría con id ${id} eliminada` };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException('La categoría ya existe para este tipo');
    
    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revise los logs del servidor');
  }
}
