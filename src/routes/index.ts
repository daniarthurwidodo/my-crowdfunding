import { Router } from 'express';
import passport from 'passport';
import authRoutes from './auth';
import projectRoutes from './projects';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { db } from '../config/database';
import logger from '../utils/logger';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

// Backward compatibility routes
router.post('/register', AuthController.register);
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }),
  AuthController.login
);
router.get('/dashboard', requireAuth, AuthController.getDashboard);
router.post('/logout', AuthController.logout);

// Health check with database connectivity
router.get('/health', async (req, res) => {
  try {
    // Test database connectivity
    await db.execute('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'Crowdfunding API is running!' });
});

export default router;