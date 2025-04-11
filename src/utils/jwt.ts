// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email
  };

  // Using any type to bypass TypeScript issues with jsonwebtoken types
  return (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  // Using any type to bypass TypeScript issues with jsonwebtoken types
  return (jwt as any).verify(token, JWT_SECRET);
}