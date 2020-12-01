import RestaurantRepository, { Restaurant } from '../repositories/RestaurantRespository';

class CreateRestaurantService {
  repository: RestaurantRepository;

  constructor(repository: RestaurantRepository) {
    this.repository = repository;
  }

  async execute(restaurantId?: string): Promise<Restaurant[]> {
    const restaurants = await this.repository.get(restaurantId);
    return restaurants;
  }
}

export default CreateRestaurantService;
