import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

// Create the PostgreSQL connection
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/crowdfunding';

// Create the postgres client
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

// Create the drizzle instance
export const db = drizzle(client, { schema });

// Export the client for cleanup if needed
export { client };