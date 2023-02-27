import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reserve.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto){}
