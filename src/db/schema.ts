import { pgTable, text, integer, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// User table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => sql`gen_random_uuid()::text`),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

// Session table for storing session data if needed
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

// For a crowdfunding app, we might also want projects/campaigns
export const projects = pgTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => sql`gen_random_uuid()::text`),
  title: text('title').notNull(),
  description: text('description'),
  goalAmount: integer('goal_amount').notNull(), // In cents
  currentAmount: integer('current_amount').default(0),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  deadline: integer('deadline'), // Unix timestamp
  isCompleted: boolean('is_completed').default(false),
});