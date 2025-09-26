// Type definitions for the crowdfunding application

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number;
  currentAmount: number | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date | null;
  deadline: number | null;
  isCompleted: boolean | null;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  goalAmount: number;
  deadline?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}