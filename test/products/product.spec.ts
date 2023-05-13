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
import { ProductController } from '~/module/private/products/product.controller';
import { ProductModule } from '~/module/private/products/product.module';
import { ProductService } from '~/module/private/products/product.service';
import { productDtoStub } from './products.stub';

describe('Product Services', () => {
  let service: ProductService;
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
        ProductService,
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
    service = module.get<ProductService>(ProductService);
    const category = (
      await new categoryModel({
        name: 'Món khai vị',
      }).save()
    ).toObject();
    await new productModel({
      ...productDtoStub(),
      category: category._id,
    }).save();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Get all products', () => {
    it('should get all products successfully', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      if (result.length !== 0) {
        expect(result[0].name).toBe(productDtoStub().name);
      }
    });
  });
  describe('Get product by id', () => {
    it('should get product by its id successfully', async () => {
      const productList = await service.findAll();
      let id;
      if (productList) {
        id = productList[0].id;
      }
      const result = await service.findById(id);
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toEqual(id);
    });
  });
  describe('Update product by id', () => {
    it('should update product by its id successfully', async () => {
      const productList = await service.findAll();
      let id;
      const productName = 'Test Update product';
      if (productList) {
        id = productList[0].id;
      }
      const result = await service.update(id, {
        name: productName,
      });
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Object);
    });
  });
  describe('Delete product by id', () => {
    it('should delete product by its id successfully', async () => {
      const productList = await service.findAll();
      let id;
      if (productList) {
        id = productList[0].id;
      }
      const result = await service.delete(id);
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Object);
    });
  });
});
