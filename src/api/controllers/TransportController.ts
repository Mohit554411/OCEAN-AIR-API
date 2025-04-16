// src/api/controllers/TransportController.ts
import { Context } from 'koa';
import { TransportService } from '../../services/TransportService';
import { Transport } from '../../entities/Transport';

export class TransportController {
  private transportService: TransportService;

  constructor() {
    this.transportService = new TransportService();
  }

  getTransports = async (ctx: Context) => {
    try {
      const { transports, total } = await this.transportService.findAll(ctx.query);

      ctx.body = {
        transports,
        page_info: {
          total,
          has_more: total > (Number(ctx.query.skip) || 0) + (Number(ctx.query.take) || 10)
        }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch transports' } };
    }
  };

  getTransportById = async (ctx: Context) => {
    try {
      const { identifier_type, identifier_value } = ctx.params;

      let transport;

      if (identifier_type === 'transport_id') {
        transport = await this.transportService.findByTransportId(identifier_value);
      } else if (identifier_type === 'transport_number') {
        transport = await this.transportService.findByTransportNumber(identifier_value);
      } else {
        ctx.status = 400;
        ctx.body = { error: { message: 'Invalid identifier type' } };
        return;
      }

      if (!transport) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Transport not found' } };
        return;
      }

      ctx.body = transport;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch transport details' } };
    }
  };

  createOrUpdateTransport = async (ctx: Context) => {
    try {
      const { identifier_type, identifier_value } = ctx.params;
      const transportData = ctx.request.body as Partial<Transport>;

      let existingTransport;

      if (identifier_type === 'transport_id') {
        existingTransport = await this.transportService.findByTransportId(identifier_value);
      } else if (identifier_type === 'transport_number') {
        existingTransport = await this.transportService.findByTransportNumber(identifier_value);
      } else {
        ctx.status = 400;
        ctx.body = { error: { message: 'Invalid identifier type' } };
        return;
      }

      let transport;
      let dataToUse = { ...(transportData as object) } as any;

      if (existingTransport) {
        // Merge stops if they exist in both existing and new data
        if (dataToUse.stops && existingTransport.stops) {
          dataToUse.stops = [...existingTransport.stops, ...dataToUse.stops];
        }
        dataToUse = { ...existingTransport, ...dataToUse };
        transport = await this.transportService.update(existingTransport.id, dataToUse);
      } else {
        // Set both fields to the same value
        dataToUse.transportId = identifier_value;
        dataToUse.transportNumber = identifier_value;
        transport = await this.transportService.create(dataToUse);
      }

      ctx.body = transport;
    } catch (error) {
      console.error('Error creating or updating transport:', error);
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to create or update transport' } };
    }
  };

  deleteTransport = async (ctx: Context) => {
    try {
      const { identifier_type, identifier_value } = ctx.params;

      let existingTransport;

      if (identifier_type === 'transport_id') {
        existingTransport = await this.transportService.findByTransportId(identifier_value);
      } else if (identifier_type === 'transport_number') {
        existingTransport = await this.transportService.findByTransportNumber(identifier_value);
      } else {
        ctx.status = 400;
        ctx.body = { error: { message: 'Invalid identifier type' } };
        return;
      }

      if (!existingTransport) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Transport not found' } };
        return;
      }

      await this.transportService.delete(existingTransport.id);

      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to delete transport' } };
    }
  };

  allocateVehicle = async (ctx: Context) => {
    try {
      const { identifier_type, identifier_value } = ctx.params;
      const { license_plate_number } = ctx.request.body as { license_plate_number: string };

      if (!license_plate_number) {
        ctx.status = 400;
        ctx.body = { error: { message: 'License plate number is required' } };
        return;
      }

      let transportId;

      if (identifier_type === 'transport_id') {
        transportId = identifier_value;
      } else if (identifier_type === 'transport_number') {
        const transport = await this.transportService.findByTransportNumber(identifier_value);
        if (!transport) {
          ctx.status = 404;
          ctx.body = { error: { message: 'Transport not found' } };
          return;
        }
        transportId = transport.transportId;
      } else {
        ctx.status = 400;
        ctx.body = { error: { message: 'Invalid identifier type' } };
        return;
      }

      const result = await this.transportService.allocateVehicle(transportId, license_plate_number);

      if (!result) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Transport or Vehicle not found' } };
        return;
      }

      ctx.body = {
        message: `Vehicle with license plate ${license_plate_number} allocated to transport ${transportId}`
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to allocate vehicle' } };
    }
  };

  deallocateVehicle = async (ctx: Context) => {
    try {
      const { identifier_type, identifier_value } = ctx.params;

      let transportId;

      if (identifier_type === 'transport_id') {
        transportId = identifier_value;
      } else if (identifier_type === 'transport_number') {
        const transport = await this.transportService.findByTransportNumber(identifier_value);
        if (!transport) {
          ctx.status = 404;
          ctx.body = { error: { message: 'Transport not found' } };
          return;
        }
        transportId = transport.transportId;
      } else {
        ctx.status = 400;
        ctx.body = { error: { message: 'Invalid identifier type' } };
        return;
      }

      const result = await this.transportService.deallocateVehicle(transportId);

      if (!result) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Transport not found or no vehicle allocated' } };
        return;
      }

      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to deallocate vehicle' } };
    }
  };
}