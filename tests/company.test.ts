import { AppDataSource } from '../src/database/connection';
import { Company } from '../src/entities/Company';

describe('Company Entity', () => {
  beforeEach(async () => {
    // Clear the companies table before each test
    await AppDataSource.getRepository(Company).clear();
  });

  it('should create a new company', async () => {
    const companyData = {
      name: 'Test Company',
      companyId: 'TEST123',
      vat: '123456789',
      address: {
        street: 'Test Street',
        city: 'Test City',
        country: 'Test Country'
      },
      isActive: true
    };

    const company = AppDataSource.getRepository(Company).create(companyData);
    const savedCompany = await AppDataSource.getRepository(Company).save(company);

    expect(savedCompany).toBeDefined();
    expect(savedCompany.name).toBe(companyData.name);
    expect(savedCompany.companyId).toBe(companyData.companyId);
    expect(savedCompany.vat).toBe(companyData.vat);
    expect(savedCompany.isActive).toBe(true);
  });

  it('should retrieve a company by id', async () => {
    const companyData = {
      name: 'Test Company',
      companyId: 'TEST123',
      vat: '123456789',
      address: {
        street: 'Test Street',
        city: 'Test City',
        country: 'Test Country'
      },
      isActive: true
    };

    const company = AppDataSource.getRepository(Company).create(companyData);
    const savedCompany = await AppDataSource.getRepository(Company).save(company);

    const foundCompany = await AppDataSource.getRepository(Company).findOne({
      where: { id: savedCompany.id }
    });

    expect(foundCompany).toBeDefined();
    expect(foundCompany?.id).toBe(savedCompany.id);
    expect(foundCompany?.name).toBe(companyData.name);
  });

  it('should update a company', async () => {
    const companyData = {
      name: 'Test Company',
      companyId: 'TEST123',
      vat: '123456789',
      address: {
        street: 'Test Street',
        city: 'Test City',
        country: 'Test Country'
      },
      isActive: true
    };

    const company = AppDataSource.getRepository(Company).create(companyData);
    const savedCompany = await AppDataSource.getRepository(Company).save(company);

    const newName = 'Updated Company Name';
    await AppDataSource.getRepository(Company).update(savedCompany.id, {
      name: newName
    });

    const updatedCompany = await AppDataSource.getRepository(Company).findOne({
      where: { id: savedCompany.id }
    });

    expect(updatedCompany).toBeDefined();
    expect(updatedCompany?.name).toBe(newName);
  });

  it('should delete a company', async () => {
    const companyData = {
      name: 'Test Company',
      companyId: 'TEST123',
      vat: '123456789',
      address: {
        street: 'Test Street',
        city: 'Test City',
        country: 'Test Country'
      },
      isActive: true
    };

    const company = AppDataSource.getRepository(Company).create(companyData);
    const savedCompany = await AppDataSource.getRepository(Company).save(company);

    await AppDataSource.getRepository(Company).delete(savedCompany.id);

    const deletedCompany = await AppDataSource.getRepository(Company).findOne({
      where: { id: savedCompany.id }
    });

    expect(deletedCompany).toBeNull();
  });
}); 