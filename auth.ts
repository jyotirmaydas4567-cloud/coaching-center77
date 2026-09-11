import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadDatabase } from './db';
import { User } from '../src/types/index';

export const JWT_SECRET = process.env.JWT_SECRET || 'coaching_mgmt_secure_jwt_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name,
      referenceId: user.referenceId 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const db = loadDatabase();
    const user = db.users.find(u => u.id === decoded.id && u.status === 'ACTIVE');
    
    if (!user) {
      res.status(401).json({ error: 'Invalid session or user account is disabled.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired or invalid token.' });
    return;
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access forbidden. Administrator privileges required.' });
    return;
  }
  next();
}

export function requireTeacherOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'teacher')) {
    res.status(403).json({ error: 'Access forbidden. Teacher or Administrator privileges required.' });
    return;
  }
  next();
}

export function requireStudent(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'student') {
    res.status(403).json({ error: 'Access forbidden. Student account required.' });
    return;
  }
  next();
}

// Security Guard: Check if teacher has access to batch
export function isTeacherAssignedToBatch(teacherUserId: string, batchId: string): boolean {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === teacherUserId);
  if (!user || user.role !== 'teacher' || !user.referenceId) return false;
  
  const teacher = db.teachers.find(t => t.id === user.referenceId);
  if (!teacher) return false;

  return teacher.assignedBatchIds.includes(batchId);
}

// Security Guard: Check if teacher has access to student
export function isTeacherAssignedToStudent(teacherUserId: string, studentId: string): boolean {
  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId || s.studentId === studentId);
  if (!student) return false;
  return isTeacherAssignedToBatch(teacherUserId, student.batchId);
}
