import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import swaggerUi from 'swagger-ui-express';
import { UserService } from './services/userService';
import routes from './routes';
import { specs, swaggerUiOptions } from './config/swagger';
import logger from './utils/logger';

// Create Express application
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserService.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

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

// Routes
app.use('/', routes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: err, url: req.url, method: req.method }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;