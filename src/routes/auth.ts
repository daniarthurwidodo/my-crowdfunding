import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validateBody, userSchemas } from '../middleware/validation';

const router = Router();

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
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Username already exists
 */
router.post('/register', validateBody(userSchemas.register), AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login',
  validateBody(userSchemas.login),
  passport.authenticate('local', {
    successRedirect: '/auth/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  }),
  AuthController.login
);

/**
 * @swagger
 * /auth/dashboard:
 *   get:
 *     summary: Get user dashboard
 *     tags: [Authentication]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', requireAuth, AuthController.getDashboard);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', AuthController.logout);

// Backward compatibility routes
router.post('/', validateBody(userSchemas.register), AuthController.register); // POST /auth for registration
router.get('/', requireAuth, AuthController.getDashboard); // GET /auth for dashboard

export default router;