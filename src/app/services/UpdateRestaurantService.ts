import RestaurantRepository, { Restaurant } from '../repositories/RestaurantRespository';

class UpdateRestaurantService {
  repository: RestaurantRepository;

  constructor(repository: RestaurantRepository) {
    this.repository = repository;
  }

  async execute({
    restaurantId, photoUri, name, address, businessHours,
  }: {
    restaurantId: string;
    photoUri?: string;
    name?: string;
    address?: string;
    businessHours?: string,
  }): Promise<Restaurant> {
    const restaurants = await this.repository.update({
      restaurantId, photoUri, name, address, businessHours,
    });
    return restaurants;
  }
}

export default UpdateRestaurantService;
