import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: string;

  @Expose()
  year: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}
