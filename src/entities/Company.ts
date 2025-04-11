// src/entities/Company.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  companyId: string;

  @Column({ nullable: true })
  vat: string;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    streetAddress?: string;
    city?: string;
    state?: string;
    country: string;
    zipcode?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}