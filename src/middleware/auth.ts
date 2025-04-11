// src/middleware/auth.ts
import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/connection';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface JwtPayload {
  id: string;
  email: string;
}

export async function authMiddleware(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Unauthorized: Missing or invalid token format' } };
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ 
      where: { id: decoded.id },
      relations: ['company']
    });

    if (!user || !user.isActive) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Unauthorized: User not found or inactive' } };
      return;
    }

    ctx.state.user = user;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: { message: 'Unauthorized: Invalid token' } };
  }
}