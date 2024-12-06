import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsOptional,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  readonly name: string;

  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' })
  readonly price: number;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  readonly description: string;

  @IsOptional() // Optional field for image
  @IsString()
  readonly image?: string;
}
