import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import type { CreateProjectRequest, ApiResponse } from '../types';
import logger from '../utils/logger';

export class ProjectController {
  static async getAllProjects(req: Request, res: Response<ApiResponse>) {
    try {
      const projects = await ProjectService.getAllProjects();
      res.json({
        message: 'Projects retrieved successfully',
        data: { projects }
      });
    } catch (error) {
      logger.error({ error }, 'Error fetching projects');
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createProject(req: Request<{}, ApiResponse, CreateProjectRequest>, res: Response<ApiResponse>) {
    try {
      const { title, description, goalAmount, deadline } = req.body;
      const creatorId = (req.user as any)?.id;

      if (!title || !goalAmount || !creatorId) {
        return res.status(400).json({
          message: 'Title, goal amount, and authentication are required'
        });
      }

      const newProject = await ProjectService.createProject(
        { title, description, goalAmount, deadline },
        creatorId
      );

      res.status(201).json({
        message: 'Project created successfully',
        data: { project: newProject }
      });
    } catch (error) {
      logger.error({ error }, 'Error creating project');
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}