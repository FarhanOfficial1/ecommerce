import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsNumber()
    productId: number;
  
    @IsNumber()
    quantity: number;
  
    @IsString()
    productName: string;

    @IsNumber()
    unitPrice: number;
  
    @IsOptional() // Optional if the backend calculates it
    @IsNumber()
    totalPrice?: number;
  }
  