// src/entities/Partner.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

export enum PartnerType {
  CUSTOMER = 'customer',
  SUBCONTRACTOR = 'subcontractor'
}

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PartnerType,
    default: PartnerType.CUSTOMER
  })
  type: PartnerType;

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;

  @ManyToOne(() => Company)
  @JoinColumn()
  partnerCompany: Company;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}