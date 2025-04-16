import { AppDataSource } from '../../src/database/connection';
import { User } from '../../src/entities/User';
import { Company } from '../../src/entities/Company';
import * as jwt from 'jsonwebtoken';

export const createTestUser = async () => {
  // Generate unique identifiers for each test run
  const timestamp = Date.now();
  
  // First create a company
  const company = AppDataSource.getRepository(Company).create({
    name: `Test Company ${timestamp}`,
    companyId: `TEST${timestamp}`,
    vat: `123456789${timestamp}`,
    address: {
      streetAddress: 'Test Street',
      city: 'Test City',
      country: 'Test Country'
    },
    isActive: true
  });
  const savedCompany = await AppDataSource.getRepository(Company).save(company);

  // Create a test user
  const user = AppDataSource.getRepository(User).create({
    email: `test${timestamp}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    company: savedCompany
  });
  return await AppDataSource.getRepository(User).save(user);
};

export const getAuthToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test_secret_key',
    { expiresIn: '1d' }
  );
}; 