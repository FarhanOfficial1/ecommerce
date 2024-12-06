// import { IsDecimal, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

// export class CreateOrderDetailsDto {
//   @IsInt()
//   @Min(1)
//   orderId: number; // The ID of the order this item belongs to

//   @IsInt()
//   @Min(1)
//   productId: number; // The ID of the product being ordered

//   @IsInt()
//   @Min(1)
//   quantity: number; // The quantity of the product being ordered

//   @IsDecimal()
//   totalPrice: number; // The total price of this item (quantity * product price)

//   @IsString()
//   @IsNotEmpty()
//   status: string; // The status of the order item (e.g., "pending", "shipped")
// }

import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "src/OrderItems/OrderItem.Dto";


export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  // @IsString()
  // status: string;

  @IsDateString() // Accepts a valid ISO date string
  orderDate?: string;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => CreateOrderItemDto) // Transform nested DTOs
  orderItems: {
    productName: string;
    quantity: number;
  }[]; 
}
