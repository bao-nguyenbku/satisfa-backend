import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import {
  Product,
  ProductSchema,
} from '~/module/private/products/product.schema';
import {
  Category,
  CategorySchema,
} from '~/module/private/categories/category.schema';
import { getModelToken } from '@nestjs/mongoose';
import { orderDtoStub } from './orders.stub';
import { OrdersService } from '~/module/private/orders/orders.service';

describe('Product Services', () => {
  let service: OrdersService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productModel: Model<Product>;
  let categoryModel: Model<Category>;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    productModel = mongoConnection.model(Product.name, ProductSchema);
    categoryModel = mongoConnection.model(Category.name, CategorySchema);
  });
  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });
  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Product.name),
          useValue: productModel,
        },
        {
          provide: getModelToken(Category.name),
          useValue: categoryModel,
        },
      ],
    }).compile();
    service = module.get<OrdersService>(OrdersService);
    // TODO: add data to database here
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
