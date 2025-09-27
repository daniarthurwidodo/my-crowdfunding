# Implementation Guide

## Technical Implementation Details

This document outlines the technical implementation of the My Crowdfunding Platform backend, including all recent enhancements.

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │────│   Express API   │────│ PostgreSQL DB   │
│                 │    │                 │    │                 │
│ - Web Frontend  │    │ - REST Endpoints│    │ - Users (ULID)  │
│ - Mobile Apps   │    │ - Auth Middleware│    │ - Projects(ULID)│
│ - Admin Panel   │    │ - Swagger Docs   │    │ - Sessions      │
│ - API Docs      │    │ - Validation MW  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Details

#### Backend Framework
- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript with static typing
- **Node.js**: Runtime environment (version 18+ recommended)

#### Database Layer
- **PostgreSQL**: Robust relational database for production
- **Drizzle ORM**: Type-safe SQL query builder
- **ULID**: Universally Unique Lexicographically Sortable Identifiers

#### Authentication & Security
- **Passport.js**: Authentication middleware
- **Local Strategy**: Email/password authentication
- **express-session**: Session management
- **bcrypt**: Password hashing with configurable rounds
- **Joi**: Input validation and sanitization

#### Development Tools
- **TypeScript Compiler**: Code compilation
- **Jest**: Unit testing framework with ts-jest
- **ESLint**: Code linting
- **Prettier**: Code formatting

#### Documentation & API
- **Swagger/OpenAPI**: API documentation
- **swagger-jsdoc**: Documentation generation
- **swagger-ui-express**: Interactive documentation UI

## Modular Architecture

### Project Structure
```
src/
├── app.ts                 # Express app configuration & middleware
├── index.ts              # Main entry point
├── config/
│   ├── database.ts       # Database connection setup
│   └── swagger.ts        # API documentation configuration
├── controllers/
│   ├── authController.ts    # Authentication HTTP handlers
│   └── projectController.ts # Project HTTP handlers
├── middleware/
│   ├── auth.ts           # Authentication middleware
│   └── validation.ts     # Input validation middleware
├── routes/
│   ├── index.ts          # Route aggregation & mounting
│   ├── auth.ts           # Authentication routes
│   └── projects.ts       # Project routes
├── services/
│   ├── userService.ts    # User business logic
│   └── projectService.ts # Project business logic
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   └── password.ts       # Password hashing utilities
└── db/
    ├── index.ts          # Database configuration
    └── schema.ts         # Database schema definitions
```

### Separation of Concerns

#### Controllers
- Handle HTTP requests and responses
- Parse request data
- Format response data
- Delegate business logic to services
- Handle HTTP-specific concerns (status codes, headers)

#### Services
- Contain business logic
- Interact with database through repositories
- Perform data validation and transformation
- Handle business rules and workflows

#### Routes
- Define API endpoints
- Apply middleware (auth, validation)
- Route requests to appropriate controllers
- Handle route-specific logic

#### Middleware
- Authentication and authorization
- Input validation and sanitization
- Error handling
- CORS configuration
- Logging and monitoring

## Database Implementation

### Schema Design
```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  goal_amount INTEGER NOT NULL,
  current_amount INTEGER DEFAULT 0,
  creator_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deadline INTEGER,
  is_completed INTEGER DEFAULT 0,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);
```

### Database Connection
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';

// Create the SQLite database instance
const sqlite = new Database(process.env.DATABASE_URL || 'sqlite.db');

// Create the drizzle instance
export const db = drizzle(sqlite, { schema });
```

## Authentication Implementation

### Passport Configuration
```typescript
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await UserService.findByUsername(username);

      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      const isValidPassword = await UserService.validatePassword(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
```

### Session Management
```typescript
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

## Validation Implementation

### Joi Validation Schemas
```typescript
export const userSchemas = {
  register: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
  })
};
```

### Validation Middleware
```typescript
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};
```

## API Documentation

### Swagger Configuration
```typescript
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Crowdfunding Platform API',
      version: '1.0.0',
      description: 'A comprehensive API for a crowdfunding platform',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJSDoc(options);
```

### Route Documentation
```typescript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 */
router.post('/register', validateBody(userSchemas.register), AuthController.register);
```

## Testing Implementation

### Jest Configuration
```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "roots": ["<rootDir>/src", "<rootDir>/tests"],
    "testMatch": ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/**/*.d.ts",
      "!src/index.ts"
    ]
  }
}
```

### Unit Test Example
```typescript
describe('Password Utils', () => {
  it('should hash a password', async () => {
    const hashed = await hashPassword('testPassword123!');

    expect(hashed).toBeDefined();
    expect(typeof hashed).toBe('string');
    expect(hashed.length).toBeGreaterThan(0);
  });
});
```

## Environment Configuration

### Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=sqlite.db

# Session Configuration
SESSION_SECRET=your-super-secret-session-key

# Security Configuration
BCRYPT_ROUNDS=10

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Configuration Loading
```typescript
import 'dotenv/config';

// Environment variables are now available via process.env
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
```

## Error Handling

### Global Error Handler
```typescript
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### Validation Error Handling
```typescript
if (error) {
  const errors = error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message
  }));

  return res.status(400).json({
    message: 'Validation failed',
    errors
  });
}
```

## Security Measures

### Password Security
- bcrypt hashing with configurable rounds
- Minimum password requirements
- Secure password validation

### Session Security
- Secure cookies in production
- Configurable session timeout
- Session secret from environment variables

### Input Validation
- Comprehensive Joi schemas
- SQL injection prevention via ORM
- XSS protection through input sanitization

### CORS Configuration
- Configurable allowed origins
- Proper preflight handling
- Credential support for authenticated requests

## Performance Considerations

### Database Optimization
- Drizzle ORM query optimization
- Proper indexing on frequently queried columns
- Connection pooling for production

### Caching Strategy
- Session storage optimization
- Database query result caching
- Static asset caching headers

### Monitoring
- Error logging and tracking
- Performance monitoring
- Request/response logging

## Deployment

### Build Process
```bash
npm run build    # Compile TypeScript
npm test         # Run tests
npm start        # Start production server
```

### Environment Setup
```bash
# Production environment
NODE_ENV=production
PORT=3000
SESSION_SECRET=secure-production-secret
DATABASE_URL=production.db
CORS_ORIGIN=https://yourdomain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

## Future Enhancements

### Planned Features
- Payment gateway integration (Stripe, PayPal)
- Email notifications with templates
- File upload for project images
- Advanced search and filtering
- User profiles and avatars
- Project categories and tags
- Admin dashboard
- Rate limiting
- Comprehensive logging
- Database migrations
- API versioning
- GraphQL API alongside REST

### Scalability Improvements
- Database connection pooling
- Redis for session storage
- CDN integration
- Horizontal scaling support
- Microservices architecture consideration