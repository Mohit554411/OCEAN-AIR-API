// src/entities/Transport.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { Vehicle } from './Vehicle';

export enum TransportType {
  ROAD = 'road',
  OCEAN = 'ocean',
  AIR = 'air'
}

export enum TrackingState {
  PENDING = 'pending',
  TRACKING = 'tracking',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('transports')
export class Transport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transportId: string;

  @Column({ unique: true })
  transportNumber: string;

  @Column({
    type: 'enum',
    enum: TransportType,
    default: TransportType.ROAD
  })
  type: TransportType;

  @Column({
    type: 'enum',
    enum: TrackingState,
    default: TrackingState.PENDING
  })
  trackingState: TrackingState;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isFinished: boolean;

  @ManyToOne(() => Company)
  @JoinColumn()
  company: Company;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn()
  allocatedVehicle: Vehicle;

  @Column({ type: 'jsonb', nullable: true })
  stops: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}