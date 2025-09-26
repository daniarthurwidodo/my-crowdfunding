import { db } from '../config/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword } from '../utils/password';
import type { User, CreateUserRequest } from '../types';

export class UserService {
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);

    const [newUser] = await db.insert(users).values({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    }).returning();

    return newUser;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return userResult[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return userResult[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const userResult = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return userResult[0] || null;
  }

  static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await comparePassword(password, hashedPassword);
  }
}