import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const userSchemas = {
  register: Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const projectSchemas = {
  create: Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.max': 'Title cannot exceed 100 characters'
      }),
    description: Joi.string()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    goalAmount: Joi.number()
      .integer()
      .min(1)
      .max(1000000)
      .required()
      .messages({
        'number.min': 'Goal amount must be at least $1',
        'number.max': 'Goal amount cannot exceed $1,000,000'
      }),
    deadline: Joi.date()
      .greater('now')
      .optional()
      .messages({
        'date.greater': 'Deadline must be in the future'
      })
  })
};

// Validation middleware
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

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        message: 'Parameter validation failed',
        errors
      });
    }

    // Replace req.params with validated value
    req.params = value;
    next();
  };
};