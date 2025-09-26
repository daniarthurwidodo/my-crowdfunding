import { hashPassword, comparePassword } from '../../src/utils/password';

describe('Password Utils', () => {
  const testPassword = 'testPassword123!';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hashed = await hashPassword(testPassword);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed.length).toBeGreaterThan(0);
      expect(hashed).not.toBe(testPassword);
    });

    it('should generate different hashes for the same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const hashed = await hashPassword(testPassword);
      const isValid = await comparePassword(testPassword, hashed);

      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hashed = await hashPassword(testPassword);
      const isValid = await comparePassword('wrongPassword', hashed);

      expect(isValid).toBe(false);
    });

    it('should return false for empty password', async () => {
      const hashed = await hashPassword(testPassword);
      const isValid = await comparePassword('', hashed);

      expect(isValid).toBe(false);
    });
  });
});