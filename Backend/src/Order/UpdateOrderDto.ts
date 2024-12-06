import { IsArray, IsOptional, IsInt, IsPositive, IsNumber, IsString } from 'class-validator';

class UpdateOrderItemDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsString()
  orderDate?: Date; 

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  orderItems?: UpdateOrderItemDto[];
}
