/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  extraPriceFull: number;

  @IsNumber()
  extraPriceHalf: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}