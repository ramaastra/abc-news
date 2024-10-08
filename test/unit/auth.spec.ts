import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { TestService } from '../test.service';
import { PrismaService } from '../../src/common/prisma.service';
import { BcryptService } from '../../src/common/bcrypt.service';
import { ValidationService } from '../../src/common/validation.service';
import { AuthService } from '../../src/auth/auth.service';
import { TestModule } from '../test.module';

describe('AuthService', () => {
  let authService: AuthService;
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, TestModule],
      providers: [
        TestService,
        PrismaService,
        BcryptService,
        ValidationService,
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    testService = module.get<TestService>(TestService);
  });

  describe('register()', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      try {
        await authService.register({
          email: 'testuser',
          username: '',
          firstName: '',
          lastName: '',
          password: '',
          role: 'USER',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be rejected if username already registered', async () => {
      await testService.createUser();

      try {
        await authService.register({
          email: 'testuser@gmail.com',
          username: 'user_test',
          firstName: 'User',
          lastName: 'Test',
          password: '123456',
          role: 'USER',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should register user and return user data', async () => {
      const result = await authService.register({
        email: 'testuser@gmail.com',
        username: 'user_test',
        firstName: 'User',
        lastName: 'Test',
        password: '123456',
        role: 'USER',
      });
      expect(result.id).toBeDefined();
      expect(result.email).toBe('testuser@gmail.com');
      expect(result.username).toBe('user_test');
      expect(result.firstName).toBe('User');
      expect(result.lastName).toBe('Test');
      expect(result.role).toBe('USER');
    });
  });

  describe('login()', () => {
    beforeAll(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      try {
        await authService.login({
          email: 'testuser',
          password: '',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be rejected if email is not registered', async () => {
      try {
        await authService.login({
          email: 'user@gmail.com',
          password: '123456',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be rejected if password is invalid', async () => {
      try {
        await authService.login({
          email: 'testuser@gmail.com',
          password: 'qwerty',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should login user and return access token', async () => {
      const result = await authService.login({
        email: 'testuser@gmail.com',
        password: '123456',
      });

      expect(result.user.id).toBeDefined();
      expect(result.user.email).toBe('testuser@gmail.com');
      expect(result.user.username).toBe('user_test');
      expect(result.user.firstName).toBe('User');
      expect(result.user.lastName).toBe('Test');
      expect(result.user.role).toBe('USER');
      expect(result.token).toBeDefined();
    });
  });
});
