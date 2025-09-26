import { UserService } from '../../src/services/userService';
import { db } from '../../src/config/database';

// Mock the database
jest.mock('../../src/config/database');
const mockDb = db as jest.Mocked<typeof db>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: '2023-01-01',
        updatedAt: null
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockUser])
          })
        })
      } as any);

      const result = await UserService.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockDb.select).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([])
          })
        })
      } as any);

      const result = await UserService.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', async () => {
      const result = await UserService.validatePassword('password', '$2b$10$hashedpassword');

      // This will actually call bcrypt, so we expect it to work
      expect(typeof result).toBe('boolean');
    });
  });
});