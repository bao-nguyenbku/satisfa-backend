import { OmitType } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';

export class CreateProductDto extends OmitType(ProductEntity, ['id']) {}
