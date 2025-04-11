// src/api/controllers/PartnerController.ts
import { Context } from 'koa';
import { PartnerService } from '../../services/PartnerService';
import { Partner } from '../../entities/Partner';

export class PartnerController {
  private partnerService: PartnerService;

  constructor() {
    this.partnerService = new PartnerService();
  }

  getPartners = async (ctx: Context) => {
    try {
      const { partners, total } = await this.partnerService.findAll(ctx.query);
      
      ctx.body = {
        partners,
        page_info: {
          total,
          has_more: total > (Number(ctx.query.skip) || 0) + (Number(ctx.query.take) || 10)
        }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch partners' } };
    }
  };

  createPartner = async (ctx: Context) => {
    try {
      const partnerData = ctx.request.body as Partial<Partner>;
      
      if (!partnerData.company || !partnerData.partnerCompany) {
        ctx.status = 400;
        ctx.body = { error: { message: 'Company and partnerCompany are required' } };
        return;
      }
      
      const partner = await this.partnerService.create(partnerData);
      
      ctx.status = 201;
      ctx.body = partner;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to create partner' } };
    }
  };

  updatePartner = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      const partnerData = ctx.request.body as Partial<Partner>;
      
      const partner = await this.partnerService.update(id, partnerData);
      
      if (!partner) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Partner not found' } };
        return;
      }
      
      ctx.body = partner;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to update partner' } };
    }
  };

  deletePartner = async (ctx: Context) => {
    try {
      const { id } = ctx.params;
      
      const result = await this.partnerService.delete(id);
      
      if (!result) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Partner not found' } };
        return;
      }
      
      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to delete partner' } };
    }
  };
}