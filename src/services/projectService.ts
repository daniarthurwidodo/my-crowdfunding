import { db } from '../config/database';
import { projects } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { Project, CreateProjectRequest } from '../types';

export class ProjectService {
  static async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  static async createProject(projectData: CreateProjectRequest, creatorId: number): Promise<Project> {
    const [newProject] = await db.insert(projects).values({
      title: projectData.title,
      description: projectData.description || '',
      goalAmount: projectData.goalAmount,
      creatorId,
      deadline: projectData.deadline ? Math.floor(new Date(projectData.deadline).getTime() / 1000) : undefined,
    }).returning();

    return newProject;
  }

  static async findById(id: number): Promise<Project | null> {
    const projectResult = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return projectResult[0] || null;
  }
}