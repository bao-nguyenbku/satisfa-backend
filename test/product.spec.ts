import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '~/module/private/products/product.controller';
import { ProductModule } from '~/module/private/products/product.module';
import { ProductService } from '~/module/private/products/product.service';

describe('ProductsController', () => {
  let service: ProductService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
      imports: [ProductModule],
    }).compile();
    // controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
