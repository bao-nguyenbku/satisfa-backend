import { OmitType } from '@nestjs/swagger';
import { ReviewEntity } from '~/module/private/reviews/entities/review.entity';

export class CreateReviewDto extends OmitType(ReviewEntity, [
  'id',
  'customerId',
  'createdAt',
  'updatedAt',
]) {
  customerId: string;
}
