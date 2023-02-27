import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryResponse extends OmitType(CategoryEntity, []) {}
