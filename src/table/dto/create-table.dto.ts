import { OmitType } from '@nestjs/swagger';
import { TableEntity } from '../entities/table.entity';

export class CreateTableDto extends OmitType(TableEntity, ['id']) {}
