import Joi from 'joi';
import { Context, Next } from 'koa';

// Common validation schemas
export const schemas = {
  // Transport validation schemas
  transport: Joi.object({
    transportNumber: Joi.string().required(),
    type: Joi.string().valid('road', 'ocean', 'air').required(),
    startTime: Joi.date().iso(),
    endTime: Joi.date().iso().min(Joi.ref('startTime')),
    customFields: Joi.object().pattern(Joi.string(), Joi.any()),
    isFinished: Joi.boolean()
  }),

  // Vehicle validation schemas
  vehicle: Joi.object({
    licensePlateNumber: Joi.string().required(),
    vehicleType: Joi.string().valid('tractor', 'trailer', 'vessel', 'barge', 'rail', 'terminal').required(),
    trackerId: Joi.string(),
    equipment: Joi.array().items(Joi.object()),
    isActive: Joi.boolean()
  }),

  // Partner validation schemas
  partner: Joi.object({
    type: Joi.string().valid('customer', 'subcontractor').required(),
    company: Joi.string().required(),
    partnerCompany: Joi.string().required(),
    isActive: Joi.boolean()
  }),

  // Place validation schemas
  place: Joi.object({
    name: Joi.string().required(),
    geometry: Joi.object({
      type: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).required()
    }).required(),
    address: Joi.object({
      streetAddress: Joi.string(),
      city: Joi.string(),
      zipcode: Joi.string(),
      country: Joi.string().required(),
      name: Joi.string(),
      disableAddressMatching: Joi.boolean()
    }).required(),
    geofence: Joi.object(),
    addressAliases: Joi.array().items(Joi.object({
      name: Joi.string(),
      streetAddress: Joi.string(),
      city: Joi.string(),
      zipcode: Joi.string(),
      country: Joi.string().required()
    }))
  }),

  // User validation schemas
  user: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    company: Joi.string().required(),
    isActive: Joi.boolean()
  })
};

// Generic validation middleware
export function validate(schema: Joi.Schema) {
  return async (ctx: Context, next: Next) => {
    try {
      await schema.validateAsync(ctx.request.body);
      await next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'Validation error',
            details: error.details.map(detail => detail.message)
          }
        };
        return;
      }
      throw error;
    }
  };
}
