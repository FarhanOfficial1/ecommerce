import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductService } from './Product.Service';
import { ProductEntity } from './Product.Entity';
import { ProductDto } from './Product.Dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("select/countall")
  async all(){
    return this.productService.all();
  }
  @Get('select/all')
  async getAll() {
    return this.productService.getAllProducts();
  }

  @Get('select/:id')
  async getById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Delete('delete/:id')
  async deleteById(@Param('id') id: number) {
    return this.productService.deleteById(id);
  }

  @Post('insert')
  async create(
    @Body() productDto: ProductDto | ProductDto[],
  ): Promise<ProductEntity | ProductEntity[]> {
    return this.productService.insertProduct(productDto);
  }

  @Put('insert/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() productDto: ProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(id, productDto); // Call the service method
  }

  @Get('select/countproduct')
  async countAll() {
    return await this.productService.countProduct(); // This needs to be defined in the service
  }
}
