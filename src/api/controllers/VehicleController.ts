// src/api/controllers/VehicleController.ts
import { Context } from 'koa';
import { VehicleService } from '../../services/VehicleService';
import { Vehicle } from '../../entities/Vehicle';

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  getVehicles = async (ctx: Context) => {
    try {
      const { vehicles, total } = await this.vehicleService.findAll(ctx.query);
      
      ctx.body = {
        vehicles,
        page_info: {
          total,
          has_more: total > (Number(ctx.query.skip) || 0) + (Number(ctx.query.take) || 10)
        }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch vehicles' } };
    }
  };

  getVehicleByLicensePlate = async (ctx: Context) => {
    try {
      const { license_plate_number } = ctx.params;
      
      const vehicle = await this.vehicleService.findByLicensePlate(license_plate_number);
      
      if (!vehicle) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Vehicle not found' } };
        return;
      }
      
      ctx.body = vehicle;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch vehicle details' } };
    }
  };

  createVehicle = async (ctx: Context) => {
    try {
      const vehicleData = ctx.request.body as Partial<Vehicle>;
      
      if (!vehicleData.licensePlateNumber) {
        ctx.status = 400;
        ctx.body = { error: { message: 'License plate number is required' } };
        return;
      }
      
      const existingVehicle = await this.vehicleService.findByLicensePlate(vehicleData.licensePlateNumber);
      
      if (existingVehicle) {
        ctx.status = 409;
        ctx.body = { error: { message: 'Vehicle with this license plate already exists' } };
        return;
      }
      
      const vehicle = await this.vehicleService.create(vehicleData);
      
      ctx.status = 201;
      ctx.body = vehicle;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to create vehicle' } };
    }
  };

  updateVehicle = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const vehicleData = ctx.request.body as Partial<Vehicle>;
      
      const vehicle = await this.vehicleService.update(id, vehicleData);
      
      if (!vehicle) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Vehicle not found' } };
        return;
      }
      
      ctx.body = vehicle;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to update vehicle' } };
    }
  };

  deleteVehicle = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      
      const result = await this.vehicleService.delete(id);
      
      if (!result) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Vehicle not found' } };
        return;
      }
      
      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to delete vehicle' } };
    }
  };
}