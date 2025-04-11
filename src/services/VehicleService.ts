// src/services/VehicleService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { Vehicle } from '../entities/Vehicle';
import { Company } from '../entities/Company';

export class VehicleService {
  private vehicleRepository: Repository<Vehicle>;
  private companyRepository: Repository<Company>;

  constructor() {
    this.vehicleRepository = AppDataSource.getRepository(Vehicle);
    this.companyRepository = AppDataSource.getRepository(Company);
  }

  async findAll(params: any): Promise<{ vehicles: Vehicle[]; total: number }> {
    const { skip = 0, take = 10, ...filters } = params;
    
    const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.company', 'company')
      .skip(skip)
      .take(take);

    if (filters.licensePlateNumber) {
      queryBuilder.andWhere('vehicle.licensePlateNumber LIKE :licensePlateNumber', { 
        licensePlateNumber: `%${filters.licensePlateNumber.replace(/\s+/g, '')}%` 
      });
    }

    if (filters.vehicleType) {
      queryBuilder.andWhere('vehicle.vehicleType = :vehicleType', { vehicleType: filters.vehicleType });
    }

    if (filters.companyId) {
      queryBuilder.andWhere('company.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('vehicle.isActive = :isActive', { isActive: filters.isActive });
    }

    const [vehicles, total] = await queryBuilder.getManyAndCount();
    return { vehicles, total };
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: ['company']
    });
  }

  async findByLicensePlate(licensePlateNumber: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { licensePlateNumber },
      relations: ['company']
    });
  }

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(data);
    return this.vehicleRepository.save(vehicle);
  }

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
    await this.vehicleRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.vehicleRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}