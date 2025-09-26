import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the PostgreSQL connection
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/crowdfunding';

// Create the postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create the drizzle instance
export const db = drizzle(client, { schema });

// Export the client for cleanup if needed
export { client };