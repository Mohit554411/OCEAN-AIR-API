// src/entities/Place.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  placeReferenceId: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  geometry: {
    type: string;
    coordinates: number[];
  };

  @Column({ type: 'jsonb' })
  address: {
    streetAddress?: string;
    city?: string;
    zipcode?: string;
    country: string;
    name?: string;
    disableAddressMatching?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  geofence: {
    type: string;
    properties?: Record<string, any>;
    geometry: {
      type: string;
      coordinates: any;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  addressAliases: {
    name?: string;
    streetAddress?: string;
    city?: string;
    zipcode?: string;
    country: string;
  }[];

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}