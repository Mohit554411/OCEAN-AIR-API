// src/services/PartnerService.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { Partner, PartnerType } from '../entities/Partner';
import { Company } from '../entities/Company';

export class PartnerService {
  private partnerRepository: Repository<Partner>;
  private companyRepository: Repository<Company>;

  constructor() {
    this.partnerRepository = AppDataSource.getRepository(Partner);
    this.companyRepository = AppDataSource.getRepository(Company);
  }

  async findAll(params: any): Promise<{ partners: Partner[]; total: number }> {
    const { skip = 0, take = 10, ...filters } = params;
    
    const queryBuilder = this.partnerRepository.createQueryBuilder('partner')
      .leftJoinAndSelect('partner.company', 'company')
      .leftJoinAndSelect('partner.partnerCompany', 'partnerCompany')
      .skip(skip)
      .take(take);

    if (filters.companyId) {
      queryBuilder.andWhere('company.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters.partnerCompanyId) {
      queryBuilder.andWhere('partnerCompany.companyId = :partnerCompanyId', { partnerCompanyId: filters.partnerCompanyId });
    }

    if (filters.vat) {
      queryBuilder.andWhere('partnerCompany.vat = :vat', { vat: filters.vat });
    }

    if (filters.companyName) {
      queryBuilder.andWhere('partnerCompany.name LIKE :companyName', { companyName: `%${filters.companyName}%` });
    }

    if (filters.type) {
      queryBuilder.andWhere('partner.type = :type', { type: filters.type });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('partner.isActive = :isActive', { isActive: filters.isActive });
    }

    const [partners, total] = await queryBuilder.getManyAndCount();
    return { partners, total };
  }

  async findById(id: string): Promise<Partner | null> {
    return this.partnerRepository.findOne({
      where: { id },
      relations: ['company', 'partnerCompany']
    });
  }

  async create(data: Partial<Partner>): Promise<Partner> {
    const partner = this.partnerRepository.create(data);
    return this.partnerRepository.save(partner);
  }

  async update(id: string, data: Partial<Partner>): Promise<Partner | null> {
    await this.partnerRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.partnerRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}