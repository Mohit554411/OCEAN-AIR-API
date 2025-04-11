// src/entities/Vehicle.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company';

export enum VehicleType {
  TRACTOR = 'tractor',
  TRAILER = 'trailer',
  VESSEL = 'vessel',
  BARGE = 'barge',
  RAIL = 'rail',
  TERMINAL = 'terminal'
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  licensePlateNumber: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.TRACTOR
  })
  vehicleType: VehicleType;

  @Column({ nullable: true })
  trackerId: string;

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;

  @Column({ type: 'jsonb', nullable: true })
  equipment: Record<string, any>[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}