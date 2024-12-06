import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './Product.Entity';
import { ProductDto } from './Product.Dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async all(){
    return this.productRepository.count();
  }
  async updateProduct(
    id: number,
    productDto: ProductDto,
  ): Promise<ProductEntity> {
    try {
      // Find the product and throw an error if not found
      const product = await this.productRepository.findOneOrFail({
        where: { id },
      });

      // Update the product properties
      product.name = productDto.name;
      product.price = productDto.price;
      product.description = productDto.description;
      product.image = productDto.image;

      // Save the updated product
      return await this.productRepository.save(product); // Save and return the updated product
    } catch (error) {
      throw new Error('Product not found');
    }
  }

  async insertProduct(
    productDto: ProductDto | ProductDto[],
  ): Promise<ProductEntity | ProductEntity[]> {
    if (Array.isArray(productDto)) {
      // If input is an array of products
      const products = productDto.map((dto) => {
        const product = new ProductEntity();
        product.name = dto.name;
        product.price = dto.price;
        product.description = dto.description;
        product.image = dto.image;
        return product;
      });

      // Save and return all products
      return await this.productRepository.save(products);
    } else {
      // If input is a single product
      const product = new ProductEntity();
      product.name = productDto.name;
      product.price = productDto.price;
      product.description = productDto.description;
      product.image = productDto.image;
      // Save and return the single product
      return await this.productRepository.save(product);
    }
  }

  async getAllProducts(): Promise<ProductEntity[]> {
    return this.productRepository.find({
      order: {
        // id: 'ASC',
        id: 'ASC',
      },
    });
  }

  async getProductById(id: number): Promise<ProductEntity> {
    return this.productRepository.findOne({ where: { id } });
  }

  async deleteById(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.delete(id); // Deletes the product if found
  }

  async countProduct() {
    return this.productRepository.find();
  }
}
