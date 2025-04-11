import { Context } from 'koa';
import { PlaceService } from '../../services/PlaceService';
import { Place } from '../../entities/Place';

export class PlaceController {
  private placeService: PlaceService;

  constructor() {
    this.placeService = new PlaceService();
  }

  getPlaces = async (ctx: Context) => {
    try {
      const { places, total } = await this.placeService.findAll(ctx.query);
      
      ctx.body = {
        places,
        page_info: {
          total,
          has_more: total > (Number(ctx.query.skip) || 0) + (Number(ctx.query.take) || 10)
        }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch places' } };
    }
  };

  getPlaceById = async (ctx: Context) => {
    try {
      const { place_reference_id } = ctx.params;
      
      const place = await this.placeService.findByPlaceReferenceId(place_reference_id);
      
      if (!place) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Place not found' } };
        return;
      }
      
      ctx.body = place;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to fetch place details' } };
    }
  };

  createPlace = async (ctx: Context) => {
    try {
      const { place_reference_id } = ctx.params;
      const placeData = ctx.request.body as Partial<Place>;
      
      // Check if place already exists
      const existingPlace = await this.placeService.findByPlaceReferenceId(place_reference_id);
      
      if (existingPlace) {
        ctx.status = 409;
        ctx.body = { error: { message: 'Place with this reference ID already exists' } };
        return;
      }
      
      const place = await this.placeService.create({
        ...placeData as object,
        placeReferenceId: place_reference_id
      });
      
      ctx.status = 200;
      ctx.body = { message: 'Place created successfully' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to create place' } };
    }
  };

  updatePlace = async (ctx: Context) => {
    try {
      const { place_reference_id } = ctx.params;
      const placeData = ctx.request.body as Partial<Place>;
      
      const existingPlace = await this.placeService.findByPlaceReferenceId(place_reference_id);
      
      if (!existingPlace) {
        // If place doesn't exist, create it
        await this.placeService.create({
          ...placeData as object,
          placeReferenceId: place_reference_id
        });
        
        ctx.status = 200;
        ctx.body = { message: 'Place created successfully' };
        return;
      }
      
      // Update existing place
      const place = await this.placeService.update(existingPlace.id, placeData);
      
      ctx.status = 200;
      ctx.body = { message: 'Place updated successfully' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to update place' } };
    }
  };

  deletePlace = async (ctx: Context) => {
    try {
      const { place_reference_id } = ctx.params;
      
      const existingPlace = await this.placeService.findByPlaceReferenceId(place_reference_id);
      
      if (!existingPlace) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Place not found' } };
        return;
      }
      
      await this.placeService.delete(existingPlace.id);
      
      ctx.status = 200;
      ctx.body = { message: 'Place deleted successfully' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to delete place' } };
    }
  };
}
