// src/services/AuthService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { User } from '../entities/User';
import { Company } from '../entities/Company';
import { generateToken, verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { UserCreatePayload } from '@mohit554411/ocean-air-types';

export class AuthService {
  private userRepository: Repository<User>;
  private companyRepository: Repository<Company>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.companyRepository = AppDataSource.getRepository(Company);
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

  async register(payload: UserCreatePayload): Promise<{ user: Partial<User>; token: string } | null> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email }
    });

    if (existingUser) {
      logger.warn(`Registration attempt for existing email: ${payload.email}`);
      return null; // Indicate user already exists
    }

    // Find the company by ID
    let company: Company | null = null;
    try {
      company = await this.companyRepository.findOne({ 
        where: { companyId: payload.company } // Use companyId for lookup
      });
    } catch (error) {
        // This catch might be less relevant now if companyId is just a string
        // but we'll keep it in case of unexpected DB issues.
        logger.error(`Error finding company by companyId ${payload.company}:`, error);
        throw new Error(`Error looking up company.`); // Generic error
    }

    if (!company) {
       logger.error(`Company not found with companyId: ${payload.company}`);
       // Use a more user-friendly error message for the client
       throw new Error(`Company not found. Please check the Company ID.`); 
    }

    // Create the TypeORM User entity
    const userEntityData: Partial<User> = {
        email: payload.email,
        password: payload.password, // Let the @BeforeInsert handle hashing
        firstName: payload.firstName,
        lastName: payload.lastName,
        company: company, // Assign the found Company entity
        isActive: payload.isActive ?? true // Default to true if not provided
    };

    const user = this.userRepository.create(userEntityData);
    await this.userRepository.save(user);
    logger.info(`User registered successfully: ${user.email}`);

    const token = generateToken(user);
    
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}