// src/services/PlaceService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { Place } from '../entities/Place';
import { Company } from '../entities/Company';

export class PlaceService {
  private placeRepository: Repository<Place>;
  private companyRepository: Repository<Company>;

  constructor() {
    this.placeRepository = AppDataSource.getRepository(Place);
    this.companyRepository = AppDataSource.getRepository(Company);
  }

  async findAll(params: any): Promise<{ places: Place[]; total: number }> {
    const { skip = 0, take = 10, ...filters } = params;
    
    const queryBuilder = this.placeRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.company', 'company')
      .skip(skip)
      .take(take);

    if (filters.placeReferenceId) {
      queryBuilder.andWhere('place.placeReferenceId = :placeReferenceId', { placeReferenceId: filters.placeReferenceId });
    }

    if (filters.name) {
      queryBuilder.andWhere('place.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.companyId) {
      queryBuilder.andWhere('company.companyId = :companyId', { companyId: filters.companyId });
    }

    const [places, total] = await queryBuilder.getManyAndCount();
    return { places, total };
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeRepository.findOne({
      where: { id },
      relations: ['company']
    });
  }

  async findByPlaceReferenceId(placeReferenceId: string): Promise<Place | null> {
    return this.placeRepository.findOne({
      where: { placeReferenceId },
      relations: ['company']
    });
  }

  async create(data: Partial<Place>): Promise<Place> {
    const place = this.placeRepository.create(data);
    return this.placeRepository.save(place);
  }

  async update(id: string, data: Partial<Place>): Promise<Place | null> {
    await this.placeRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.placeRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}