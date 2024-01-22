import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class PutGoldDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(1000000)
  amount: number;
}
