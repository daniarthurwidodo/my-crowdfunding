import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import type { CreateUserRequest, LoginRequest, ApiResponse } from '../types';
import logger from '../utils/logger';

export class AuthController {
  static async register(req: Request<{}, ApiResponse, CreateUserRequest>, res: Response<ApiResponse>) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          message: 'Username, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await UserService.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      // Create new user
      const newUser = await UserService.createUser({ username, email, password });

      res.status(201).json({
        message: 'User registered successfully',
        data: { user: newUser }
      });
    } catch (error) {
      logger.error({ error }, 'Registration error');
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static login(req: Request, res: Response) {
    res.json({
      message: 'Login successful',
      data: { user: req.user }
    });
  }

  static logout(req: Request, res: Response) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Could not destroy session' });
        }
        res.json({ message: 'Logged out successfully' });
      });
    });
  }

  static getDashboard(req: Request, res: Response) {
    res.json({
      message: 'Welcome to the dashboard!',
      data: { user: req.user }
    });
  }
}