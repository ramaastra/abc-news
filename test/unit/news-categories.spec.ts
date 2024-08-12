import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from '../test.service';
import { PrismaService } from '../../src/common/prisma.service';
import { ValidationService } from '../../src/common/validation.service';
import { NewsCategoriesService } from '../../src/news-categories/news-categories.service';
import { TestModule } from '../test.module';

describe('NewsCategoryService', () => {
  let newsCategoriesService: NewsCategoriesService;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [
        TestService,
        PrismaService,
        ValidationService,
        NewsCategoriesService,
      ],
    }).compile();

    newsCategoriesService = module.get<NewsCategoriesService>(
      NewsCategoriesService,
    );
    testService = module.get<TestService>(TestService);
  });

  describe('create()', () => {
    beforeEach(async () => {
      await testService.deleteNewsCategory();
    });

    it('should be rejected if request is invalid', async () => {
      try {
        await newsCategoriesService.create({
          name: '',
          description: '',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be rejected if news category name is already exist', async () => {
      try {
        await testService.createNewsCategory();
        await newsCategoriesService.create({
          name: 'Test Category',
          description: 'This is just a dummy category used for testing purpose',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should create news category and return its data', async () => {
      const result = await newsCategoriesService.create({
        name: 'Test Category',
        description: 'This is just a dummy category used for testing purpose',
      });
      expect(result.id).toBeDefined();
      expect(result.slug).toBe('test-category');
      expect(result.name).toBe('Test Category');
      expect(result.description).toBe(
        'This is just a dummy category used for testing purpose',
      );
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('findAll()', () => {
    beforeEach(async () => {
      await testService.deleteNewsCategory();
      await testService.createNewsCategory();
    });

    it('should be able to list news categories available', async () => {
      const result = await newsCategoriesService.findAll();
      expect(result[0].id).toBeDefined();
      expect(result[0].slug).toBeDefined();
      expect(result[0].name).toBeDefined();
      expect(result[0].description).toBeDefined();
      expect(result[0].createdAt).toBeDefined();
      expect(result[0].updatedAt).toBeDefined();
    });
  });

  describe('findOne()', () => {
    beforeEach(async () => {
      await testService.deleteNewsCategory();
      await testService.createNewsCategory();
    });

    it('should be rejected if news category id does not exist', async () => {
      try {
        await newsCategoriesService.findOne(0);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should return the corresponding news category data', async () => {
      const { id } = await testService.getNewsCategory();
      const result = await newsCategoriesService.findOne(id);
      expect(result.id).toBe(id);
      expect(result.slug).toBe('test-category');
      expect(result.description).toBe(
        'This is just a dummy category used for testing purpose',
      );
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('update()', () => {
    beforeEach(async () => {
      await testService.deleteNewsCategory();
      await testService.createNewsCategory();
    });

    it('should be rejected if news category id does not exist', async () => {
      try {
        await newsCategoriesService.update(0, {
          name: '[Updated] Test Category',
          description:
            '[Updated] This is just a dummy category used for testing purpose',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be rejected if request is invalid', async () => {
      try {
        const { id } = await testService.getNewsCategory();
        await newsCategoriesService.update(id, {
          name: '',
          description: '',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should update news category and return its data', async () => {
      const { id } = await testService.getNewsCategory();
      const result = await newsCategoriesService.update(id, {
        description:
          '[Updated] This is just a dummy category used for testing purpose',
      });
      expect(result.id).toBeDefined();
      expect(result.slug).toBe('test-category');
      expect(result.name).toBe('Test Category');
      expect(result.description).toBe(
        '[Updated] This is just a dummy category used for testing purpose',
      );
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('remove()', () => {
    beforeEach(async () => {
      await testService.deleteNewsCategory();
      await testService.createNewsCategory();
    });

    it('should be rejected if news category id does not exist', async () => {
      try {
        await newsCategoriesService.remove(0);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should return true if news category has been deleted', async () => {
      const { id } = await testService.getNewsCategory();
      const result = await newsCategoriesService.remove(id);
      expect(result).toBe(true);
    });
  });
});
