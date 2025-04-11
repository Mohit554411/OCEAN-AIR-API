// src/services/TransportService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { Transport, TransportType, TrackingState } from '../entities/Transport';
import { Vehicle } from '../entities/Vehicle';
import { Company } from '../entities/Company';

export class TransportService {
  private transportRepository: Repository<Transport>;
  private vehicleRepository: Repository<Vehicle>;
  private companyRepository: Repository<Company>;

  constructor() {
    this.transportRepository = AppDataSource.getRepository(Transport);
    this.vehicleRepository = AppDataSource.getRepository(Vehicle);
    this.companyRepository = AppDataSource.getRepository(Company);
  }

  async findAll(params: any): Promise<{ transports: Transport[]; total: number }> {
    const { skip = 0, take = 10, ...filters } = params;
    
    const queryBuilder = this.transportRepository.createQueryBuilder('transport')
      .leftJoinAndSelect('transport.company', 'company')
      .leftJoinAndSelect('transport.allocatedVehicle', 'vehicle')
      .skip(skip)
      .take(take);

    if (filters.transportNumber) {
      queryBuilder.andWhere('transport.transportNumber = :transportNumber', { transportNumber: filters.transportNumber });
    }

    if (filters.transportId) {
      queryBuilder.andWhere('transport.transportId = :transportId', { transportId: filters.transportId });
    }

    if (filters.isFinished !== undefined) {
      queryBuilder.andWhere('transport.isFinished = :isFinished', { isFinished: filters.isFinished });
    }

    if (filters.type) {
      queryBuilder.andWhere('transport.type = :type', { type: filters.type });
    }

    if (filters.companyId) {
      queryBuilder.andWhere('company.companyId = :companyId', { companyId: filters.companyId });
    }

    const [transports, total] = await queryBuilder.getManyAndCount();
    return { transports, total };
  }

  async findById(id: string): Promise<Transport | null> {
    return this.transportRepository.findOne({
      where: { id },
      relations: ['company', 'allocatedVehicle']
    });
  }

  async findByTransportId(transportId: string): Promise<Transport | null> {
    return this.transportRepository.findOne({
      where: { transportId },
      relations: ['company', 'allocatedVehicle']
    });
  }

  async findByTransportNumber(transportNumber: string): Promise<Transport | null> {
    return this.transportRepository.findOne({
      where: { transportNumber },
      relations: ['company', 'allocatedVehicle']
    });
  }

  async create(data: Partial<Transport>): Promise<Transport> {
    const transport = this.transportRepository.create(data);
    return this.transportRepository.save(transport);
  }

  async update(id: string, data: Partial<Transport>): Promise<Transport | null> {
    await this.transportRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.transportRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async allocateVehicle(transportId: string, licensePlateNumber: string): Promise<Transport | null> {
    const transport = await this.findByTransportId(transportId);
    if (!transport) {
      return null;
    }

    const vehicle = await this.vehicleRepository.findOne({
      where: { licensePlateNumber }
    });

    if (!vehicle) {
      return null;
    }

    transport.allocatedVehicle = vehicle;
    return this.transportRepository.save(transport);
  }

  async deallocateVehicle(transportId: string): Promise<Transport | null> {
    const transport = await this.findByTransportId(transportId);
    if (!transport) {
      return null;
    }

    transport.allocatedVehicle = null;
    return this.transportRepository.save(transport);
  }
}