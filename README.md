# My Crowdfunding Platform

A Node.js/TypeScript backend application for a crowdfunding platform with user authentication, project management, and comprehensive API documentation.

## Features

- 🔐 **User Authentication**: Secure registration and login with Passport.js
- 📋 **Project Management**: Create and manage crowdfunding projects
- ✅ **Input Validation**: Comprehensive validation using Joi
- 📚 **API Documentation**: Interactive Swagger/OpenAPI documentation
- 🧪 **Unit Testing**: Jest test suite with coverage reporting
- 🔒 **Security**: Password hashing, session management, and environment variables
- 🏗️ **Modular Architecture**: Clean separation of concerns with controllers, services, and middleware

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with ts-jest
- **Environment**: dotenv

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
4. Set up the database:
   ```bash
   npm run db:migrate
   ```
5. Build the project:
   ```bash
   npm run build
   ```

## Database Setup

This application uses PostgreSQL as the database. You have two options to set up PostgreSQL:

### Option 1: Using Podman (Recommended for Windows/Linux)

1. **Install Podman**:
   - Download from: https://podman.io/getting-started/installation

2. **Start PostgreSQL**:
   ```powershell
   .\setup-podman.ps1
   ```

3. **Verify the database is running**:
   ```powershell
   podman ps
   ```

### Option 2: Using Docker Compose

1. **Install Docker Desktop**

2. **Start PostgreSQL**:
   ```bash
   docker-compose up -d postgres
   ```

### Option 3: Local PostgreSQL Installation

If you have PostgreSQL installed locally:

1. Create a database named `crowdfunding`
2. Create a user with appropriate permissions
3. Update the `DATABASE_URL` in your `.env` file

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
npm run test:coverage
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://crowdfunding_user:crowdfunding_password@localhost:5432/crowdfunding

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Security Configuration
BCRYPT_ROUNDS=10

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/dashboard` - Get user dashboard (protected)
- `POST /auth/logout` - Logout user

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create a new project (protected)

### Legacy Endpoints (Backward Compatible)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /dashboard` - Get user dashboard (protected)
- `POST /logout` - Logout user

## API Documentation

Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

The documentation includes:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Interactive testing interface

## Project Structure

```
src/
├── app.ts                 # Express app configuration
├── index.ts              # Application entry point
├── config/
│   ├── database.ts       # Database connection
│   └── swagger.ts        # API documentation config
├── controllers/
│   ├── authController.ts    # Authentication logic
│   └── projectController.ts # Project management logic
├── middleware/
│   ├── auth.ts           # Authentication middleware
│   └── validation.ts     # Input validation middleware
├── routes/
│   ├── index.ts          # Route aggregation
│   ├── auth.ts           # Authentication routes
│   └── projects.ts       # Project routes
├── services/
│   ├── userService.ts    # User business logic
│   └── projectService.ts # Project business logic
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   └── password.ts       # Password utilities
└── db/
    ├── index.ts          # Database setup
    └── schema.ts         # Database schema
```

## Validation Rules

### User Registration
- Username: 3-30 characters, alphanumeric + underscore
- Email: Valid email format
- Password: Minimum 8 characters, must contain uppercase, lowercase, and number

### Project Creation
- Title: 5-100 characters
- Description: Optional, max 1000 characters
- Goal Amount: $1 - $1,000,000
- Deadline: Optional, must be in the future

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- Password utilities
- User service
- Project service
- Controllers
- Middleware

## Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **Session Management**: Secure session cookies
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Protection**: Configurable CORS settings
- **Environment Variables**: Sensitive data stored securely

## Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing

### Database
- SQLite for development and testing
- Drizzle ORM for type-safe queries
- Automatic schema management

## Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure `SESSION_SECRET`
4. Configure CORS for production domain

### Build Process
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

## License

ISC