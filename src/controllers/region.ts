import { InternalClient, Joi } from '..';

export class Region {
  public static async getAllRegions(props: {
    priority?: number | number[];
  }): Promise<void> {
    const { priority } = await Joi.object({
      priority: Joi.array().items(Joi.number()).single().optional(),
    }).validateAsync(props);

    return InternalClient.getLocation()
      .instance.get('/regions/all', { params: { priority } })
      .then((res) => res.data.regions);
  }
}
