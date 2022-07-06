import { InternalClient } from '..';

export class Region {
  public static async getRegions(): Promise<any> {
    return InternalClient.getLocation()
      .instance.get('/regions')
      .then((res) => res.data.regions);
  }
}
