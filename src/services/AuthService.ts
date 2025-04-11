// src/services/AuthService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { User } from '../entities/User';
import { generateToken } from '../utils/jwt';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async login(email: string, password: string): Promise<{ user: Partial<User>; token: string } | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company']
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return null;
    }

    const token = generateToken(user);
    
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async register(userData: Partial<User>): Promise<{ user: Partial<User>; token: string } | null> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      return null;
    }

    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);

    const token = generateToken(user);
    
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
}