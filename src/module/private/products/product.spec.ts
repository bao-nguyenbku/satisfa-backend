import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '~/module/private/products/product.controller';
import { ProductService } from '~/module/private/products/product.service';

describe('ProductsController', () => {
  let controller: ProductController;
  let service: ProductService;
  const findAllResult = [
    {
      name: 'Gà nướng muối ớt',
      category: 'Món chính',
      description: '<p>Đây là mô tả cho gà nướng muối ớt</p>',
      images: [
        'http://localhost:5000/uploads/d84ce40c-2bd4-4357-a1a6-8355d9003a72.png',
      ],
      price: 560000,
      visible: true,
      id: '63ede3002ec016926c0fc5f1',
    },
  ];
  const mockProductService = {
    findAll: jest.fn().mockImplementation(() => {
      return ['List'];
    }),
  };
  beforeEach(async () => {
    const ApiProvider = {
      provide: ProductService,
      useFactory: () => ({
        findAll: jest.fn(() => findAllResult),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, ApiProvider],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();
    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('shuold return list of product', async () => {
    expect(controller.getAllProduct()).toEqual(findAllResult);
  });
});
