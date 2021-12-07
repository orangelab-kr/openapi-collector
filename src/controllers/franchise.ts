import { InternalClient } from '..';

export class Franchise {
  public static async getFranchises(): Promise<any> {
    return InternalClient.getFranchise()
      .instance.get('/franchises', { params: { take: 10000 } })
      .then((res) => res.data.franchises);
  }
}
